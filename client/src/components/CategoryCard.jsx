import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, ArrowRight } from 'lucide-react';

export const CategoryCard = ({ category, type = 'incubatorType' }) => {
  return (
    <Link
      to={`/explore?${type}=${encodeURIComponent(category.name)}`}
      className="bg-white border border-border rounded-xl p-4 shadow-xs hover:shadow-card hover:-translate-y-0.5 hover:border-primary/50 transition-all duration-200 ease-out flex items-center justify-between group"
    >
      <div className="flex items-center space-x-3 overflow-hidden">
        <div className="w-10 h-10 rounded-xl bg-slate-bg border border-border flex items-center justify-center text-primary shrink-0 transition-transform duration-200 group-hover:scale-105 group-hover:bg-primary-light">
          <Layers className="w-4 h-4 text-slate-muted group-hover:text-primary transition-colors duration-200" />
        </div>
        <div className="truncate">
          <h4 className="text-sm font-semibold text-dark group-hover:text-primary transition-colors duration-200 truncate">
            {category.name}
          </h4>
          <p className="text-xs text-slate-muted">
            {category.count} {category.count === 1 ? 'Incubator' : 'Incubators'}
          </p>
        </div>
      </div>
      <ArrowRight className="w-4 h-4 text-slate-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-200 shrink-0 ml-2" />
    </Link>
  );
};
