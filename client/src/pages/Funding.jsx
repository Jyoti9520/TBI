import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, Filter, Landmark, Gift, Bookmark, 
  RotateCcw, ChevronLeft, ChevronRight, Sparkles, AlertCircle
} from 'lucide-react';
import { investorService } from '../services/investorService';
import { fundingService } from '../services/fundingService';
import InvestorCard from '../components/InvestorCard';
import GrantCard from '../components/GrantCard';
import { useAuth } from '../context/AuthContext';

export const Funding = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();

  // Active tab: 'investors' | 'grants' | 'saved'
  const activeTab = searchParams.get('tab') || 'investors';

  // Filters State
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || '');
  const [selectedSector, setSelectedSector] = useState(searchParams.get('sector') || '');
  const [selectedStage, setSelectedStage] = useState(searchParams.get('stage') || '');
  const [selectedGeography, setSelectedGeography] = useState(searchParams.get('geography') || '');
  const [selectedScope, setSelectedScope] = useState('');
  const [isGrantOnly, setIsGrantOnly] = useState('');

  // Pagination & Data
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lists
  const [investors, setInvestors] = useState([]);
  const [grants, setGrants] = useState([]);
  const [savedInvestors, setSavedInvestors] = useState([]);

  // Filter metadata options
  const [meta, setMeta] = useState({
    sectors: ['DeepTech', 'Agritech', 'HealthTech', 'CleanTech', 'AI/ML', 'SaaS', 'Robotics', 'SpaceTech', 'BioTech'],
    stages: ['Pre-Seed', 'Seed', 'Pre-Series A', 'Series A', 'Growth'],
    types: [
      'Venture Capital',
      'Angel Network',
      'Corporate VC',
      'Government / PSU Fund',
      'Family Office',
      'Accelerator / Incubator Fund',
      'Seed Fund'
    ],
    geographies: ['India', 'Bengaluru', 'Delhi-NCR', 'Mumbai', 'Chennai', 'Hyderabad']
  });

  // Fetch Metadata once
  useEffect(() => {
    investorService.getInvestorMeta()
      .then(res => {
        if (res.data) {
          setMeta(prev => ({
            ...prev,
            sectors: res.data.sectors?.length ? res.data.sectors : prev.sectors,
            stages: res.data.stages?.length ? res.data.stages : prev.stages,
            types: res.data.types?.length ? res.data.types : prev.types,
            geographies: res.data.geographies?.length ? res.data.geographies : prev.geographies
          }));
        }
      })
      .catch(err => console.error('Error fetching filter meta:', err));
  }, []);

  // Fetch Data according to active tab
  useEffect(() => {
    let isCancelled = false;
    setLoading(true);
    setError(null);

    const fetchData = async () => {
      try {
        if (activeTab === 'investors') {
          const res = await investorService.getInvestors({
            page,
            limit: 9,
            search,
            type: selectedType,
            sector: selectedSector,
            stage: selectedStage,
            geography: selectedGeography
          });
          if (!isCancelled) {
            setInvestors(res.data || []);
            setTotalPages(res.totalPages || 1);
            setTotalItems(res.total || 0);
          }
        } else if (activeTab === 'grants') {
          const res = await fundingService.getFundingOpportunities({
            page,
            limit: 9,
            search,
            scope: selectedScope,
            isGrant: isGrantOnly
          });
          if (!isCancelled) {
            setGrants(res.data || []);
            setTotalPages(res.totalPages || 1);
            setTotalItems(res.total || 0);
          }
        } else if (activeTab === 'saved') {
          if (!user) {
            if (!isCancelled) {
              setSavedInvestors([]);
              setLoading(false);
            }
            return;
          }
          const res = await investorService.getSavedInvestors();
          if (!isCancelled) {
            const list = res.data || [];
            setSavedInvestors(list);
            setTotalPages(1);
            setTotalItems(list.length);
          }
        }
      } catch (err) {
        if (!isCancelled) {
          console.error('Funding data fetch error:', err);
          setError('Failed to load records. Please try again.');
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isCancelled = true;
    };
  }, [
    activeTab, 
    page, 
    search, 
    selectedType, 
    selectedSector, 
    selectedStage, 
    selectedGeography, 
    selectedScope, 
    isGrantOnly,
    user
  ]);

  const handleTabChange = (tab) => {
    setSearchParams({ tab });
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearch('');
    setSelectedType('');
    setSelectedSector('');
    setSelectedStage('');
    setSelectedGeography('');
    setSelectedScope('');
    setIsGrantOnly('');
    setPage(1);
  };

  const hasActiveFilters = Boolean(
    search || selectedType || selectedSector || selectedStage || selectedGeography || selectedScope || isGrantOnly
  );

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500/10 via-[#131318] to-purple-500/10 border border-white/10 p-6 sm:p-10 backdrop-blur-xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>TBI Capital & Grants Ecosystem</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
            Funding & Institutional Investors
          </h1>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            Discover verified deep-tech venture funds, angel networks, and non-dilutive government innovation grants (PRAYAS, EIR, BIG, SISFS) integrated directly with India's premier university incubators.
          </p>
        </div>
      </div>

      {/* Primary Tab Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2 p-1.5 bg-[#131318] rounded-2xl border border-white/10">
          <button
            onClick={() => handleTabChange('investors')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'investors'
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Landmark className="w-4 h-4" />
            <span>Investor Directory</span>
          </button>

          <button
            onClick={() => handleTabChange('grants')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'grants'
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Gift className="w-4 h-4" />
            <span>Grants & Schemes</span>
          </button>

          <button
            onClick={() => handleTabChange('saved')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'saved'
                ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Saved Portfolio</span>
          </button>
        </div>

        <div className="text-xs text-gray-400 font-medium">
          Showing <span className="text-white font-bold">{totalItems}</span> {activeTab === 'grants' ? 'funding schemes' : 'investors'}
        </div>
      </div>

      {/* Search & Filters Controls */}
      {activeTab !== 'saved' && (
        <div className="rounded-2xl bg-[#131318] border border-white/10 p-4 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Search input */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={
                  activeTab === 'investors'
                    ? 'Search by investor name, thesis, city, or keywords...'
                    : 'Search grants by scheme title, sponsor agency, or focus area...'
                }
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>

            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs text-gray-300 font-medium transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5 text-gray-400" />
                Reset Filters
              </button>
            )}
          </div>

          {/* Filter Dropdowns for Investors */}
          {activeTab === 'investors' && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div>
                <label className="block text-[11px] font-medium text-gray-400 mb-1">Investor Type</label>
                <select
                  value={selectedType}
                  onChange={(e) => {
                    setSelectedType(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-gray-200 focus:outline-none focus:border-orange-500"
                >
                  <option value="">All Investor Types</option>
                  {meta.types.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-gray-400 mb-1">Target Sector</label>
                <select
                  value={selectedSector}
                  onChange={(e) => {
                    setSelectedSector(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-gray-200 focus:outline-none focus:border-orange-500"
                >
                  <option value="">All Sectors</option>
                  {meta.sectors.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-gray-400 mb-1">Funding Stage</label>
                <select
                  value={selectedStage}
                  onChange={(e) => {
                    setSelectedStage(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-gray-200 focus:outline-none focus:border-orange-500"
                >
                  <option value="">All Stages</option>
                  {meta.stages.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-gray-400 mb-1">HQ / Geography</label>
                <select
                  value={selectedGeography}
                  onChange={(e) => {
                    setSelectedGeography(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-gray-200 focus:outline-none focus:border-orange-500"
                >
                  <option value="">All Geographies</option>
                  {meta.geographies.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Filter Dropdowns for Grants */}
          {activeTab === 'grants' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-[11px] font-medium text-gray-400 mb-1">Grant Structure</label>
                <select
                  value={isGrantOnly}
                  onChange={(e) => {
                    setIsGrantOnly(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-gray-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="">All Schemes (Grants & Seed Debt/Equity)</option>
                  <option value="true">100% Non-Dilutive Grants Only</option>
                  <option value="false">Seed Fund / Convertible Component</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-gray-400 mb-1">Geographic Scope</label>
                <select
                  value={selectedScope}
                  onChange={(e) => {
                    setSelectedScope(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-gray-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="">All Scopes</option>
                  <option value="Pan-India">Pan-India</option>
                  <option value="State Specific">State Specific</option>
                </select>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Content Area */}
      <div>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-72 rounded-2xl bg-[#131318]/50 border border-white/5 animate-pulse p-6"
              />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl bg-red-500/10 border border-red-500/20 p-8 text-center max-w-md mx-auto">
            <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
            <h3 className="text-white font-bold mb-1">Data Retrieval Error</h3>
            <p className="text-xs text-gray-400 mb-4">{error}</p>
            <button
              onClick={() => setPage(1)}
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-semibold rounded-xl border border-red-500/30"
            >
              Retry
            </button>
          </div>
        ) : activeTab === 'investors' ? (
          investors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {investors.map((inv) => (
                <InvestorCard key={inv.id} investor={inv} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl bg-[#131318] border border-white/10 p-12 text-center max-w-lg mx-auto">
              <Landmark className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-base font-bold text-white mb-2">No Investors Found</h3>
              <p className="text-xs text-gray-400 mb-6">
                No institutional investors matched your filter parameters. Try clearing your filters or widening search criteria.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-medium text-xs transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          )
        ) : activeTab === 'grants' ? (
          grants.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {grants.map((gr) => (
                <GrantCard key={gr.id} grant={gr} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl bg-[#131318] border border-white/10 p-12 text-center max-w-lg mx-auto">
              <Gift className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-base font-bold text-white mb-2">No Funding Opportunities Found</h3>
              <p className="text-xs text-gray-400 mb-6">
                No active grants or schemes match your criteria. Check back soon or reset filters.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-medium text-xs transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          )
        ) : activeTab === 'saved' ? (
          !user ? (
            <div className="rounded-3xl bg-[#131318] border border-white/10 p-12 text-center max-w-md mx-auto">
              <Bookmark className="w-12 h-12 text-orange-400/50 mx-auto mb-4" />
              <h3 className="text-base font-bold text-white mb-2">Sign In to Save Investors</h3>
              <p className="text-xs text-gray-400 mb-6">
                Bookmark and curate your preferred institutional venture funds, angel networks, and grant opportunities.
              </p>
            </div>
          ) : savedInvestors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedInvestors.map((inv) => (
                <InvestorCard
                  key={inv.id}
                  investor={{ ...inv, isSaved: true }}
                  onBookmarkToggle={() => {
                    // Refresh saved investors list
                    investorService.getSavedInvestors().then(res => setSavedInvestors(res.data || []));
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl bg-[#131318] border border-white/10 p-12 text-center max-w-lg mx-auto">
              <Bookmark className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-base font-bold text-white mb-2">No Saved Investors Yet</h3>
              <p className="text-xs text-gray-400 mb-6">
                Click the bookmark icon on any investor card in the directory to save them to your personal shortlist.
              </p>
              <button
                onClick={() => handleTabChange('investors')}
                className="px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-medium text-xs transition-colors"
              >
                Explore Investor Directory
              </button>
            </div>
          )
        ) : null}
      </div>

      {/* Pagination (When more than 1 page) */}
      {!loading && totalPages > 1 && activeTab !== 'saved' && (
        <div className="flex items-center justify-center gap-3 pt-6 border-t border-white/10">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 rounded-xl bg-[#131318] border border-white/10 text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/5 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs text-gray-400 font-medium">
            Page <span className="text-white font-bold">{page}</span> of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 rounded-xl bg-[#131318] border border-white/10 text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/5 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Funding;
