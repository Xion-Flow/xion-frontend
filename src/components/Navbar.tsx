import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  BookOpen,
  ShieldAlert,
  Sun,
  Moon,
  User as UserIcon,
  LogOut,
  ChevronDown,
  Bell,
  Check,
  X,
  UserPlus,
  Menu,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { api } from '../services/api';
import { Notification, ProjectInvite } from '../types';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Notifications state
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [pendingInvites, setPendingInvites] = useState<ProjectInvite[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const res = await api.getNotifications();
      setNotifications(res.notifications);
      setPendingInvites(res.pendingInvites);
      setUnreadCount(res.unreadCount);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 10000); // Poll every 10s
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleRespondInvite = async (inviteId: string, action: 'ACCEPT' | 'DECLINE') => {
    try {
      await api.respondToInvite(inviteId, action);
      await fetchNotifications();
      if (action === 'ACCEPT') {
        const invite = pendingInvites.find((i) => i.id === inviteId);
        if (invite?.project?.id) {
          navigate(`/projects/${invite.project.id}`);
        }
      }
    } catch (err: any) {
      alert(err.message || 'Action failed.');
    }
  };

  const handleToggleNotifications = async () => {
    setNotifOpen((prev) => !prev);
    setProfileOpen(false);
    if (!notifOpen && unreadCount > 0) {
      try {
        await api.markNotificationsRead();
        fetchNotifications();
      } catch (err) {
        console.error('Failed to mark read:', err);
      }
    }
  };

  if (!user) return null;

  const isActive = (path: string) => location.pathname === path;

  return (
    <header
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-color)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 1.5rem',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Link
          to={user.role === 'ADMIN' ? '/admin' : '/dashboard'}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            textDecoration: 'none',
          }}
        >
          <img
            src={theme === 'dark' ? '/xion-dark.png' : '/xion-light.png'}
            alt="Xion Logo"
            style={{ height: '32px', objectFit: 'contain' }}
          />
          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Xion
          </span>
          <span
            style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              padding: '0.15rem 0.45rem',
              borderRadius: '12px',
              backgroundColor: 'var(--accent-light)',
              color: 'var(--accent-primary)',
              border: '1px solid var(--border-color)',
            }}
          >
            Arixen
          </span>
        </Link>

        <nav className="nav-desktop-links" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {user.role === 'ADMIN' ? (
            <Link
              to="/admin"
              className={`btn ${isActive('/admin') ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.5rem 0.875rem' }}
            >
              <ShieldAlert size={17} />
              <span>User Management</span>
            </Link>
          ) : (
            <>
              <Link
                to="/dashboard"
                className={`btn ${isActive('/dashboard') ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '0.5rem 0.875rem' }}
              >
                <LayoutDashboard size={17} />
                <span>Dashboard</span>
              </Link>

              <Link
                to="/projects"
                className={`btn ${isActive('/projects') ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '0.5rem 0.875rem' }}
              >
                <FolderKanban size={17} />
                <span>Projects</span>
              </Link>

              <Link
                to="/my-work"
                className={`btn ${isActive('/my-work') ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '0.5rem 0.875rem' }}
              >
                <CheckSquare size={17} />
                <span>My Work</span>
              </Link>

              <Link
                to="/guide"
                className={`btn ${isActive('/guide') ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '0.5rem 0.875rem' }}
              >
                <BookOpen size={17} />
                <span>Guide</span>
              </Link>
            </>
          )}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="btn btn-secondary nav-mobile-toggle"
            style={{ display: 'none', padding: '0.5rem', borderRadius: 'var(--radius-sm)' }}
            title="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <button
            onClick={toggleTheme}
            className="btn btn-secondary"
            style={{ padding: '0.5rem', borderRadius: '50%' }}
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          <div style={{ position: 'relative' }}>
            <button
              onClick={handleToggleNotifications}
              className="btn btn-secondary"
              style={{ padding: '0.5rem', borderRadius: '50%', position: 'relative' }}
              title="Notifications & Join Requests"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-2px',
                    right: '-2px',
                    backgroundColor: 'var(--status-blocked)',
                    color: '#ffffff',
                    fontSize: '0.6875rem',
                    fontWeight: 800,
                    borderRadius: '10px',
                    padding: '1px 5px',
                    minWidth: '16px',
                    textAlign: 'center',
                  }}
                >
                  {unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <div
                className="card"
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '125%',
                  width: '360px',
                  padding: '1rem',
                  boxShadow: 'var(--shadow-lg)',
                  zIndex: 1000,
                  maxHeight: '440px',
                  overflowY: 'auto',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
                  <h3 style={{ fontSize: '0.9375rem', fontWeight: 800 }}>Notifications & Invites</h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{unreadCount} new</span>
                </div>

                {pendingInvites.length > 0 && (
                  <div style={{ marginBottom: '1rem' }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.04em' }}>
                      Pending Project Requests
                    </p>
                    {pendingInvites.map((invite) => (
                      <div
                        key={invite.id}
                        style={{
                          backgroundColor: 'var(--bg-surface-secondary)',
                          border: '1px solid var(--border-color)',
                          borderRadius: 'var(--radius-sm)',
                          padding: '0.75rem',
                          marginBottom: '0.5rem',
                        }}
                      >
                        <div style={{ display: 'flex', gap: '0.625rem', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                          <UserPlus size={18} style={{ color: 'var(--accent-primary)', marginTop: '2px', flexShrink: 0 }} />
                          <div>
                            <p style={{ fontSize: '0.8125rem', fontWeight: 700 }}>
                              {invite.inviter?.name} <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(@{invite.inviter?.username})</span>
                            </p>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                              Invited you to join <strong>{invite.project?.name}</strong>
                            </p>
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                          <button
                            onClick={() => handleRespondInvite(invite.id, 'DECLINE')}
                            className="btn btn-secondary btn-sm"
                            style={{ color: 'var(--status-blocked)', padding: '0.25rem 0.625rem', fontSize: '0.75rem' }}
                          >
                            <X size={14} /> Decline
                          </button>
                          <button
                            onClick={() => handleRespondInvite(invite.id, 'ACCEPT')}
                            className="btn btn-primary btn-sm"
                            style={{ padding: '0.25rem 0.625rem', fontSize: '0.75rem' }}
                          >
                            <Check size={14} /> Accept & Join
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div>
                  <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.04em' }}>
                    Recent Activity Logs
                  </p>
                  {notifications.length === 0 && pendingInvites.length === 0 ? (
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1rem 0' }}>
                      No new notifications.
                    </p>
                  ) : (
                    notifications.slice(0, 4).map((n) => (
                      <div
                        key={n.id}
                        style={{
                          padding: '0.5rem 0',
                          borderBottom: '1px solid var(--border-color)',
                          fontSize: '0.8125rem',
                        }}
                      >
                        <p style={{ fontWeight: 700, fontSize: '0.8125rem' }}>{n.title}</p>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{n.message}</p>
                      </div>
                    ))
                  )}
                </div>

                <div style={{ paddingTop: '0.75rem', marginTop: '0.5rem', borderTop: '1px solid var(--border-color)', textAlign: 'center' }}>
                  <Link
                    to="/activity"
                    onClick={() => setNotifOpen(false)}
                    style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--accent-primary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}
                  >
                    <span>View All Activity Logs (Last 30 Days)</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div style={{ position: 'relative' }}>
            <button
              onClick={() => {
                setProfileOpen((prev) => !prev);
                setNotifOpen(false);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.375rem 0.625rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-surface-secondary)',
                cursor: 'pointer',
              }}
            >
              <img
                src={user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                alt={user.name}
                style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>{user.name}</span>
                <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', lineHeight: 1 }}>@{user.username}</span>
              </div>
              <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
            </button>

            {profileOpen && (
              <div
                className="card"
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '120%',
                  width: '210px',
                  padding: '0.5rem',
                  boxShadow: 'var(--shadow-lg)',
                  zIndex: 1000,
                }}
                onClick={() => setProfileOpen(false)}
              >
                <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border-color)', marginBottom: '0.5rem' }}>
                  <p style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)' }}>{user.name}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>@{user.username}</p>
                  <span className="badge badge-in_progress" style={{ marginTop: '0.375rem', fontSize: '0.6875rem' }}>
                    {user.role}
                  </span>
                </div>

                <button
                  onClick={() => {
                    navigate('/profile');
                    setProfileOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    fontSize: '0.875rem',
                    color: 'var(--text-primary)',
                    borderRadius: '4px',
                    textAlign: 'left',
                  }}
                  className="btn-secondary"
                >
                  <UserIcon size={16} />
                  <span>My Profile</span>
                </button>

                <button
                  onClick={() => {
                    navigate('/activity');
                    setProfileOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    fontSize: '0.875rem',
                    color: 'var(--text-primary)',
                    borderRadius: '4px',
                    textAlign: 'left',
                    marginTop: '0.25rem',
                  }}
                  className="btn-secondary"
                >
                  <Bell size={16} />
                  <span>Activity Logs</span>
                </button>

                <button
                  onClick={logout}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    fontSize: '0.875rem',
                    color: 'var(--status-blocked)',
                    borderRadius: '4px',
                    textAlign: 'left',
                    marginTop: '0.25rem',
                  }}
                  className="btn-secondary"
                >
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Collapsible Navigation Menu Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderBottom: '1px solid var(--border-color)',
            padding: '1rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            boxShadow: 'var(--shadow-md)',
          }}
          className="nav-mobile-menu"
        >
          {user.role === 'ADMIN' ? (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className={`btn ${isActive('/admin') ? 'btn-primary' : 'btn-secondary'}`}
              style={{ justifyContent: 'flex-start', padding: '0.75rem 1rem' }}
            >
              <ShieldAlert size={18} />
              <span>User Management</span>
            </Link>
          ) : (
            <>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className={`btn ${isActive('/dashboard') ? 'btn-primary' : 'btn-secondary'}`}
                style={{ justifyContent: 'flex-start', padding: '0.75rem 1rem' }}
              >
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </Link>

              <Link
                to="/projects"
                onClick={() => setMobileMenuOpen(false)}
                className={`btn ${isActive('/projects') ? 'btn-primary' : 'btn-secondary'}`}
                style={{ justifyContent: 'flex-start', padding: '0.75rem 1rem' }}
              >
                <FolderKanban size={18} />
                <span>Projects</span>
              </Link>

              <Link
                to="/my-work"
                onClick={() => setMobileMenuOpen(false)}
                className={`btn ${isActive('/my-work') ? 'btn-primary' : 'btn-secondary'}`}
                style={{ justifyContent: 'flex-start', padding: '0.75rem 1rem' }}
              >
                <CheckSquare size={18} />
                <span>My Work</span>
              </Link>

              <Link
                to="/guide"
                onClick={() => setMobileMenuOpen(false)}
                className={`btn ${isActive('/guide') ? 'btn-primary' : 'btn-secondary'}`}
                style={{ justifyContent: 'flex-start', padding: '0.75rem 1rem' }}
              >
                <BookOpen size={18} />
                <span>Guide</span>
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};
