import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  X,
  University,
  Rocket,
  MapPin,
  Mail,
  Globe,
  Layers,
  Building2,
  Trash2,
  ArrowRight
} from 'lucide-react';
import { getTbiDisplayData } from '../utils/tbiMapping';
import { StatusBadge } from './StatusBadge';

export const CompareModal = ({
  isOpen = false,
  onClose,
  selectedTbis = [],
  onRemove,
  onClearAll
}) => {
  // Prevent background body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Comparison fields using ONLY existing dataset fields:
  // 1. University
  // 2. City
  // 3. University Type
  // 4. Incubator / TBI Name
  // 5. Incubator Type
  // 6. Official Email
  // 7. Website
  // 8. Status

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-[#131318] rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="px-5 py-4 sm:px-6 bg-[#0e0e12] border-b border-white/10 flex items-center justify-between gap-3 shrink-0">
          <div>
            <h2 className="text-lg sm:text-xl font-bold font-heading text-white flex items-center space-x-2">
              <span>Compare TBIs</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary text-white">
                {selectedTbis.length} of 3
              </span>
            </h2>
            <p className="text-xs text-slate-muted mt-0.5">
              Side-by-side comparison using verified directory records.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            {selectedTbis.length > 0 && (
              <button
                type="button"
                onClick={onClearAll}
                className="hidden sm:inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-body hover:text-status-error hover:bg-red-50 border border-border transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-muted hover:text-dark hover:bg-slate-hover transition-colors cursor-pointer"
              title="Close modal"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content / Comparison Table */}
        <div className="flex-1 overflow-auto p-4 sm:p-6">
          {selectedTbis.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm font-semibold text-slate-muted">No TBIs selected for comparison.</p>
              <button
                type="button"
                onClick={onClose}
                className="mt-4 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold"
              >
                Return to Explore
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto border border-border rounded-xl">
              <table className="w-full text-left border-collapse min-w-[640px]">
                <thead>
                  <tr className="bg-slate-bg border-b border-border">
                    <th className="p-3.5 sm:p-4 text-xs font-bold text-slate-muted w-40 sm:w-48 uppercase tracking-wider">
                      Attribute
                    </th>
                    {selectedTbis.map((tbi) => {
                      const display = getTbiDisplayData(tbi);
                      return (
                        <th key={tbi.id} className="p-3.5 sm:p-4 text-left border-l border-border">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="font-bold text-sm text-dark leading-snug">
                                {display.universityName}
                              </div>
                              <div className="text-xs font-medium text-slate-muted mt-0.5 leading-snug">
                                {display.incubatorName}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => onRemove(tbi.id)}
                              className="text-slate-muted hover:text-status-error p-1 rounded hover:bg-red-50 transition-colors cursor-pointer shrink-0"
                              title="Remove from comparison"
                              aria-label="Remove from comparison"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-xs sm:text-sm">
                  
                  {/* 1. University */}
                  <tr className="hover:bg-slate-hover/60 transition-colors">
                    <td className="p-3.5 sm:p-4 font-semibold text-slate-body bg-slate-bg/50">
                      <div className="flex items-center space-x-1.5">
                        <University className="w-4 h-4 text-primary shrink-0" />
                        <span>University</span>
                      </div>
                    </td>
                    {selectedTbis.map((tbi) => {
                      const display = getTbiDisplayData(tbi);
                      return (
                        <td key={tbi.id} className="p-3.5 sm:p-4 font-medium text-dark border-l border-border">
                          {display.universityName}
                        </td>
                      );
                    })}
                  </tr>

                  {/* 2. City */}
                  <tr className="hover:bg-slate-hover/60 transition-colors">
                    <td className="p-3.5 sm:p-4 font-semibold text-slate-body bg-slate-bg/50">
                      <div className="flex items-center space-x-1.5">
                        <MapPin className="w-4 h-4 text-primary shrink-0" />
                        <span>City</span>
                      </div>
                    </td>
                    {selectedTbis.map((tbi) => {
                      const display = getTbiDisplayData(tbi);
                      return (
                        <td key={tbi.id} className="p-3.5 sm:p-4 text-slate-body border-l border-border font-medium">
                          {display.city || '—'}
                        </td>
                      );
                    })}
                  </tr>

                  {/* 3. University Type */}
                  <tr className="hover:bg-slate-hover/60 transition-colors">
                    <td className="p-3.5 sm:p-4 font-semibold text-slate-body bg-slate-bg/50">
                      <div className="flex items-center space-x-1.5">
                        <Building2 className="w-4 h-4 text-primary shrink-0" />
                        <span>University Type</span>
                      </div>
                    </td>
                    {selectedTbis.map((tbi) => {
                      const val = tbi?.universityType && !tbi.universityType.includes('@') ? tbi.universityType.trim() : null;
                      return (
                        <td key={tbi.id} className="p-3.5 sm:p-4 text-slate-body border-l border-border">
                          {val ? (
                            <span className="inline-block px-2.5 py-0.5 rounded-md bg-slate-bg border border-border text-xs font-medium text-dark">
                              {val}
                            </span>
                          ) : (
                            <span className="text-slate-muted italic">Not specified</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>

                  {/* 4. Incubator / TBI Name */}
                  <tr className="hover:bg-slate-hover/60 transition-colors">
                    <td className="p-3.5 sm:p-4 font-semibold text-slate-body bg-slate-bg/50">
                      <div className="flex items-center space-x-1.5">
                        <Rocket className="w-4 h-4 text-primary shrink-0" />
                        <span>Incubator / TBI</span>
                      </div>
                    </td>
                    {selectedTbis.map((tbi) => {
                      const display = getTbiDisplayData(tbi);
                      return (
                        <td key={tbi.id} className="p-3.5 sm:p-4 font-medium text-dark border-l border-border">
                          {display.incubatorName}
                        </td>
                      );
                    })}
                  </tr>

                  {/* 5. Incubator Type */}
                  <tr className="hover:bg-slate-hover/60 transition-colors">
                    <td className="p-3.5 sm:p-4 font-semibold text-slate-body bg-slate-bg/50">
                      <div className="flex items-center space-x-1.5">
                        <Layers className="w-4 h-4 text-primary shrink-0" />
                        <span>Incubator Type</span>
                      </div>
                    </td>
                    {selectedTbis.map((tbi) => {
                      const display = getTbiDisplayData(tbi);
                      return (
                        <td key={tbi.id} className="p-3.5 sm:p-4 text-slate-body border-l border-border">
                          {display.incubatorType ? (
                            <span className="inline-block px-2.5 py-0.5 rounded-md bg-primary-light border border-orange-200 text-xs font-medium text-primary">
                              {display.incubatorType}
                            </span>
                          ) : (
                            <span className="text-slate-muted italic">Not specified</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>

                  {/* 6. Official Email */}
                  <tr className="hover:bg-slate-hover/60 transition-colors">
                    <td className="p-3.5 sm:p-4 font-semibold text-slate-body bg-slate-bg/50">
                      <div className="flex items-center space-x-1.5">
                        <Mail className="w-4 h-4 text-primary shrink-0" />
                        <span>Official Email</span>
                      </div>
                    </td>
                    {selectedTbis.map((tbi) => {
                      const display = getTbiDisplayData(tbi);
                      return (
                        <td key={tbi.id} className="p-3.5 sm:p-4 text-slate-body border-l border-border">
                          {display.email ? (
                            <a
                              href={`mailto:${display.email}`}
                              className="text-primary hover:underline font-medium break-all"
                            >
                              {display.email}
                            </a>
                          ) : (
                            <span className="text-slate-muted italic">Not available</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>

                  {/* 7. Website */}
                  <tr className="hover:bg-slate-hover/60 transition-colors">
                    <td className="p-3.5 sm:p-4 font-semibold text-slate-body bg-slate-bg/50">
                      <div className="flex items-center space-x-1.5">
                        <Globe className="w-4 h-4 text-primary shrink-0" />
                        <span>Website</span>
                      </div>
                    </td>
                    {selectedTbis.map((tbi) => {
                      const display = getTbiDisplayData(tbi);
                      return (
                        <td key={tbi.id} className="p-3.5 sm:p-4 text-slate-body border-l border-border">
                          {display.hasValidWebsite && display.websiteUrl ? (
                            <a
                              href={display.websiteUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center space-x-1 text-primary hover:underline font-medium"
                            >
                              <span className="truncate max-w-[180px]">{display.displayHostname || display.websiteUrl}</span>
                              <ArrowRight className="w-3 h-3 shrink-0" />
                            </a>
                          ) : (
                            <span className="text-slate-muted italic text-xs">Website URL not available</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>

                  {/* 8. Status */}
                  <tr className="hover:bg-slate-hover/60 transition-colors">
                    <td className="p-3.5 sm:p-4 font-semibold text-slate-body bg-slate-bg/50">
                      <div className="flex items-center space-x-1.5">
                        <span className="w-2 h-2 rounded-full bg-primary" />
                        <span>Status</span>
                      </div>
                    </td>
                    {selectedTbis.map((tbi) => {
                      const display = getTbiDisplayData(tbi);
                      return (
                        <td key={tbi.id} className="p-3.5 sm:p-4 border-l border-border">
                          <StatusBadge status={display.status} />
                        </td>
                      );
                    })}
                  </tr>

                  {/* Actions / View Details row */}
                  <tr className="bg-slate-bg/60">
                    <td className="p-3.5 sm:p-4 font-bold text-slate-muted">Action</td>
                    {selectedTbis.map((tbi) => (
                      <td key={tbi.id} className="p-3.5 sm:p-4 border-l border-border">
                        <Link
                          to={`/tbi/${tbi.id}`}
                          onClick={onClose}
                          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-xs hover:shadow active:scale-[0.97] transition-all"
                        >
                          <span>View Details</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    ))}
                  </tr>

                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 sm:px-6 bg-slate-bg border-t border-border flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-muted">
            Displaying only actual fields stored in the TBI database.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white border border-border text-xs font-semibold text-slate-body hover:bg-slate-hover transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
