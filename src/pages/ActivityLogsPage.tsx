import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  CheckCheck,
  Trash2,
  UserPlus,
  Info,
  Clock,
  ShieldCheck,
  Check,
  X,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Notification, ProjectInvite } from '../types';

export const ActivityLogsPage: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [pendingInvites, setPendingInvites] = useState<ProjectInvite[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'INVITES' | 'SYSTEM'>('ALL');
  const [loading, setLoading] = useState(true);
  const [actioning, setActioning] = useState(false);

  const loadData = async () => {
    try {
      const res = await api.getNotifications();
      setNotifications(res.notifications);
      setPendingInvites(res.pendingInvites);
    } catch (err) {
      console.error('Failed to load activity logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRespondInvite = async (inviteId: string, action: 'ACCEPT' | 'DECLINE') => {
    setActioning(true);
    try {
      await api.respondToInvite(inviteId, action);
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to respond to invitation.');
    } finally {
      setActioning(false);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.markNotificationsRead();
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to mark notifications as read.');
    }
  };

  const handleClearRead = async () => {
    try {
      await api.clearNotifications();
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to clear read logs.');
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'INVITES') return n.type === 'PROJECT_INVITE';
    if (filter === 'SYSTEM') return n.type === 'SYSTEM';
    return true;
  });

  if (loading) {
    return (
      <div style={{ padding: '4rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>
        <p>Loading Activity Logs...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto' }}>
      {/* Header Banner */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.375rem' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Activity Logs &amp; Notifications
            </h1>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '0.2rem 0.6rem',
                borderRadius: '16px',
                backgroundColor: 'var(--accent-light)',
                color: 'var(--accent-primary)',
                border: '1px solid var(--border-color)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.375rem',
              }}
            >
              <Clock size={12} />
              <span>Last 30 Days</span>
            </span>
          </div>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
            Track project invitations, status changes, and system updates over the past 30 days.
          </p>
        </div>

        {/* Header Action Buttons */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button onClick={handleMarkAllRead} className="btn btn-secondary btn-sm" title="Mark All as Read">
            <CheckCheck size={15} />
            <span>Mark All Read</span>
          </button>

          <button onClick={handleClearRead} className="btn btn-secondary btn-sm" title="Clear Read Activity Logs">
            <Trash2 size={15} />
            <span>Clear Read Logs</span>
          </button>
        </div>
      </div>

      {/* Auto-Purging Retention Notice */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-sm)',
          padding: '0.875rem 1rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          fontSize: '0.8125rem',
          color: 'var(--text-secondary)',
        }}
      >
        <ShieldCheck size={18} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
        <div>
          <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Automated 30-Day Retention Policy Enabled</span>
          <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            To keep system queries fast and lightweight, read activity logs older than 30 days are automatically archived.
          </span>
        </div>
      </div>

      {/* Pending Project Requests Section */}
      {pendingInvites.length > 0 && (
        <div className="card" style={{ marginBottom: '1.5rem', borderColor: 'var(--accent-primary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-primary)', fontWeight: 800, fontSize: '0.9375rem' }}>
              <UserPlus size={18} />
              <span>Pending Project Join Requests ({pendingInvites.length})</span>
            </div>
            <span className="badge badge-in_progress">ACTION REQUIRED</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {pendingInvites.map((invite) => (
              <div
                key={invite.id}
                style={{
                  backgroundColor: 'var(--bg-surface-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '1rem',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                  <img
                    src={invite.inviter?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${invite.inviter?.name}`}
                    alt={invite.inviter?.name}
                    style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <p style={{ fontWeight: 800, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>
                      {invite.inviter?.name} <span style={{ fontWeight: 500, color: 'var(--accent-primary)' }}>@{invite.inviter?.username}</span>
                    </p>
                    <p style={{ fontSize: '0.84375rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      Invited you to join project <strong>{invite.project?.name}</strong> ({invite.project?.techStack || 'Engineering Project'})
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.625rem' }}>
                  <button
                    onClick={() => handleRespondInvite(invite.id, 'DECLINE')}
                    className="btn btn-secondary btn-sm"
                    disabled={actioning}
                    style={{ color: 'var(--status-blocked)' }}
                  >
                    <X size={15} />
                    <span>Decline</span>
                  </button>
                  <button
                    onClick={() => handleRespondInvite(invite.id, 'ACCEPT')}
                    className="btn btn-primary btn-sm"
                    disabled={actioning}
                  >
                    <Check size={15} />
                    <span>Accept &amp; Join Project</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Activity Logs List & Filter Tabs */}
      <div className="card">
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 800 }}>Activity History (Last 30 Days)</h2>

          {/* Filter Tabs */}
          <div style={{ display: 'flex', gap: '0.375rem' }}>
            <button
              onClick={() => setFilter('ALL')}
              className={`btn ${filter === 'ALL' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            >
              All Logs ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('INVITES')}
              className={`btn ${filter === 'INVITES' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            >
              Invites
            </button>
            <button
              onClick={() => setFilter('SYSTEM')}
              className={`btn ${filter === 'SYSTEM' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            >
              System
            </button>
          </div>
        </div>

        {filteredNotifications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
            <Bell size={40} style={{ margin: '0 auto 0.75rem', opacity: 0.5 }} />
            <p style={{ fontWeight: 700, fontSize: '1rem' }}>No Activity Logs Found</p>
            <p style={{ fontSize: '0.8125rem', marginTop: '0.25rem' }}>
              Your activity history for the last 30 days is empty.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {filteredNotifications.map((n) => (
              <div
                key={n.id}
                style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: n.isRead ? 'var(--bg-surface-secondary)' : 'var(--accent-light)',
                  border: `1px solid ${n.isRead ? 'var(--border-color)' : 'var(--accent-primary)'}`,
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '1rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <div
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '50%',
                      backgroundColor: n.type === 'PROJECT_INVITE' ? 'var(--accent-light)' : 'var(--bg-surface)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--accent-primary)',
                      flexShrink: 0,
                      marginTop: '2px',
                    }}
                  >
                    {n.type === 'PROJECT_INVITE' ? <UserPlus size={18} /> : <Info size={18} />}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <p style={{ fontWeight: 800, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>{n.title}</p>
                      {!n.isRead && <span className="badge badge-in_progress" style={{ fontSize: '0.65rem' }}>NEW</span>}
                    </div>
                    <p style={{ fontSize: '0.84375rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      {n.message}
                    </p>
                  </div>
                </div>

                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', flexShrink: 0 }}>
                  {new Date(n.createdAt).toLocaleDateString()} {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
