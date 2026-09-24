import React from 'react';
import { SearchX } from 'lucide-react';

export const EmptyState = ({
  title = 'No TBIs found',
  description = 'Try searching for another university, city or incubator type.',
  actionLabel = 'Clear Search',
  onAction
}) => {
  return (
    <div className="text-center py-16 px-4 bg-surface border border-dashed border-slate-border rounded-2xl max-w-lg mx-auto my-6">
      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-muted">
        <SearchX className="w-6 h-6" />
      </div>
      <h3 className="text-base font-bold text-slate mb-1">{title}</h3>
      <p className="text-sm text-slate-muted max-w-sm mx-auto mb-5">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 bg-[#1F150C] hover:bg-[#412D15] text-[#E1DCC9] text-xs font-semibold rounded-lg shadow-sm transition-colors border border-[#000000]"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
