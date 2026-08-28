import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckSquare, Users, FileText, Code, Plus, ArrowLeft, Radio, Pencil, UserMinus, Archive, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { api } from '../services/api';
import { Project, ProjectDeliverable, User } from '../types';
import { ProgressBar } from '../components/ProgressBar';
import { Badge } from '../components/Badge';
import { Modal } from '../components/Modal';
import { TechStackBadges } from '../components/TechStackBadges';
import { VisualTechStackEditor } from '../components/VisualTechStackEditor';

export const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { socket, isConnected, joinProject, leaveProject } = useSocket();

  const [project, setProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState<'roadmap' | 'team' | 'documents' | 'techstack'>('roadmap');
  const [selectedPhaseId, setSelectedPhaseId] = useState<string | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit Project Details Modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editTechStack, setEditTechStack] = useState('');
  const [editStatus, setEditStatus] = useState('');
  const [editGithubUrl, setEditGithubUrl] = useState('');
  const [editDemoUrl, setEditDemoUrl] = useState('');
  const [editTargetDate, setEditTargetDate] = useState('');
  const [savingProject, setSavingProject] = useState(false);

  // Edit deliverable modal state
  const [editingDeliverable, setEditingDeliverable] = useState<ProjectDeliverable | null>(null);
  const [docUrlInput, setDocUrlInput] = useState('');
  const [notesInput, setNotesInput] = useState('');
  const [assigneeInput, setAssigneeInput] = useState<string>('');
  const [statusInput, setStatusInput] = useState<string>('NOT_STARTED');
  const [updating, setUpdating] = useState(false);

  // Add team member modal
  const [addMemberModalOpen, setAddMemberModalOpen] = useState(false);
  const [newMemberId, setNewMemberId] = useState('');

  const canManageTeam = user?.role === 'ADMIN' || project?.createdById === user?.id || (project?.members?.some((m) => m.userId === user?.id) ?? false);
  const isCreatorOrAdmin = user?.role === 'ADMIN' || project?.createdById === user?.id;

  const loadProject = async () => {
    if (!id) return;
    try {
      const [projRes, userRes] = await Promise.all([api.getProjectDetails(id), api.getUsers()]);
      setProject(projRes.project);
      setAllUsers(userRes.users);

      if (!selectedPhaseId && projRes.project.phases && projRes.project.phases.length > 0) {
        const activeP = projRes.project.phases.find((p) => p.status === 'IN_PROGRESS') || projRes.project.phases[0];
        setSelectedPhaseId(activeP.id);
      }
    } catch (err: any) {
      console.error('Failed to load project details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProject();
  }, [id]);

  // Join WebSocket Project Room & Listen for Live Synchronization
  useEffect(() => {
    if (!id) return;
    joinProject(id);

    if (!socket) return;

    const handleDeliverableUpdated = (data: { deliverable: ProjectDeliverable }) => {
      console.log('⚡ Live WebSocket Event: Deliverable Updated', data);

      setProject((prevProject) => {
        if (!prevProject || !prevProject.phases) return prevProject;

        const updatedPhases = prevProject.phases.map((phase) => {
          const updatedDeliverables = phase.deliverables.map((d) =>
            d.id === data.deliverable.id ? { ...d, ...data.deliverable } : d
          );
          return { ...phase, deliverables: updatedDeliverables };
        });

        return { ...prevProject, phases: updatedPhases };
      });
    };

    const handleProgressUpdated = (data: { progressSummary: any }) => {
      console.log('⚡ Live WebSocket Event: Progress Updated', data);
      setProject((prevProject) => {
        if (!prevProject) return prevProject;
        return {
          ...prevProject,
          progress: data.progressSummary.overallProgressPercentage,
          currentPhase: data.progressSummary.currentPhase,
        };
      });
    };

    socket.on('deliverable:updated', handleDeliverableUpdated);
    socket.on('project:progress_updated', handleProgressUpdated);

    return () => {
      leaveProject(id);
      socket.off('deliverable:updated', handleDeliverableUpdated);
      socket.off('project:progress_updated', handleProgressUpdated);
    };
  }, [id, socket]);

  const handleOpenEditDeliverable = (d: ProjectDeliverable) => {
    setEditingDeliverable(d);
    setDocUrlInput(d.documentUrl || '');
    setNotesInput(d.notes || '');
    setAssigneeInput(d.assignedToId || '');
    setStatusInput(d.status);
  };

  // Optimistic UI Mutation Implementation
  const handleSaveDeliverable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDeliverable || !project) return;
    setUpdating(true);

    const deliverableId = editingDeliverable.id;
    const previousProjectState = { ...project };

    // 1. Optimistically mutate local React state for 0ms latency
    setProject((prev) => {
      if (!prev || !prev.phases) return prev;
      const newPhases = prev.phases.map((p) => ({
        ...p,
        deliverables: p.deliverables.map((d) =>
          d.id === deliverableId
            ? {
                ...d,
                status: statusInput as any,
                documentUrl: docUrlInput || null,
                notes: notesInput || null,
                assignedToId: assigneeInput || null,
              }
            : d
        ),
      }));
      return { ...prev, phases: newPhases };
    });

    setEditingDeliverable(null);

    // 2. Perform background API call
    try {
      await api.updateDeliverable(deliverableId, {
        status: statusInput as any,
        documentUrl: docUrlInput || null,
        notes: notesInput || null,
        assignedToId: assigneeInput || null,
      });
    } catch (err: any) {
      alert(err.message || 'Failed to update deliverable. Rolling back.');
      // Rollback on failure
      setProject(previousProjectState);
    } finally {
      setUpdating(false);
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !newMemberId) return;

    try {
      await api.addProjectMembers(id, [newMemberId]);
      setAddMemberModalOpen(false);
      setNewMemberId('');
    } catch (err: any) {
      alert(err.message || 'Failed to add team member.');
    }
  };

  const handleRemoveMember = async (targetUserId: string) => {
    if (!id) return;
    if (!window.confirm('Are you sure you want to remove this member from the project team?')) {
      return;
    }
    try {
      await api.removeProjectMember(id, targetUserId);
      await loadProject();
    } catch (err: any) {
      alert(err.message || 'Failed to remove team member.');
    }
  };

  const handleArchiveProject = async () => {
    if (!id || !project) return;
    const isArchived = project.status === 'ARCHIVED';
    const actionName = isArchived ? 'unarchive' : 'archive';
    if (!window.confirm(`Are you sure you want to ${actionName} this project?`)) return;
    try {
      const res = await api.archiveProject(id, !isArchived);
      setProject((prev) => (prev ? { ...prev, status: res.project.status } : prev));
      setEditModalOpen(false);
    } catch (err: any) {
      alert(err.message || `Failed to ${actionName} project.`);
    }
  };

  const handleDeleteProject = async () => {
    if (!id || !project) return;
    if (
      !window.confirm(
        `⚠️ DANGER: Are you sure you want to PERMANENTLY DELETE "${project.name}"?\n\nThis will remove all phases, deliverables, and activity history. This action CANNOT be undone!`
      )
    ) {
      return;
    }
    try {
      await api.deleteProject(id);
      window.location.href = '/projects';
    } catch (err: any) {
      alert(err.message || 'Failed to delete project.');
    }
  };

  const openEditModal = (p: Project) => {
    setEditName(p.name || '');
    setEditDescription(p.description || '');
    setEditTechStack(p.techStack || '');
    setEditStatus(p.status || 'IN_PROGRESS');
    setEditGithubUrl(p.githubUrl || '');
    setEditDemoUrl(p.demoUrl || '');
    setEditTargetDate(p.targetDate ? p.targetDate.split('T')[0] : '');
    setEditModalOpen(true);
  };

  const handleSaveProjectDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setSavingProject(true);
    try {
      const res = await api.updateProject(id, {
        name: editName,
        description: editDescription,
        techStack: editTechStack,
        status: editStatus as any,
        githubUrl: editGithubUrl || undefined,
        demoUrl: editDemoUrl || undefined,
        targetDate: editTargetDate || undefined,
      });
      setProject((prev) => (prev ? { ...prev, ...res.project } : prev));
      setEditModalOpen(false);
    } catch (err: any) {
      alert(err.message || 'Failed to update project details.');
    } finally {
      setSavingProject(false);
    }
  };

  if (loading || !project) {
    return (
      <div style={{ padding: '3rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>
        <p>Loading Project Details...</p>
      </div>
    );
  }

  const selectedPhase = project.phases?.find((p) => p.id === selectedPhaseId) || project.phases?.[0];
  const totalDeliverables = project.phases?.reduce((acc, p) => acc + p.deliverables.length, 0) || 0;
  const completedDeliverables = project.phases?.reduce((acc, p) => acc + p.deliverables.filter((d) => d.status === 'COMPLETED').length, 0) || 0;
  const overallProgress = totalDeliverables > 0 ? Math.round((completedDeliverables / totalDeliverables) * 100) : 0;

  const documentDeliverables = project.phases
    ?.flatMap((p) => p.deliverables.map((d) => ({ ...d, phaseName: p.name })))
    .filter((d) => d.documentUrl) || [];

  return (
    <div>
      {/* Top Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <Link to="/projects" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          <ArrowLeft size={16} />
          <span>Back to Projects</span>
        </Link>

        {/* Live Synchronization Status Indicator */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.375rem',
            padding: '0.25rem 0.625rem',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: 700,
            backgroundColor: isConnected ? 'var(--status-completed-bg)' : 'var(--status-not-started-bg)',
            color: isConnected ? 'var(--status-completed)' : 'var(--status-not-started)',
          }}
          title={isConnected ? 'Connected to Live Synchronization WebSockets' : 'Offline / Polling mode'}
        >
          <Radio size={14} />
          <span>{isConnected ? 'LIVE SYNC ACTIVE' : 'CONNECTING WS...'}</span>
        </div>
      </div>

      {/* Project Header Banner */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                {project.name}
              </h1>
              <Badge status={project.status} />
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => openEditModal(project)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', fontWeight: 700 }}
              >
                <Pencil size={14} />
                <span>Edit Project</span>
              </button>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', maxWidth: '720px' }}>
              {project.description || 'No project description provided.'}
            </p>
          </div>

          <div style={{ textAlign: 'right', minWidth: '200px' }}>
            <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Overall Progress</p>
            <ProgressBar progress={overallProgress} />
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.375rem' }}>
              {completedDeliverables} of {totalDeliverables} deliverables completed
            </p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
        <button
          onClick={() => setActiveTab('roadmap')}
          className={`btn ${activeTab === 'roadmap' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
        >
          <CheckSquare size={16} />
          <span>Roadmap & Deliverables</span>
        </button>

        <button
          onClick={() => setActiveTab('team')}
          className={`btn ${activeTab === 'team' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
        >
          <Users size={16} />
          <span>Team ({project.members.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('documents')}
          className={`btn ${activeTab === 'documents' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
        >
          <FileText size={16} />
          <span>Documents ({documentDeliverables.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('techstack')}
          className={`btn ${activeTab === 'techstack' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
        >
          <Code size={16} />
          <span>Tech Stack</span>
        </button>
      </div>

      {/* TAB 1: ROADMAP & DELIVERABLES */}
      {activeTab === 'roadmap' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 340px) 1fr', gap: '1.5rem' }}>
          {/* Left Column: Interactive 10-Phase Step Visualizer */}
          <div className="card" style={{ padding: '1rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
              Development Phases
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {project.phases?.map((p) => {
                const isSelected = p.id === selectedPhaseId;
                const completedCount = p.deliverables.filter((d) => d.status === 'COMPLETED').length;
                const totalCount = p.deliverables.length;
                const isCompleted = p.status === 'COMPLETED';
                const isInProgress = p.status === 'IN_PROGRESS';

                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPhaseId(p.id)}
                    style={{
                      padding: '0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid',
                      borderColor: isSelected ? 'var(--accent-primary)' : 'var(--border-color)',
                      backgroundColor: isSelected ? 'var(--accent-light)' : 'transparent',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {isCompleted && '✓ '}
                        {isInProgress && '→ '}
                        {!isCompleted && !isInProgress && '○ '}
                        {p.name}
                      </span>
                      <Badge status={p.status} />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      <span>Progress</span>
                      <span>{completedCount} / {totalCount} Done</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Deliverables Checklist for Selected Phase */}
          {selectedPhase && (
            <div className="card">
              <div style={{ marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{selectedPhase.name}</h3>
                  <Badge status={selectedPhase.status} />
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.375rem' }}>
                  {selectedPhase.description}
                </p>
                {selectedPhase.objective && (
                  <p style={{ fontSize: '0.8125rem', color: 'var(--accent-primary)', fontWeight: 600, marginTop: '0.375rem' }}>
                    🎯 Objective: {selectedPhase.objective}
                  </p>
                )}
              </div>

              <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>
                Phase Deliverables Checklist ({selectedPhase.deliverables.length})
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                {selectedPhase.deliverables.map((d) => (
                  <div
                    key={d.id}
                    style={{
                      padding: '1rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-color)',
                      backgroundColor: 'var(--bg-surface-secondary)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>{d.name}</span>
                          {d.isRequired ? (
                            <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--status-blocked)', backgroundColor: 'var(--status-blocked-bg)', padding: '0.125rem 0.375rem', borderRadius: '4px' }}>
                              REQUIRED
                            </span>
                          ) : (
                            <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-muted)', backgroundColor: 'var(--bg-surface)', padding: '0.125rem 0.375rem', borderRadius: '4px' }}>
                              OPTIONAL
                            </span>
                          )}
                          <Badge status={d.status} />
                        </div>

                        <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                          {d.description}
                        </p>

                        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          <span>Assigned To: <strong>{d.assignedTo ? d.assignedTo.name : 'Unassigned'}</strong></span>
                          {d.documentUrl && (
                            <a href={d.documentUrl} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}>
                              <FileText size={14} />
                              <span>View Document Reference</span>
                            </a>
                          )}
                        </div>
                      </div>

                      <button className="btn btn-secondary btn-sm" onClick={() => handleOpenEditDeliverable(d)}>
                        Update Status
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: TEAM MEMBERS */}
      {activeTab === 'team' && (
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Project Team Members</h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                {project.type === 'PERSONAL'
                  ? '👤 Personal Project — Member invitations are disabled for personal workspaces.'
                  : 'Manage team collaborators and project assignments.'}
              </p>
            </div>
            {project.type === 'TEAM' && canManageTeam && (
              <button className="btn btn-primary btn-sm" onClick={() => setAddMemberModalOpen(true)}>
                <Plus size={16} />
                <span>Add Team Member</span>
              </button>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
            {project.members.map((m) => (
              <div key={m.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                  <img
                    src={m.user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${m.user.name}`}
                    alt={m.user.name}
                    style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                  />
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>{m.user.name}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{m.user.email}</p>
                    <Badge status="IN_PROGRESS" label={m.role} />
                  </div>
                </div>

                {m.user.id !== project.createdById && canManageTeam && (
                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ color: 'var(--status-blocked)', borderColor: 'var(--status-blocked)' }}
                    onClick={() => handleRemoveMember(m.user.id)}
                    title="Remove member from project"
                  >
                    <UserMinus size={14} />
                    <span>Remove</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: DOCUMENTS INDEX */}
      {activeTab === 'documents' && (
        <div className="card">
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem' }}>
            Attached Documents & Artifacts ({documentDeliverables.length})
          </h3>

          {documentDeliverables.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>
              No document references or files have been attached yet. Update deliverable statuses and include document URLs.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {documentDeliverables.map((doc) => (
                <div key={doc.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <FileText size={20} style={{ color: 'var(--accent-primary)' }} />
                    <div>
                      <p style={{ fontWeight: 700, fontSize: '0.9375rem' }}>{doc.name}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Phase: {doc.phaseName}</p>
                    </div>
                  </div>

                  <a href={doc.documentUrl!} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">
                    Open Reference Document
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: ARCHITECTURE & TECH STACK */}
      {activeTab === 'techstack' && (
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Architecture & Tech Stack
              </h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                Categorized framework components, databases, tools, and deployment infrastructure.
              </p>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => openEditModal(project)}>
              <Pencil size={14} />
              <span>Edit Tech Stack</span>
            </button>
          </div>

          <TechStackBadges techStack={project.techStack} />
        </div>
      )}

      {/* Edit Deliverable Modal */}
      <Modal isOpen={!!editingDeliverable} onClose={() => setEditingDeliverable(null)} title={`Update: ${editingDeliverable?.name}`}>
        <form onSubmit={handleSaveDeliverable}>
          <div className="form-group">
            <label>Status</label>
            <select className="input-field" value={statusInput} onChange={(e) => setStatusInput(e.target.value)}>
              <option value="NOT_STARTED">NOT_STARTED</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="BLOCKED">BLOCKED</option>
            </select>
          </div>

          <div className="form-group">
            <label>Assign To</label>
            <select className="input-field" value={assigneeInput} onChange={(e) => setAssigneeInput(e.target.value)}>
              <option value="">Unassigned</option>
              {allUsers.map((u) => (
                <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Document / File Link (URL)</label>
            <input
              type="url"
              className="input-field"
              placeholder="https://docs.google.com/document/d/..."
              value={docUrlInput}
              onChange={(e) => setDocUrlInput(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Notes / Deliverable Remarks</label>
            <textarea
              className="input-field"
              rows={3}
              placeholder="Add completion notes or context..."
              value={notesInput}
              onChange={(e) => setNotesInput(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setEditingDeliverable(null)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={updating}>
              {updating ? 'Saving...' : 'Save Updates'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Team Member Modal */}
      <Modal isOpen={addMemberModalOpen} onClose={() => setAddMemberModalOpen(false)} title="Add Team Member to Project">
        <form onSubmit={handleAddMember}>
          <div className="form-group">
            <label>Select User</label>
            <select className="input-field" value={newMemberId} onChange={(e) => setNewMemberId(e.target.value)} required>
              <option value="">-- Choose User --</option>
              {allUsers
                .filter((u) => u.role !== 'ADMIN' && !project.members.some((m) => m.userId === u.id))
                .map((u) => (
                  <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                ))}
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setAddMemberModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Add Member
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Project Details Modal */}
      <Modal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} title="Edit Project Details">
        <form onSubmit={handleSaveProjectDetails}>
          <div className="form-group">
            <label htmlFor="editName">Project Name *</label>
            <input
              id="editName"
              type="text"
              className="input-field"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="editDescription">Description</label>
            <textarea
              id="editDescription"
              className="input-field"
              rows={3}
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Architecture & Tech Stack Builder</label>
            <VisualTechStackEditor value={editTechStack} onChange={setEditTechStack} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div className="form-group">
              <label htmlFor="editStatus">Project Status</label>
              <select id="editStatus" className="input-field" value={editStatus} onChange={(e) => setEditStatus(e.target.value)}>
                <option value="PLANNING">PLANNING</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="ON_HOLD">ON_HOLD</option>
                <option value="ARCHIVED">ARCHIVED</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="editTargetDate">Target Completion Date</label>
              <input
                id="editTargetDate"
                type="date"
                className="input-field"
                value={editTargetDate}
                onChange={(e) => setEditTargetDate(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div className="form-group">
              <label htmlFor="editGithubUrl">GitHub Repository URL</label>
              <input
                id="editGithubUrl"
                type="url"
                className="input-field"
                placeholder="https://github.com/org/repo"
                value={editGithubUrl}
                onChange={(e) => setEditGithubUrl(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="editDemoUrl">Live Demo URL</label>
              <input
                id="editDemoUrl"
                type="url"
                className="input-field"
                placeholder="https://demo.app.com"
                value={editDemoUrl}
                onChange={(e) => setEditDemoUrl(e.target.value)}
              />
            </div>
          </div>
          {/* Team Members Management inside Edit Modal (TEAM projects only) */}
          {project.type === 'TEAM' && (
            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
              <label style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>
                Project Team Members ({project.members?.length || 0})
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                {project.members?.map((m) => (
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
                    <span>{m.user.name}</span>
                    {m.user.id !== project.createdById && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(m.user.id)}
                        style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--status-blocked)', padding: 0, display: 'flex' }}
                        title="Remove member"
                      >
                        <UserMinus size={12} />
                      </button>
                    )}
                  </span>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <select
                  className="input-field"
                  style={{ fontSize: '0.8125rem', padding: '0.375rem 0.625rem' }}
                  value={newMemberId}
                  onChange={(e) => setNewMemberId(e.target.value)}
                >
                  <option value="">-- Add New Member --</option>
                  {allUsers
                    .filter((u) => u.role !== 'ADMIN' && !project.members.some((m) => m.userId === u.id))
                    .map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.email})
                      </option>
                    ))}
                </select>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  disabled={!newMemberId}
                  onClick={async () => {
                    if (!id || !newMemberId) return;
                    try {
                      await api.addProjectMembers(id, [newMemberId]);
                      setNewMemberId('');
                      await loadProject();
                    } catch (err: any) {
                      alert(err.message || 'Failed to add member');
                    }
                  }}
                >
                  <Plus size={14} />
                  <span>Add</span>
                </button>
              </div>
            </div>
          )}

          {/* Project Creator & Admin Danger Zone (Archive & Delete) */}
          {isCreatorOrAdmin && (
            <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
              <label style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--status-blocked)', marginBottom: '0.5rem', display: 'block' }}>
                Danger Zone (Project Owner Controls)
              </label>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={handleArchiveProject}
                  style={{ fontSize: '0.8125rem' }}
                >
                  <Archive size={14} />
                  <span>{project.status === 'ARCHIVED' ? 'Unarchive Project' : 'Archive Project'}</span>
                </button>

                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={handleDeleteProject}
                  style={{ color: 'var(--status-blocked)', borderColor: 'var(--status-blocked)', fontSize: '0.8125rem' }}
                >
                  <Trash2 size={14} />
                  <span>Delete Project</span>
                </button>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setEditModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={savingProject}>
              {savingProject ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
