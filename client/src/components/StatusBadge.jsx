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
        className={`inline-flex items-center space-x-1.5 font-semibold text-emerald-800 bg-emerald-50 rounded-md border border-emerald-200/80 whitespace-nowrap ${containerPadding}`}
      >
        <BadgeCheck className={`${iconClass} text-emerald-600 shrink-0`} />
        <span>Verified</span>
      </span>
    );
  }

  if (isUnderVerification) {
    return (
      <span
        className={`inline-flex items-center space-x-1.5 font-semibold text-amber-900 bg-amber-50 rounded-md border border-amber-200/80 whitespace-nowrap ${containerPadding}`}
      >
        <Clock className={`${iconClass} text-amber-700 shrink-0`} />
        <span>Under Verification</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center space-x-1.5 font-semibold text-slate-600 bg-slate-100 rounded-md border border-slate-200/80 whitespace-nowrap ${containerPadding}`}
    >
      <Circle className={`${circleClass} text-slate-400 shrink-0`} />
      <span>Unverified</span>
    </span>
  );
};
