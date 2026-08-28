import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { FolderKanban, CheckSquare, Clock, ArrowRight, CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Project, ProjectDeliverable, ProjectInvite } from '../types';
import { ProgressBar } from '../components/ProgressBar';
import { Badge } from '../components/Badge';
import { TechStackBadges } from '../components/TechStackBadges';
import { UserPlus, Check, X } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  if (user?.role === 'ADMIN') {
    return <Navigate to="/admin" replace />;
  }
  const [projects, setProjects] = useState<Project[]>([]);
  const [myWork, setMyWork] = useState<ProjectDeliverable[]>([]);
  const [pendingInvites, setPendingInvites] = useState<ProjectInvite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = async () => {
    try {
      const [projRes, workRes, notifRes] = await Promise.all([
        api.getProjects(),
        api.getMyWork('PENDING'),
        api.getNotifications(),
      ]);
      setProjects(projRes.projects);
      setMyWork(workRes.deliverables);
      setPendingInvites(notifRes.pendingInvites || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRespondInvite = async (inviteId: string, action: 'ACCEPT' | 'DECLINE') => {
    try {
      await api.respondToInvite(inviteId, action);
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to respond to invitation.');
    }
  };

  const handleToggleComplete = async (deliverableId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'COMPLETED' ? 'IN_PROGRESS' : 'COMPLETED';
      await api.updateDeliverable(deliverableId, { status: newStatus as any });

      // Refresh list
      const [projRes, workRes] = await Promise.all([api.getProjects(), api.getMyWork('PENDING')]);
      setProjects(projRes.projects);
      setMyWork(workRes.deliverables);
    } catch (err: any) {
      alert(err.message || 'Failed to update deliverable status.');
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '3rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>
        <p>Loading Dashboard...</p>
      </div>
    );
  }

  const completedWorkCount = projects.reduce((acc, p) => acc + (p.completedDeliverablesCount || 0), 0);
  const totalWorkCount = projects.reduce((acc, p) => acc + (p.deliverablesCount || 0), 0);

  return (
    <div>
      {/* Header Banner */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          Welcome back, {user?.name}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', marginTop: '0.25rem' }}>
          Here is your development roadmap overview and immediate task queue.
        </p>
      </div>

      {/* Pending Project Join Requests Banner */}
      {pendingInvites.length > 0 && (
        <div
          className="card"
          style={{
            backgroundColor: 'var(--status-in-progress-bg)',
            border: '1.5px solid var(--status-in-progress)',
            marginBottom: '1.5rem',
            padding: '1rem 1.25rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <UserPlus size={22} style={{ color: 'var(--status-in-progress)' }} />
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Pending Project Join Invitations ({pendingInvites.length})
              </h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                You have been invited to join the following project teams. Accept to access project workflows.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {pendingInvites.map((invite) => (
              <div
                key={invite.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  backgroundColor: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)',
                }}
              >
                <div>
                  <p style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Project: {invite.project?.name}
                  </p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Invited by {invite.inviter?.name} (@{invite.inviter?.username})
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => handleRespondInvite(invite.id, 'DECLINE')}
                    className="btn btn-secondary btn-sm"
                    style={{ color: 'var(--status-blocked)' }}
                  >
                    <X size={14} />
                    <span>Decline</span>
                  </button>
                  <button
                    onClick={() => handleRespondInvite(invite.id, 'ACCEPT')}
                    className="btn btn-primary btn-sm"
                  >
                    <Check size={14} />
                    <span>Accept & Join</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="card" style={{ backgroundColor: 'var(--status-blocked-bg)', color: 'var(--status-blocked)', marginBottom: '1.5rem' }}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', borderRadius: '12px', backgroundColor: 'var(--accent-light)', color: 'var(--accent-primary)' }}>
            <FolderKanban size={24} />
          </div>
          <div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>Active Projects</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>{projects.length}</p>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', borderRadius: '12px', backgroundColor: 'var(--status-in-progress-bg)', color: 'var(--status-in-progress)' }}>
            <Clock size={24} />
          </div>
          <div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>My Pending Tasks</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>{myWork.length}</p>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', borderRadius: '12px', backgroundColor: 'var(--status-completed-bg)', color: 'var(--status-completed)' }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Deliverables Done</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>{completedWorkCount} / {totalWorkCount}</p>
          </div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
        {/* Projects Section */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Project Roadmap Status</h2>
            <Link to="/projects" className="btn btn-secondary btn-sm">
              <span>View All</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {projects.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
              <p style={{ color: 'var(--text-muted)' }}>No projects found. Create or join a project to see your workflow roadmap.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {projects.map((p) => (
                <div key={p.id} className="card">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <Link to={`/projects/${p.id}`} style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {p.name}
                    </Link>
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
                        {p.type === 'PERSONAL' ? '👤 Personal' : '👥 Team'}
                      </span>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.84375rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineClamp: 2 }}>
                    {p.description || 'No description provided.'}
                  </p>

                  <div style={{ backgroundColor: 'var(--bg-surface-secondary)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.375rem' }}>
                      <span>Current Phase:</span>
                      <span style={{ color: 'var(--accent-primary)' }}>{p.currentPhase ? p.currentPhase.name : 'Completed'}</span>
                    </div>
                    <ProgressBar progress={p.progress || 0} />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                    <span>{p.completedDeliverablesCount} of {p.deliverablesCount} deliverables produced</span>
                    <Link to={`/projects/${p.id}`} className="btn btn-secondary btn-sm">
                      Open Project
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* My Work Section */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>My Work Queue</h2>
            <Link to="/my-work" className="btn btn-secondary btn-sm">
              <span>Go to My Work</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {myWork.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '2.5rem' }}>
              <CheckCircle2 size={36} style={{ color: 'var(--status-completed)', margin: '0 auto 0.75rem' }} />
              <p style={{ fontWeight: 700, fontSize: '1rem' }}>All Caught Up!</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.84375rem', marginTop: '0.25rem' }}>
                You have no pending deliverables assigned to you.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {myWork.slice(0, 5).map((d) => (
                <div key={d.id} className="card" style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <button
                      onClick={() => handleToggleComplete(d.id, d.status)}
                      style={{ color: d.status === 'COMPLETED' ? 'var(--status-completed)' : 'var(--text-muted)', marginTop: '2px' }}
                      title="Toggle completion status"
                    >
                      {d.status === 'COMPLETED' ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                    </button>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                        <p style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>{d.name}</p>
                        <Badge status={d.status} />
                      </div>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.125rem' }}>
                        {d.projectPhase?.project?.name} • {d.projectPhase?.name}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
