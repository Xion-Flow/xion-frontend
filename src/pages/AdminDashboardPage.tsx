import React, { useEffect, useState } from 'react';
import { ShieldCheck, UserPlus, Users, FolderKanban, CheckCircle2, KeyRound, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { User, AdminStats, Project } from '../types';
import { Badge } from '../components/Badge';
import { Modal } from '../components/Modal';

export const AdminDashboardPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // User Creation Modal state
  const [createUserOpen, setCreateUserOpen] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [roleInput, setRoleInput] = useState<string>('MEMBER');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');

  // Password Reset Modal state
  const [resetUser, setResetUser] = useState<User | null>(null);
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [resetting, setResetting] = useState(false);

  const loadAdminData = async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([api.getAdminStats(), api.getUsers()]);
      setStats(statsRes.stats);
      setProjects(statsRes.recentProjects);
      setUsers(usersRes.users);
    } catch (err: any) {
      console.error('Failed to load admin dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError('');
    setCreating(true);

    try {
      await api.createUser({
        name: nameInput,
        email: emailInput,
        password: passwordInput,
        role: roleInput,
      });

      setCreateUserOpen(false);
      setNameInput('');
      setEmailInput('');
      setPasswordInput('');
      setRoleInput('MEMBER');
      await loadAdminData();
    } catch (err: any) {
      setCreateError(err.message || 'Failed to create user account.');
    } finally {
      setCreating(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetUser) return;
    setResetting(true);

    try {
      await api.resetUserPassword(resetUser.id, newPasswordInput);
      alert(`Password for ${resetUser.name} reset successfully.`);
      setResetUser(null);
      setNewPasswordInput('');
    } catch (err: any) {
      alert(err.message || 'Failed to reset user password.');
    } finally {
      setResetting(false);
    }
  };

  const handleToggleUserActive = async (u: User) => {
    if (u.id === currentUser?.id) {
      alert('You cannot deactivate your own admin account.');
      return;
    }
    try {
      await api.updateUser(u.id, { isActive: !u.isActive });
      await loadAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to update user status.');
    }
  };

  const handleDeleteUser = async (u: User) => {
    if (u.id === currentUser?.id) {
      alert('You cannot delete your own admin account.');
      return;
    }
    if (!window.confirm(`Are you sure you want to permanently delete user account '${u.name}' (${u.email})?`)) {
      return;
    }
    try {
      await api.deleteUser(u.id);
      await loadAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete user account.');
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '3rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>
        <p>Loading Admin Dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header Banner */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <ShieldCheck size={24} style={{ color: 'var(--accent-primary)' }} />
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              User Management Portal
            </h1>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem' }}>
            Global user account provisioning, role assignment, password resets, and account access management.
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => setCreateUserOpen(true)}>
          <UserPlus size={18} />
          <span>Provision User Account</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', borderRadius: '12px', backgroundColor: 'var(--accent-light)', color: 'var(--accent-primary)' }}>
            <Users size={24} />
          </div>
          <div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Accounts</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 800 }}>{users.length}</p>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', borderRadius: '12px', backgroundColor: 'var(--status-completed-bg)', color: 'var(--status-completed)' }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>Active Users</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 800 }}>{users.filter((u) => u.isActive).length}</p>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', borderRadius: '12px', backgroundColor: 'var(--status-blocked-bg)', color: 'var(--status-blocked)' }}>
            <KeyRound size={24} />
          </div>
          <div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>Deactivated Users</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 800 }}>{users.filter((u) => !u.isActive).length}</p>
          </div>
        </div>
      </div>

      {/* User Directory Table */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem' }}>
          User Accounts Directory ({users.length})
        </h2>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.75rem' }}>User</th>
                <th style={{ padding: '0.75rem' }}>Role</th>
                <th style={{ padding: '0.75rem' }}>Status</th>
                <th style={{ padding: '0.75rem' }}>Joined</th>
                <th style={{ padding: '0.75rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img src={u.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name}`} alt={u.name} style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                      <div>
                        <p style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{u.name}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    <Badge status="IN_PROGRESS" label={u.role} />
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    {u.isActive ? (
                      <span className="badge badge-completed">Active</span>
                    ) : (
                      <span className="badge badge-blocked">Deactivated</span>
                    )}
                  </td>
                  <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => setResetUser(u)}>
                        <KeyRound size={14} />
                        <span>Reset Password</span>
                      </button>
                      {u.id === currentUser?.id ? (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, padding: '0.25rem 0.5rem', borderRadius: '4px', backgroundColor: 'var(--bg-surface-secondary)' }}>
                          Self Account
                        </span>
                      ) : (
                        <>
                          <button className="btn btn-secondary btn-sm" onClick={() => handleToggleUserActive(u)}>
                            {u.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            className="btn btn-secondary btn-sm"
                            style={{ color: 'var(--status-blocked)', borderColor: 'var(--status-blocked)' }}
                            onClick={() => handleDeleteUser(u)}
                            title="Delete User Account"
                          >
                            <Trash2 size={14} />
                            <span>Delete</span>
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create User Account Modal */}
      <Modal isOpen={createUserOpen} onClose={() => setCreateUserOpen(false)} title="Provision New User Account">
        {createError && (
          <div style={{ backgroundColor: 'var(--status-blocked-bg)', color: 'var(--status-blocked)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontSize: '0.875rem', fontWeight: 600 }}>
            {createError}
          </div>
        )}

        <form onSubmit={handleCreateUser}>
          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input id="name" type="text" className="input-field" placeholder="e.g. Alex Developer" value={nameInput} onChange={(e) => setNameInput(e.target.value)} required />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input id="email" type="email" className="input-field" placeholder="user@xion.local" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} required />
          </div>

          <div className="form-group">
            <label htmlFor="password">Temporary Password *</label>
            <input id="password" type="text" className="input-field" placeholder="Minimum 8 characters" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} required minLength={8} />
          </div>

          <div className="form-group">
            <label>Assigned System Role</label>
            <select className="input-field" value={roleInput} onChange={(e) => setRoleInput(e.target.value)}>
              <option value="MEMBER">MEMBER (Team Developer / Designer)</option>
              <option value="ADMIN">ADMIN (System Administrator)</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setCreateUserOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={creating}>
              {creating ? 'Provisioning...' : 'Provision User Account'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Reset User Password Modal */}
      <Modal isOpen={!!resetUser} onClose={() => setResetUser(null)} title={`Reset Password: ${resetUser?.name}`}>
        <form onSubmit={handleResetPassword}>
          <div className="form-group">
            <label>New Password</label>
            <input
              type="text"
              className="input-field"
              placeholder="Enter new password (min 8 chars)"
              value={newPasswordInput}
              onChange={(e) => setNewPasswordInput(e.target.value)}
              required
              minLength={8}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setResetUser(null)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={resetting}>
              {resetting ? 'Resetting...' : 'Set New Password'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
