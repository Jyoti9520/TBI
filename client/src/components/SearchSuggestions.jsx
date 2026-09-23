import React from 'react';
import { Building2, MapPin, Compass } from 'lucide-react';

export const SearchSuggestions = ({ suggestions, onSelect, visible }) => {
  if (!visible || !suggestions || suggestions.length === 0) return null;

  return (
    <div className="absolute left-0 right-0 top-full mt-1.5 bg-surface border border-slate-border rounded-xl shadow-hover overflow-hidden z-50 animate-in fade-in slide-in-from-top-1 duration-150">
      <div className="p-2 border-b border-slate-border bg-slate-50 text-[11px] font-semibold text-slate-muted uppercase tracking-wider">
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
              className="px-4 py-2.5 hover:bg-navy-50/60 cursor-pointer flex items-center justify-between transition-colors group"
            >
              <div className="flex items-center space-x-3 overflow-hidden">
                <div className="w-7 h-7 rounded-md bg-slate-100 group-hover:bg-navy-100 flex items-center justify-center shrink-0 text-slate-muted group-hover:text-navy transition-colors">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="truncate">
                  <p className="text-sm font-medium text-slate group-hover:text-navy truncate">
                    {item.title}
                  </p>
                  <p className="text-xs text-slate-muted truncate">{item.subtitle}</p>
                </div>
              </div>
              <span className="text-[10px] uppercase font-bold text-teal bg-teal-50 px-2 py-0.5 rounded-full shrink-0 ml-2">
                {item.type}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
