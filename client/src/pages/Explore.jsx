import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Compass, SlidersHorizontal, X, LayoutGrid, MapPin } from 'lucide-react';
import { SearchBar } from '../components/SearchBar';
import { FilterPanel } from '../components/FilterPanel';
import { TbiGrid } from '../components/TbiGrid';
import { TbiMapView } from '../components/TbiMapView';
import { CompareBar } from '../components/CompareBar';
import { Pagination } from '../components/Pagination';
import { tbiService } from '../services/tbiService';
import { showToast } from '../components/Toast';
import {
  getCompareTbis,
  toggleCompareTbi,
  removeCompareTbi,
  clearCompareTbis
} from '../utils/compareStorage';

const QUICK_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'verified', label: 'Verified', type: 'status', value: 'Verified' },
  { id: 'under_verification', label: 'Under Verification', type: 'status', value: 'Under Verification' },
  { id: 'dst_tbi', label: 'DST TBI', type: 'incubatorType', value: 'DST TBI' },
  { id: 'nidhi_tbi', label: 'NIDHI-TBI', type: 'incubatorType', value: 'NIDHI-TBI' },
  { id: 'university_incubator', label: 'University Incubator', type: 'incubatorType', value: 'University Incubator' },
  { id: 'section_8', label: 'Section 8 Incubator', type: 'incubatorType', value: 'Section 8 Incubator' },
  { id: 'nearby', label: 'Nearby', type: 'nearby' }
];

