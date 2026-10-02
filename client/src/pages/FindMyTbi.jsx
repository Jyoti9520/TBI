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
          <h1 className="text-2xl sm:text-3xl font-bold text-dark font-heading flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-primary-light border border-blue-100 flex items-center justify-center shrink-0 shadow-xs transition-transform duration-200 hover:scale-105">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <span>Find Your TBI</span>
          </h1>
          <p className="text-sm text-slate-muted mt-1">
            Answer a few questions and discover incubators that match your requirements.
          </p>
        </div>

        {step !== 1 && (
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-muted hover:text-dark hover:bg-slate-hover border border-border transition-all cursor-pointer self-start sm:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Start Over</span>
          </button>
        )}
      </div>

      {/* Progress Indicator (when on steps 1, 2, 3) */}
      {step !== 'results' && (
        <div className="bg-white border border-border rounded-xl p-5 shadow-card">
          <div className="flex items-center justify-between mb-3 text-xs">
            <div className="flex items-center space-x-2 font-bold text-primary">
              <span className="w-6 h-6 rounded-full bg-primary-light border border-blue-100 flex items-center justify-center text-[11px] text-primary font-bold">
                {step}
              </span>
              <span>Step {step} of 3</span>
            </div>
            <span className="text-slate-muted font-medium hidden sm:inline">
              {step === 1 && 'Location Preference'}
              {step === 2 && 'Incubator Program & Type'}
              {step === 3 && 'Institution & Verification'}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-border">
            <div
              className="bg-primary h-full transition-all duration-300 ease-out rounded-full"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* STEP 1: LOCATION                                               */}
      {/* ============================================================== */}
      {step === 1 && (
        <div className="bg-white border border-border rounded-xl p-6 sm:p-8 shadow-card space-y-6">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-primary-light border border-blue-100 text-primary text-xs font-semibold mb-2">
              <MapPin className="w-3.5 h-3.5" />
              <span>Location</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-dark font-heading">
              Where are you looking?
            </h2>
            <p className="text-sm text-slate-muted">
              Select a specific city or choose any city across India.
            </p>
          </div>

          {/* "Any city" option card */}
          <button
            type="button"
            onClick={() => setSelectedCity('')}
            className={`w-full text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-between ${
              selectedCity === ''
                ? 'bg-primary-light border-primary ring-2 ring-primary/20 shadow-xs'
                : 'bg-white border-border hover:border-slate-300 hover:bg-slate-hover'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                  selectedCity === ''
                    ? 'bg-primary text-white'
                    : 'bg-slate-bg text-slate-muted border border-border'
                }`}
              >
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-dark text-sm sm:text-base">
                  Any city (Pan-India)
                </p>
                <p className="text-xs text-slate-muted">
                  Discover TBIs across all states and union territories.
                </p>
              </div>
            </div>
            <div
              className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                selectedCity === ''
                  ? 'border-primary bg-primary text-white'
                  : 'border-slate-300 bg-white'
              }`}
            >
              {selectedCity === '' && <Check className="w-3 h-3 stroke-[3]" />}
            </div>
          </button>

          {/* City Search & Select */}
          <div className="space-y-3 pt-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-muted">
              Or choose a specific city ({options.cities.length} available)
            </label>

            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-muted" />
              <input
                type="text"
                value={citySearch}
                onChange={(e) => setCitySearch(e.target.value)}
                placeholder="Type to filter cities (e.g. Mohali, Chennai, Bengaluru, Delhi)..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>

            {/* Quick-pick popular cities */}
            {!citySearch && popularCities.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-semibold text-slate-muted">Frequent hubs:</span>
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
                            ? 'bg-primary text-white border-primary shadow-xs'
                            : 'bg-white text-slate-body border-border hover:border-slate-300 hover:bg-slate-hover'
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
              <div className="max-h-56 overflow-y-auto border border-border rounded-lg divide-y divide-border bg-white">
                {filteredCities.length > 0 ? (
                  filteredCities.map((c) => {
                    const isSelected = selectedCity === c.name;
                    return (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => setSelectedCity(c.name)}
                        className={`w-full text-left px-4 py-2.5 text-xs sm:text-sm flex items-center justify-between hover:bg-slate-hover transition-colors cursor-pointer ${
                          isSelected ? 'bg-primary-light font-bold text-primary' : 'text-slate-body'
                        }`}
                      >
                        <span className="flex items-center space-x-2">
                          <MapPin className="w-3.5 h-3.5 text-slate-muted" />
                          <span>{c.name}</span>
                        </span>
                        <span className="text-xs text-slate-muted font-normal">
                          {c.count} {c.count === 1 ? 'TBI' : 'TBIs'}
                        </span>
                      </button>
                    );
                  })
                ) : (
                  <div className="p-4 text-center text-xs text-slate-muted">
                    No cities matching "{citySearch}". You can choose "Any city" or refine your query.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Selected city banner if chosen */}
          {selectedCity && (
            <div className="p-3 rounded-lg bg-primary-light border border-blue-100 flex items-center justify-between text-xs text-primary font-semibold">
              <span className="flex items-center space-x-1.5">
                <MapPin className="w-4 h-4" />
                <span>Selected: <strong>{selectedCity}</strong></span>
              </span>
              <button
                type="button"
                onClick={() => setSelectedCity('')}
                className="text-slate-muted hover:text-primary underline text-[11px] cursor-pointer"
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
              className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold shadow-sm hover:bg-primary-hover active:scale-[0.98] transition-all cursor-pointer"
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
        <div className="bg-white border border-border rounded-xl p-6 sm:p-8 shadow-card space-y-6">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-primary-light border border-blue-100 text-primary text-xs font-semibold mb-2">
              <Building2 className="w-3.5 h-3.5" />
              <span>Incubator Model</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-dark font-heading">
              What type of incubator are you looking for?
            </h2>
            <p className="text-sm text-slate-muted">
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
                  ? 'bg-primary-light border-primary ring-2 ring-primary/20 shadow-xs'
                  : 'bg-white border-border hover:border-slate-300 hover:bg-slate-hover'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                    selectedIncubatorType === ''
                      ? 'bg-primary text-white'
                      : 'bg-slate-bg text-slate-muted border border-border'
                  }`}
                >
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-dark text-sm">Any type</p>
                  <p className="text-xs text-slate-muted">
                    Include DST TBI, NIDHI-TBI, University, Section 8, and all models.
                  </p>
                </div>
              </div>
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                  selectedIncubatorType === ''
                    ? 'border-primary bg-primary text-white'
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
                      ? 'bg-primary-light border-primary ring-2 ring-primary/20 shadow-xs'
                      : 'bg-white border-border hover:border-slate-300 hover:bg-slate-hover'
                  }`}
                >
                  <div className="pr-3">
                    <p className="font-bold text-dark text-sm leading-tight">
                      {typeObj.name}
                    </p>
                    <p className="text-xs text-slate-muted mt-1 font-medium">
                      {typeObj.count} registered {typeObj.count === 1 ? 'centre' : 'centres'}
                      {typeObj.verifiedCount > 0 && ` • ${typeObj.verifiedCount} verified`}
                    </p>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'border-primary bg-primary text-white'
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
          <div className="pt-4 flex items-center justify-between border-t border-border">
            <button
              type="button"
              onClick={() => {
                setStep(1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg border border-border text-slate-muted hover:text-dark hover:bg-slate-hover text-sm font-semibold transition-all cursor-pointer"
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
              className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold shadow-sm hover:bg-primary-hover active:scale-[0.98] transition-all cursor-pointer"
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
        <div className="bg-white border border-border rounded-xl p-6 sm:p-8 shadow-card space-y-8">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-primary-light border border-blue-100 text-primary text-xs font-semibold mb-2">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Institution & Status</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-dark font-heading">
              Specify Institution Type or Verification
            </h2>
            <p className="text-sm text-slate-muted">
              Refine by host university classification or accreditation status.
            </p>
          </div>

          {/* Section A: University Type */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-muted">
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
                    className={`py-3 px-3 rounded-lg border text-center font-semibold text-xs sm:text-sm transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-primary text-white border-primary shadow-xs'
                        : 'bg-white text-dark border-border hover:border-slate-300 hover:bg-slate-hover'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
            {options.universityTypes.length > 0 && (
              <div className="pt-1">
                <span className="text-[11px] text-slate-muted font-medium">
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
                          className={`text-[11px] px-2.5 py-1 rounded-md border font-medium transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-primary text-white border-primary'
                              : 'bg-white text-slate-muted border-border hover:text-primary hover:bg-slate-hover'
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
          <div className="space-y-3 pt-2 border-t border-border">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-muted">
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
                        ? 'bg-primary-light border-primary ring-2 ring-primary/20 shadow-xs'
                        : 'bg-white border-border hover:border-slate-300 hover:bg-slate-hover'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm text-dark">{st.label}</span>
                        {isSelected && (
                          <div className="w-4 h-4 rounded-full bg-primary text-white flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-slate-muted">{st.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Criteria Summary Card */}
          <div className="p-4 rounded-xl bg-slate-bg border border-border space-y-2">
            <div className="text-xs font-bold text-primary uppercase tracking-wider">
              Selected Discovery Filters
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs px-2.5 py-1 rounded-md bg-white border border-border text-dark font-semibold">
                📍 City: {selectedCity || 'Any'}
              </span>
              <span className="text-xs px-2.5 py-1 rounded-md bg-white border border-border text-dark font-semibold">
                🏢 Type: {selectedIncubatorType || 'Any'}
              </span>
              {selectedUniversityType && (
                <span className="text-xs px-2.5 py-1 rounded-md bg-white border border-border text-dark font-semibold">
                  🎓 Institution: {selectedUniversityType}
                </span>
              )}
              {selectedStatus && (
                <span className="text-xs px-2.5 py-1 rounded-md bg-white border border-border text-dark font-semibold">
                  ✓ Status: {selectedStatus}
                </span>
              )}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="pt-4 flex items-center justify-between border-t border-border">
            <button
              type="button"
              onClick={() => {
                setStep(2);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg border border-border text-slate-muted hover:text-dark hover:bg-slate-hover text-sm font-semibold transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={handleFindTbis}
              className="inline-flex items-center space-x-2 px-7 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold shadow-sm hover:bg-primary-hover active:scale-[0.98] transition-all cursor-pointer"
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
          <div className="bg-white border border-border rounded-xl p-5 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-xs text-slate-muted mb-1">
                <span>Guided Discovery</span>
                <span>•</span>
                <span className="text-primary font-bold">Filtered Results</span>
              </div>
              <h2 className="text-xl font-bold text-dark font-heading">
                TBIs matching your selected criteria
              </h2>
              <p className="text-xs text-slate-muted mt-0.5">
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
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-primary bg-primary-light border border-blue-100 hover:bg-blue-100 transition-all cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Adjust Criteria</span>
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-muted hover:text-dark hover:bg-slate-hover border border-border transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Start Over</span>
              </button>
            </div>
          </div>

          {/* Active criteria pills */}
          <div className="flex flex-wrap items-center gap-2 px-1">
            <span className="text-xs font-semibold text-slate-muted">Filters applied:</span>
            {selectedCity ? (
              <span className="text-xs px-2.5 py-1 rounded-full bg-primary-light border border-blue-100 text-primary font-medium flex items-center space-x-1">
                <MapPin className="w-3 h-3" />
                <span>City: {selectedCity}</span>
              </span>
            ) : (
              <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-muted font-medium">
                City: Any
              </span>
            )}

            {selectedIncubatorType ? (
              <span className="text-xs px-2.5 py-1 rounded-full bg-primary-light border border-blue-100 text-primary font-medium flex items-center space-x-1">
                <Building2 className="w-3 h-3" />
                <span>Type: {selectedIncubatorType}</span>
              </span>
            ) : (
              <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-muted font-medium">
                Type: Any
              </span>
            )}

            {selectedUniversityType && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-primary-light border border-blue-100 text-primary font-medium flex items-center space-x-1">
                <GraduationCap className="w-3 h-3" />
                <span>Institution: {selectedUniversityType}</span>
              </span>
            )}

            {selectedStatus && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-primary-light border border-blue-100 text-primary font-medium flex items-center space-x-1">
                <ShieldCheck className="w-3 h-3" />
                <span>Status: {selectedStatus}</span>
              </span>
            )}
          </div>

          {/* Results Grid or Empty State */}
          {!loadingResults && results.length === 0 ? (
            <div className="text-center py-16 px-4 bg-white border border-dashed border-border rounded-xl max-w-lg mx-auto my-8 shadow-card">
              <div className="w-14 h-14 rounded-xl bg-slate-bg border border-border flex items-center justify-center mx-auto mb-4 text-primary shadow-xs">
                <Compass className="w-7 h-7" />
              </div>
              <h2 className="text-lg font-bold text-dark mb-1.5 font-heading">
                No TBIs match these criteria.
              </h2>
              <p className="text-sm text-slate-muted mb-6 max-w-sm mx-auto">
                Try selecting "Any city" or choosing a broader incubator type to discover available centres.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-2 rounded-lg border border-border bg-white text-dark text-xs font-semibold hover:bg-slate-hover transition-all cursor-pointer"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Try different filters</span>
                </button>
                <Link
                  to="/explore"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-2 bg-primary text-white text-xs font-semibold rounded-lg shadow-sm hover:bg-primary-hover transition-all"
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
