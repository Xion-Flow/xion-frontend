import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  Eye,
  EyeOff,
  Sparkles,
  Layers,
  Users,
  CheckCircle2,
  Sun,
  Moon,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { api } from '../services/api';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const xionLogo = theme === 'dark' ? '/xion-dark.png' : '/xion-light.png';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await login(email, password);
      const meRes = await api.getMe();
      if (meRes.user?.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid email address or password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', backgroundColor: 'var(--bg-app)', color: 'var(--text-primary)' }}>
      {/* Left Brand Showcase Hero Panel — Rich Violet Mesh Gradient & Glassmorphism */}
      <div
        style={{
          flex: '1 1 50%',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #311b92 100%)',
          color: '#f8fafc',
          padding: '4rem 3.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden',
        }}
        className="hidden-mobile"
      >
        {/* Decorative Glowing Orbs */}
        <div
          style={{
            position: 'absolute',
            top: '-10%',
            right: '-10%',
            width: '350px',
            height: '350px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '10%',
            left: '-10%',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* Top Brand Header */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
              <img src="/xion-dark.png" alt="Xion Logo" style={{ height: '40px', objectFit: 'contain' }} />
              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>Xion</span>
            </Link>

            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '0.25rem 0.625rem',
                borderRadius: '16px',
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                color: '#a5b4fc',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.375rem',
                backdropFilter: 'blur(6px)',
              }}
            >
              <Sparkles size={12} />
              Software Engineering Engine
            </span>
          </div>

          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.2, letterSpacing: '-0.02em', marginBottom: '1.25rem', color: '#ffffff' }}>
            Structured Product Lifecycle &amp; Workflow Tracker
          </h1>

          <p style={{ color: '#cbd5e1', fontSize: '1.0625rem', lineHeight: 1.6, maxWidth: '520px', marginBottom: '2.5rem' }}>
            Automated 10-phase roadmaps, deliverable specifications, and real-time team project collaboration.
          </p>

          {/* Glassmorphism Feature Showcase Card — Clean Design */}
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: 'var(--radius-md)',
              padding: '1.5rem',
              backdropFilter: 'blur(12px)',
              maxWidth: '480px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>
              <img src="/xion-dark.png" alt="Xion" style={{ height: '28px', objectFit: 'contain' }} />
              <span style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.01em' }}>
                Xion Workflow Platform
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '6px', backgroundColor: 'rgba(129, 140, 248, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a5b4fc', flexShrink: 0 }}>
                  <Layers size={15} />
                </div>
                <span style={{ fontSize: '0.84375rem', color: '#e2e8f0' }}>Clones 10 Standardized Lifecycle Phases</span>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '6px', backgroundColor: 'rgba(52, 211, 153, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6ee7b7', flexShrink: 0 }}>
                  <Users size={15} />
                </div>
                <span style={{ fontSize: '0.84375rem', color: '#e2e8f0' }}>Team Collaboration &amp; Task Assignment</span>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '6px', backgroundColor: 'rgba(96, 165, 250, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#93c5fd', flexShrink: 0 }}>
                  <CheckCircle2 size={15} />
                </div>
                <span style={{ fontSize: '0.84375rem', color: '#e2e8f0' }}>Dynamic Phase Progress Calculation</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Creator & Company Footer */}
        <div style={{ position: 'relative', zIndex: 2, paddingTop: '2rem', borderTop: '1px solid rgba(255, 255, 255, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <img src="/arixen.png" alt="Arixen" style={{ height: '22px', objectFit: 'contain' }} />
            <span style={{ fontSize: '0.8125rem', color: '#cbd5e1' }}>A Product of <strong>Arixen</strong></span>
          </div>
          <span style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>Created by <strong>Riven Arx</strong></span>
        </div>
      </div>

      {/* Right Login Form Container */}
      <div style={{ flex: '1 1 50%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '2.5rem 2rem' }}>
        {/* Top Navbar Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none' }}>
            <img src={xionLogo} alt="Xion Logo" style={{ height: '32px', objectFit: 'contain' }} />
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Xion</span>
          </Link>

          <button
            onClick={toggleTheme}
            className="btn btn-secondary btn-sm"
            style={{ borderRadius: '50%', padding: '0.5rem', width: '36px', height: '36px', justifyContent: 'center' }}
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        {/* Center Login Form Card */}
        <div style={{ maxWidth: '420px', width: '100%', margin: '2rem auto' }}>
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Sign In to Xion
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', marginTop: '0.375rem' }}>
              Access your software engineering project workspace
            </p>
          </div>

          {error && (
            <div
              style={{
                backgroundColor: 'var(--status-blocked-bg)',
                color: 'var(--status-blocked)',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.875rem',
                marginBottom: '1.25rem',
                fontWeight: 600,
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={18}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)',
                  }}
                />
                <input
                  id="email"
                  type="email"
                  className="input-field"
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '1.75rem' }}>
              <label htmlFor="password">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={18}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)',
                  }}
                />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="input-field"
                  style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-muted)',
                    display: 'flex',
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
              style={{ width: '100%', padding: '0.875rem', fontSize: '0.9375rem', fontWeight: 700, borderRadius: 'var(--radius-md)' }}
            >
              {submitting ? 'Authenticating...' : 'Sign In to Workspace'}
              {!submitting && <ArrowRight size={18} />}
            </button>
          </form>

          {/* Security Card */}
          <div
            style={{
              marginTop: '1.5rem',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-surface-secondary)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'var(--accent-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-primary)',
                flexShrink: 0,
              }}
            >
              <ShieldCheck size={18} />
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: '0.8125rem', color: 'var(--text-primary)' }}>
                Managed Access Control
              </p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Accounts provisioned by System Administrator
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Footer Attribution */}
        <div style={{ textAlign: 'center', fontSize: '0.8125rem', color: 'var(--text-muted)', paddingTop: '1rem' }}>
          <p>
            A Product of <strong>Arixen</strong> &nbsp;•&nbsp; Created by <strong>Riven Arx</strong>
          </p>
        </div>
      </div>
    </div>
  );
};
