import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, LayoutGrid, Rocket, ArrowRight, X, Info } from 'lucide-react';
import { getTbiDisplayData } from '../utils/tbiMapping';
import { StatusBadge } from './StatusBadge';

export const TbiMapView = ({ tbis = [], onSwitchToList }) => {
  const [selectedTbi, setSelectedTbi] = useState(null);

  // Filter ONLY TBIs that have legitimate coordinates in the dataset
  const tbisWithCoords = (tbis || []).filter(
    (t) =>
      t?.latitude !== null &&
      t?.latitude !== undefined &&
      t?.longitude !== null &&
      t?.longitude !== undefined &&
      !isNaN(Number(t.latitude)) &&
      !isNaN(Number(t.longitude))
  );

  // If precise coordinates are unavailable in the database, do NOT invent data
  if (tbisWithCoords.length === 0) {
    return (
      <div className="bg-surface border border-dashed border-[#D9CAB3] rounded-2xl p-10 sm:p-14 text-center shadow-card max-w-xl mx-auto my-6 animate-in fade-in duration-200">
        <div className="w-14 h-14 rounded-2xl bg-[#FAF7F2] border border-[#D9CAB3] flex items-center justify-center mx-auto mb-4 text-[#7A0B1A] shadow-xs">
          <MapPin className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-extrabold text-[#7A0B1A]">
          Map view is not available yet
        </h3>
        <p className="text-sm font-semibold text-[#243447] mt-2">
          Location coordinates are not available for these records.
        </p>
        <p className="text-xs text-[#647C98] mt-1.5 leading-relaxed max-w-md mx-auto">
          You can still explore TBIs by city using the search and filters.
        </p>
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={onSwitchToList}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#7A0B1A] text-white text-xs font-bold shadow-sm hover:bg-[#5B0712] active:scale-[0.98] transition-all cursor-pointer"
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Return to List →</span>
          </button>
        </div>
      </div>
    );
  }

  // When coordinates exist, render the map with markers and interactive popup
  return (
    <div className="relative w-full h-[600px] bg-slate-100 rounded-2xl border border-slate-border overflow-hidden shadow-card">
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Markers container */}
        <div className="relative w-full h-full p-6">
          {tbisWithCoords.map((tbi) => {
            const display = getTbiDisplayData(tbi);
            const isSelected = selectedTbi?.id === tbi.id;

            return (
              <button
                key={tbi.id}
                type="button"
                onClick={() => setSelectedTbi(tbi)}
                className={`absolute p-2 rounded-full shadow-md transition-transform duration-200 hover:scale-125 cursor-pointer ${
                  isSelected
                    ? 'bg-[#7A0B1A] text-white ring-4 ring-[#5B0712]/30 scale-125 z-20'
                    : 'bg-white text-[#5B0712] border border-[#D9CAB3] z-10'
                }`}
                title={display.universityName}
              >
                <MapPin className="w-4 h-4 fill-current" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Marker Popup Card */}
      {selectedTbi && (
        <div className="absolute bottom-6 left-6 right-6 sm:left-auto sm:right-6 sm:w-96 bg-surface border border-slate-border rounded-2xl p-5 shadow-hover z-30 animate-in fade-in slide-in-from-bottom-2 duration-200">
          {(() => {
            const display = getTbiDisplayData(selectedTbi);
            return (
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 line-clamp-1">
                      {display.universityName}
                    </h4>
                    <p className="text-xs font-semibold text-[#5B0712] flex items-center space-x-1.5 mt-0.5 line-clamp-1">
                      <Rocket className="w-3.5 h-3.5 shrink-0" />
                      <span>{display.incubatorName}</span>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedTbi(null)}
                    className="p-1 rounded-lg text-slate-muted hover:text-slate-800 hover:bg-slate-100 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center space-x-1.5 text-xs text-slate-muted">
                  <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                  <span>{display.city}</span>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <StatusBadge status={display.status} size="sm" />
                  <Link
                    to={`/tbi/${selectedTbi.id}`}
                    className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-[#7A0B1A] hover:bg-[#5B0712] text-white text-xs font-bold shadow-xs active:scale-[0.98] transition-all"
                  >
                    <span>View Details →</span>
                  </Link>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};
