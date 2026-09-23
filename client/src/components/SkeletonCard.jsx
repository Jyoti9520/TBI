import React from 'react';

export const SkeletonCard = () => {
  return (
    <div className="bg-surface border border-slate-border rounded-xl p-5 shadow-card animate-pulse flex flex-col justify-between h-64">
      <div>
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-slate-200" />
          <div className="w-8 h-8 rounded-full bg-slate-100" />
        </div>
        <div className="h-5 bg-slate-200 rounded w-4/5 mb-2" />
        <div className="h-3.5 bg-slate-100 rounded w-1/2 mb-3" />
        <div className="h-5 bg-slate-100 rounded-md w-1/3 mb-4" />
        <div className="space-y-2">
          <div className="h-3 bg-slate-100 rounded w-2/3" />
          <div className="h-3 bg-slate-100 rounded w-1/2" />
        </div>
      </div>
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        <div className="h-4 bg-slate-200 rounded w-1/4" />
        <div className="h-7 bg-slate-200 rounded-lg w-20" />
      </div>
    </div>
  );
};