export const Explore = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [tbis, setTbis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [filterOpen, setFilterOpen] = useState(false);
  const [isNearbyActive, setIsNearbyActive] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'map'
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

  // Derive initial values from URL query params
  const initialSearch = searchParams.get('q') || '';
  const initialUniversity = searchParams.get('university') || '';
  const initialCity = searchParams.get('city') || '';
  const initialIncubatorType = searchParams.get('incubatorType') || '';
  const initialUniversityType = searchParams.get('universityType') || '';
  const initialStatus = searchParams.get('status') || '';

  const [search, setSearch] = useState(initialSearch);
  const [filters, setFilters] = useState({
    university: initialUniversity,
    city: initialCity,
    incubatorType: initialIncubatorType,
    universityType: initialUniversityType,
    status: initialStatus
  });

  const fetchTbis = async () => {
    if (isNearbyActive) return;
    setLoading(true);
    try {
      const params = {
        page,
        limit: 15,
        search: search.trim(),
        ...filters
      };
      const res = await tbiService.getTbis(params);
      if (res.success) {
        setTbis(res.data || []);
        setTotalPages(res.totalPages || 1);
        setTotalCount(res.total || 0);
      }
    } catch (err) {
      console.error('Explore fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Sync state with URL params
  useEffect(() => {
    setSearch(searchParams.get('q') || '');
    setFilters({
      university: searchParams.get('university') || '',
      city: searchParams.get('city') || '',
      incubatorType: searchParams.get('incubatorType') || '',
      universityType: searchParams.get('universityType') || '',
      status: searchParams.get('status') || ''
    });
    setPage(parseInt(searchParams.get('page'), 10) || 1);
  }, [searchParams]);

  useEffect(() => {
    fetchTbis();
  }, [page, search, filters]);

  const updateQueryParams = (newSearch, newFilters, newPage = 1) => {
    const params = new URLSearchParams();
    if (newSearch) params.set('q', newSearch);
    if (newFilters.university) params.set('university', newFilters.university);
    if (newFilters.city) params.set('city', newFilters.city);
    if (newFilters.incubatorType) params.set('incubatorType', newFilters.incubatorType);
    if (newFilters.universityType) params.set('universityType', newFilters.universityType);
    if (newFilters.status) params.set('status', newFilters.status);
    if (newPage > 1) params.set('page', newPage.toString());

    setSearchParams(params);
  };

  const handleNearbyFilter = () => {
    if (isNearbyActive) {
      setIsNearbyActive(false);
      fetchTbis();
      return;
    }

    if (!navigator.geolocation) {
      showToast('Geolocation is not supported by your browser', 'error');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await tbiService.getNearbyTbis({
            lat: pos.coords.latitude,
            lon: pos.coords.longitude
          });
          if (res.success) {
            setTbis(res.data || []);
            setIsNearbyActive(true);
            setTotalCount((res.data || []).length);
            setTotalPages(1);
            showToast('Showing incubators sorted by distance from your location');
          }
        } catch (err) {
          showToast('Unable to discover nearby TBIs', 'error');
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setLoading(false);
        showToast('Location permission denied. Enable location to find nearby TBIs.', 'error');
      },
      { timeout: 10000 }
    );
  };

  const handleQuickFilterClick = (chip) => {
    if (chip.id === 'all') {
      setIsNearbyActive(false);
      const nextFilters = { ...filters, status: '', incubatorType: '' };
      setFilters(nextFilters);
      setPage(1);
      updateQueryParams(search, nextFilters, 1);
      return;
    }

    if (chip.id === 'nearby') {
      handleNearbyFilter();
      return;
    }

    setIsNearbyActive(false);

    const isCurrentlyActive =
      (chip.type === 'status' && filters.status === chip.value) ||
      (chip.type === 'incubatorType' && filters.incubatorType === chip.value);

    const nextFilters = {
      ...filters,
      status: chip.type === 'status' ? (isCurrentlyActive ? '' : chip.value) : filters.status,
      incubatorType: chip.type === 'incubatorType' ? (isCurrentlyActive ? '' : chip.value) : filters.incubatorType
    };

    setFilters(nextFilters);
    setPage(1);
    updateQueryParams(search, nextFilters, 1);
  };

  const handleSearch = (term) => {
    setSearch(term);
    setIsNearbyActive(false);
    setPage(1);
    updateQueryParams(term, filters, 1);
  };

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    setIsNearbyActive(false);
    setPage(1);
    updateQueryParams(search, newFilters, 1);
  };

  const handleResetFilters = () => {
    const empty = {
      university: '',
      city: '',
      incubatorType: '',
      universityType: '',
      status: ''
    };
    setSearch('');
    setFilters(empty);
    setIsNearbyActive(false);
    setPage(1);
    setSearchParams(new URLSearchParams());
  };

  const removeFilterBadge = (key) => {
    const next = { ...filters, [key]: '' };
    setFilters(next);
    setIsNearbyActive(false);
    setPage(1);
    updateQueryParams(search, next, 1);
  };

  const isFilterActive = Object.values(filters).some(Boolean) || isNearbyActive;

  return (
    <div className={`space-y-6 ${selectedCompareTbis.length > 0 ? 'pb-24 sm:pb-20' : ''}`}>
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#7A0B1A] flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#D9CAB3] flex items-center justify-center shrink-0 shadow-xs transition-transform duration-200 hover:scale-105">
            <Compass className="w-5 h-5 text-[#7A0B1A]" />
          </div>
          <span>Explore TBIs Directory</span>
        </h1>
        <p className="text-sm text-[#647C98] mt-1">
          Search and discover technology business incubators across India.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-surface p-4 rounded-2xl border border-slate-border shadow-card space-y-3.5">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex-1">
            <SearchBar
              value={search}
              onChange={(val) => setSearch(val)}
              onSearch={handleSearch}
              placeholder="Search TBI name, university, city, or incubator type..."
              showFilterButton={true}
              onFilterToggle={() => setFilterOpen(true)}
              filterActive={isFilterActive}
            />
          </div>

          {/* List / Map View Toggle */}
          <div className="flex items-center bg-[#FAF7F2] p-1 rounded-xl border border-[#D9CAB3]/70 shrink-0 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-[#7A0B1A] text-white shadow-xs'
                  : 'text-[#7A0B1A] hover:bg-[#D9CAB3]/40'
              }`}
              title="List View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
            <button
              type="button"
              onClick={() => {
                const hasCoordinates = tbis.some(
                  (t) =>
                    t?.latitude !== null &&
                    t?.latitude !== undefined &&
                    t?.longitude !== null &&
                    t?.longitude !== undefined &&
                    !isNaN(Number(t.latitude)) &&
                    !isNaN(Number(t.longitude))
                );
                if (!hasCoordinates) {
                  showToast('Map view requires location coordinates.', 'warning');
                }
                setViewMode('map');
              }}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 cursor-pointer ${
                viewMode === 'map'
                  ? 'bg-[#7A0B1A] text-white shadow-xs'
                  : 'text-[#7A0B1A] hover:bg-[#D9CAB3]/40'
              }`}
              title="Map View"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Map</span>
            </button>
          </div>
        </div>

        {/* Quick Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5 no-scrollbar select-none">
          {QUICK_FILTERS.map((chip) => {
            const isActive =
              chip.id === 'all'
                ? !filters.status && !filters.incubatorType && !isNearbyActive
                : chip.id === 'nearby'
                ? isNearbyActive
                : chip.type === 'status'
                ? filters.status === chip.value
                : chip.type === 'incubatorType'
                ? filters.incubatorType === chip.value
                : false;

            return (
              <button
                key={chip.id}
                type="button"
                onClick={() => handleQuickFilterClick(chip)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer border ${
                  isActive
                    ? 'bg-[#7A0B1A] text-white border-[#7A0B1A] shadow-xs font-bold'
                    : 'bg-white text-[#7A0B1A] border-[#D9CAB3] hover:bg-[#FAF7F2] hover:border-[#7A0B1A]/40'
                }`}
              >
                {chip.label}
              </button>
            );
          })}
        </div>

        {/* Active Filters Badges */}
        {(isFilterActive || search) && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-muted">Active:</span>

            {search && (
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-[#D9CAB3] text-[#7A0B1A] border border-[#5B0712]/30 text-xs font-bold">
                <span>Query: "{search}"</span>
                <button onClick={() => handleSearch('')} className="hover:text-status-error">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {isNearbyActive && (
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-[#D9CAB3] text-[#7A0B1A] border border-[#8C7A6B] text-xs font-bold shadow-sm">
                <span>Nearby Locations</span>
                <button
                  onClick={() => {
                    setIsNearbyActive(false);
                    fetchTbis();
                  }}
                  className="hover:text-status-error"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {Object.entries(filters).map(([k, v]) => {
              if (!v) return null;
              return (
                <span
                  key={k}
                  className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-[#D9CAB3] text-[#7A0B1A] border border-[#8C7A6B] text-xs font-bold shadow-sm"
                >
                  <span className="capitalize">{k}: {v}</span>
                  <button onClick={() => removeFilterBadge(k)} className="hover:text-status-error">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              );
            })}

            <button
              onClick={handleResetFilters}
              className="text-xs font-bold text-status-error hover:underline ml-2"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Results Count & View Mode Summary */}
      <div className="flex items-center justify-between text-xs font-semibold text-slate-muted">
        <span>
          Showing {tbis.length} of {totalCount} incubators
        </span>
        <span className="capitalize text-slate-muted">
          View: <strong className="text-[#7A0B1A]">{viewMode}</strong>
        </span>
      </div>

      {/* Main View: List or Map */}
      {viewMode === 'map' ? (
        <TbiMapView tbis={tbis} onSwitchToList={() => setViewMode('list')} />
      ) : (
        <>
          {/* Grid */}
          <TbiGrid
            tbis={tbis}
            loading={loading}
            onClearFilters={handleResetFilters}
            selectedCompareIds={selectedCompareTbis.map((t) => t.id)}
            onToggleCompare={handleToggleCompare}
          />

          {/* Pagination */}
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(p) => {
              setPage(p);
              updateQueryParams(search, filters, p);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </>
      )}

      {/* Sticky Bottom Comparison Bar */}
      <CompareBar
        selectedTbis={selectedCompareTbis}
        onRemove={handleRemoveCompare}
        onClearAll={handleClearAllCompare}
        onCompare={() => navigate('/compare')}
      />

      {/* Filter Drawer */}
      <FilterPanel
        isOpen={filterOpen}
        onClose={() => setFilterOpen(false)}
        filters={filters}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
      />
    </div>
  );
};
