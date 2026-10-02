import React from 'react';
import { Link } from 'react-router-dom';
import { University, MapPin, ArrowRight } from 'lucide-react';

export const UniversityCard = ({ university }) => {
  return (
    <div className="bg-white border border-border rounded-xl p-5 shadow-xs hover:shadow-card hover:-translate-y-0.5 hover:border-primary/50 transition-all duration-200 ease-out flex flex-col justify-between group">
      <div>
        {/* University Icon Container */}
        <div className="w-11 h-11 rounded-xl bg-slate-bg border border-border flex items-center justify-center text-primary mb-3.5 transition-transform duration-200 group-hover:scale-105 group-hover:bg-primary-light">
          <University className="w-5 h-5 text-primary" />
        </div>

        <h3 className="text-base font-bold font-heading text-dark group-hover:text-primary transition-colors duration-200 line-clamp-2 leading-snug">
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
        <span className="text-xs font-semibold text-primary bg-primary-light px-2.5 py-1 rounded-md border border-blue-100">
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
