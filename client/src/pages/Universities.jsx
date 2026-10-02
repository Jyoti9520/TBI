import React, { useState, useEffect } from 'react';
import { University, Search } from 'lucide-react';
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
        <h1 className="text-2xl sm:text-3xl font-bold font-heading text-dark flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-primary-light border border-orange-200 flex items-center justify-center shrink-0">
            <University className="w-5 h-5 text-primary" />
          </div>
          <span>University Directory</span>
        </h1>
        <p className="text-sm text-slate-body mt-1">
          Explore higher education institutions hosting technology business incubators.
        </p>
      </div>

      {/* University Search Bar */}
      <div className="bg-white p-2 rounded-xl border border-border shadow-xs max-w-xl">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-muted">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search universities by name or city..."
            className="w-full pl-10 pr-4 py-2 bg-transparent text-sm text-dark placeholder:text-slate-muted focus:outline-none"
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
