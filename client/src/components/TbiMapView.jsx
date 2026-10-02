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
      <div className="bg-white border border-dashed border-border rounded-xl p-10 sm:p-14 text-center shadow-card max-w-xl mx-auto my-6 animate-in fade-in duration-200">
        <div className="w-14 h-14 rounded-xl bg-slate-bg border border-border flex items-center justify-center mx-auto mb-4 text-primary shadow-xs">
          <MapPin className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-bold text-dark font-heading">
          Map view is not available yet
        </h3>
        <p className="text-sm font-semibold text-slate-body mt-2">
          Location coordinates are not available for these records.
        </p>
        <p className="text-xs text-slate-muted mt-1.5 leading-relaxed max-w-md mx-auto">
          You can still explore TBIs by city using the search and filters.
        </p>
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={onSwitchToList}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-xs active:scale-[0.98] transition-all cursor-pointer"
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
    <div className="relative w-full h-[600px] bg-slate-50 rounded-xl border border-border overflow-hidden shadow-card">
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
                    ? 'bg-primary text-white ring-4 ring-primary/20 scale-125 z-20'
                    : 'bg-white text-primary border border-border hover:border-primary/50 z-10'
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
        <div className="absolute bottom-6 left-6 right-6 sm:left-auto sm:right-6 sm:w-96 bg-white border border-border rounded-xl p-5 shadow-lg z-30 animate-in fade-in slide-in-from-bottom-2 duration-200">
          {(() => {
            const display = getTbiDisplayData(selectedTbi);
            return (
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-bold text-dark line-clamp-1">
                      {display.universityName}
                    </h4>
                    <p className="text-xs font-semibold text-primary flex items-center space-x-1.5 mt-0.5 line-clamp-1">
                      <Rocket className="w-3.5 h-3.5 shrink-0" />
                      <span>{display.incubatorName}</span>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedTbi(null)}
                    className="p-1 rounded-lg text-slate-muted hover:text-dark hover:bg-slate-hover transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center space-x-1.5 text-xs text-slate-muted">
                  <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                  <span>{display.city}</span>
                </div>

                <div className="pt-2 border-t border-border flex items-center justify-between">
                  <StatusBadge status={display.status} size="sm" />
                  <Link
                    to={`/tbi/${selectedTbi.id}`}
                    className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-xs active:scale-[0.98] transition-all"
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
