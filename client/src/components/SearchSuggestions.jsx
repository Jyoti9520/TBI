import React from 'react';
import { University, Rocket, MapPin, BadgeCheck, Clock, Search, AlertCircle } from 'lucide-react';
import { getTbiDisplayData } from '../utils/tbiMapping';

export const HighlightMatch = ({ text = '', query = '' }) => {
  if (!text) return null;
  if (!query || !query.trim()) return <span>{text}</span>;

  const escaped = query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = text.split(new RegExp(`(${escaped})`, 'gi'));

  return (
    <span>
      {parts.map((part, index) =>
        part.toLowerCase() === query.trim().toLowerCase() ? (
          <span
            key={index}
            className="bg-[#D9CAB3]/80 text-[#5E0B15] font-extrabold px-0.5 rounded-xs"
          >
            {part}
          </span>
        ) : (
          part
        )
      )}
    </span>
  );
};

export const SearchSuggestions = ({
  suggestions = [],
  query = '',
  selectedIndex = -1,
  onSelect,
  visible = false,
  loading = false
}) => {
  if (!visible) return null;

  return (
    <div className="absolute left-0 right-0 top-full mt-2 bg-surface border border-slate-border rounded-2xl shadow-hover overflow-hidden z-50 animate-in fade-in slide-in-from-top-1 duration-150">
      {/* Dropdown Header */}
      <div className="px-4 py-2 border-b border-slate-border/80 bg-[#FAF7F2] flex items-center justify-between text-[11px] font-bold text-slate-muted uppercase tracking-wider">
        <span>Suggested Incubators</span>
        {suggestions.length > 0 && (
          <span className="text-[10px] lowercase font-normal text-slate-400">
            Use ↑↓ to navigate, ↵ to select
          </span>
        )}
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="p-5 flex items-center justify-center space-x-2 text-xs text-slate-muted">
          <div className="w-3.5 h-3.5 border-2 border-[#90323D] border-t-transparent rounded-full animate-spin" />
          <span>Searching ecosystem...</span>
        </div>
      ) : suggestions.length === 0 ? (
        /* Empty state: No matching TBIs found */
        <div className="p-6 text-center text-xs text-slate-muted">
          <div className="w-8 h-8 rounded-full bg-[#FAF7F2] border border-[#D9CAB3] flex items-center justify-center mx-auto mb-2 text-[#90323D]">
            <Search className="w-4 h-4" />
          </div>
          <p className="font-bold text-slate-800 text-sm">No matching TBIs found</p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Try searching by university name, incubator name, city, or incubator type.
          </p>
        </div>
      ) : (
        /* Results list */
        <ul className="max-h-80 overflow-y-auto divide-y divide-slate-100" role="listbox">
          {suggestions.map((item, idx) => {
            const display = getTbiDisplayData(item);
            const isSelected = selectedIndex === idx;

            return (
              <li
                key={item.id || idx}
                role="option"
                aria-selected={isSelected}
                onMouseDown={(e) => {
                  e.preventDefault(); // Prevent input blur before selection completes
                  if (onSelect) onSelect(item);
                }}
                className={`px-4 py-3 cursor-pointer transition-colors duration-150 flex items-center justify-between gap-3 group ${
                  isSelected
                    ? 'bg-[#5E0B15]/[0.08] text-[#5E0B15]'
                    : 'hover:bg-[#FAF7F2]'
                }`}
              >
                <div className="flex items-start space-x-3 overflow-hidden min-w-0">
                  {/* University icon */}
                  <div
                    className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 transition-transform duration-150 group-hover:scale-105 ${
                      isSelected
                        ? 'bg-[#5E0B15] text-white border-[#5E0B15]'
                        : 'bg-[#FAF7F2] border-[#D9CAB3] text-[#90323D]'
                    }`}
                  >
                    <University className="w-4 h-4" />
                  </div>

                  {/* Text details */}
                  <div className="overflow-hidden min-w-0 text-left">
                    {/* University Name */}
                    <p className="text-sm font-bold text-slate-900 group-hover:text-[#5E0B15] truncate leading-tight">
                      <HighlightMatch text={display.universityName} query={query} />
                    </p>

                    {/* TBI / Incubator Name */}
                    <p className="text-xs font-semibold text-[#90323D] flex items-center space-x-1.5 mt-0.5 truncate">
                      <Rocket className="w-3 h-3 shrink-0 text-[#90323D]" />
                      <span className="truncate">
                        <HighlightMatch text={display.incubatorName} query={query} />
                      </span>
                    </p>

                    {/* City */}
                    <p className="text-[11px] text-slate-muted flex items-center space-x-1.5 mt-0.5 truncate">
                      <MapPin className="w-3 h-3 shrink-0 text-slate-400" />
                      <span className="truncate">
                        <HighlightMatch text={display.city} query={query} />
                      </span>
                    </p>
                  </div>
                </div>

                {/* Small category / status indicator */}
                <div className="flex flex-col items-end shrink-0 gap-1.5">
                  {display.incubatorType && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#D9CAB3]/50 text-[#5E0B15] border border-[#8C7A6B]/30 whitespace-nowrap shadow-2xs">
                      <HighlightMatch text={display.incubatorType} query={query} />
                    </span>
                  )}

                  {display.status === 'Verified' ? (
                    <span className="inline-flex items-center space-x-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/60 whitespace-nowrap">
                      <BadgeCheck className="w-3 h-3 text-emerald-600" />
                      <span>Verified</span>
                    </span>
                  ) : display.status === 'Under Verification' ? (
                    <span className="inline-flex items-center space-x-1 text-[10px] font-semibold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/60 whitespace-nowrap">
                      <Clock className="w-3 h-3 text-amber-700" />
                      <span>Under Verification</span>
                    </span>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
