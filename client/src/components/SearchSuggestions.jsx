import React from 'react';
import { Building2, MapPin, Compass } from 'lucide-react';

export const SearchSuggestions = ({ suggestions, onSelect, visible }) => {
  if (!visible || !suggestions || suggestions.length === 0) return null;

  return (
    <div className="absolute left-0 right-0 top-full mt-1.5 bg-surface border border-slate-border rounded-xl shadow-hover overflow-hidden z-50 animate-in fade-in slide-in-from-top-1 duration-150">
      <div className="p-2 border-b border-slate-border bg-[#FAF7F2] text-[11px] font-bold text-slate-muted uppercase tracking-wider">
        Quick Suggestions
      </div>
      <ul className="max-h-72 overflow-y-auto divide-y divide-slate-100">
        {suggestions.map((item, idx) => {
          let Icon = Compass;
          if (item.type === 'university') Icon = Building2;
          else if (item.type === 'city') Icon = MapPin;

          return (
            <li
              key={idx}
              onMouseDown={() => onSelect(item)}
              className="px-4 py-2.5 hover:bg-[#D9CAB3]/40 cursor-pointer flex items-center justify-between transition-colors group"
            >
              <div className="flex items-center space-x-3 overflow-hidden">
                <div className="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-[#D9CAB3] flex items-center justify-center shrink-0 text-slate-muted group-hover:text-[#5E0B15] transition-colors">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="truncate">
                  <p className="text-sm font-semibold text-slate group-hover:text-[#90323D] truncate">
                    {item.title}
                  </p>
                  <p className="text-xs text-slate-muted truncate">{item.subtitle}</p>
                </div>
              </div>
              <span className="text-[10px] uppercase font-bold text-[#5E0B15] bg-[#D9CAB3] border border-[#8C7A6B] px-2 py-0.5 rounded-full shrink-0 ml-2">
                {item.type}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
