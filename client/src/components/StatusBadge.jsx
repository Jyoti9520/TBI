import React from 'react';
import { BadgeCheck, Clock, Circle } from 'lucide-react';

export const StatusBadge = ({ status, size = 'md' }) => {
  const isVerified = status === 'Verified';
  const isUnderVerification = status === 'Under Verification';

  const isSmall = size === 'sm';
  const iconClass = isSmall ? 'w-3 h-3' : 'w-3.5 h-3.5';
  const circleClass = isSmall ? 'w-2.5 h-2.5 stroke-[2.5]' : 'w-3 h-3 stroke-[2.5]';
  const containerPadding = isSmall ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-0.5 text-xs';

  if (isVerified) {
    return (
      <span
        className={`inline-flex items-center space-x-1.5 font-semibold text-emerald-400 bg-emerald-950/60 rounded-md border border-emerald-500/30 whitespace-nowrap ${containerPadding}`}
      >
        <BadgeCheck className={`${iconClass} text-emerald-400 shrink-0`} />
        <span>Verified</span>
      </span>
    );
  }

  if (isUnderVerification) {
    return (
      <span
        className={`inline-flex items-center space-x-1.5 font-semibold text-amber-300 bg-amber-950/60 rounded-md border border-amber-500/30 whitespace-nowrap ${containerPadding}`}
      >
        <Clock className={`${iconClass} text-amber-400 shrink-0`} />
        <span>Under Verification</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center space-x-1.5 font-bold text-slate-900 bg-slate-100/95 rounded-md border border-slate-300 whitespace-nowrap shadow-xs ${containerPadding}`}
      style={{ color: '#0f172a' }}
    >
      <Circle className={`${circleClass} text-slate-700 shrink-0`} style={{ stroke: '#0f172a' }} />
      <span className="text-black font-extrabold" style={{ color: '#000000' }}>Unverified</span>
    </span>
  );
};
