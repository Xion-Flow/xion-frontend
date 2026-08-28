import React, { useState, useRef, useEffect } from 'react';
import { Search, UserCheck, X, ChevronDown } from 'lucide-react';
import { User } from '../types';

interface UserSearchSelectProps {
  users: User[];
  selectedUserId: string;
  onSelectUser: (userId: string) => void;
  placeholder?: string;
}

export const UserSearchSelect: React.FC<UserSearchSelectProps> = ({
  users,
  selectedUserId,
  onSelectUser,
  placeholder = 'Type name or email to search users...',
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedUser = users.find((u) => u.id === selectedUserId);

  // Filter users based on query
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(query.toLowerCase()) ||
      u.email.toLowerCase().includes(query.toLowerCase())
  );

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (user: User) => {
    onSelectUser(user.id);
    setQuery('');
    setIsOpen(false);
  };

  const handleClear = () => {
    onSelectUser('');
    setQuery('');
  };

  return (
    <div ref={dropdownRef} style={{ position: 'relative', width: '100%' }}>
      {/* Selected User Display OR Search Input */}
      {selectedUser ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.5rem 0.75rem',
            backgroundColor: 'var(--bg-surface-secondary)',
            border: '1px solid var(--accent-primary)',
            borderRadius: 'var(--radius-md)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <img
              src={selectedUser.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedUser.name}`}
              alt={selectedUser.name}
              style={{ width: '28px', height: '28px', borderRadius: '50%' }}
            />
            <div>
              <p style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                {selectedUser.name}
              </p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{selectedUser.email}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClear}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              padding: '0.25rem',
              display: 'flex',
            }}
            title="Change Selection"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div style={{ position: 'relative' }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
              pointerEvents: 'none',
            }}
          />
          <input
            type="text"
            className="input-field"
            style={{ paddingLeft: '2.25rem', paddingRight: '2rem' }}
            placeholder={placeholder}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
          />
          <ChevronDown
            size={16}
            style={{
              position: 'absolute',
              right: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
              pointerEvents: 'none',
            }}
          />
        </div>
      )}

      {/* Floating User Search Dropdown Menu */}
      {isOpen && !selectedUser && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: '0.375rem',
            maxHeight: '220px',
            overflowY: 'auto',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 100,
          }}
        >
          {filteredUsers.length === 0 ? (
            <div style={{ padding: '0.75rem 1rem', fontSize: '0.8125rem', color: 'var(--text-muted)', textAlign: 'center' }}>
              No users found matching &quot;{query}&quot;
            </div>
          ) : (
            filteredUsers.map((u) => (
              <div
                key={u.id}
                onClick={() => handleSelect(u)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.625rem 0.875rem',
                  cursor: 'pointer',
                  borderBottom: '1px solid var(--border-color)',
                  transition: 'background-color 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-surface-secondary)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <img
                  src={u.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name}`}
                  alt={u.name}
                  style={{ width: '32px', height: '32px', borderRadius: '50%' }}
                />
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{u.name}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{u.email}</p>
                </div>
                <UserCheck size={14} style={{ color: 'var(--text-muted)' }} />
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
