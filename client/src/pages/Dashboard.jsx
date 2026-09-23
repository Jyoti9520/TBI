import React, { useState, useEffect } from 'react';
import { Compass, Bookmark, CheckCircle2, Building2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { SearchBar } from '../components/SearchBar';
import { FilterPanel } from '../components/FilterPanel';
import { TbiGrid } from '../components/TbiGrid';
import { Pagination } from '../components/Pagination';
import { StatsCard } from '../components/StatsCard';
import { tbiService } from '../services/tbiService';
import { userService } from '../services/userService';

export const Dashboard = () => {
  const { user } = useAuth();
  const [tbis, setTbis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    city: '',
    university: '',
    universityType: '',
    incubatorType: '',
    status: ''
  });
  const [savedCount, setSavedCount] = useState(0);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const fetchTbis = async (currentPage = 1, currentSearch = '', currentFilters = {}) => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 12,
        search: currentSearch,
        ...currentFilters
      };
      const res = await tbiService.getTbis(params);
      if (res.success) {
        setTbis(res.data || []);
        setPage(res.page || 1);
        setTotalPages(res.totalPages || 1);
        setTotalCount(res.total || 0);
      }
    } catch (err) {
      console.error('Fetch dashboard TBIs error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTbis(page, search, filters);
  }, [page, filters]);

  // Load saved count
  useEffect(() => {
    userService
      .getFavorites()
      .then((res) => {
        if (res.success) setSavedCount(res.total || 0);
      })
      .catch(() => {});
  }, []);

  const handleSearchSubmit = (searchTerm) => {
    setSearch(searchTerm);
    setPage(1);
    fetchTbis(1, searchTerm, filters);
  };

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleResetFilters = () => {
    const empty = {
      city: '',
      university: '',
      universityType: '',
      incubatorType: '',
      status: ''
    };
    setFilters(empty);
    setSearch('');
    setPage(1);
  };

  const isFilterActive = Object.values(filters).some((v) => !!v);

  return (
    <div className="space-y-6">
      {/* Header Greeting */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy">
          {getGreeting()}, {user?.name || 'Innovator'}
        </h1>
        <p className="text-sm text-slate-muted mt-1">
          Discover innovation and technology business incubators around you.
        </p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard
          title="Total Incubation Centres"
          value={totalCount}
          icon={Building2}
          color="navy"
          subtitle="Registered across institutions"
        />
        <StatsCard
          title="Your Saved TBIs"
          value={savedCount}
          icon={Bookmark}
          color="teal"
          subtitle="Saved to your account"
        />
        <StatsCard
          title="Verified Status"
          value="450+"
          icon={CheckCircle2}
          color="green"
          subtitle="Accredited ecosystems"
        />
      </div>

      {/* Large Search Bar (Section 25) */}
      <div className="bg-surface p-4 rounded-2xl border border-slate-border shadow-card">
        <SearchBar
          value={search}
          onChange={(val) => setSearch(val)}
          onSearch={handleSearchSubmit}
          placeholder="Search TBI, university, city or incubator type..."
          showFilterButton={true}
          onFilterToggle={() => setFilterOpen(true)}
          filterActive={isFilterActive}
        />
      </div>

      {/* Main Grid Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-navy flex items-center space-x-2">
          <Compass className="w-5 h-5 text-teal" />
          <span>Explore Incubators</span>
          <span className="text-xs font-normal text-slate-muted">
            ({totalCount} available)
          </span>
        </h2>
      </div>

      {/* TBI Cards Grid */}
      <TbiGrid
        tbis={tbis}
        loading={loading}
        onClearFilters={handleResetFilters}
        onFavoriteToggle={() => {
          userService.getFavorites().then(r => r.success && setSavedCount(r.total || 0));
        }}
      />

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(newPage) => setPage(newPage)}
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
