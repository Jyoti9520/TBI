import React from 'react';

export const StatsCard = ({ title, value, icon: Icon, color = 'navy', subtitle }) => {
  const colorMap = {
    navy: 'bg-[#5E0B15] text-[#D9CAB3] border-[#5E0B15]',
    teal: 'bg-[#90323D] text-[#D9CAB3] border-[#90323D]',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    green: 'bg-emerald-50 text-emerald-600 border-emerald-200'
  };

  return (
    <div className="group bg-surface border border-slate-border rounded-xl p-5 shadow-subtle hover:shadow-card hover:-translate-y-1 hover:border-[#90323D]/50 transition-all duration-200 ease-out flex items-center justify-between">
      <div>
        <p className="text-xs font-bold text-slate-muted uppercase tracking-wider">{title}</p>
        <p className="text-2xl font-extrabold text-[#5E0B15] mt-1">{value ?? '—'}</p>
        {subtitle && <p className="text-[11px] text-slate-muted mt-0.5">{subtitle}</p>}
      </div>
      {Icon && (
        <div className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 shadow-xs transition-transform duration-200 group-hover:scale-105 ${colorMap[color] || colorMap.navy}`}>
          <Icon className="w-5 h-5" />
        </div>
      )}
    </div>
  );
};
