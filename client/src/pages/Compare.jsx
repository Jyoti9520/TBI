import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  GitCompare,
  Compass,
  X,
  Trash2,
  ArrowRight,
  University,
  Rocket,
  MapPin,
  Building2,
  Layers,
  Mail,
  Globe,
  ExternalLink
} from 'lucide-react';
import { getCompareTbis, removeCompareTbi, clearCompareTbis } from '../utils/compareStorage';
import { getTbiDisplayData } from '../utils/tbiMapping';
import { StatusBadge } from '../components/StatusBadge';

export const Compare = () => {
  const navigate = useNavigate();
  const [selectedTbis, setSelectedTbis] = useState(() => getCompareTbis());

  useEffect(() => {
    const handleUpdate = (e) => {
      setSelectedTbis(e.detail || getCompareTbis());
    };
    window.addEventListener('compare-tbis-updated', handleUpdate);
    return () => window.removeEventListener('compare-tbis-updated', handleUpdate);
  }, []);

  const handleRemove = (tbiId) => {
    const updated = removeCompareTbi(tbiId);
    setSelectedTbis(updated);
  };

  const handleClearAll = () => {
    clearCompareTbis();
    setSelectedTbis([]);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#7A0B1A] flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#D9CAB3] flex items-center justify-center shrink-0 shadow-xs transition-transform duration-200 hover:scale-105">
              <GitCompare className="w-5 h-5 text-[#7A0B1A]" />
            </div>
            <span>Compare TBIs</span>
          </h1>
          <p className="text-sm text-[#647C98] mt-1">
            Compare incubation centres, universities, credentials, and verification status side-by-side.
          </p>
        </div>

        {selectedTbis.length > 0 && (
          <div className="flex items-center space-x-3 shrink-0">
            <button
              type="button"
              onClick={handleClearAll}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-[#647C98] hover:text-status-error hover:bg-red-50 border border-slate-200 transition-all cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
            <Link
              to="/explore"
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[#FAF7F2] border border-[#D9CAB3] hover:border-[#7A0B1A] text-[#7A0B1A] text-xs font-bold transition-all shadow-subtle hover:bg-white cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Explore More TBIs</span>
            </Link>
          </div>
        )}
      </div>

      {/* Empty State or Less than 2 items State */}
      {selectedTbis.length === 0 ? (
        <div className="text-center py-16 px-4 bg-surface border border-dashed border-[#D9CAB3] rounded-2xl max-w-lg mx-auto my-8 shadow-card">
          <div className="w-14 h-14 rounded-2xl bg-[#FAF7F2] border border-[#D9CAB3] flex items-center justify-center mx-auto mb-4 text-[#7A0B1A] shadow-xs">
            <GitCompare className="w-7 h-7" />
          </div>
          <h2 className="text-lg font-bold text-[#243447] mb-1.5">Compare TBIs</h2>
          <p className="text-sm text-[#647C98] mb-6 max-w-sm mx-auto">
            Select at least 2 TBIs from Explore to compare them side-by-side.
          </p>
          <Link
            to="/explore"
            className="inline-flex items-center space-x-2 px-5 py-2.5 bg-[#7A0B1A] text-white text-xs font-bold rounded-xl shadow-sm hover:bg-[#5B0712] active:scale-[0.98] transition-all"
          >
            <span>Explore TBIs →</span>
          </Link>
        </div>
      ) : selectedTbis.length === 1 ? (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#D9CAB3] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm">
            <div className="flex items-center space-x-2 text-[#7A0B1A] font-semibold">
              <span>⚠️</span>
              <span>You have selected 1 TBI. Select at least 1 more TBI to enable side-by-side comparison.</span>
            </div>
            <Link
              to="/explore"
              className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-lg bg-[#7A0B1A] text-white text-xs font-bold hover:bg-[#5B0712] transition-colors shrink-0"
            >
              <span>Explore TBIs →</span>
            </Link>
          </div>

          {/* Single TBI Preview Card */}
          <div className="max-w-md mx-auto bg-surface border border-slate-border rounded-xl p-5 shadow-card">
            {(() => {
              const display = getTbiDisplayData(selectedTbis[0]);
              return (
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <StatusBadge status={display.status} size="sm" />
                      <h3 className="font-bold text-base text-[#243447] mt-2">{display.universityName}</h3>
                      <p className="text-xs font-semibold text-[#7A0B1A] mt-0.5">{display.incubatorName}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemove(selectedTbis[0].id)}
                      className="text-slate-400 hover:text-status-error p-1 rounded hover:bg-red-50 transition-colors"
                      title="Remove"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-[#647C98]">
                    <span>{display.city}</span>
                    <Link
                      to={`/tbi/${selectedTbis[0].id}`}
                      className="font-bold text-[#7A0B1A] hover:underline"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      ) : (
        /* Comparison Table View (Responsive with horizontal scrolling ONLY inside table container) */
        <div className="bg-surface border border-slate-border rounded-2xl shadow-card overflow-hidden">
          <div className="p-4 sm:p-5 bg-gradient-to-r from-[#FAF7F2] to-white border-b border-slate-border flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#647C98]">Comparing</span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#7A0B1A] text-white text-xs font-bold">
                {selectedTbis.length} of 3 TBIs
              </span>
            </div>
            <span className="text-xs text-[#647C98] hidden sm:inline-block">
              Scroll horizontally if table extends beyond screen
            </span>
          </div>

          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse min-w-[640px] sm:min-w-[720px]">
              <thead>
                <tr className="bg-[#FAF7F2]/80 border-b border-slate-border">
                  <th className="p-4 text-xs font-bold text-[#647C98] w-44 sm:w-52 uppercase tracking-wider">
                    Feature
                  </th>
                  {selectedTbis.map((tbi) => {
                    const display = getTbiDisplayData(tbi);
                    return (
                      <th
                        key={tbi.id}
                        className="p-4 text-left border-l border-slate-border bg-white/60 min-w-[220px]"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="font-extrabold text-sm sm:text-base text-[#7A0B1A] leading-snug">
                              {display.universityName}
                            </div>
                            <div className="text-xs font-semibold text-[#647C98] mt-1 leading-snug">
                              {display.incubatorName}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemove(tbi.id)}
                            className="text-slate-400 hover:text-status-error p-1 rounded-lg hover:bg-red-50 transition-colors cursor-pointer shrink-0"
                            title="Remove from comparison"
                            aria-label={`Remove ${display.universityName}`}
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
                <tr className="hover:bg-slate-50/60 transition-colors">
                  <td className="p-4 font-bold text-slate-600 bg-slate-50/40">
                    <div className="flex items-center space-x-2">
                      <University className="w-4 h-4 text-[#7A0B1A] shrink-0" />
                      <span>University</span>
                    </div>
                  </td>
                  {selectedTbis.map((tbi) => {
                    const display = getTbiDisplayData(tbi);
                    return (
                      <td key={tbi.id} className="p-4 font-medium text-slate-800 border-l border-slate-100">
                        {display.universityName || 'Not available'}
                      </td>
                    );
                  })}
                </tr>

                {/* 2. Incubator / TBI Name */}
                <tr className="hover:bg-slate-50/60 transition-colors">
                  <td className="p-4 font-bold text-slate-600 bg-slate-50/40">
                    <div className="flex items-center space-x-2">
                      <Rocket className="w-4 h-4 text-[#7A0B1A] shrink-0" />
                      <span>Incubator / TBI Name</span>
                    </div>
                  </td>
                  {selectedTbis.map((tbi) => {
                    const display = getTbiDisplayData(tbi);
                    return (
                      <td key={tbi.id} className="p-4 font-medium text-slate-800 border-l border-slate-100">
                        {display.incubatorName || 'Not available'}
                      </td>
                    );
                  })}
                </tr>

                {/* 3. City */}
                <tr className="hover:bg-slate-50/60 transition-colors">
                  <td className="p-4 font-bold text-slate-600 bg-slate-50/40">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-[#7A0B1A] shrink-0" />
                      <span>City</span>
                    </div>
                  </td>
                  {selectedTbis.map((tbi) => {
                    const display = getTbiDisplayData(tbi);
                    return (
                      <td key={tbi.id} className="p-4 text-slate-700 border-l border-slate-100 font-medium">
                        {display.city || 'Not available'}
                      </td>
                    );
                  })}
                </tr>

                {/* 4. University Type */}
                <tr className="hover:bg-slate-50/60 transition-colors">
                  <td className="p-4 font-bold text-slate-600 bg-slate-50/40">
                    <div className="flex items-center space-x-2">
                      <Building2 className="w-4 h-4 text-[#7A0B1A] shrink-0" />
                      <span>University Type</span>
                    </div>
                  </td>
                  {selectedTbis.map((tbi) => {
                    const val = tbi?.universityType && !tbi.universityType.includes('@') ? tbi.universityType.trim() : null;
                    return (
                      <td key={tbi.id} className="p-4 text-slate-700 border-l border-slate-100">
                        {val ? (
                          <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#FAF7F2] border border-[#D9CAB3] text-xs font-semibold text-[#7A0B1A]">
                            {val}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">Not available</span>
                        )}
                      </td>
                    );
                  })}
                </tr>

                {/* 5. Incubator Type */}
                <tr className="hover:bg-slate-50/60 transition-colors">
                  <td className="p-4 font-bold text-slate-600 bg-slate-50/40">
                    <div className="flex items-center space-x-2">
                      <Layers className="w-4 h-4 text-[#7A0B1A] shrink-0" />
                      <span>Incubator Type</span>
                    </div>
                  </td>
                  {selectedTbis.map((tbi) => {
                    const display = getTbiDisplayData(tbi);
                    return (
                      <td key={tbi.id} className="p-4 text-slate-700 border-l border-slate-100">
                        {display.incubatorType ? (
                          <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#FAF7F2] border border-[#D9CAB3] text-xs font-semibold text-[#7A0B1A]">
                            {display.incubatorType}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">Not available</span>
                        )}
                      </td>
                    );
                  })}
                </tr>

                {/* 6. Official Email ID */}
                <tr className="hover:bg-slate-50/60 transition-colors">
                  <td className="p-4 font-bold text-slate-600 bg-slate-50/40">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-[#7A0B1A] shrink-0" />
                      <span>Official Email ID</span>
                    </div>
                  </td>
                  {selectedTbis.map((tbi) => {
                    const display = getTbiDisplayData(tbi);
                    return (
                      <td key={tbi.id} className="p-4 text-slate-700 border-l border-slate-100">
                        {display.email ? (
                          <a
                            href={`mailto:${display.email}`}
                            className="text-[#7A0B1A] hover:underline font-medium break-all"
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
                <tr className="hover:bg-slate-50/60 transition-colors">
                  <td className="p-4 font-bold text-slate-600 bg-slate-50/40">
                    <div className="flex items-center space-x-2">
                      <Globe className="w-4 h-4 text-[#7A0B1A] shrink-0" />
                      <span>Website</span>
                    </div>
                  </td>
                  {selectedTbis.map((tbi) => {
                    const display = getTbiDisplayData(tbi);
                    return (
                      <td key={tbi.id} className="p-4 text-slate-700 border-l border-slate-100">
                        {display.hasValidWebsite && display.websiteUrl ? (
                          <a
                            href={display.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-1.5 text-[#7A0B1A] hover:text-[#5B0712] hover:underline font-semibold"
                            title={`Open ${display.websiteUrl}`}
                          >
                            <span>Visit Website</span>
                            <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                          </a>
                        ) : (
                          <span className="text-slate-400 italic text-xs">Not available</span>
                        )}
                      </td>
                    );
                  })}
                </tr>

                {/* 8. Status */}
                <tr className="hover:bg-slate-50/60 transition-colors">
                  <td className="p-4 font-bold text-slate-600 bg-slate-50/40">
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-[#7A0B1A]" />
                      <span>Status</span>
                    </div>
                  </td>
                  {selectedTbis.map((tbi) => {
                    const display = getTbiDisplayData(tbi);
                    return (
                      <td key={tbi.id} className="p-4 border-l border-slate-100">
                        <StatusBadge status={display.status} />
                      </td>
                    );
                  })}
                </tr>

                {/* Action Links */}
                <tr className="bg-[#FAF7F2]/40">
                  <td className="p-4 font-bold text-slate-600 bg-slate-50/60">
                    <span>Actions</span>
                  </td>
                  {selectedTbis.map((tbi) => (
                    <td key={tbi.id} className="p-4 border-l border-slate-100">
                      <div className="flex items-center space-x-2">
                        <Link
                          to={`/tbi/${tbi.id}`}
                          className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-[#7A0B1A] hover:bg-[#5B0712] text-white text-xs font-bold shadow-2xs transition-colors"
                        >
                          <span>View Details</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleRemove(tbi.id)}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-status-error hover:bg-red-50 text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
