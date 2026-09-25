import React, { useState, useEffect } from 'react';
import { Bookmark, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';
import { userService } from '../services/userService';
import { TbiGrid } from '../components/TbiGrid';
import { EmptyState } from '../components/EmptyState';

export const Saved = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const res = await userService.getFavorites();
      if (res.success) {
        setFavorites(res.data || []);
      }
    } catch (err) {
      console.error('Fetch favorites error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleFavoriteToggle = (tbiId, isFav) => {
    if (!isFav) {
      setFavorites((prev) => prev.filter((t) => t.id !== tbiId));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#7A0B1A] flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#D9CAB3] flex items-center justify-center shrink-0 shadow-xs transition-transform duration-200 hover:scale-105">
            <Bookmark className="w-5 h-5 text-[#5B0712]" />
          </div>
          <span>Saved TBIs</span>
        </h1>
        <p className="text-sm text-slate-muted mt-1">
          Your bookmarked technology business incubators and incubation centres.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-64 rounded-xl bg-surface border border-slate-border animate-pulse p-5" />
          ))}
        </div>
      ) : favorites.length === 0 ? (
        <div className="text-center py-16 px-4 bg-surface border border-dashed border-slate-border rounded-2xl max-w-md mx-auto my-8">
          <Bookmark className="w-10 h-10 text-slate-muted mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate mb-1">No Saved TBIs</h3>
          <p className="text-sm text-slate-muted mb-5">
            You haven't bookmarked any technology business incubators yet.
          </p>
          <Link
            to="/explore"
            className="inline-flex items-center space-x-2 px-4 py-2 bg-[#7A0B1A] text-[#D9CAB3] text-xs font-semibold rounded-lg shadow-sm hover:bg-[#5B0712] transition-colors border border-[#7A0B1A]"
          >
            <Compass className="w-4 h-4" />
            <span>Explore TBIs</span>
          </Link>
        </div>
      ) : (
        <TbiGrid
          tbis={favorites}
          loading={false}
          onFavoriteToggle={handleFavoriteToggle}
        />
      )}
    </div>
  );
};
