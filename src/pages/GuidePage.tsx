import React, { useEffect, useState } from 'react';
import { BookOpen, CheckCircle2, ListChecks, Target, FileText } from 'lucide-react';
import { api } from '../services/api';
import { PhaseTemplate } from '../types';

export const GuidePage: React.FC = () => {
  const [phases, setPhases] = useState<PhaseTemplate[]>([]);
  const [selectedPhaseId, setSelectedPhaseId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGuide() {
      try {
        const res = await api.getGuide();
        setPhases(res.phases);
        if (res.phases.length > 0) {
          setSelectedPhaseId(res.phases[0].id);
        }
      } catch (err: any) {
        console.error('Failed to load Development Guide:', err);
      } finally {
        setLoading(false);
      }
    }

    loadGuide();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '3rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>
        <p>Loading Development Guide...</p>
      </div>
    );
  }

  const selectedPhase = phases.find((p) => p.id === selectedPhaseId) || phases[0];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          Xion Development Guide & Knowledge Base
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', marginTop: '0.25rem' }}>
          Master software engineering phase workflows, activities, expected deliverables, and completion criteria.
        </p>
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 340px) 1fr', gap: '1.5rem' }}>
        {/* Left Side Navigation List */}
        <div className="card" style={{ padding: '1rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
            Lifecycle Phases
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            {phases.map((p) => {
              const isSelected = p.id === selectedPhaseId;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedPhaseId(p.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid',
                    borderColor: isSelected ? 'var(--accent-primary)' : 'transparent',
                    backgroundColor: isSelected ? 'var(--accent-light)' : 'transparent',
                    color: isSelected ? 'var(--accent-primary)' : 'var(--text-primary)',
                    fontWeight: isSelected ? 700 : 500,
                    fontSize: '0.875rem',
                    textAlign: 'left',
                  }}
                >
                  <span>{p.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side Guide Content */}
        {selectedPhase && (
          <div className="card">
            <div style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
              <span className="badge badge-in_progress" style={{ marginBottom: '0.5rem' }}>
                Phase {selectedPhase.order} of 10
              </span>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                {selectedPhase.name}
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.6 }}>
                {selectedPhase.description}
              </p>
            </div>

            {/* Objective */}
            <div style={{ backgroundColor: 'var(--bg-surface-secondary)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-primary)', fontWeight: 700, marginBottom: '0.25rem' }}>
                <Target size={18} />
                <span>Phase Objective</span>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>{selectedPhase.objective}</p>
            </div>

            {/* Activities List */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1.0625rem', marginBottom: '0.75rem' }}>
                <ListChecks size={20} style={{ color: 'var(--accent-primary)' }} />
                <span>Engineering Activities</span>
              </div>
              <ul style={{ listStyleType: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {selectedPhase.activities.map((act, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    <CheckCircle2 size={16} style={{ color: 'var(--status-completed)', marginTop: '3px' }} />
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Deliverables Table */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1.0625rem', marginBottom: '0.75rem' }}>
                <FileText size={20} style={{ color: 'var(--accent-primary)' }} />
                <span>Expected Deliverables ({selectedPhase.deliverables.length})</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {selectedPhase.deliverables.map((d) => (
                  <div key={d.id} style={{ padding: '0.875rem 1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-app)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
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
                    </div>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{d.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
