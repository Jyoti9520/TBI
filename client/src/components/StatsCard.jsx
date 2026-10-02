import React from 'react';

export const StatsCard = ({ title, value, icon: Icon, color = 'blue', subtitle }) => {
  const colorMap = {
    blue: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
    orange: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
    cyan: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
    amber: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    green: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    navy: 'bg-[#1e1e26] text-white border-white/20'
  };

  return (
    <div className="group bg-[#131318] border border-white/10 rounded-xl p-5 shadow-lg hover:shadow-orange-500/10 hover:-translate-y-0.5 hover:border-orange-500/50 transition-all duration-200 ease-out flex items-center justify-between">
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</p>
        <p className="text-2xl font-bold font-heading text-white mt-1">{value ?? '—'}</p>
        {subtitle && <p className="text-[11px] text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {Icon && (
        <div className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 ${colorMap[color] || colorMap.blue}`}>
          <Icon className="w-5 h-5" />
        </div>
      )}
    </div>
  );
};
