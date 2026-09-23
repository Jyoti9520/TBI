import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, ArrowRight } from 'lucide-react';

export const CategoryCard = ({ category, type = 'incubatorType' }) => {
  return (
    <Link
      to={`/explore?${type}=${encodeURIComponent(category.name)}`}
      className="bg-surface border border-slate-border rounded-xl p-4 shadow-card hover:shadow-hover hover:border-teal/50 transition-all duration-200 flex items-center justify-between group"
    >
      <div className="flex items-center space-x-3 overflow-hidden">
        <div className="w-9 h-9 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center text-teal shrink-0 group-hover:scale-105 transition-transform">
          <Layers className="w-4 h-4" />
        </div>
        <div className="truncate">
          <h4 className="text-sm font-bold text-slate group-hover:text-teal transition-colors truncate">
            {category.name}
          </h4>
          <p className="text-xs text-slate-muted">
            {category.count} {category.count === 1 ? 'Incubator' : 'Incubators'}
          </p>
        </div>
      </div>
      <ArrowRight className="w-4 h-4 text-slate-muted group-hover:text-teal group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
    </Link>
  );
};
