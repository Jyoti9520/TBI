import React, { useState, useEffect } from 'react';
import { X, Filter, RotateCcw } from 'lucide-react';
import { tbiService } from '../services/tbiService';

export const FilterPanel = ({
  isOpen,
  onClose,
  filters = {},
  onApply,
  onReset
}) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const [options, setOptions] = useState({
    incubatorTypes: [],
    universityTypes: [],
    cities: []
  });
  const [loadingOptions, setLoadingOptions] = useState(false);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  useEffect(() => {
    if (isOpen && options.incubatorTypes.length === 0) {
      setLoadingOptions(true);
      tbiService
        .getCategories()
        .then((res) => {
          if (res.success && res.data) {
            setOptions({
              incubatorTypes: res.data.incubatorTypes || [],
              universityTypes: res.data.universityTypes || [],
              cities: res.data.cities || []
            });
          }
        })
        .catch(() => {})
        .finally(() => setLoadingOptions(false));
    }
  }, [isOpen]);

  const handleChange = (field, value) => {
    setLocalFilters((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleApply = () => {
    onApply(localFilters);
    onClose();
  };

  const handleReset = () => {
    const empty = {
      city: '',
      university: '',
      universityType: '',
      incubatorType: '',
      status: ''
    };
    setLocalFilters(empty);
    onReset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate/40 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-md bg-surface h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200 border-l border-slate-border">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-border flex items-center justify-between">
          <div className="flex items-center space-x-2 text-[#1B3650]">
            <Filter className="w-5 h-5 text-[#78A4CB]" />
            <h3 className="font-bold text-lg">Filter TBIs</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-muted hover:text-slate hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Status */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-muted mb-2">
              Verification Status
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['', 'Verified', 'Under Verification'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => handleChange('status', st)}
                  className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition-all ${
                    localFilters.status === st
                      ? 'bg-[#78A4CB] text-white border-[#5F8FB8] shadow-sm font-bold'
                      : 'bg-surface text-slate border-slate-border hover:bg-[#B4E1EB]/20'
                  }`}
                >
                  {st === '' ? 'All Status' : st}
                </button>
              ))}
            </div>
          </div>

          {/* City */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-muted mb-2">
              City
            </label>
            <input
              type="text"
              value={localFilters.city || ''}
              onChange={(e) => handleChange('city', e.target.value)}
              placeholder="e.g. Mohali, Chennai, Bengaluru..."
              className="w-full px-3.5 py-2 bg-surface border border-slate-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#78A4CB]/30 focus:border-[#78A4CB]"
            />
            {options.cities.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {options.cities.slice(0, 6).map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => handleChange('city', c.name)}
                    className="text-[11px] px-2 py-0.5 rounded bg-[#B4E1EB]/40 text-[#1B3650] hover:bg-[#78A4CB] hover:text-white transition-colors font-medium"
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* University Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-muted mb-2">
              University
            </label>
            <input
              type="text"
              value={localFilters.university || ''}
              onChange={(e) => handleChange('university', e.target.value)}
              placeholder="e.g. Chandigarh University..."
              className="w-full px-3.5 py-2 bg-surface border border-slate-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#78A4CB]/30 focus:border-[#78A4CB]"
            />
          </div>

          {/* Incubator Type */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-muted mb-2">
              Incubator Type
            </label>
            <select
              value={localFilters.incubatorType || ''}
              onChange={(e) => handleChange('incubatorType', e.target.value)}
              className="w-full px-3.5 py-2 bg-surface border border-slate-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#78A4CB]/30 focus:border-[#78A4CB]"
            >
              <option value="">All Incubator Types</option>
              {options.incubatorTypes.map((t) => (
                <option key={t.name} value={t.name}>
                  {t.name} ({t.count})
                </option>
              ))}
            </select>
          </div>

          {/* University Type */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-muted mb-2">
              University Type
            </label>
            <select
              value={localFilters.universityType || ''}
              onChange={(e) => handleChange('universityType', e.target.value)}
              className="w-full px-3.5 py-2 bg-surface border border-slate-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#78A4CB]/30 focus:border-[#78A4CB]"
            >
              <option value="">All University Types</option>
              {options.universityTypes.map((u) => (
                <option key={u.name} value={u.name}>
                  {u.name} ({u.count})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-border bg-slate-50 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-lg border border-[#F4DB6F] text-xs font-bold bg-[#F9E8A2]/60 text-[#4A3B02] hover:bg-[#F9E8A2] transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>

          <button
            type="button"
            onClick={handleApply}
            className="flex-1 px-5 py-2.5 bg-[#78A4CB] hover:bg-[#5F8FB8] text-white text-sm font-bold rounded-lg shadow-sm transition-colors text-center"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};
