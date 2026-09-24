import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, MapPin, ArrowRight } from 'lucide-react';

export const UniversityCard = ({ university }) => {
  return (
    <div className="bg-surface border border-slate-border rounded-xl p-5 shadow-card hover:shadow-hover hover:border-[#78A4CB] transition-all duration-200 flex flex-col justify-between group">
      <div>
        <div className="w-10 h-10 rounded-xl bg-[#B4E1EB]/40 border border-[#95BDD7]/40 flex items-center justify-center text-[#78A4CB] font-bold mb-3.5 shadow-sm">
          <Building2 className="w-5 h-5 text-[#78A4CB]" />
        </div>

        <h3 className="text-base font-bold text-slate group-hover:text-[#78A4CB] transition-colors line-clamp-2 leading-snug">
          {university.university}
        </h3>

        <div className="mt-3 space-y-1 text-xs text-slate-muted">
          <div className="flex items-center space-x-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#78A4CB] shrink-0" />
            <span className="truncate">{university.city}</span>
          </div>

          <p className="text-[11px] font-semibold text-[#5A758E] truncate">
            {university.universityType}
          </p>
        </div>
      </div>

      <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs font-bold text-[#4A3B02] bg-[#F9E8A2] px-2.5 py-1 rounded-md border border-[#F4DB6F]/70 shadow-sm">
          {university.tbiCount} {university.tbiCount === 1 ? 'TBI' : 'TBIs'}
        </span>

        <Link
          to={`/explore?university=${encodeURIComponent(university.university)}`}
          className="flex items-center space-x-1 text-xs font-bold text-[#78A4CB] hover:text-[#5F8FB8] transition-colors"
        >
          <span>View TBIs</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
};
