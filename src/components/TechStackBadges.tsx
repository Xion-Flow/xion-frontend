import React from 'react';
import { parseTechStack } from '../utils/techStackParser';
import {
  Layout,
  Server,
  Sparkles,
  Search,
  Code2,
  FileText,
  Database as DbIcon,
  Cloud,
  Layers,
  Cpu,
  Shield,
  Box,
  LucideIcon,
} from 'lucide-react';

interface TechStackBadgesProps {
  techStack?: string | null;
  compact?: boolean;
}

interface CategoryStyle {
  icon: LucideIcon;
  bg: string;
  color: string;
  border: string;
  badgeBg: string;
}

const CATEGORY_THEMES: Array<{ key: string; icon: LucideIcon; bg: string; color: string; border: string; badgeBg: string }> = [
  { key: 'frontend', icon: Layout, bg: 'rgba(59, 130, 246, 0.08)', color: '#3b82f6', border: 'rgba(59, 130, 246, 0.22)', badgeBg: 'rgba(59, 130, 246, 0.12)' },
  { key: 'backend', icon: Server, bg: 'rgba(16, 185, 129, 0.08)', color: '#10b981', border: 'rgba(16, 185, 129, 0.22)', badgeBg: 'rgba(16, 185, 129, 0.12)' },
  { key: 'ai', icon: Sparkles, bg: 'rgba(139, 92, 246, 0.08)', color: '#8b5cf6', border: 'rgba(139, 92, 246, 0.22)', badgeBg: 'rgba(139, 92, 246, 0.12)' },
  { key: 'nlp', icon: Sparkles, bg: 'rgba(139, 92, 246, 0.08)', color: '#8b5cf6', border: 'rgba(139, 92, 246, 0.22)', badgeBg: 'rgba(139, 92, 246, 0.12)' },
  { key: 'rag', icon: Search, bg: 'rgba(245, 158, 11, 0.08)', color: '#f59e0b', border: 'rgba(245, 158, 11, 0.22)', badgeBg: 'rgba(245, 158, 11, 0.12)' },
  { key: 'retrieval', icon: Search, bg: 'rgba(245, 158, 11, 0.08)', color: '#f59e0b', border: 'rgba(245, 158, 11, 0.22)', badgeBg: 'rgba(245, 158, 11, 0.12)' },
  { key: 'code', icon: Code2, bg: 'rgba(6, 182, 212, 0.08)', color: '#06b6d4', border: 'rgba(6, 182, 212, 0.22)', badgeBg: 'rgba(6, 182, 212, 0.12)' },
  { key: 'analysis', icon: Code2, bg: 'rgba(6, 182, 212, 0.08)', color: '#06b6d4', border: 'rgba(6, 182, 212, 0.22)', badgeBg: 'rgba(6, 182, 212, 0.12)' },
  { key: 'document', icon: FileText, bg: 'rgba(236, 72, 153, 0.08)', color: '#ec4899', border: 'rgba(236, 72, 153, 0.22)', badgeBg: 'rgba(236, 72, 153, 0.12)' },
  { key: 'database', icon: DbIcon, bg: 'rgba(99, 102, 241, 0.08)', color: '#6366f1', border: 'rgba(99, 102, 241, 0.22)', badgeBg: 'rgba(99, 102, 241, 0.12)' },
  { key: 'db', icon: DbIcon, bg: 'rgba(99, 102, 241, 0.08)', color: '#6366f1', border: 'rgba(99, 102, 241, 0.22)', badgeBg: 'rgba(99, 102, 241, 0.12)' },
  { key: 'devops', icon: Cloud, bg: 'rgba(20, 184, 166, 0.08)', color: '#14b8a6', border: 'rgba(20, 184, 166, 0.22)', badgeBg: 'rgba(20, 184, 166, 0.12)' },
  { key: 'deployment', icon: Cloud, bg: 'rgba(20, 184, 166, 0.08)', color: '#14b8a6', border: 'rgba(20, 184, 166, 0.22)', badgeBg: 'rgba(20, 184, 166, 0.12)' },
  { key: 'security', icon: Shield, bg: 'rgba(239, 68, 68, 0.08)', color: '#ef4444', border: 'rgba(239, 68, 68, 0.22)', badgeBg: 'rgba(239, 68, 68, 0.12)' },
];

function getCategoryTheme(cat: string): CategoryStyle {
  const lower = cat.toLowerCase();
  for (const t of CATEGORY_THEMES) {
    if (lower.includes(t.key)) {
      return {
        icon: t.icon,
        bg: t.bg,
        color: t.color,
        border: t.border,
        badgeBg: t.badgeBg,
      };
    }
  }
  return {
    icon: Box,
    bg: 'var(--accent-light)',
    color: 'var(--accent-primary)',
    border: 'var(--border-color)',
    badgeBg: 'var(--bg-surface-secondary)',
  };
}

export const TechStackBadges: React.FC<TechStackBadgesProps> = ({ techStack, compact = false }) => {
  const parsed = parseTechStack(techStack);
  const categories = Object.keys(parsed);

  if (categories.length === 0) {
    return <span style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', fontStyle: 'italic' }}>No tech stack specified</span>;
  }

  // Concise Inline View for Project Cards
  if (compact) {
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', alignItems: 'center' }}>
        {categories.map((cat) => {
          const theme = getCategoryTheme(cat);
          const Icon = theme.icon;
          const techs = parsed[cat];
          return (
            <span
              key={cat}
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                padding: '0.25rem 0.6rem',
                borderRadius: '8px',
                backgroundColor: theme.bg,
                color: theme.color,
                border: `1px solid ${theme.border}`,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
              }}
            >
              <Icon size={12} />
              <strong style={{ opacity: 0.9 }}>{cat}:</strong> {techs.join(', ')}
            </span>
          );
        })}
      </div>
    );
  }

  // Premium Multi-Column Card Grid View for Project Detail Page
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1rem',
        marginTop: '0.5rem',
      }}
    >
      {categories.map((cat) => {
        const theme = getCategoryTheme(cat);
        const Icon = theme.icon;
        const techs = parsed[cat];

        return (
          <div
            key={cat}
            style={{
              padding: '1rem 1.125rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-surface)',
              border: `1px solid ${theme.border}`,
              boxShadow: 'var(--shadow-sm)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Top Accent Indicator */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                backgroundColor: theme.color,
              }}
            />

            {/* Category Header with Icon */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  backgroundColor: theme.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: theme.color,
                }}
              >
                <Icon size={16} />
              </div>
              <h4 style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {cat}
              </h4>
            </div>

            {/* Technology Badge Tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
              {techs.map((tech) => (
                <span
                  key={tech}
                  style={{
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    padding: '0.25rem 0.625rem',
                    borderRadius: '6px',
                    backgroundColor: theme.bg,
                    color: theme.color,
                    border: `1px solid ${theme.border}`,
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
