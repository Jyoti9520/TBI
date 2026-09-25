import React from 'react';
import { TbiCard } from './TbiCard';
import { SkeletonCard } from './SkeletonCard';
import { EmptyState } from './EmptyState';

export const TbiGrid = ({
  tbis = [],
  loading = false,
  emptyTitle = 'No TBIs found',
  emptyMessage = 'Try adjusting your search or filters to discover incubators.',
  onClearFilters,
  onFavoriteToggle,
  selectedCompareIds = [],
  onToggleCompare
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, idx) => (
          <SkeletonCard key={idx} />
        ))}
      </div>
    );
  }

  if (!tbis || tbis.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyMessage}
        actionLabel={onClearFilters ? 'Clear Search & Filters' : null}
        onAction={onClearFilters}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {tbis.map((tbi) => (
        <TbiCard
          key={tbi.id}
          tbi={tbi}
          onFavoriteToggle={onFavoriteToggle}
          isComparing={selectedCompareIds.includes(tbi.id)}
          onToggleCompare={onToggleCompare}
        />
      ))}
    </div>
  );
};
