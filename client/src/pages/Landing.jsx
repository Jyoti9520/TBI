import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Compass,
  Building2,
  CheckCircle2,
  Layers,
  ArrowRight,
  Sparkles,
  MapPin,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Globe2
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { tbiService } from '../services/tbiService';
import { adminService } from '../services/adminService';
import { TbiCard } from '../components/TbiCard';
import { SkeletonCard } from '../components/SkeletonCard';

export const Landing = () => {
  const [query, setQuery] = useState('');
  const [stats, setStats] = useState(null);
  const [featuredTbis, setFeaturedTbis] = useState([]);
  const [popularCategories, setPopularCategories] = useState([]);
  const [topUniversities, setTopUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;

    const fetchLandingData = async () => {
      try {
        const [statsRes, tbisRes, catsRes, unisRes] = await Promise.all([
          adminService.getStats().catch(() => ({ success: false })),
          tbiService.getTbis({ status: 'Verified', limit: 6 }),
          tbiService.getCategories(),
          tbiService.getUniversities({ limit: 6 })
        ]);

        if (active) {
          if (statsRes.success) setStats(statsRes.data);
          if (tbisRes.success) setFeaturedTbis(tbisRes.data);
          if (catsRes.success && catsRes.data?.incubatorTypes) {
            setPopularCategories(catsRes.data.incubatorTypes.slice(0, 6));
          }
          if (unisRes.success) setTopUniversities(unisRes.data.slice(0, 6));
        }
      } catch (err) {
        console.error('Landing load error:', err);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchLandingData();
    return () => {
      active = false;
    };
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/explore?q=${encodeURIComponent(query.trim())}`);
    } else {
      navigate('/explore');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-navy-100 selection:text-navy">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 border-b border-slate-border bg-gradient-to-b from-white via-surface to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Subtle Pill */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200/70 text-teal text-xs font-semibold mb-6 shadow-subtle">
            <Sparkles className="w-3.5 h-3.5 text-teal" />
            <span>Discover University & Startup Incubators</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-navy tracking-tight max-w-4xl mx-auto leading-tight sm:leading-tight">
            Discover Where <span className="text-teal">Innovation</span> Begins.
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-muted max-w-2xl mx-auto font-normal">
            Find Technology Business Incubators (TBIs), university incubation centres, and startup ecosystems across institutions in India.
          </p>

          {/* Search Box on Landing */}
          <div className="mt-8 max-w-2xl mx-auto">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center shadow-hover rounded-2xl bg-surface border border-slate-border p-1.5 focus-within:ring-2 focus-within:ring-navy/20 focus-within:border-navy transition-all">
              <div className="pl-4 pr-2 text-slate-muted">
                <Search className="w-5 h-5 text-navy" />
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search universities, TBIs, cities or incubator types..."
                className="w-full py-3 pr-4 text-sm sm:text-base text-slate placeholder:text-slate-muted bg-transparent focus:outline-none"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-navy hover:bg-navy-600 text-white font-semibold text-sm rounded-xl transition-colors shrink-0 shadow-sm"
              >
                Search
              </button>
            </form>
          </div>

          {/* Action CTAs */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/explore"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-navy text-white text-sm font-semibold hover:bg-navy-600 transition-colors shadow-sm"
            >
              <Compass className="w-4 h-4" />
              <span>Explore TBIs</span>
            </Link>
            <Link
              to="/universities"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-surface border border-slate-border text-slate text-sm font-semibold hover:bg-slate-50 transition-colors shadow-subtle"
            >
              <Building2 className="w-4 h-4" />
              <span>Browse Universities</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Dynamic Statistics Bar (Section 59 - Real DB calculations) */}
      <section className="py-8 bg-surface border-b border-slate-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-2">
              <p className="text-3xl sm:text-4xl font-extrabold text-navy">
                {stats?.totalTbis ?? (loading ? '...' : '500+')}
              </p>
              <p className="text-xs sm:text-sm font-medium text-slate-muted mt-1 uppercase tracking-wider">
                Total TBIs
              </p>
            </div>
            <div className="p-2 border-l border-slate-100">
              <p className="text-3xl sm:text-4xl font-extrabold text-teal">
                {stats?.uniqueUniversities ?? (loading ? '...' : '350+')}
              </p>
              <p className="text-xs sm:text-sm font-medium text-slate-muted mt-1 uppercase tracking-wider">
                Universities
              </p>
            </div>
            <div className="p-2 border-l border-slate-100">
              <p className="text-3xl sm:text-4xl font-extrabold text-navy">
                {stats?.uniqueCities ?? (loading ? '...' : '150+')}
              </p>
              <p className="text-xs sm:text-sm font-medium text-slate-muted mt-1 uppercase tracking-wider">
                Cities Covered
              </p>
            </div>
            <div className="p-2 border-l border-slate-100">
              <p className="text-3xl sm:text-4xl font-extrabold text-status-success">
                {stats?.verifiedTbis ?? (loading ? '...' : '400+')}
              </p>
              <p className="text-xs sm:text-sm font-medium text-slate-muted mt-1 uppercase tracking-wider">
                Verified Records
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured TBIs Section (Section 60) */}
      <section className="py-16 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center space-x-2 text-teal text-xs font-bold uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified Ecosystems</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-navy">Featured TBIs</h2>
            <p className="text-sm text-slate-muted mt-1">
              Technology business incubators with verified credentials and contact details.
            </p>
          </div>
          <Link
            to="/explore"
            className="inline-flex items-center space-x-1.5 text-sm font-semibold text-navy hover:text-teal transition-colors shrink-0"
          >
            <span>View all incubators</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredTbis.map((tbi) => (
              <TbiCard key={tbi.id} tbi={tbi} />
            ))}
          </div>
        )}
      </section>

      {/* Popular Incubator Categories (Section 37) */}
      {popularCategories.length > 0 && (
        <section className="py-16 bg-surface border-y border-slate-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-navy">Explore by Incubator Type</h2>
                <p className="text-sm text-slate-muted mt-1">
                  Browse incubators based on institutional recognition and funding programs.
                </p>
              </div>
              <Link
                to="/categories"
                className="text-sm font-semibold text-teal hover:underline flex items-center space-x-1"
              >
                <span>All Categories</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {popularCategories.map((cat) => (
                <Link
                  key={cat.name}
                  to={`/explore?incubatorType=${encodeURIComponent(cat.name)}`}
                  className="p-4 rounded-xl border border-slate-border bg-background hover:bg-white hover:border-teal/50 hover:shadow-hover transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center space-x-3 overflow-hidden">
                    <div className="w-9 h-9 rounded-lg bg-navy-50 text-navy flex items-center justify-center font-bold text-xs shrink-0 group-hover:bg-teal-50 group-hover:text-teal transition-colors">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <p className="text-sm font-bold text-slate group-hover:text-navy truncate">
                        {cat.name}
                      </p>
                      <p className="text-xs text-slate-muted">{cat.count} TBIs registered</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-muted group-hover:text-teal group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Top Universities Section */}
      {topUniversities.length > 0 && (
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-navy">Leading Innovation Universities</h2>
              <p className="text-sm text-slate-muted mt-1">
                Colleges and universities pioneering entrepreneurial ecosystems.
              </p>
            </div>
            <Link
              to="/universities"
              className="text-sm font-semibold text-teal hover:underline flex items-center space-x-1"
            >
              <span>View All Universities</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {topUniversities.map((uni) => (
              <Link
                key={uni.university}
                to={`/explore?university=${encodeURIComponent(uni.university)}`}
                className="p-4 rounded-xl border border-slate-border bg-surface hover:shadow-hover hover:border-slate-300 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center space-x-3 overflow-hidden">
                  <div className="w-9 h-9 rounded-lg bg-navy-50 text-navy flex items-center justify-center shrink-0">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <p className="text-sm font-bold text-slate group-hover:text-navy truncate">
                      {uni.university}
                    </p>
                    <p className="text-xs text-slate-muted">{uni.city} • {uni.tbiCount} TBI</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-muted group-hover:text-navy group-hover:translate-x-0.5 transition-all shrink-0" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* How It Works */}
      <section className="py-16 bg-slate-50 border-t border-slate-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-navy">How TBI Global Works</h2>
          <p className="text-sm text-slate-muted mt-2 max-w-lg mx-auto">
            A frictionless directory empowering researchers, students, and founders.
          </p>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-surface p-6 rounded-2xl border border-slate-border shadow-card text-left">
              <div className="w-10 h-10 rounded-xl bg-navy text-white flex items-center justify-center font-bold mb-4">
                1
              </div>
              <h3 className="text-base font-bold text-slate mb-1">Search & Filter</h3>
              <p className="text-sm text-slate-muted">
                Search across 500+ authentic records by university, incubator category, city, or status.
              </p>
            </div>

            <div className="bg-surface p-6 rounded-2xl border border-slate-border shadow-card text-left">
              <div className="w-10 h-10 rounded-xl bg-teal text-white flex items-center justify-center font-bold mb-4">
                2
              </div>
              <h3 className="text-base font-bold text-slate mb-1">Inspect Verified Details</h3>
              <p className="text-sm text-slate-muted">
                Review verified status, official contact emails, and verified portal links without fabricated information.
              </p>
            </div>

            <div className="bg-surface p-6 rounded-2xl border border-slate-border shadow-card text-left">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold mb-4">
                3
              </div>
              <h3 className="text-base font-bold text-slate mb-1">Save & Connect</h3>
              <p className="text-sm text-slate-muted">
                Bookmark incubation centres to your personal dashboard and reach out directly to incubation officers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 bg-navy text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Ready to find the right incubator for your next idea?
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
            Join founders and researchers discovering incubation opportunities across university ecosystems.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              to="/signup"
              className="px-6 py-2.5 rounded-xl bg-teal hover:bg-teal-600 text-white text-sm font-semibold transition-colors shadow-sm"
            >
              Get Started Free
            </Link>
            <Link
              to="/explore"
              className="px-6 py-2.5 rounded-xl bg-navy-600 hover:bg-navy-700 text-white text-sm font-semibold border border-white/20 transition-colors"
            >
              Explore Directory
            </Link>
          </div>
        </div>
      </section>

      {/* Footer (Section 61) */}
      <footer className="bg-surface border-t border-slate-border py-12 text-sm text-slate-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 text-navy font-bold text-base mb-2">
                <div className="w-6 h-6 rounded bg-navy text-white text-xs flex items-center justify-center font-bold">
                  T
                </div>
                <span>TBI GLOBAL</span>
              </div>
              <p className="text-xs text-slate-muted mt-1 leading-relaxed">
                Find. Connect. Innovate.
                <br />
                The comprehensive discovery platform for university and startup incubation centres.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate mb-3">Explore</h4>
              <ul className="space-y-2 text-xs">
                <li><Link to="/explore" className="hover:text-navy">Explore TBIs</Link></li>
                <li><Link to="/universities" className="hover:text-navy">Universities</Link></li>
                <li><Link to="/categories" className="hover:text-navy">Categories</Link></li>
                <li><Link to="/nearby" className="hover:text-navy">Nearby TBIs</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate mb-3">Platform</h4>
              <ul className="space-y-2 text-xs">
                <li><Link to="/suggest" className="hover:text-navy">Suggest a TBI</Link></li>
                <li><Link to="/saved" className="hover:text-navy">Saved TBIs</Link></li>
                <li><Link to="/dashboard" className="hover:text-navy">Dashboard</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate mb-3">Administration</h4>
              <ul className="space-y-2 text-xs">
                <li><Link to="/login" className="hover:text-navy">Admin Login</Link></li>
                <li><Link to="/admin" className="hover:text-navy">Admin Portal</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400">
            <p>© 2026 TBI Global. All rights reserved.</p>
            <p className="mt-2 sm:mt-0 text-[11px]">
              Independent incubator discovery directory grounded in verified university records.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
