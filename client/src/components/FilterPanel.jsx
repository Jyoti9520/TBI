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
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-md transition-opacity">
      <div className="w-full max-w-md bg-[#131318] text-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200 border-l border-white/10">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#0e0e12]">
          <div className="flex items-center space-x-2 text-white">
            <Filter className="w-5 h-5 text-primary" />
            <h3 className="font-bold font-heading text-lg">Filter TBIs</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Status */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-muted mb-2">
              Verification Status
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['', 'Verified', 'Under Verification'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => handleChange('status', st)}
                  className={`py-2 px-3 text-xs font-medium rounded-lg border text-center transition-all ${
                    localFilters.status === st
                      ? 'bg-primary text-white border-primary shadow-xs font-semibold'
                      : 'bg-white text-slate-body border-border hover:bg-slate-hover'
                  }`}
                >
                  {st === '' ? 'All Status' : st}
                </button>
              ))}
            </div>
          </div>

          {/* City */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-muted mb-2">
              City
            </label>
            <input
              type="text"
              value={localFilters.city || ''}
              onChange={(e) => handleChange('city', e.target.value)}
              placeholder="e.g. Mohali, Chennai, Bengaluru..."
              className="w-full px-3.5 py-2 bg-white border border-border rounded-lg text-sm text-dark placeholder:text-slate-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
            {options.cities.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {options.cities.slice(0, 6).map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => handleChange('city', c.name)}
                    className="text-[11px] px-2.5 py-1 rounded-md bg-slate-bg text-slate-body hover:bg-primary-light hover:text-primary transition-colors font-medium border border-border"
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* University Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-muted mb-2">
              University
            </label>
            <input
              type="text"
              value={localFilters.university || ''}
              onChange={(e) => handleChange('university', e.target.value)}
              placeholder="e.g. Chandigarh University..."
              className="w-full px-3.5 py-2 bg-white border border-border rounded-lg text-sm text-dark placeholder:text-slate-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          {/* Incubator Type */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-muted mb-2">
              Incubator Type
            </label>
            <select
              value={localFilters.incubatorType || ''}
              onChange={(e) => handleChange('incubatorType', e.target.value)}
              className="w-full px-3.5 py-2 bg-white border border-border rounded-lg text-sm text-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
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
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-muted mb-2">
              University Type
            </label>
            <select
              value={localFilters.universityType || ''}
              onChange={(e) => handleChange('universityType', e.target.value)}
              className="w-full px-3.5 py-2 bg-white border border-border rounded-lg text-sm text-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
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
        <div className="p-4 border-t border-border bg-slate-bg flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-lg border border-border text-xs font-semibold bg-white text-slate-body hover:bg-slate-hover transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>

          <button
            type="button"
            onClick={handleApply}
            className="flex-1 px-5 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-lg shadow-xs transition-colors text-center"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};
