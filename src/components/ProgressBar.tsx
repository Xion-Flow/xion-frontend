import React from 'react';

interface ProgressBarProps {
  progress: number;
  showText?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, showText = true }) => {
  const percentage = Math.min(100, Math.max(0, progress));

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%' }}>
      <div className="progress-bar-track" style={{ flex: 1 }}>
        <div className="progress-bar-fill" style={{ width: `${percentage}%` }} />
      </div>
      {showText && (
        <span style={{ fontSize: '0.8125rem', fontWeight: 700, minWidth: '40px', textAlign: 'right' }}>
          {percentage}%
        </span>
      )}
    </div>
  );
};
