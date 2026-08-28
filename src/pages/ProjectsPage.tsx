import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Plus, FolderKanban, Users, Code, ArrowRight, X, Github, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Project, ProjectType, User } from '../types';
import { ProgressBar } from '../components/ProgressBar';
import { Badge } from '../components/Badge';
import { Modal } from '../components/Modal';
import { TechStackBadges } from '../components/TechStackBadges';
import { VisualTechStackEditor } from '../components/VisualTechStackEditor';
import { UserSearchSelect } from '../components/UserSearchSelect';

export const ProjectsPage = () => {
  const { user } = useAuth();
  if ((user?.role as string) === 'ADMIN') {
    return <Navigate to="/admin" replace />;
  }
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED'>('ACTIVE');

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [techStack, setTechStack] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [projectType, setProjectType] = useState<ProjectType>('PERSONAL');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  // Live member search state for Create Project modal
  const [memberSearchQuery, setMemberSearchQuery] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<User[]>([]);
  const [memberSearchResults, setMemberSearchResults] = useState<User[]>([]);
  const [searchingMembers, setSearchingMembers] = useState(false);

  const canCreateProject = (user?.role as string) !== 'ADMIN';

  const loadData = async () => {
    try {
      const [projRes, userRes] = await Promise.all([api.getProjects(), api.getUsers()]);
      setProjects(projRes.projects);
      setUsers(userRes.users);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Debounced member search
  useEffect(() => {
    if (!memberSearchQuery.trim()) {
      setMemberSearchResults([]);
      return;
    }

    setSearchingMembers(true);
    const timer = setTimeout(async () => {
      try {
        const res = await api.searchUsers(memberSearchQuery);
        const filtered = res.users.filter(
          (u) => u.id !== user?.id && u.role !== 'ADMIN' && !selectedMembers.some((m) => m.id === u.id)
        );
        setMemberSearchResults(filtered);
      } catch (err) {
        console.error('Member search error:', err);
      } finally {
        setSearchingMembers(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [memberSearchQuery, selectedMembers, user?.id]);

  const filteredProjects = projects.filter((p) => {
    if (statusFilter === 'ACTIVE') return p.status !== 'ARCHIVED' && p.status !== 'COMPLETED';
    if (statusFilter === 'COMPLETED') return p.status === 'COMPLETED';
    if (statusFilter === 'ARCHIVED') return p.status === 'ARCHIVED';
    return true;
  });

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setCreating(true);

    try {
      await api.createProject({
        name,
        description,
        techStack,
        githubUrl,
        demoUrl,
        targetDate,
        type: projectType,
        memberIds: projectType === 'TEAM' ? selectedMembers.map((m) => m.id) : [],
      });

      setModalOpen(false);
      setName('');
      setDescription('');
      setTechStack('');
      setGithubUrl('');
      setDemoUrl('');
      setTargetDate('');
      setProjectType('PERSONAL');
      setSelectedMembers([]);
      setMemberSearchQuery('');
      await loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to create project.');
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '3rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>
        <p>Loading Projects...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Projects Workspace
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', marginTop: '0.25rem' }}>
            Manage personal and team projects with snapshot-cloned engineering lifecycle workflows.
          </p>
        </div>

        {canCreateProject && (
          <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
            <Plus size={18} />
            <span>Create Project</span>
          </button>
        )}
      </div>

      {/* Status Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {[
          { key: 'ACTIVE', label: 'Active Projects' },
          { key: 'ALL', label: 'All Projects' },
          { key: 'COMPLETED', label: 'Completed' },
          { key: 'ARCHIVED', label: 'Archived' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key as any)}
            className={`btn ${statusFilter === tab.key ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.45rem 0.875rem', fontSize: '0.8125rem' }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <FolderKanban size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>No Projects Found</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', maxWidth: '400px', margin: '0.5rem auto 1.5rem' }}>
            {statusFilter === 'ARCHIVED'
              ? 'No projects have been archived yet.'
              : statusFilter === 'COMPLETED'
              ? 'No projects are completed yet.'
              : 'Get started by initializing a new personal or team project.'}
          </p>
          {canCreateProject && (
            <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
              <Plus size={18} />
              <span>Create Project</span>
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {filteredProjects.map((p) => (
            <div key={p.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Badge status={p.status} />
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        padding: '0.125rem 0.5rem',
                        borderRadius: '12px',
                        backgroundColor: p.type === 'PERSONAL' ? 'var(--accent-light)' : 'var(--bg-surface-secondary)',
                        color: p.type === 'PERSONAL' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                        border: '1px solid var(--border-color)',
                      }}
                    >
                      {p.type === 'PERSONAL' ? '👤 Personal' : '👥 Team Project'}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Created {new Date(p.createdAt).toLocaleDateString()}</span>
                </div>

                <h2 style={{ fontSize: '1.1875rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                  <Link to={`/projects/${p.id}`} style={{ color: 'inherit' }}>{p.name}</Link>
                </h2>

                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', minHeight: '40px' }}>
                  {p.description || 'No project description provided.'}
                </p>

                {(p.githubUrl || p.demoUrl) && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem', fontSize: '0.8125rem', marginBottom: '1.25rem' }}>
                    {p.githubUrl && (
                      <a
                        href={p.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-secondary)', fontSize: '0.75rem', textDecoration: 'none' }}
                        title="GitHub Repository"
                      >
                        <Github size={14} />
                        <span>Repo</span>
                        <ExternalLink size={10} />
                      </a>
                    )}

                    {p.demoUrl && (
                      <a
                        href={p.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: 'var(--status-completed)', fontSize: '0.75rem', textDecoration: 'none' }}
                        title="Live Demo"
                      >
                        <ExternalLink size={14} />
                        <span>Demo</span>
                      </a>
                    )}
                  </div>
                )}

                <div style={{ backgroundColor: 'var(--bg-surface-secondary)', padding: '0.875rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                    <span>Active Phase:</span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{p.currentPhase ? p.currentPhase.name : 'Completed'}</span>
                  </div>
                  <ProgressBar progress={p.progress || 0} />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                  <Users size={16} />
                  <span>{p.type === 'PERSONAL' ? 'Solo Developer' : `${p.members.length} Members`}</span>
                </div>

                <Link to={`/projects/${p.id}`} className="btn btn-secondary btn-sm">
                  <span>View Details</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Create New Engineering Project">
        {error && (
          <div style={{ backgroundColor: 'var(--status-blocked-bg)', color: 'var(--status-blocked)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontSize: '0.875rem', fontWeight: 600 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleCreateProject}>
          <div className="form-group">
            <label>Project Ownership & Structure *</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.25rem' }}>
              <button
                type="button"
                className={`btn ${projectType === 'PERSONAL' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setProjectType('PERSONAL')}
                style={{ flexDirection: 'column', padding: '0.75rem', height: 'auto', textAlign: 'left', alignItems: 'flex-start' }}
              >
                <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>👤 Personal Project</div>
                <div style={{ fontSize: '0.75rem', opacity: 0.8, fontWeight: 400, marginTop: '0.25rem' }}>
                  Developed by you alone. Pre-assigns deliverables to you.
                </div>
              </button>

              <button
                type="button"
                className={`btn ${projectType === 'TEAM' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setProjectType('TEAM')}
                style={{ flexDirection: 'column', padding: '0.75rem', height: 'auto', textAlign: 'left', alignItems: 'flex-start' }}
              >
                <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>👥 Team Project</div>
                <div style={{ fontSize: '0.75rem', opacity: 0.8, fontWeight: 400, marginTop: '0.25rem' }}>
                  Collaborative project. You lead and assign team members.
                </div>
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="name">Project Name *</label>
            <input
              id="name"
              type="text"
              className="input-field"
              placeholder="e.g. Arixen Platform"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              className="input-field"
              rows={3}
              placeholder="Brief description of the product objective..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Architecture & Tech Stack Builder</label>
            <VisualTechStackEditor value={techStack} onChange={setTechStack} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div className="form-group">
              <label htmlFor="githubUrl">GitHub Repository URL</label>
              <input
                id="githubUrl"
                type="url"
                className="input-field"
                placeholder="https://github.com/org/repo"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="demoUrl">Live Demo URL</label>
              <input
                id="demoUrl"
                type="url"
                className="input-field"
                placeholder="https://demo.app"
                value={demoUrl}
                onChange={(e) => setDemoUrl(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="targetDate">Target Completion Date</label>
            <input
              id="targetDate"
              type="date"
              className="input-field"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
            />
          </div>

          {projectType === 'TEAM' && (
            <div className="form-group">
              <label>Search & Select Team Members by Name or Email</label>
              <UserSearchSelect
                users={users.filter((u) => u.id !== user?.id && u.role !== 'ADMIN' && !selectedMembers.some((m) => m.id === u.id))}
                selectedUserId=""
                onSelectUser={(selectedId) => {
                  const found = users.find((u) => u.id === selectedId);
                  if (found) {
                    setSelectedMembers((prev) => [...prev, found]);
                  }
                }}
                placeholder="Type name or email to add team members..."
              />

              {/* Selected Members Chips */}
              {selectedMembers.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.75rem' }}>
                  {selectedMembers.map((m) => (
                    <span
                      key={m.id}
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        padding: '0.25rem 0.6rem',
                        borderRadius: '16px',
                        backgroundColor: 'var(--bg-surface-secondary)',
                        border: '1px solid var(--border-color)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.375rem',
                      }}
                    >
                      <span>{m.name} ({m.email})</span>
                      <button
                        type="button"
                        onClick={() => setSelectedMembers((prev) => prev.filter((u) => u.id !== m.id))}
                        style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--status-blocked)', padding: 0, display: 'flex' }}
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={creating}>
              {creating ? 'Generating Workflow...' : 'Create & Generate Workflow'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
