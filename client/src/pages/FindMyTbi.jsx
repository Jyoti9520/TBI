import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  MapPin,
  Building2,
  CheckCircle2,
  Compass,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Check,
  Search,
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
  GraduationCap
} from 'lucide-react';
import { tbiService } from '../services/tbiService';
import { TbiGrid } from '../components/TbiGrid';
import { CompareBar } from '../components/CompareBar';
import { showToast } from '../components/Toast';
import {
  getCompareTbis,
  toggleCompareTbi,
  removeCompareTbi,
  clearCompareTbis
} from '../utils/compareStorage';

export const FindMyTbi = () => {
  const navigate = useNavigate();

  // Wizard State
  const [step, setStep] = useState(1); // 1, 2, 3, or 'results'
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [options, setOptions] = useState({
    cities: [],
    incubatorTypes: [],
    universityTypes: []
  });

  // Selected Criteria State
  const [selectedCity, setSelectedCity] = useState(''); // '' means "Any city"
  const [citySearch, setCitySearch] = useState('');
  const [selectedIncubatorType, setSelectedIncubatorType] = useState(''); // '' means "Any type"
  const [selectedUniversityType, setSelectedUniversityType] = useState(''); // '' means "Any"
  const [selectedStatus, setSelectedStatus] = useState(''); // '' means "Any"

  // Search Results State
  const [results, setResults] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loadingResults, setLoadingResults] = useState(false);

  // Compare TBIs Integration
  const [selectedCompareTbis, setSelectedCompareTbis] = useState(() => getCompareTbis());

  useEffect(() => {
    const handleCompareUpdate = (e) => {
      setSelectedCompareTbis(e.detail || getCompareTbis());
    };
    window.addEventListener('compare-tbis-updated', handleCompareUpdate);
    return () => window.removeEventListener('compare-tbis-updated', handleCompareUpdate);
  }, []);

  const handleToggleCompare = (tbi) => {
    const result = toggleCompareTbi(tbi);
    if (result.action === 'limit_reached') {
      showToast('You can compare up to 3 TBIs.', 'warning');
    }
  };

  const handleRemoveCompare = (tbiId) => {
    removeCompareTbi(tbiId);
  };

  const handleClearAllCompare = () => {
    clearCompareTbis();
  };

  // Load actual categories and cities from database
  useEffect(() => {
    setLoadingOptions(true);
    tbiService
      .getCategories({ allCities: 'true' })
      .then((res) => {
        if (res.success && res.data) {
          setOptions({
            cities: res.data.cities || [],
            incubatorTypes: res.data.incubatorTypes || [],
            universityTypes: res.data.universityTypes || []
          });
        }
      })
      .catch((err) => {
        console.error('Failed to load discovery options:', err);
      })
      .finally(() => setLoadingOptions(false));
  }, []);

  // Filter cities by search term
  const filteredCities = options.cities.filter((c) =>
    c.name.toLowerCase().includes(citySearch.trim().toLowerCase())
  );

  // Common quick-select cities from the dataset
  const popularCities = options.cities.slice(0, 10);

  // Perform search based ONLY on selected fields
  const handleFindTbis = async () => {
    setLoadingResults(true);
    setStep('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      const params = {
        limit: 100 // Discover all matches for guided discovery
      };
      if (selectedCity) params.city = selectedCity;
      if (selectedIncubatorType) params.incubatorType = selectedIncubatorType;
      if (selectedUniversityType) params.universityType = selectedUniversityType;
      if (selectedStatus) params.status = selectedStatus;

      const res = await tbiService.getTbis(params);
      if (res.success) {
        setResults(res.data || []);
        setTotalCount(res.total || 0);
      } else {
        setResults([]);
        setTotalCount(0);
      }
    } catch (err) {
      console.error('Guided discovery query error:', err);
      setResults([]);
      setTotalCount(0);
    } finally {
      setLoadingResults(false);
    }
  };

  const handleReset = () => {
    setSelectedCity('');
    setCitySearch('');
    setSelectedIncubatorType('');
    setSelectedUniversityType('');
    setSelectedStatus('');
    setResults([]);
    setTotalCount(0);
    setStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Human-readable labels for selected criteria
  const activeCriteriaList = [];
  if (selectedCity) activeCriteriaList.push(`City: ${selectedCity}`);
  else activeCriteriaList.push('City: Any');

  if (selectedIncubatorType) activeCriteriaList.push(`Type: ${selectedIncubatorType}`);
  else activeCriteriaList.push('Type: Any');

  if (selectedUniversityType) activeCriteriaList.push(`Institution: ${selectedUniversityType}`);
  if (selectedStatus) activeCriteriaList.push(`Status: ${selectedStatus}`);

  return (
    <div
      className={`space-y-6 max-w-5xl mx-auto transition-all ${
        selectedCompareTbis.length > 0 ? 'pb-24 sm:pb-20' : 'pb-12'
      }`}
    >
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#7A0B1A] flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#D9CAB3] flex items-center justify-center shrink-0 shadow-xs transition-transform duration-200 hover:scale-105">
              <Sparkles className="w-5 h-5 text-[#7A0B1A]" />
            </div>
            <span>Find Your TBI</span>
          </h1>
          <p className="text-sm text-[#647C98] mt-1">
            Answer a few questions and discover incubators that match your requirements.
          </p>
        </div>

        {step !== 1 && (
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-[#647C98] hover:text-[#7A0B1A] hover:bg-[#FAF7F2] border border-slate-200 transition-all cursor-pointer self-start sm:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Start Over</span>
          </button>
        )}
      </div>

      {/* Progress Indicator (when on steps 1, 2, 3) */}
      {step !== 'results' && (
        <div className="bg-surface border border-slate-border rounded-2xl p-5 shadow-card">
          <div className="flex items-center justify-between mb-3 text-xs">
            <div className="flex items-center space-x-2 font-bold text-[#7A0B1A]">
              <span className="w-6 h-6 rounded-full bg-[#FAF7F2] border border-[#D9CAB3] flex items-center justify-center text-[11px] text-[#7A0B1A] font-extrabold">
                {step}
              </span>
              <span>Step {step} of 3</span>
            </div>
            <span className="text-[#647C98] font-medium hidden sm:inline">
              {step === 1 && 'Location Preference'}
              {step === 2 && 'Incubator Program & Type'}
              {step === 3 && 'Institution & Verification'}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-[#FAF7F2] h-2.5 rounded-full overflow-hidden border border-[#D9CAB3]/60">
            <div
              className="bg-gradient-to-r from-[#7A0B1A] to-[#5B0712] h-full transition-all duration-300 ease-out rounded-full"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* STEP 1: LOCATION                                               */}
      {/* ============================================================== */}
      {step === 1 && (
        <div className="bg-surface border border-slate-border rounded-2xl p-6 sm:p-8 shadow-card space-y-6">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-[#FAF7F2] border border-[#D9CAB3] text-[#7A0B1A] text-xs font-bold mb-2">
              <MapPin className="w-3.5 h-3.5" />
              <span>Location</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#243447]">
              Where are you looking?
            </h2>
            <p className="text-sm text-[#647C98]">
              Select a specific city or choose any city across India.
            </p>
          </div>

          {/* "Any city" option card */}
          <button
            type="button"
            onClick={() => setSelectedCity('')}
            className={`w-full text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-between ${
              selectedCity === ''
                ? 'bg-[#FAF7F2] border-[#7A0B1A] ring-2 ring-[#7A0B1A]/20 shadow-xs'
                : 'bg-white border-slate-border hover:border-[#D9CAB3] hover:bg-[#FAF7F2]/40'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                  selectedCity === ''
                    ? 'bg-[#7A0B1A] text-white'
                    : 'bg-[#FAF7F2] text-[#647C98] border border-[#D9CAB3]'
                }`}
              >
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-[#243447] text-sm sm:text-base">
                  Any city (Pan-India)
                </p>
                <p className="text-xs text-[#647C98]">
                  Discover TBIs across all states and union territories.
                </p>
              </div>
            </div>
            <div
              className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                selectedCity === ''
                  ? 'border-[#7A0B1A] bg-[#7A0B1A] text-white'
                  : 'border-slate-300 bg-white'
              }`}
            >
              {selectedCity === '' && <Check className="w-3 h-3 stroke-[3]" />}
            </div>
          </button>

          {/* City Search & Select */}
          <div className="space-y-3 pt-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#647C98]">
              Or choose a specific city ({options.cities.length} available)
            </label>

            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#647C98]" />
              <input
                type="text"
                value={citySearch}
                onChange={(e) => setCitySearch(e.target.value)}
                placeholder="Type to filter cities (e.g. Mohali, Chennai, Bengaluru, Delhi)..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7A0B1A]/30 focus:border-[#7A0B1A] transition-colors"
              />
            </div>

            {/* Quick-pick popular cities */}
            {!citySearch && popularCities.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-semibold text-[#647C98]">Frequent hubs:</span>
                <div className="flex flex-wrap gap-2">
                  {popularCities.map((c) => {
                    const isSelected = selectedCity === c.name;
                    return (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => setSelectedCity(c.name)}
                        className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#7A0B1A] text-white border-[#7A0B1A] shadow-xs'
                            : 'bg-white text-[#243447] border-slate-border hover:border-[#D9CAB3] hover:bg-[#FAF7F2]'
                        }`}
                      >
                        {c.name} ({c.count})
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Filtered cities list */}
            {citySearch && (
              <div className="max-h-56 overflow-y-auto border border-slate-border rounded-xl divide-y divide-slate-100 bg-white">
                {filteredCities.length > 0 ? (
                  filteredCities.map((c) => {
                    const isSelected = selectedCity === c.name;
                    return (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => setSelectedCity(c.name)}
                        className={`w-full text-left px-4 py-2.5 text-xs sm:text-sm flex items-center justify-between hover:bg-[#FAF7F2] transition-colors cursor-pointer ${
                          isSelected ? 'bg-[#FAF7F2] font-bold text-[#7A0B1A]' : 'text-[#243447]'
                        }`}
                      >
                        <span className="flex items-center space-x-2">
                          <MapPin className="w-3.5 h-3.5 text-[#647C98]" />
                          <span>{c.name}</span>
                        </span>
                        <span className="text-xs text-[#647C98] font-normal">
                          {c.count} {c.count === 1 ? 'TBI' : 'TBIs'}
                        </span>
                      </button>
                    );
                  })
                ) : (
                  <div className="p-4 text-center text-xs text-[#647C98]">
                    No cities matching "{citySearch}". You can choose "Any city" or refine your query.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Selected city banner if chosen */}
          {selectedCity && (
            <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#D9CAB3] flex items-center justify-between text-xs text-[#7A0B1A] font-semibold">
              <span className="flex items-center space-x-1.5">
                <MapPin className="w-4 h-4" />
                <span>Selected: <strong>{selectedCity}</strong></span>
              </span>
              <button
                type="button"
                onClick={() => setSelectedCity('')}
                className="text-[#647C98] hover:text-[#7A0B1A] underline text-[11px]"
              >
                Clear to Any city
              </button>
            </div>
          )}

          {/* Action Button */}
          <div className="pt-4 flex justify-end">
            <button
              type="button"
              onClick={() => {
                setStep(2);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-[#7A0B1A] text-white text-sm font-bold shadow-sm hover:bg-[#5B0712] active:scale-[0.98] transition-all cursor-pointer"
            >
              <span>Continue →</span>
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* STEP 2: INCUBATOR TYPE                                         */}
      {/* ============================================================== */}
      {step === 2 && (
        <div className="bg-surface border border-slate-border rounded-2xl p-6 sm:p-8 shadow-card space-y-6">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-[#FAF7F2] border border-[#D9CAB3] text-[#7A0B1A] text-xs font-bold mb-2">
              <Building2 className="w-3.5 h-3.5" />
              <span>Incubator Model</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#243447]">
              What type of incubator are you looking for?
            </h2>
            <p className="text-sm text-[#647C98]">
              Select a specialized government/institutional model or browse any type.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* "Any type" option card */}
            <button
              type="button"
              onClick={() => setSelectedIncubatorType('')}
              className={`p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer flex items-center justify-between sm:col-span-2 ${
                selectedIncubatorType === ''
                  ? 'bg-[#FAF7F2] border-[#7A0B1A] ring-2 ring-[#7A0B1A]/20 shadow-xs'
                  : 'bg-white border-slate-border hover:border-[#D9CAB3] hover:bg-[#FAF7F2]/40'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                    selectedIncubatorType === ''
                      ? 'bg-[#7A0B1A] text-white'
                      : 'bg-[#FAF7F2] text-[#647C98] border border-[#D9CAB3]'
                  }`}
                >
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-[#243447] text-sm">Any type</p>
                  <p className="text-xs text-[#647C98]">
                    Include DST TBI, NIDHI-TBI, University, Section 8, and all models.
                  </p>
                </div>
              </div>
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                  selectedIncubatorType === ''
                    ? 'border-[#7A0B1A] bg-[#7A0B1A] text-white'
                    : 'border-slate-300 bg-white'
                }`}
              >
                {selectedIncubatorType === '' && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
            </button>

            {/* Real incubator types from database */}
            {options.incubatorTypes.map((typeObj) => {
              const isSelected = selectedIncubatorType === typeObj.name;
              return (
                <button
                  key={typeObj.name}
                  type="button"
                  onClick={() => setSelectedIncubatorType(typeObj.name)}
                  className={`p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#FAF7F2] border-[#7A0B1A] ring-2 ring-[#7A0B1A]/20 shadow-xs'
                      : 'bg-white border-slate-border hover:border-[#D9CAB3] hover:bg-[#FAF7F2]/40'
                  }`}
                >
                  <div className="pr-3">
                    <p className="font-bold text-[#243447] text-sm leading-tight">
                      {typeObj.name}
                    </p>
                    <p className="text-xs text-[#647C98] mt-1 font-medium">
                      {typeObj.count} registered {typeObj.count === 1 ? 'centre' : 'centres'}
                      {typeObj.verifiedCount > 0 && ` • ${typeObj.verifiedCount} verified`}
                    </p>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'border-[#7A0B1A] bg-[#7A0B1A] text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Navigation Buttons */}
          <div className="pt-4 flex items-center justify-between border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setStep(1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl border border-slate-border text-[#647C98] hover:text-[#243447] hover:bg-slate-50 text-sm font-semibold transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setStep(3);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-[#7A0B1A] text-white text-sm font-bold shadow-sm hover:bg-[#5B0712] active:scale-[0.98] transition-all cursor-pointer"
            >
              <span>Continue →</span>
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* STEP 3: UNIVERSITY TYPE & VERIFICATION STATUS                  */}
      {/* ============================================================== */}
      {step === 3 && (
        <div className="bg-surface border border-slate-border rounded-2xl p-6 sm:p-8 shadow-card space-y-8">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-[#FAF7F2] border border-[#D9CAB3] text-[#7A0B1A] text-xs font-bold mb-2">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Institution & Status</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#243447]">
              Specify Institution Type or Verification
            </h2>
            <p className="text-sm text-[#647C98]">
              Refine by host university classification or accreditation status.
            </p>
          </div>

          {/* Section A: University Type */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#647C98]">
              University Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Common dataset classifications */}
              {[
                { label: 'Any', value: '' },
                { label: 'Private', value: 'Private' },
                { label: 'State', value: 'State' },
                { label: 'Deemed', value: 'Deemed' }
              ].map((item) => {
                const isSelected = selectedUniversityType === item.value;
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => setSelectedUniversityType(item.value)}
                    className={`py-3 px-3 rounded-xl border text-center font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#7A0B1A] text-white border-[#7A0B1A] shadow-xs'
                        : 'bg-white text-[#243447] border-slate-border hover:border-[#D9CAB3] hover:bg-[#FAF7F2]'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
            {options.universityTypes.length > 0 && (
              <div className="pt-1">
                <span className="text-[11px] text-[#647C98] font-medium">
                  Other models in directory:
                </span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {options.universityTypes
                    .filter((u) => !['Private', 'State', 'Deemed'].includes(u.name))
                    .slice(0, 6)
                    .map((u) => {
                      const isSelected = selectedUniversityType === u.name;
                      return (
                        <button
                          key={u.name}
                          type="button"
                          onClick={() => setSelectedUniversityType(u.name)}
                          className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#7A0B1A] text-white border-[#7A0B1A]'
                              : 'bg-white text-[#647C98] border-slate-200 hover:text-[#7A0B1A] hover:bg-[#FAF7F2]'
                          }`}
                        >
                          {u.name} ({u.count})
                        </button>
                      );
                    })}
                </div>
              </div>
            )}
          </div>

          {/* Section B: Verification Status */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#647C98]">
              Verification Status
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { label: 'Any Status', value: '', desc: 'Show all directory records' },
                {
                  label: 'Verified',
                  value: 'Verified',
                  desc: 'Officially accredited ecosystems',
                  badge: 'green'
                },
                {
                  label: 'Under Verification',
                  value: 'Under Verification',
                  desc: 'Pending documentation review',
                  badge: 'amber'
                }
              ].map((st) => {
                const isSelected = selectedStatus === st.value;
                return (
                  <button
                    key={st.label}
                    type="button"
                    onClick={() => setSelectedStatus(st.value)}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#FAF7F2] border-[#7A0B1A] ring-2 ring-[#7A0B1A]/20 shadow-xs'
                        : 'bg-white border-slate-border hover:border-[#D9CAB3] hover:bg-[#FAF7F2]/40'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm text-[#243447]">{st.label}</span>
                        {isSelected && (
                          <div className="w-4 h-4 rounded-full bg-[#7A0B1A] text-white flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-[#647C98]">{st.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Criteria Summary Card */}
          <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#D9CAB3] space-y-2">
            <div className="text-xs font-bold text-[#7A0B1A] uppercase tracking-wider">
              Selected Discovery Filters
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs px-2.5 py-1 rounded-md bg-white border border-[#D9CAB3] text-[#243447] font-semibold">
                📍 City: {selectedCity || 'Any'}
              </span>
              <span className="text-xs px-2.5 py-1 rounded-md bg-white border border-[#D9CAB3] text-[#243447] font-semibold">
                🏢 Type: {selectedIncubatorType || 'Any'}
              </span>
              {selectedUniversityType && (
                <span className="text-xs px-2.5 py-1 rounded-md bg-white border border-[#D9CAB3] text-[#243447] font-semibold">
                  🎓 Institution: {selectedUniversityType}
                </span>
              )}
              {selectedStatus && (
                <span className="text-xs px-2.5 py-1 rounded-md bg-white border border-[#D9CAB3] text-[#243447] font-semibold">
                  ✓ Status: {selectedStatus}
                </span>
              )}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="pt-4 flex items-center justify-between border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setStep(2);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl border border-slate-border text-[#647C98] hover:text-[#243447] hover:bg-slate-50 text-sm font-semibold transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={handleFindTbis}
              className="inline-flex items-center space-x-2 px-7 py-3 rounded-xl bg-[#7A0B1A] text-white text-sm font-bold shadow-card hover:bg-[#5B0712] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Find My TBIs →</span>
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* RESULTS VIEW                                                   */}
      {/* ============================================================== */}
      {step === 'results' && (
        <div className="space-y-6">
          {/* Results Summary Header */}
          <div className="bg-surface border border-slate-border rounded-2xl p-5 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-xs text-[#647C98] mb-1">
                <span>Guided Discovery</span>
                <span>•</span>
                <span className="text-[#7A0B1A] font-bold">Filtered Results</span>
              </div>
              <h2 className="text-xl font-bold text-[#243447]">
                TBIs matching your selected criteria
              </h2>
              <p className="text-xs text-[#647C98] mt-0.5">
                {loadingResults
                  ? 'Searching directory...'
                  : `${totalCount} matching ${totalCount === 1 ? 'TBI' : 'TBIs'} found`}
              </p>
            </div>

            {/* Actions: Edit criteria or Start over */}
            <div className="flex items-center space-x-2 shrink-0">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-[#7A0B1A] bg-[#FAF7F2] border border-[#D9CAB3] hover:bg-white transition-all cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Adjust Criteria</span>
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-[#647C98] hover:text-[#7A0B1A] hover:bg-slate-50 border border-slate-200 transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Start Over</span>
              </button>
            </div>
          </div>

          {/* Active criteria pills */}
          <div className="flex flex-wrap items-center gap-2 px-1">
            <span className="text-xs font-semibold text-[#647C98]">Filters applied:</span>
            {selectedCity ? (
              <span className="text-xs px-2.5 py-1 rounded-full bg-[#FAF7F2] border border-[#D9CAB3] text-[#7A0B1A] font-medium flex items-center space-x-1">
                <MapPin className="w-3 h-3" />
                <span>City: {selectedCity}</span>
              </span>
            ) : (
              <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-[#647C98] font-medium">
                City: Any
              </span>
            )}

            {selectedIncubatorType ? (
              <span className="text-xs px-2.5 py-1 rounded-full bg-[#FAF7F2] border border-[#D9CAB3] text-[#7A0B1A] font-medium flex items-center space-x-1">
                <Building2 className="w-3 h-3" />
                <span>Type: {selectedIncubatorType}</span>
              </span>
            ) : (
              <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-[#647C98] font-medium">
                Type: Any
              </span>
            )}

            {selectedUniversityType && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-[#FAF7F2] border border-[#D9CAB3] text-[#7A0B1A] font-medium flex items-center space-x-1">
                <GraduationCap className="w-3 h-3" />
                <span>Institution: {selectedUniversityType}</span>
              </span>
            )}

            {selectedStatus && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-[#FAF7F2] border border-[#D9CAB3] text-[#7A0B1A] font-medium flex items-center space-x-1">
                <ShieldCheck className="w-3 h-3" />
                <span>Status: {selectedStatus}</span>
              </span>
            )}
          </div>

          {/* Results Grid or Empty State */}
          {!loadingResults && results.length === 0 ? (
            <div className="text-center py-16 px-4 bg-surface border border-dashed border-[#D9CAB3] rounded-2xl max-w-lg mx-auto my-8 shadow-card">
              <div className="w-14 h-14 rounded-2xl bg-[#FAF7F2] border border-[#D9CAB3] flex items-center justify-center mx-auto mb-4 text-[#7A0B1A] shadow-xs">
                <Compass className="w-7 h-7" />
              </div>
              <h2 className="text-lg font-bold text-[#243447] mb-1.5">
                No TBIs match these criteria.
              </h2>
              <p className="text-sm text-[#647C98] mb-6 max-w-sm mx-auto">
                Try selecting "Any city" or choosing a broader incubator type to discover available centres.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl border border-[#D9CAB3] bg-[#FAF7F2] text-[#7A0B1A] text-xs font-bold hover:bg-white transition-all cursor-pointer"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Try different filters</span>
                </button>
                <Link
                  to="/explore"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-2.5 bg-[#7A0B1A] text-white text-xs font-bold rounded-xl shadow-sm hover:bg-[#5B0712] transition-all"
                >
                  <span>Explore All TBIs →</span>
                </Link>
              </div>
            </div>
          ) : (
            <TbiGrid
              tbis={results}
              loading={loadingResults}
              onFavoriteToggle={() => {}}
              selectedCompareIds={selectedCompareTbis.map((t) => t.id)}
              onToggleCompare={handleToggleCompare}
            />
          )}
        </div>
      )}

      {/* Sticky Bottom Comparison Bar */}
      <CompareBar
        selectedTbis={selectedCompareTbis}
        onRemove={handleRemoveCompare}
        onClearAll={handleClearAllCompare}
        onCompare={() => navigate('/compare')}
      />
    </div>
  );
};
