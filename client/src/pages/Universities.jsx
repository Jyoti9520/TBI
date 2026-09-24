import React, { useState, useEffect } from 'react';
import { Building2, Search } from 'lucide-react';
import { tbiService } from '../services/tbiService';
import { UniversityCard } from '../components/UniversityCard';
import { EmptyState } from '../components/EmptyState';

export const Universities = () => {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    let active = true;
    const fetchUniversities = async () => {
      setLoading(true);
      try {
        const res = await tbiService.getUniversities({ search: search.trim() });
        if (active && res.success) {
          setUniversities(res.data || []);
        }
      } catch (err) {
        console.error('Fetch universities error:', err);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchUniversities();
    return () => {
      active = false;
    };
  }, [search]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F150C] flex items-center space-x-2">
          <Building2 className="w-7 h-7 text-[#412D15]" />
          <span>University Directory</span>
        </h1>
        <p className="text-sm text-slate-muted mt-1">
          Explore higher education institutions hosting technology business incubators.
        </p>
      </div>

      {/* University Search Bar */}
      <div className="bg-surface p-3.5 rounded-2xl border border-slate-border shadow-card max-w-xl">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-muted">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search universities by name or city..."
            className="w-full pl-10 pr-4 py-2 bg-transparent text-sm text-slate placeholder:text-slate-muted focus:outline-none"
          />
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-44 rounded-xl bg-surface border border-slate-border animate-pulse p-5" />
          ))}
        </div>
      ) : universities.length === 0 ? (
        <EmptyState
          title="No universities found"
          description="Try searching for another institution name."
          actionLabel="Clear Search"
          onAction={() => setSearch('')}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {universities.map((uni) => (
            <UniversityCard key={uni.university} university={uni} />
          ))}
        </div>
      )}
    </div>
  );
};
