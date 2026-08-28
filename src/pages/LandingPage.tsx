import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  CheckCircle2,
  FolderKanban,
  Users,
  Code,
  Github,
  ExternalLink,
  Shield,
  Layers,
  Zap,
  Sun,
  Moon,
  ChevronRight,
  Award,
  Terminal,
  Activity,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export const LandingPage: React.FC = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [activeDemoPhase, setActiveDemoPhase] = useState(1);

  const xionLogo = theme === 'dark' ? '/xion-dark.png' : '/xion-light.png';

  const demoPhases = [
    { order: 1, name: '01 Idea & Problem Definition', deliverables: 3, desc: 'Persona mapping, pain points & value prop definition.' },
    { order: 2, name: '02 Requirements', deliverables: 4, desc: 'Functional specs, user stories & acceptance criteria.' },
    { order: 3, name: '03 Product Planning', deliverables: 3, desc: 'Milestone roadmap, sprint planning & task estimation.' },
    { order: 4, name: '04 UX/UI Design', deliverables: 3, desc: 'Wireframes, design system tokens & clickable prototypes.' },
    { order: 5, name: '05 System Design', deliverables: 4, desc: 'API contracts, database schema ERDs & system architecture.' },
    { order: 6, name: '06 Development', deliverables: 4, desc: 'CI/CD pipeline, module implementation & code reviews.' },
    { order: 7, name: '07 Testing', deliverables: 3, desc: 'Unit tests, end-to-end integration & security auditing.' },
    { order: 8, name: '08 Deployment', deliverables: 3, desc: 'Production build, SSL, environment configuration & rollout.' },
    { order: 9, name: '09 Launch & Monitoring', deliverables: 3, desc: 'Error monitoring, telemetry tracking & user analytics.' },
    { order: 10, name: '10 Maintenance & Roadmap', deliverables: 3, desc: 'Bug triage, dependency updates & v2 feature roadmap.' },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-app)', color: 'var(--text-primary)' }}>
      {/* Top Header / Navigation Bar (Rendered only when visitor is unauthenticated) */}
      {!user && (
        <header
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderBottom: '1px solid var(--border-color)',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            backdropFilter: 'blur(8px)',
          }}
        >
          <div
            style={{
              maxWidth: '1280px',
              margin: '0 auto',
              padding: '0 1.5rem',
              height: '70px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            {/* Logo & Product Badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
                <img
                  src={xionLogo}
                  alt="Xion Logo"
                  style={{ height: '36px', objectFit: 'contain' }}
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <span style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.025em' }}>
                  Xion
                </span>
              </Link>

              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '0.2rem 0.6rem',
                  borderRadius: '16px',
                  backgroundColor: 'var(--accent-light)',
                  color: 'var(--accent-primary)',
                  border: '1px solid var(--border-color)',
                }}
              >
                <Sparkles size={12} />
                <span>Product of Arixen</span>
              </span>
            </div>

            {/* Action Navigation */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button
                onClick={toggleTheme}
                className="btn btn-secondary btn-sm"
                style={{ borderRadius: '50%', padding: '0.5rem', width: '36px', height: '36px', justifyContent: 'center' }}
                title="Toggle Theme"
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <Link to="/login" className="btn btn-primary btn-sm">
                <span>Sign In / Launch</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </header>
      )}

      {/* Hero Section */}
      <section
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '4rem 1.5rem 3rem',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        {/* Creator & Company Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', padding: '0.375rem 1rem', borderRadius: '9999px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)', marginBottom: '1.5rem' }}>
          <img src="/arixen.png" alt="Arixen Logo" style={{ height: '20px', objectFit: 'contain' }} />
          <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            A Product of <strong>Arixen</strong> &nbsp;•&nbsp; Created by <strong>Riven Arx</strong>
          </span>
        </div>

        <h1
          style={{
            fontSize: '3.25rem',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            maxWidth: '900px',
            margin: '0 auto 1.25rem',
            background: 'linear-gradient(135deg, var(--text-primary) 30%, var(--accent-primary) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Engineering Project Lifecycle &amp; Dynamic Workflow Engine
        </h1>

        <p
          style={{
            fontSize: '1.125rem',
            color: 'var(--text-secondary)',
            maxWidth: '720px',
            margin: '0 auto 2.5rem',
            lineHeight: 1.6,
          }}
        >
          Xion automatically snapshot-clones standardized 10-phase software engineering roadmaps into isolated project environments. Track deliverables, unique <strong style={{ color: 'var(--accent-primary)' }}>@username</strong> team invites, and live GitHub deployments.
        </p>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '3.5rem' }}>
          <button
            onClick={() => navigate(user ? (user.role === 'ADMIN' ? '/admin' : '/dashboard') : '/login')}
            className="btn btn-primary"
            style={{ padding: '0.875rem 1.75rem', fontSize: '1rem', fontWeight: 700, borderRadius: 'var(--radius-md)' }}
          >
            <span>Launch Xion Workspace</span>
            <ArrowRight size={18} />
          </button>

          <a
            href="#features"
            className="btn btn-secondary"
            style={{ padding: '0.875rem 1.75rem', fontSize: '1rem', fontWeight: 600, borderRadius: 'var(--radius-md)' }}
          >
            <span>Explore Engineering Features</span>
            <ChevronRight size={18} />
          </a>
        </div>

        {/* Hero Interactive Preview Card */}
        <div
          className="card"
          style={{
            maxWidth: '1000px',
            margin: '0 auto',
            padding: '2rem',
            textAlign: 'left',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--border-color)',
            background: 'var(--bg-surface)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#10b981' }} />
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', marginLeft: '0.5rem' }}>
                Xion Engineering Workspace Preview
              </span>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <span className="badge badge-in_progress">IN PROGRESS</span>
              <span className="badge badge-completed">10 PHASES ACTIVE</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {/* Left Mock Panel */}
            <div style={{ backgroundColor: 'var(--bg-surface-secondary)', padding: '1.25rem', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ fontWeight: 800, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>Xion Core Engine</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 700 }}>@ilakkiyan_lead</span>
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                Full-stack software engineering project tracker with isolated phase clones.
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span className="btn btn-secondary btn-sm" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}>
                  <Code size={12} /> React + TS + Prisma
                </span>
                <span className="btn btn-secondary btn-sm" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem', color: 'var(--accent-primary)' }}>
                  <Github size={12} /> GitHub Linked
                </span>
              </div>
            </div>

            {/* Right Mock Panel */}
            <div style={{ backgroundColor: 'var(--bg-surface-secondary)', padding: '1.25rem', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ fontWeight: 800, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>Dynamic Phase Rules</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--status-completed)', fontWeight: 700 }}>Auto-Synced</span>
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                Phases mark <strong>IN PROGRESS</strong> only when deliverables begin, keeping roadmaps 100% accurate.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <CheckCircle2 size={14} style={{ color: 'var(--status-completed)' }} />
                <span>Zero deliverables started = NOT STARTED</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase Section */}
      <section id="features" style={{ backgroundColor: 'var(--bg-surface)', padding: '5rem 1.5rem', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Engineered for Excellence
            </span>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.5rem', letterSpacing: '-0.02em' }}>
              Built for Modern Engineering Workflows
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0.5rem auto 0', fontSize: '1rem' }}>
              Eliminate guesswork with structured lifecycle templates, role governance, and real-time team collaboration.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            {/* Feature 1 */}
            <div className="card" style={{ padding: '1.75rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)', marginBottom: '1.25rem' }}>
                <Layers size={22} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>10-Phase Standardized Roadmap</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                Every project automatically clones 10 software lifecycle phases from Idea &amp; Requirements to Testing, Launch, and Maintenance.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card" style={{ padding: '1.75rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)', marginBottom: '1.25rem' }}>
                <Users size={22} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Unique Handles &amp; Invitations</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                Search users by unique <strong style={{ color: 'var(--accent-primary)' }}>@username</strong> handles. Invited members receive instant notifications with Accept &amp; Join options.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card" style={{ padding: '1.75rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)', marginBottom: '1.25rem' }}>
                <Activity size={22} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Dynamic Phase Calculation</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                Phases transition automatically based on deliverable status changes, ensuring accurate sprint reporting without manual overrides.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="card" style={{ padding: '1.75rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)', marginBottom: '1.25rem' }}>
                <Github size={22} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>GitHub &amp; Live Demo Badges</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                Link your source repository and live application URL directly to project headers with interactive quick-access badges.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="card" style={{ padding: '1.75rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)', marginBottom: '1.25rem' }}>
                <Shield size={22} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Role-Based Governance</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                Restrict project deletion and archiving strictly to creators and System Admins, while enabling team members to leave gracefully.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="card" style={{ padding: '1.75rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)', marginBottom: '1.25rem' }}>
                <Zap size={22} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>My Work Task Board</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                Personal task index pulling assigned deliverables across all projects into a unified workspace sorted by status and due date.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Phase Roadmap Preview */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '5rem 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            10 Standardized Software Engineering Phases
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', marginTop: '0.375rem' }}>
            Click any phase to preview pre-configured engineering deliverables and objective specifications.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {/* Phase Selector Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {demoPhases.map((phase) => (
              <button
                key={phase.order}
                onClick={() => setActiveDemoPhase(phase.order)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.875rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: activeDemoPhase === phase.order ? 'var(--accent-light)' : 'var(--bg-surface)',
                  color: activeDemoPhase === phase.order ? 'var(--accent-primary)' : 'var(--text-primary)',
                  border: `1px solid ${activeDemoPhase === phase.order ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontWeight: activeDemoPhase === phase.order ? 700 : 500,
                  fontSize: '0.875rem',
                }}
              >
                <span>{phase.name}</span>
                <span className="badge badge-not_started" style={{ fontSize: '0.75rem' }}>
                  {phase.deliverables} Tasks
                </span>
              </button>
            ))}
          </div>

          {/* Phase Detail Card */}
          <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span className="badge badge-in_progress">PHASE {activeDemoPhase} SPECIFICATION</span>
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Template Cloned Automatically</span>
              </div>

              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                {demoPhases[activeDemoPhase - 1].name}
              </h3>

              <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                {demoPhases[activeDemoPhase - 1].desc}
              </p>

              <div style={{ backgroundColor: 'var(--bg-surface-secondary)', padding: '1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem' }}>
                <p style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>
                  🎯 Core Engineering Objective
                </p>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                  Establish clear execution milestones, acceptance criteria, and traceable deliverable artifacts before phase signoff.
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate(user ? (user.role === 'ADMIN' ? '/admin' : '/dashboard') : '/login')}
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <span>Initialize Project Roadmap</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Creator & Company Showcase Section */}
      <section style={{ backgroundColor: 'var(--bg-surface)', padding: '4rem 1.5rem', borderTop: '1px solid var(--border-color)' }}>
        <div
          className="card"
          style={{
            maxWidth: '1000px',
            margin: '0 auto',
            padding: '2.5rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '2rem',
            backgroundColor: 'var(--bg-app)',
            border: '1px solid var(--border-color)',
          }}
        >
          <div style={{ flex: '1 1 400px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <img src="/arixen.png" alt="Arixen" style={{ height: '32px', objectFit: 'contain' }} />
              <span style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-primary)' }}>Arixen Engineering</span>
            </div>

            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
              Designed &amp; Created by Riven Arx
            </h3>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '1rem' }}>
              Xion is an intelligent product lifecycle engine designed under <strong>Arixen</strong> to bring mathematical precision, standardized workflow cloning, and seamless team collaboration to software development.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--accent-primary)', fontWeight: 700 }}>
              <Award size={16} />
              <span>Arixen Core Product Suite</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', minWidth: '220px' }}>
            <div style={{ padding: '0.875rem', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>FOUNDER &amp; ARCHITECT</p>
              <p style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--text-primary)' }}>Riven Arx</p>
            </div>
            <div style={{ padding: '0.875rem', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>PARENT ORGANIZATION</p>
              <p style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--accent-primary)' }}>Arixen</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: 'var(--bg-surface)', borderTop: '1px solid var(--border-color)', padding: '2.5rem 1.5rem' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <img src={xionLogo} alt="Xion Logo" style={{ height: '28px', objectFit: 'contain' }} />
            <span style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-primary)' }}>Xion</span>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              — A Product of <strong>Arixen</strong>
            </span>
          </div>

          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            Created with ❤️ by <strong>Riven Arx</strong> &nbsp;•&nbsp; © 2026 Xion Platform
          </p>

          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8125rem' }}>
            <Link to="/login" style={{ color: 'var(--text-secondary)' }}>Sign In</Link>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)' }}>GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
