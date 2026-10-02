import React from 'react';

export const StatsCard = ({ title, value, icon: Icon, color = 'blue', subtitle }) => {
  const colorMap = {
    blue: 'bg-primary-light text-primary border-blue-100',
    cyan: 'bg-sky-50 text-secondary-accent border-sky-100',
    amber: 'bg-amber-50 text-status-warning border-amber-200',
    green: 'bg-emerald-50 text-status-success border-emerald-200',
    navy: 'bg-dark text-white border-dark'
  };

  return (
    <div className="group bg-white border border-border rounded-xl p-5 shadow-xs hover:shadow-card hover:-translate-y-0.5 hover:border-primary/40 transition-all duration-200 ease-out flex items-center justify-between">
      <div>
        <p className="text-xs font-semibold text-slate-muted uppercase tracking-wider">{title}</p>
        <p className="text-2xl font-bold font-heading text-dark mt-1">{value ?? '—'}</p>
        {subtitle && <p className="text-[11px] text-slate-muted mt-0.5">{subtitle}</p>}
      </div>
      {Icon && (
        <div className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 ${colorMap[color] || colorMap.blue}`}>
          <Icon className="w-5 h-5" />
        </div>
      )}
    </div>
  );
};
