import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Compass, SlidersHorizontal, X } from 'lucide-react';
import { SearchBar } from '../components/SearchBar';
import { FilterPanel } from '../components/FilterPanel';
import { TbiGrid } from '../components/TbiGrid';
import { Pagination } from '../components/Pagination';
import { tbiService } from '../services/tbiService';

export const Explore = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [tbis, setTbis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [filterOpen, setFilterOpen] = useState(false);

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

  const handleSearch = (term) => {
    setSearch(term);
    setPage(1);
    updateQueryParams(term, filters, 1);
  };

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
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
    setPage(1);
    setSearchParams(new URLSearchParams());
  };

  const removeFilterBadge = (key) => {
    const next = { ...filters, [key]: '' };
    setFilters(next);
    setPage(1);
    updateQueryParams(search, next, 1);
  };

  const isFilterActive = Object.values(filters).some(Boolean);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy flex items-center space-x-2">
          <Compass className="w-7 h-7 text-teal" />
          <span>Explore TBIs Directory</span>
        </h1>
        <p className="text-sm text-slate-muted mt-1">
          Search and discover technology business incubators across India.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-surface p-4 rounded-2xl border border-slate-border shadow-card space-y-3">
        <SearchBar
          value={search}
          onChange={(val) => setSearch(val)}
          onSearch={handleSearch}
          placeholder="Search TBI name, university, city, or incubator type..."
          showFilterButton={true}
          onFilterToggle={() => setFilterOpen(true)}
          filterActive={isFilterActive}
        />

        {/* Active Filters Badges */}
        {(isFilterActive || search) && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
            <span className="text-xs font-semibold text-slate-muted">Active:</span>

            {search && (
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-navy-50 text-navy text-xs font-semibold">
                <span>Query: "{search}"</span>
                <button onClick={() => handleSearch('')} className="hover:text-status-error">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {Object.entries(filters).map(([k, v]) => {
              if (!v) return null;
              return (
                <span
                  key={k}
                  className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-teal-50 text-teal text-xs font-semibold"
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
              className="text-xs font-semibold text-status-error hover:underline ml-2"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Results Count Summary */}
      <div className="flex items-center justify-between text-xs font-medium text-slate-muted">
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
