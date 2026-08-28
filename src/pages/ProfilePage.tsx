import React, { useState, useEffect } from 'react';
import { User as UserIcon, Lock, CheckCircle2, AlertCircle, Check, X, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export const ProfilePage: React.FC = () => {
  const { user, updateCurrentUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [username, setUsername] = useState(user?.username || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [profileMsg, setProfileMsg] = useState('');
  const [profileError, setProfileError] = useState('');
  const [updatingProfile, setUpdatingProfile] = useState(false);

  // Username validation state
  const [usernameStatus, setUsernameStatus] = useState<{ checking: boolean; available?: boolean; isCurrent?: boolean; reason?: string }>({
    checking: false,
    available: true,
    isCurrent: true,
  });

  // Password change states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [updatingPassword, setUpdatingPassword] = useState(false);

  // Debounced username availability check
  useEffect(() => {
    if (!username || username === user?.username) {
      setUsernameStatus({ checking: false, available: true, isCurrent: true });
      return;
    }

    if (username.length < 3 || !/^[a-zA-Z0-9_]+$/.test(username)) {
      setUsernameStatus({ checking: false, available: false, reason: 'Must be 3+ letters/numbers/underscores.' });
      return;
    }

    setUsernameStatus({ checking: true });
    const timer = setTimeout(async () => {
      try {
        const res = await api.checkUsername(username);
        setUsernameStatus({ checking: false, available: res.available, isCurrent: res.isCurrent, reason: res.reason });
      } catch (err) {
        setUsernameStatus({ checking: false, available: false, reason: 'Error checking availability.' });
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [username, user?.username]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg('');
    setProfileError('');

    if (username !== user?.username && !usernameStatus.available) {
      setProfileError('Please choose a valid and available username.');
      return;
    }

    setUpdatingProfile(true);

    try {
      const res = await api.updateProfile(name, username, avatarUrl);
      updateCurrentUser(res.user);
      setProfileMsg('Profile updated successfully.');
    } catch (err: any) {
      setProfileError(err.message || 'Failed to update profile.');
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg('');
    setPasswordError('');
    setUpdatingPassword(true);

    try {
      const res = await api.changePassword(currentPassword, newPassword);
      setPasswordMsg(res.message);
      setCurrentPassword('');
      setNewPassword('');
    } catch (err: any) {
      setPasswordError(err.message || 'Failed to change password.');
    } finally {
      setUpdatingPassword(false);
    }
  };

  if (!user) return null;

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          My Account Profile
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', marginTop: '0.25rem' }}>
          Update your profile details, unique handle, avatar, and security credentials.
        </p>
      </div>

      {/* Profile Details Form */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
          <img
            src={avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
            alt={user.name}
            style={{ width: '56px', height: '56px', borderRadius: '50%' }}
          />
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{user.name}</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              @{user.username} • {user.email} • Role: <strong>{user.role}</strong>
            </p>
          </div>
        </div>

        {profileMsg && (
          <div style={{ backgroundColor: 'var(--status-completed-bg)', color: 'var(--status-completed)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={16} />
            <span>{profileMsg}</span>
          </div>
        )}

        {profileError && (
          <div style={{ backgroundColor: 'var(--status-blocked-bg)', color: 'var(--status-blocked)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={16} />
            <span>{profileError}</span>
          </div>
        )}

        <form onSubmit={handleUpdateProfile}>
          <div className="form-group">
            <label htmlFor="name">Display Name</label>
            <input
              id="name"
              type="text"
              className="input-field"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="username">
              Unique Handle (@username)
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="username"
                type="text"
                className="input-field"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().trim())}
                required
                style={{ paddingRight: '2.5rem' }}
              />
              <div style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center' }}>
                {usernameStatus.checking ? (
                  <Loader2 size={16} className="spin" style={{ color: 'var(--text-muted)' }} />
                ) : username !== user?.username ? (
                  usernameStatus.available ? (
                    <span style={{ color: 'var(--status-completed)', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '2px' }}>
                      <Check size={16} /> Available
                    </span>
                  ) : (
                    <span style={{ color: 'var(--status-blocked)', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '2px' }}>
                      <X size={16} /> Taken
                    </span>
                  )
                ) : null}
              </div>
            </div>
            {usernameStatus.reason && !usernameStatus.available && (
              <p style={{ color: 'var(--status-blocked)', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                {usernameStatus.reason}
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="avatarUrl">Avatar Image URL</label>
            <input
              id="avatarUrl"
              type="url"
              className="input-field"
              placeholder="https://example.com/avatar.png"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={updatingProfile || (username !== user?.username && !usernameStatus.available)}
          >
            {updatingProfile ? 'Saving...' : 'Save Profile Changes'}
          </button>
        </form>
      </div>

      {/* Change Password Form */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
          <Lock size={20} style={{ color: 'var(--accent-primary)' }} />
          <h2 style={{ fontSize: '1.1875rem', fontWeight: 800 }}>Change Security Password</h2>
        </div>

        {passwordMsg && (
          <div style={{ backgroundColor: 'var(--status-completed-bg)', color: 'var(--status-completed)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={16} />
            <span>{passwordMsg}</span>
          </div>
        )}

        {passwordError && (
          <div style={{ backgroundColor: 'var(--status-blocked-bg)', color: 'var(--status-blocked)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={16} />
            <span>{passwordError}</span>
          </div>
        )}

        <form onSubmit={handleChangePassword}>
          <div className="form-group">
            <label htmlFor="currentPassword">Current Password</label>
            <input
              id="currentPassword"
              type="password"
              className="input-field"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="newPassword">New Password (min 8 characters)</label>
            <input
              id="newPassword"
              type="password"
              className="input-field"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={updatingPassword}>
            {updatingPassword ? 'Updating Password...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
};
