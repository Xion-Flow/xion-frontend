import React from 'react';
import { DeliverableStatus, PhaseStatus } from '../types';

interface BadgeProps {
  status: DeliverableStatus | PhaseStatus | string;
  label?: string;
}

export const Badge: React.FC<BadgeProps> = ({ status, label }) => {
  const normalizedStatus = status.toLowerCase();
  const displayLabel = label || status.replace('_', ' ');

  return <span className={`badge badge-${normalizedStatus}`}>{displayLabel}</span>;
};
