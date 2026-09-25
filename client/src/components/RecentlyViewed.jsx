import React from 'react';
import { Link } from 'react-router-dom';
import { History, ArrowRight, MapPin, Rocket, University } from 'lucide-react';
import { getTbiDisplayData } from '../utils/tbiMapping';

export const RecentlyViewed = ({ items = [] }) => {
  return (
    <div className="bg-surface rounded-2xl border border-slate-border p-5 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-[#7A0B1A] flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-[#FAF7F2] border border-[#D9CAB3] flex items-center justify-center shrink-0 shadow-2xs">
            <History className="w-4 h-4 text-[#7A0B1A]" />
          </div>
          <span>Recently Viewed</span>
        </h2>
        {items.length > 0 && (
          <span className="text-xs font-semibold text-[#647C98]">
            {items.length} {items.length === 1 ? 'item' : 'items'}
          </span>
        )}
      </div>

      {items.length === 0 ? (
        <div className="py-6 px-4 text-center rounded-xl bg-[#FAF7F2]/60 border border-dashed border-[#D9CAB3]">
          <p className="text-xs font-medium text-[#647C98]">
            TBIs you view will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {items.map((tbi) => {
            const display = getTbiDisplayData(tbi);
            return (
              <div
                key={tbi.id}
                className="group relative flex flex-col justify-between p-3.5 rounded-xl bg-surface border border-slate-border hover:border-[#7A0B1A]/40 hover:shadow-card hover:-translate-y-1 transition-all duration-200 ease-out"
              >
                <div>
                  {/* Top: Small Avatar / Icon */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] border border-[#D9CAB3] flex items-center justify-center font-bold text-[#7A0B1A] text-xs shrink-0 shadow-2xs group-hover:scale-105 transition-transform duration-200">
                      {tbi.logo ? (
                        <img
                          src={tbi.logo}
                          alt={display.universityName}
                          className="w-full h-full object-cover rounded-lg"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : (
                        display.firstLetter
                      )}
                    </div>
                  </div>

                  {/* University Name */}
                  <h3
                    className="text-xs font-bold text-[#243447] line-clamp-1 group-hover:text-[#7A0B1A] transition-colors"
                    title={display.universityName}
                  >
                    {display.universityName}
                  </h3>

                  {/* TBI / Incubator Name */}
                  <p
                    className="text-[11px] font-semibold text-[#7A0B1A] mt-0.5 flex items-center space-x-1 line-clamp-1"
                    title={display.incubatorName}
                  >
                    <Rocket className="w-2.5 h-2.5 shrink-0" />
                    <span>{display.incubatorName}</span>
                  </p>

                  {/* City */}
                  <p
                    className="text-[11px] text-[#647C98] mt-1.5 flex items-center space-x-1 line-clamp-1"
                    title={display.city}
                  >
                    <MapPin className="w-2.5 h-2.5 shrink-0 text-[#7A0B1A]" />
                    <span>{display.city}</span>
                  </p>
                </div>

                {/* View Details action */}
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-end">
                  <Link
                    to={`/tbi/${tbi.id}`}
                    className="group/link inline-flex items-center space-x-1 text-xs font-bold text-[#7A0B1A] hover:text-[#5B0712] active:scale-[0.97] transition-all duration-200 select-none"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-3 h-3 transition-transform duration-200 ease-out group-hover/link:translate-x-1" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
