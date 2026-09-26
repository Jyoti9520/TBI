import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, Bookmark, BadgeCheck, University, Rocket, MapPin } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { SearchBar } from '../components/SearchBar';
import { FilterPanel } from '../components/FilterPanel';
import { TbiGrid } from '../components/TbiGrid';
import { Pagination } from '../components/Pagination';
import { StatsCard } from '../components/StatsCard';
import { RecentlyViewed } from '../components/RecentlyViewed';
import { CompareBar } from '../components/CompareBar';
import { tbiService } from '../services/tbiService';
import { userService } from '../services/userService';
import { getRecentlyViewed } from '../utils/recentTbis';
import { showToast } from '../components/Toast';
import {
  getCompareTbis,
  toggleCompareTbi,
  removeCompareTbi,
  clearCompareTbis
} from '../utils/compareStorage';

export const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
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
  const [recentlyViewed, setRecentlyViewed] = useState(() => getRecentlyViewed());
  const [selectedCompareTbis, setSelectedCompareTbis] = useState(() => getCompareTbis());
  const [metrics, setMetrics] = useState({
    totalIncubators: 0,
    totalUniversities: 0,
    verifiedTbis: 0,
    citiesCovered: 0
  });

  useEffect(() => {
    const handleUpdate = () => {
      setRecentlyViewed(getRecentlyViewed());
    };
    window.addEventListener('recently-viewed-updated', handleUpdate);
    return () => window.removeEventListener('recently-viewed-updated', handleUpdate);
  }, []);

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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Fetch real statistics from public endpoints (tbis, universities, categories)
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const [allTbisRes, verifiedRes, unisRes, catsRes] = await Promise.all([
          tbiService.getTbis({ limit: 1 }),
          tbiService.getTbis({ status: 'Verified', limit: 1 }),
          tbiService.getUniversities(),
          tbiService.getCategories()
        ]);

        const totalIncubators = allTbisRes.success ? (allTbisRes.total || 0) : 0;
        const verifiedTbis = verifiedRes.success ? (verifiedRes.total || 0) : 0;
        const totalUniversities = unisRes.success ? (unisRes.total || (unisRes.data ? unisRes.data.length : 0)) : 0;
        const citiesCovered = (catsRes.success && catsRes.data?.cities) ? catsRes.data.cities.length : 0;

        setMetrics({
          totalIncubators,
          totalUniversities,
          verifiedTbis,
          citiesCovered
        });
      } catch (err) {
        console.error('Error fetching dashboard statistics:', err);
      }
    };

    fetchMetrics();
  }, []);

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

  // Load saved count & keep in sync with card favorite clicks
  useEffect(() => {
    if (!user) {
      setSavedCount(0);
      return;
    }

    const fetchSaved = () => {
      userService
        .getFavorites()
        .then((res) => {
          if (res.success) setSavedCount(res.total || 0);
        })
        .catch(() => {});
    };

    fetchSaved();

    window.addEventListener('favorites-updated', fetchSaved);
    return () => window.removeEventListener('favorites-updated', fetchSaved);
  }, [user]);

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
    <div className={`space-y-6 ${selectedCompareTbis.length > 0 ? 'pb-24 sm:pb-20' : ''}`}>
      {/* 1. Header Greeting */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#7A0B1A]">
          {user ? `${getGreeting()}, ${user.name}` : 'Welcome to TBI Nexus'}
        </h1>
        <p className="text-sm text-[#647C98] mt-1">
          Discover innovation and technology business incubators around you.
        </p>
      </div>

      {/* 2. Main Search (Visually prominent, placed immediately below greeting/subtitle) */}
      <div className="bg-surface p-4 sm:p-5 rounded-2xl border-2 border-slate-200 shadow-card focus-within:border-[#7A0B1A] transition-colors duration-200">
        <SearchBar
          value={search}
          onChange={(val) => setSearch(val)}
          onSearch={handleSearchSubmit}
          placeholder="Search TBIs, universities, cities or incubator types..."
          showFilterButton={true}
          onFilterToggle={() => setFilterOpen(true)}
          filterActive={isFilterActive}
        />
      </div>

      {/* 3. Statistics (4 real database count cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Incubators"
          value={metrics.totalIncubators || totalCount || '—'}
          icon={Rocket}
          color="navy"
          subtitle="Registered in directory"
        />
        <StatsCard
          title="Universities"
          value={metrics.totalUniversities || '—'}
          icon={University}
          color="teal"
          subtitle="Host institutions"
        />
        <StatsCard
          title="Verified TBIs"
          value={metrics.verifiedTbis || '—'}
          icon={BadgeCheck}
          color="green"
          subtitle="Accredited ecosystems"
        />
        <StatsCard
          title="Cities Covered"
          value={metrics.citiesCovered || '—'}
          icon={MapPin}
          color="amber"
          subtitle="Pan-India presence"
        />
      </div>

      {/* 4. Recently Viewed Section */}
      <RecentlyViewed items={recentlyViewed} />

      {/* 5. Discovery Content (Main Grid Header & Cards) */}
      <div className="flex items-center justify-between pt-2">
        <h2 className="text-lg font-bold text-[#7A0B1A] flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] border border-[#D9CAB3] flex items-center justify-center shrink-0 shadow-sm transition-transform duration-200 hover:scale-105">
            <Compass className="w-4 h-4 text-[#7A0B1A]" />
          </div>
          <span>Explore Incubators</span>
          <span className="text-xs font-normal text-[#647C98]">
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
        selectedCompareIds={selectedCompareTbis.map((t) => t.id)}
        onToggleCompare={handleToggleCompare}
      />

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(newPage) => setPage(newPage)}
      />

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
