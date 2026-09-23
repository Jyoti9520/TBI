import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, MapPin, ArrowRight } from 'lucide-react';

export const UniversityCard = ({ university }) => {
  return (
    <div className="bg-surface border border-slate-border rounded-xl p-5 shadow-card hover:shadow-hover hover:border-slate-300 transition-all duration-200 flex flex-col justify-between group">
      <div>
        <div className="w-10 h-10 rounded-lg bg-navy-50 border border-navy-100 flex items-center justify-center text-navy font-bold mb-3.5">
          <Building2 className="w-5 h-5 text-navy" />
        </div>

        <h3 className="text-base font-bold text-slate group-hover:text-navy transition-colors line-clamp-2 leading-snug">
          {university.university}
        </h3>

        <div className="mt-3 space-y-1 text-xs text-slate-muted">
          <div className="flex items-center space-x-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-muted shrink-0" />
            <span className="truncate">{university.city}</span>
          </div>

          <p className="text-[11px] font-medium text-teal truncate">
            {university.universityType}
          </p>
        </div>
      </div>

      <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs font-bold text-navy bg-navy-50 px-2.5 py-1 rounded-md border border-navy-100/50">
          {university.tbiCount} {university.tbiCount === 1 ? 'TBI' : 'TBIs'}
        </span>

        <Link
          to={`/explore?university=${encodeURIComponent(university.university)}`}
          className="flex items-center space-x-1 text-xs font-semibold text-teal hover:text-teal-700 transition-colors"
        >
          <span>View TBIs</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
};
