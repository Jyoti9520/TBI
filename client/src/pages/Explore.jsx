import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Compass, SlidersHorizontal, X } from 'lucide-react';
import { SearchBar } from '../components/SearchBar';
import { FilterPanel } from '../components/FilterPanel';
import { TbiGrid } from '../components/TbiGrid';
import { Pagination } from '../components/Pagination';
import { tbiService } from '../services/tbiService';
import { showToast } from '../components/Toast';

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

  const [tbis, setTbis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [filterOpen, setFilterOpen] = useState(false);
  const [isNearbyActive, setIsNearbyActive] = useState(false);

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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#5E0B15] flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#D9CAB3] flex items-center justify-center shrink-0 shadow-xs transition-transform duration-200 hover:scale-105">
            <Compass className="w-5 h-5 text-[#90323D]" />
          </div>
          <span>Explore TBIs Directory</span>
        </h1>
        <p className="text-sm text-slate-muted mt-1">
          Search and discover technology business incubators across India.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-surface p-4 rounded-2xl border border-slate-border shadow-card space-y-3.5">
        <SearchBar
          value={search}
          onChange={(val) => setSearch(val)}
          onSearch={handleSearch}
          placeholder="Search TBI name, university, city, or incubator type..."
          showFilterButton={true}
          onFilterToggle={() => setFilterOpen(true)}
          filterActive={isFilterActive}
        />

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
                    ? 'bg-[#5E0B15] text-white border-[#5E0B15] shadow-xs font-bold'
                    : 'bg-white text-[#5E0B15] border-[#D9CAB3] hover:bg-[#FAF7F2] hover:border-[#90323D]/60'
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
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-[#D9CAB3] text-[#5E0B15] border border-[#90323D]/30 text-xs font-bold">
                <span>Query: "{search}"</span>
                <button onClick={() => handleSearch('')} className="hover:text-status-error">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {isNearbyActive && (
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-[#D9CAB3] text-[#5E0B15] border border-[#8C7A6B] text-xs font-bold shadow-sm">
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
                  className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-[#D9CAB3] text-[#5E0B15] border border-[#8C7A6B] text-xs font-bold shadow-sm"
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

      {/* Results Count Summary */}
      <div className="flex items-center justify-between text-xs font-semibold text-slate-muted">
        <span>
          Showing {tbis.length} of {totalCount} incubators
        </span>
      </div>

      {/* Grid */}
      <TbiGrid
        tbis={tbis}
        loading={loading}
        onClearFilters={handleResetFilters}
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
