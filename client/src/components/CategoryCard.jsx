import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, ArrowRight } from 'lucide-react';

export const CategoryCard = ({ category, type = 'incubatorType' }) => {
  return (
    <Link
      to={`/explore?${type}=${encodeURIComponent(category.name)}`}
      className="bg-[#131318] border border-white/10 rounded-xl p-4 shadow-lg hover:shadow-orange-500/10 hover:-translate-y-0.5 hover:border-orange-500/50 transition-all duration-200 ease-out flex items-center justify-between group"
    >
      <div className="flex items-center space-x-3 overflow-hidden">
        <div className="w-10 h-10 rounded-xl bg-[#1c1c24] border border-white/10 flex items-center justify-center text-orange-400 shrink-0 transition-transform duration-200 group-hover:scale-105 group-hover:bg-orange-500/20">
          <Layers className="w-4 h-4 text-orange-400 group-hover:text-orange-300 transition-colors duration-200" />
        </div>
        <div className="truncate">
          <h4 className="text-sm font-semibold text-white group-hover:text-orange-400 transition-colors duration-200 truncate">
            {category.name}
          </h4>
          <p className="text-xs text-slate-400">
            {category.count} {category.count === 1 ? 'Incubator' : 'Incubators'}
          </p>
        </div>
      </div>
      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-orange-400 group-hover:translate-x-0.5 transition-all duration-200 shrink-0 ml-2" />
    </Link>
  );
};
