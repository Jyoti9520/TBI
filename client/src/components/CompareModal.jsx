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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-surface rounded-2xl border border-slate-border shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="px-5 py-4 sm:px-6 bg-[#FAF7F2] border-b border-[#D9CAB3] flex items-center justify-between gap-3 shrink-0">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-[#5E0B15] flex items-center space-x-2">
              <span>Compare TBIs</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#5E0B15] text-white">
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
                className="hidden sm:inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-muted hover:text-status-error hover:bg-red-50 border border-slate-200 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-muted hover:text-slate-900 hover:bg-[#D9CAB3]/40 transition-colors cursor-pointer"
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
                className="mt-4 px-4 py-2 rounded-xl bg-[#5E0B15] text-white text-xs font-bold"
              >
                Return to Explore
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left border-collapse min-w-[640px]">
                <thead>
                  <tr className="bg-[#FAF7F2] border-b border-slate-200">
                    <th className="p-3.5 sm:p-4 text-xs font-bold text-slate-muted w-40 sm:w-48 uppercase tracking-wider">
                      Attribute
                    </th>
                    {selectedTbis.map((tbi) => {
                      const display = getTbiDisplayData(tbi);
                      return (
                        <th key={tbi.id} className="p-3.5 sm:p-4 text-left border-l border-slate-200">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="font-extrabold text-sm text-[#5E0B15] leading-snug">
                                {display.universityName}
                              </div>
                              <div className="text-xs font-semibold text-[#90323D] mt-0.5 leading-snug">
                                {display.incubatorName}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => onRemove(tbi.id)}
                              className="text-slate-400 hover:text-status-error p-1 rounded hover:bg-red-50 transition-colors cursor-pointer shrink-0"
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
                <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                  
                  {/* 1. University */}
                  <tr className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3.5 sm:p-4 font-bold text-slate-600 bg-slate-50/50">
                      <div className="flex items-center space-x-1.5">
                        <University className="w-4 h-4 text-[#90323D] shrink-0" />
                        <span>University</span>
                      </div>
                    </td>
                    {selectedTbis.map((tbi) => {
                      const display = getTbiDisplayData(tbi);
                      return (
                        <td key={tbi.id} className="p-3.5 sm:p-4 font-medium text-slate-800 border-l border-slate-100">
                          {display.universityName}
                        </td>
                      );
                    })}
                  </tr>

                  {/* 2. City */}
                  <tr className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3.5 sm:p-4 font-bold text-slate-600 bg-slate-50/50">
                      <div className="flex items-center space-x-1.5">
                        <MapPin className="w-4 h-4 text-[#90323D] shrink-0" />
                        <span>City</span>
                      </div>
                    </td>
                    {selectedTbis.map((tbi) => {
                      const display = getTbiDisplayData(tbi);
                      return (
                        <td key={tbi.id} className="p-3.5 sm:p-4 text-slate-700 border-l border-slate-100 font-medium">
                          {display.city || '—'}
                        </td>
                      );
                    })}
                  </tr>

                  {/* 3. University Type */}
                  <tr className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3.5 sm:p-4 font-bold text-slate-600 bg-slate-50/50">
                      <div className="flex items-center space-x-1.5">
                        <Building2 className="w-4 h-4 text-[#90323D] shrink-0" />
                        <span>University Type</span>
                      </div>
                    </td>
                    {selectedTbis.map((tbi) => {
                      // Only existing dataset field value, no fake invention
                      const val = tbi?.universityType && !tbi.universityType.includes('@') ? tbi.universityType.trim() : null;
                      return (
                        <td key={tbi.id} className="p-3.5 sm:p-4 text-slate-700 border-l border-slate-100">
                          {val ? (
                            <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#FAF7F2] border border-[#D9CAB3] text-xs font-semibold text-[#5E0B15]">
                              {val}
                            </span>
                          ) : (
                            <span className="text-slate-400 italic">Not specified</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>

                  {/* 4. Incubator / TBI Name */}
                  <tr className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3.5 sm:p-4 font-bold text-slate-600 bg-slate-50/50">
                      <div className="flex items-center space-x-1.5">
                        <Rocket className="w-4 h-4 text-[#90323D] shrink-0" />
                        <span>Incubator / TBI</span>
                      </div>
                    </td>
                    {selectedTbis.map((tbi) => {
                      const display = getTbiDisplayData(tbi);
                      return (
                        <td key={tbi.id} className="p-3.5 sm:p-4 font-medium text-slate-800 border-l border-slate-100">
                          {display.incubatorName}
                        </td>
                      );
                    })}
                  </tr>

                  {/* 5. Incubator Type */}
                  <tr className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3.5 sm:p-4 font-bold text-slate-600 bg-slate-50/50">
                      <div className="flex items-center space-x-1.5">
                        <Layers className="w-4 h-4 text-[#90323D] shrink-0" />
                        <span>Incubator Type</span>
                      </div>
                    </td>
                    {selectedTbis.map((tbi) => {
                      const display = getTbiDisplayData(tbi);
                      return (
                        <td key={tbi.id} className="p-3.5 sm:p-4 text-slate-700 border-l border-slate-100">
                          {display.incubatorType ? (
                            <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#D9CAB3]/40 border border-[#8C7A6B]/30 text-xs font-semibold text-[#5E0B15]">
                              {display.incubatorType}
                            </span>
                          ) : (
                            <span className="text-slate-400 italic">Not specified</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>

                  {/* 6. Official Email */}
                  <tr className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3.5 sm:p-4 font-bold text-slate-600 bg-slate-50/50">
                      <div className="flex items-center space-x-1.5">
                        <Mail className="w-4 h-4 text-[#90323D] shrink-0" />
                        <span>Official Email</span>
                      </div>
                    </td>
                    {selectedTbis.map((tbi) => {
                      const display = getTbiDisplayData(tbi);
                      return (
                        <td key={tbi.id} className="p-3.5 sm:p-4 text-slate-700 border-l border-slate-100">
                          {display.email ? (
                            <a
                              href={`mailto:${display.email}`}
                              className="text-[#90323D] hover:underline font-medium break-all"
                            >
                              {display.email}
                            </a>
                          ) : (
                            <span className="text-slate-400 italic">Not available</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>

                  {/* 7. Website */}
                  <tr className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3.5 sm:p-4 font-bold text-slate-600 bg-slate-50/50">
                      <div className="flex items-center space-x-1.5">
                        <Globe className="w-4 h-4 text-[#90323D] shrink-0" />
                        <span>Website</span>
                      </div>
                    </td>
                    {selectedTbis.map((tbi) => {
                      const hasWebsite = tbi?.hasValidWebsite && tbi?.websiteUrl;
                      return (
                        <td key={tbi.id} className="p-3.5 sm:p-4 text-slate-700 border-l border-slate-100">
                          {hasWebsite ? (
                            <a
                              href={tbi.websiteUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center space-x-1 text-[#5E0B15] hover:underline font-semibold"
                            >
                              <span className="truncate max-w-[180px]">{tbi.website}</span>
                              <ArrowRight className="w-3 h-3 shrink-0" />
                            </a>
                          ) : (
                            <span className="text-slate-400 italic">Not available</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>

                  {/* 8. Status */}
                  <tr className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3.5 sm:p-4 font-bold text-slate-600 bg-slate-50/50">
                      <div className="flex items-center space-x-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#5E0B15]" />
                        <span>Status</span>
                      </div>
                    </td>
                    {selectedTbis.map((tbi) => {
                      const display = getTbiDisplayData(tbi);
                      return (
                        <td key={tbi.id} className="p-3.5 sm:p-4 border-l border-slate-100">
                          <StatusBadge status={display.status} />
                        </td>
                      );
                    })}
                  </tr>

                  {/* Actions / View Details row */}
                  <tr className="bg-slate-50/60">
                    <td className="p-3.5 sm:p-4 font-bold text-slate-600">Action</td>
                    {selectedTbis.map((tbi) => (
                      <td key={tbi.id} className="p-3.5 sm:p-4 border-l border-slate-100">
                        <Link
                          to={`/tbi/${tbi.id}`}
                          onClick={onClose}
                          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#5E0B15] hover:bg-[#490911] text-white text-xs font-semibold shadow-xs hover:shadow transition-all"
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
        <div className="px-5 py-3 sm:px-6 bg-[#FAF7F2] border-t border-[#D9CAB3] flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-muted">
            Displaying only actual fields stored in the TBI database.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-surface border border-slate-border text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
