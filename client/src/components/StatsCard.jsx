import React from 'react';

export const StatsCard = ({ title, value, icon: Icon, color = 'navy', subtitle }) => {
  const colorMap = {
    navy: 'bg-[#7A0B1A] text-white border-[#5B0712]',
    teal: 'bg-[#FAF7F2] text-[#7A0B1A] border-[#D9CAB3]',
    amber: 'bg-[#D99A2B]/10 text-[#D99A2B] border-[#D99A2B]/30',
    green: 'bg-[#16A36A]/10 text-[#16A36A] border-[#16A36A]/25'
  };

  return (
    <div className="group bg-surface border border-slate-border rounded-xl p-5 shadow-subtle hover:shadow-card hover:-translate-y-1 hover:border-[#7A0B1A]/40 transition-all duration-200 ease-out flex items-center justify-between">
      <div>
        <p className="text-xs font-bold text-[#647C98] uppercase tracking-wider">{title}</p>
        <p className="text-2xl font-extrabold text-[#7A0B1A] mt-1">{value ?? '—'}</p>
        {subtitle && <p className="text-[11px] text-[#647C98] mt-0.5">{subtitle}</p>}
      </div>
      {Icon && (
        <div className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 shadow-xs transition-transform duration-200 group-hover:scale-105 ${colorMap[color] || colorMap.navy}`}>
          <Icon className="w-5 h-5" />
        </div>
      )}
    </div>
  );
};
