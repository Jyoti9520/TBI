import React from 'react';
import { Link } from 'react-router-dom';
import { University, MapPin, ArrowRight } from 'lucide-react';

export const UniversityCard = ({ university }) => {
  return (
    <div className="bg-surface border border-slate-border rounded-xl p-5 shadow-subtle hover:shadow-card hover:-translate-y-1 hover:border-[#5B0712]/50 transition-all duration-200 ease-out flex flex-col justify-between group">
      <div>
        {/* University Icon Container */}
        <div className="w-11 h-11 rounded-xl bg-[#FAF7F2] border border-[#D9CAB3] flex items-center justify-center text-[#7A0B1A] mb-3.5 shadow-xs transition-transform duration-200 group-hover:scale-105">
          <University className="w-5 h-5 text-[#7A0B1A]" />
        </div>

        <h3 className="text-base font-bold text-slate-800 group-hover:text-[#7A0B1A] transition-colors duration-200 line-clamp-2 leading-snug">
          {university.university}
        </h3>

        <div className="mt-3 space-y-1 text-xs text-slate-muted">
          <div className="flex items-center space-x-1.5">
            <div className="w-4 h-4 rounded-md bg-[#FAF7F2] border border-[#D9CAB3]/70 flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105">
              <MapPin className="w-2.5 h-2.5 text-[#5B0712]" />
            </div>
            <span className="truncate">{university.city}</span>
          </div>

          <p className="text-[11px] font-semibold text-slate-muted truncate pl-5">
            {university.universityType}
          </p>
        </div>
      </div>

      <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs font-bold text-[#7A0B1A] bg-[#D9CAB3]/40 px-2.5 py-1 rounded-md border border-[#8C7A6B]/30 shadow-2xs">
          {university.tbiCount} {university.tbiCount === 1 ? 'TBI' : 'TBIs'}
        </span>

        <Link
          to={`/explore?university=${encodeURIComponent(university.university)}`}
          className="flex items-center space-x-1 text-xs font-bold text-[#5B0712] hover:text-[#7A0B1A] transition-colors duration-200 group/link"
        >
          <span>View TBIs</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
};
