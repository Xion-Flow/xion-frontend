import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, FileQuestion, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export const NotFoundPage: React.FC = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const xionLogo = theme === 'dark' ? '/xion-dark.png' : '/xion-light.png';

  return (
    <div
      style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.5rem',
        textAlign: 'center',
      }}
    >
      <div style={{ maxWidth: '520px', width: '100%' }}>
        {/* Animated Icon Badge */}
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '24px',
            backgroundColor: 'var(--accent-light)',
            color: 'var(--accent-primary)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.5rem',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          <FileQuestion size={42} />
        </div>

        {/* 404 Large Label */}
        <span
          style={{
            display: 'inline-block',
            fontSize: '0.8125rem',
            fontWeight: 800,
            padding: '0.25rem 0.75rem',
            borderRadius: '16px',
            backgroundColor: 'var(--status-blocked-bg)',
            color: 'var(--status-blocked)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '0.75rem',
          }}
        >
          Error 404 • Page Not Found
        </span>

        <h1
          style={{
            fontSize: '2.25rem',
            fontWeight: 800,
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
            marginBottom: '0.75rem',
          }}
        >
          Lost in the Lifecycle?
        </h1>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '2rem' }}>
          The URL or phase route you are trying to reach does not exist or has been moved.
        </p>

        {/* Action Navigation */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.875rem', flexWrap: 'wrap' }}>
          <button onClick={() => navigate(-1)} className="btn btn-secondary">
            <ArrowLeft size={16} />
            <span>Go Back</span>
          </button>

          {user ? (
            <Link to={user.role === 'ADMIN' ? '/admin' : '/dashboard'} className="btn btn-primary">
              <Home size={16} />
              <span>Return to Workspace</span>
            </Link>
          ) : (
            <Link to="/login" className="btn btn-primary">
              <Sparkles size={16} />
              <span>Sign In / Launch</span>
            </Link>
          )}
        </div>

        {/* Footer attribution */}
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '2.5rem' }}>
          Xion Platform • A Product of <strong>Arixen</strong>
        </p>
      </div>
    </div>
  );
};
