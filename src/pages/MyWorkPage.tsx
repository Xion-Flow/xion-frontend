import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { CheckSquare, CheckCircle2, Circle, Clock, FileText, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { ProjectDeliverable } from '../types';
import { Badge } from '../components/Badge';

export const MyWorkPage: React.FC = () => {
  const { user } = useAuth();
  if (user?.role === 'ADMIN') {
    return <Navigate to="/admin" replace />;
  }
  const [deliverables, setDeliverables] = useState<ProjectDeliverable[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadWork = async () => {
    try {
      const res = await api.getMyWork(statusFilter, sortBy);
      setDeliverables(res.deliverables);
    } catch (err: any) {
      setError(err.message || 'Failed to load assigned work items.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWork();
  }, [statusFilter, sortBy]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await api.updateDeliverable(id, { status: newStatus as any });
      await loadWork();
    } catch (err: any) {
      alert(err.message || 'Failed to update deliverable status.');
    }
  };

  const handleDocUrlSave = async (id: string, docUrl: string) => {
    try {
      await api.updateDeliverable(id, { documentUrl: docUrl });
      await loadWork();
    } catch (err: any) {
      alert(err.message || 'Failed to attach document.');
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '3rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>
        <p>Loading My Work Queue...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          My Work Queue
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', marginTop: '0.25rem' }}>
          Track and produce deliverables assigned to you across all software development projects.
        </p>
      </div>

      {error && (
        <div className="card" style={{ backgroundColor: 'var(--status-blocked-bg)', color: 'var(--status-blocked)', marginBottom: '1.5rem' }}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Filter & Sort Bar */}
      <div className="card" style={{ padding: '0.875rem 1.25rem', marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)' }}>Status:</span>
          {['ALL', 'PENDING', 'IN_PROGRESS', 'COMPLETED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`btn btn-sm ${statusFilter === st ? 'btn-primary' : 'btn-secondary'}`}
            >
              {st}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)' }}>Sort By:</span>
          <select className="input-field" style={{ width: 'auto', padding: '0.375rem 0.75rem', fontSize: '0.8125rem' }} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="createdAt">Date Created</option>
            <option value="dueDate">Due Date</option>
          </select>
        </div>
      </div>

      {/* Deliverable Items Queue */}
      {deliverables.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <CheckSquare size={48} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>No Deliverables Found</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            No deliverables match the selected status filter.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {deliverables.map((d) => (
            <div key={d.id} className="card">
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <h3 style={{ fontSize: '1.0625rem', fontWeight: 800, color: 'var(--text-primary)' }}>{d.name}</h3>
                    <Badge status={d.status} />
                    {d.isRequired && (
                      <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--status-blocked)', backgroundColor: 'var(--status-blocked-bg)', padding: '0.125rem 0.375rem', borderRadius: '4px' }}>
                        REQUIRED
                      </span>
                    )}
                  </div>

                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                    Project: <strong>{d.projectPhase?.project?.name}</strong> • Phase: <strong>{d.projectPhase?.name}</strong>
                  </p>

                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                    {d.description}
                  </p>

                  {d.documentUrl ? (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
                      <FileText size={16} />
                      <a href={d.documentUrl} target="_blank" rel="noreferrer">Reference Document Attached</a>
                    </div>
                  ) : (
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => {
                        const url = prompt('Enter Document Reference URL (e.g. Google Doc or GitHub link):');
                        if (url) handleDocUrlSave(d.id, url);
                      }}
                    >
                      <FileText size={14} />
                      <span>Attach Document Link</span>
                    </button>
                  )}
                </div>

                {/* Inline Status Changer */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <select
                    className="input-field"
                    style={{ padding: '0.375rem 0.75rem', fontSize: '0.8125rem', fontWeight: 600 }}
                    value={d.status}
                    onChange={(e) => handleStatusChange(d.id, e.target.value)}
                  >
                    <option value="NOT_STARTED">NOT_STARTED</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="BLOCKED">BLOCKED</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
