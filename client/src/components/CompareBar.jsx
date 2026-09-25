import React from 'react';
import { ArrowRight, X, Trash2 } from 'lucide-react';
import { getTbiDisplayData } from '../utils/tbiMapping';

export const CompareBar = ({
  selectedTbis = [],
  onRemove,
  onClearAll,
  onCompare
}) => {
  if (!selectedTbis || selectedTbis.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-md border-t border-[#D9CAB3] shadow-lg animate-in slide-in-from-bottom duration-250">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Left: Count and item pills */}
          <div className="flex items-center gap-3 overflow-x-auto w-full sm:w-auto py-1 no-scrollbar">
            <div className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#7A0B1A] text-white text-xs font-bold shadow-xs">
              <span>{selectedTbis.length} {selectedTbis.length === 1 ? 'TBI' : 'TBIs'} selected</span>
              <span className="text-[#D9CAB3] text-[10px] font-normal">(max 3)</span>
            </div>

            {/* Selected item chips */}
            <div className="flex items-center gap-2">
              {selectedTbis.map((tbi) => {
                const display = getTbiDisplayData(tbi);
                return (
                  <span
                    key={tbi.id}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FAF7F2] border border-[#D9CAB3] text-xs font-semibold text-[#7A0B1A] max-w-[180px] sm:max-w-[200px]"
                  >
                    <span className="truncate" title={display.universityName}>
                      {display.universityName}
                    </span>
                    <button
                      type="button"
                      onClick={() => onRemove(tbi.id)}
                      className="text-slate-400 hover:text-status-error cursor-pointer p-0.5 rounded transition-colors"
                      title="Remove"
                      aria-label={`Remove ${display.universityName}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                );
              })}
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center justify-end gap-2.5 w-full sm:w-auto shrink-0">
            <button
              type="button"
              onClick={onClearAll}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-[#647C98] hover:text-status-error hover:bg-red-50 border border-transparent transition-all cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>

            <button
              type="button"
              onClick={onCompare}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[#7A0B1A] hover:bg-[#5B0712] text-white text-xs font-bold shadow-sm hover:shadow active:scale-[0.98] transition-all cursor-pointer"
            >
              <span>Compare</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
