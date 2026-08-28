import React from 'react';
import { parseTechStack } from '../utils/techStackParser';

interface TechStackBadgesProps {
  techStack?: string | null;
  compact?: boolean;
}

const CATEGORY_COLORS: Record<string, { bg: string; color: string; border: string }> = {
  frontend: { bg: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: 'rgba(59, 130, 246, 0.25)' },
  backend: { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: 'rgba(16, 185, 129, 0.25)' },
  database: { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', border: 'rgba(245, 158, 11, 0.25)' },
  db: { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', border: 'rgba(245, 158, 11, 0.25)' },
  ai: { bg: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', border: 'rgba(139, 92, 246, 0.25)' },
  nlp: { bg: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', border: 'rgba(139, 92, 246, 0.25)' },
  rag: { bg: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', border: 'rgba(139, 92, 246, 0.25)' },
  devops: { bg: 'rgba(236, 72, 153, 0.1)', color: '#ec4899', border: 'rgba(236, 72, 153, 0.25)' },
  cloud: { bg: 'rgba(236, 72, 153, 0.1)', color: '#ec4899', border: 'rgba(236, 72, 153, 0.25)' },
  deployment: { bg: 'rgba(236, 72, 153, 0.1)', color: '#ec4899', border: 'rgba(236, 72, 153, 0.25)' },
  security: { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'rgba(239, 68, 68, 0.25)' },
  auth: { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'rgba(239, 68, 68, 0.25)' },
};

function getCategoryColor(cat: string) {
  const lower = cat.toLowerCase();
  for (const [key, theme] of Object.entries(CATEGORY_COLORS)) {
    if (lower.includes(key)) return theme;
  }
  return { bg: 'var(--accent-light)', color: 'var(--accent-primary)', border: 'var(--border-color)' };
}

export const TechStackBadges: React.FC<TechStackBadgesProps> = ({ techStack, compact = false }) => {
  const parsed = parseTechStack(techStack);
  const categories = Object.keys(parsed);

  if (categories.length === 0) {
    return <span style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', fontStyle: 'italic' }}>No tech stack specified</span>;
  }

  if (compact) {
    // Single row concise view for cards
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', alignItems: 'center' }}>
        {categories.map((cat) => {
          const theme = getCategoryColor(cat);
          const techs = parsed[cat];
          return (
            <span
              key={cat}
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                padding: '0.2rem 0.5rem',
                borderRadius: '6px',
                backgroundColor: theme.bg,
                color: theme.color,
                border: `1px solid ${theme.border}`,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
              }}
            >
              <strong style={{ opacity: 0.85 }}>{cat}:</strong> {techs.join(', ')}
            </span>
          );
        })}
      </div>
    );
  }

  // Full detailed view for project details
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.875rem' }}>
      {categories.map((cat) => {
        const theme = getCategoryColor(cat);
        const techs = parsed[cat];
        return (
          <div
            key={cat}
            style={{
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-surface-secondary)',
              border: `1px solid ${theme.border}`,
            }}
          >
            <p style={{ fontSize: '0.75rem', fontWeight: 800, color: theme.color, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.375rem' }}>
              {cat}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
              {techs.map((tech) => (
                <span
                  key={tech}
                  style={{
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    padding: '0.15rem 0.45rem',
                    borderRadius: '4px',
                    backgroundColor: theme.bg,
                    color: theme.color,
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
