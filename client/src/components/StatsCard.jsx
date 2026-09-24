import React from 'react';

export const StatsCard = ({ title, value, icon: Icon, color = 'navy', subtitle }) => {
  const colorMap = {
    navy: 'bg-[#78A4CB]/15 text-[#1B3650] border-[#78A4CB]/30',
    teal: 'bg-[#95BDD7]/25 text-[#1B3650] border-[#95BDD7]/40',
    amber: 'bg-[#F9E8A2] text-[#4A3B02] border-[#F4DB6F]',
    green: 'bg-[#B4E1EB]/50 text-[#1B8251] border-[#95BDD7]/40'
  };

  return (
    <div className="bg-surface border border-slate-border rounded-xl p-5 shadow-card hover:shadow-hover hover:border-[#78A4CB]/50 transition-all flex items-center justify-between">
      <div>
        <p className="text-xs font-bold text-slate-muted uppercase tracking-wider">{title}</p>
        <p className="text-2xl font-extrabold text-[#1B3650] mt-1">{value ?? '—'}</p>
        {subtitle && <p className="text-[11px] text-slate-muted mt-0.5">{subtitle}</p>}
      </div>
      {Icon && (
        <div className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 shadow-sm ${colorMap[color] || colorMap.navy}`}>
          <Icon className="w-5 h-5" />
        </div>
      )}
    </div>
  );
};
