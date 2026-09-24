import React from 'react';

export const StatsCard = ({ title, value, icon: Icon, color = 'navy', subtitle }) => {
  const colorMap = {
    navy: 'bg-[#1F150C] text-[#E1DCC9] border-[#000000]',
    teal: 'bg-[#412D15] text-[#E1DCC9] border-[#1F150C]',
    amber: 'bg-[#E1DCC9] text-[#1F150C] border-[#CFC6A9]',
    green: 'bg-[#E1DCC9]/70 text-[#2E6F40] border-[#CFC6A9]'
  };

  return (
    <div className="bg-surface border border-slate-border rounded-xl p-5 shadow-card hover:shadow-hover hover:border-[#412D15] transition-all flex items-center justify-between">
      <div>
        <p className="text-xs font-bold text-slate-muted uppercase tracking-wider">{title}</p>
        <p className="text-2xl font-extrabold text-[#1F150C] mt-1">{value ?? '—'}</p>
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
