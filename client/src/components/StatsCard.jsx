import React from 'react';

export const StatsCard = ({ title, value, icon: Icon, color = 'navy', subtitle }) => {
  const colorMap = {
    navy: 'bg-navy-50 text-navy border-navy-100',
    teal: 'bg-teal-50 text-teal border-teal-100',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    green: 'bg-green-50 text-status-success border-green-200'
  };

  return (
    <div className="bg-surface border border-slate-border rounded-xl p-5 shadow-card hover:shadow-hover transition-all flex items-center justify-between">
      <div>
        <p className="text-xs font-bold text-slate-muted uppercase tracking-wider">{title}</p>
        <p className="text-2xl font-extrabold text-navy mt-1">{value ?? '—'}</p>
        {subtitle && <p className="text-[11px] text-slate-muted mt-0.5">{subtitle}</p>}
      </div>
      {Icon && (
        <div className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${colorMap[color] || colorMap.navy}`}>
          <Icon className="w-5 h-5" />
        </div>
      )}
    </div>
  );
};
