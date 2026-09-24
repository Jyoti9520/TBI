import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, ArrowRight } from 'lucide-react';

export const CategoryCard = ({ category, type = 'incubatorType' }) => {
  return (
    <Link
      to={`/explore?${type}=${encodeURIComponent(category.name)}`}
      className="bg-surface border border-slate-border rounded-xl p-4 shadow-subtle hover:shadow-card hover:-translate-y-0.5 hover:border-[#90323D]/50 transition-all duration-200 ease-out flex items-center justify-between group"
    >
      <div className="flex items-center space-x-3 overflow-hidden">
        <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#D9CAB3] flex items-center justify-center text-[#5E0B15] shrink-0 transition-transform duration-200 group-hover:scale-105 shadow-2xs">
          <Layers className="w-4 h-4 text-[#8C7A6B] group-hover:text-[#5E0B15] transition-colors duration-200" />
        </div>
        <div className="truncate">
          <h4 className="text-sm font-bold text-slate-800 group-hover:text-[#5E0B15] transition-colors duration-200 truncate">
            {category.name}
          </h4>
          <p className="text-xs text-slate-muted">
            {category.count} {category.count === 1 ? 'Incubator' : 'Incubators'}
          </p>
        </div>
      </div>
      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#90323D] group-hover:translate-x-0.5 transition-all duration-200 shrink-0 ml-2" />
    </Link>
  );
};
