import React from 'react';
import { Link } from 'react-router-dom';
import { University, MapPin, ArrowRight } from 'lucide-react';

export const UniversityCard = ({ university }) => {
  return (
    <div className="bg-[#131318] border border-white/10 rounded-xl p-5 shadow-lg hover:shadow-orange-500/10 hover:-translate-y-0.5 hover:border-orange-500/50 transition-all duration-200 ease-out flex flex-col justify-between group">
      <div>
        {/* University Icon Container */}
        <div className="w-11 h-11 rounded-xl bg-[#1c1c24] border border-white/10 flex items-center justify-center text-orange-400 mb-3.5 transition-transform duration-200 group-hover:scale-105 group-hover:bg-orange-500/20">
          <University className="w-5 h-5 text-orange-400" />
        </div>

        <h3 className="text-base font-bold font-heading text-white group-hover:text-orange-400 transition-colors duration-200 line-clamp-2 leading-snug">
          {university.university}
        </h3>

        <div className="mt-3 space-y-1 text-xs text-slate-muted">
          <div className="flex items-center space-x-1.5">
            <div className="w-4 h-4 rounded-md bg-slate-bg border border-border flex items-center justify-center shrink-0">
              <MapPin className="w-2.5 h-2.5 text-slate-muted" />
            </div>
            <span className="truncate text-slate-body font-medium">{university.city}</span>
          </div>

          <p className="text-[11px] font-medium text-slate-muted truncate pl-5">
            {university.universityType}
          </p>
        </div>
      </div>

      <div className="mt-5 pt-3.5 border-t border-border flex items-center justify-between">
        <span className="text-xs font-semibold text-primary bg-primary-light px-2.5 py-1 rounded-md border border-orange-200">
          {university.tbiCount} {university.tbiCount === 1 ? 'TBI' : 'TBIs'}
        </span>

        <Link
          to={`/explore?university=${encodeURIComponent(university.university)}`}
          className="flex items-center space-x-1 text-xs font-semibold text-primary hover:text-primary-hover transition-colors duration-200 group/link"
        >
          <span>View TBIs</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/link:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
};
