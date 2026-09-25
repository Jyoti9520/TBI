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
import { SearchBar } from '../components/SearchBar';

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

  const handleSearchSubmit = (searchTerm) => {
    const term = typeof searchTerm === 'string' ? searchTerm : query;
    if (term && term.trim()) {
      navigate(`/explore?q=${encodeURIComponent(term.trim())}`);
    } else {
      navigate('/explore');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-[#D9CAB3] selection:text-[#7A0B1A]">
      <Navbar />

      {/* Hero Section styled with palette gradient: #D9CAB3, #FAF7F2, #5B0712 */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 border-b border-slate-border bg-gradient-to-b from-[#D9CAB3]/40 via-[#FAF7F2] to-[#D9CAB3]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Subtle Pill using #D9CAB3 and #5B0712 */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#D9CAB3] border border-[#8C7A6B] text-[#7A0B1A] text-xs font-bold mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#5B0712]" />
            <span>Discover University & Startup Incubators</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#7A0B1A] tracking-tight max-w-4xl mx-auto leading-tight sm:leading-tight">
            Discover Where <span className="text-[#5B0712] underline decoration-[#D9CAB3] decoration-4 underline-offset-4">Innovation</span> Begins.
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-muted max-w-2xl mx-auto font-normal">
            Find Technology Business Incubators (TBIs), university incubation centres, and startup ecosystems across institutions in India.
          </p>

          {/* Search Box on Landing */}
          <div className="mt-8 max-w-2xl mx-auto bg-surface p-2 rounded-2xl border border-slate-border shadow-hover">
            <SearchBar
              value={query}
              onChange={(val) => setQuery(val)}
              onSearch={handleSearchSubmit}
              placeholder="Search universities, TBIs, cities, or incubator types..."
              showFilterButton={false}
            />
          </div>

          {/* Action CTAs */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/explore"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#7A0B1A] text-[#D9CAB3] text-sm font-bold hover:bg-[#5B0712] transition-colors shadow-sm"
            >
              <Compass className="w-4 h-4" />
              <span>Explore TBIs</span>
            </Link>
            <Link
              to="/universities"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-surface border border-slate-border text-[#7A0B1A] text-sm font-semibold hover:bg-[#D9CAB3]/40 transition-colors shadow-subtle"
            >
              <Building2 className="w-4 h-4 text-[#5B0712]" />
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
              <p className="text-3xl sm:text-4xl font-extrabold text-[#7A0B1A]">
                {stats?.totalTbis ?? (loading ? '...' : '500+')}
              </p>
              <p className="text-xs sm:text-sm font-bold text-slate-muted mt-1 uppercase tracking-wider">
                Total TBIs
              </p>
            </div>
            <div className="p-2 border-l border-slate-100">
              <p className="text-3xl sm:text-4xl font-extrabold text-[#5B0712]">
                {stats?.uniqueUniversities ?? (loading ? '...' : '350+')}
              </p>
              <p className="text-xs sm:text-sm font-bold text-slate-muted mt-1 uppercase tracking-wider">
                Universities
              </p>
            </div>
            <div className="p-2 border-l border-slate-100">
              <p className="text-3xl sm:text-4xl font-extrabold text-[#7A0B1A]">
                {stats?.uniqueCities ?? (loading ? '...' : '150+')}
              </p>
              <p className="text-xs sm:text-sm font-bold text-slate-muted mt-1 uppercase tracking-wider">
                Cities Covered
              </p>
            </div>
            <div className="p-2 border-l border-slate-100">
              <p className="text-3xl sm:text-4xl font-extrabold text-[#2E6F40]">
                {stats?.verifiedTbis ?? (loading ? '...' : '400+')}
              </p>
              <p className="text-xs sm:text-sm font-bold text-slate-muted mt-1 uppercase tracking-wider">
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
            <div className="flex items-center space-x-2 text-[#5B0712] text-xs font-bold uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4 text-[#5B0712]" />
              <span>Verified Ecosystems</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#7A0B1A]">Featured TBIs</h2>
            <p className="text-sm text-slate-muted mt-1">
              Technology business incubators with verified credentials and contact details.
            </p>
          </div>
          <Link
            to="/explore"
            className="inline-flex items-center space-x-1.5 text-sm font-bold text-[#5B0712] hover:text-[#7A0B1A] transition-colors shrink-0"
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
                <h2 className="text-2xl font-extrabold text-[#7A0B1A]">Explore by Incubator Type</h2>
                <p className="text-sm text-slate-muted mt-1">
                  Browse incubators based on institutional recognition and funding programs.
                </p>
              </div>
              <Link
                to="/categories"
                className="text-sm font-bold text-[#5B0712] hover:underline flex items-center space-x-1"
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
                  className="p-4 rounded-xl border border-slate-border bg-background hover:bg-white hover:border-[#5B0712] hover:shadow-hover transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center space-x-3 overflow-hidden">
                    <div className="w-9 h-9 rounded-lg bg-[#D9CAB3] text-[#7A0B1A] flex items-center justify-center font-bold text-xs shrink-0 group-hover:bg-[#5B0712] group-hover:text-[#D9CAB3] transition-colors">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <p className="text-sm font-bold text-slate group-hover:text-[#5B0712] truncate">
                        {cat.name}
                      </p>
                      <p className="text-xs text-slate-muted">{cat.count} TBIs registered</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-muted group-hover:text-[#5B0712] group-hover:translate-x-1 transition-all" />
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
              <h2 className="text-2xl font-extrabold text-[#7A0B1A]">Leading Innovation Universities</h2>
              <p className="text-sm text-slate-muted mt-1">
                Colleges and universities pioneering entrepreneurial ecosystems.
              </p>
            </div>
            <Link
              to="/universities"
              className="text-sm font-bold text-[#5B0712] hover:underline flex items-center space-x-1"
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
                className="p-4 rounded-xl border border-slate-border bg-surface hover:shadow-hover hover:border-[#5B0712] transition-all flex items-center justify-between group"
              >
                <div className="flex items-center space-x-3 overflow-hidden">
                  <div className="w-9 h-9 rounded-lg bg-[#D9CAB3]/60 text-[#7A0B1A] flex items-center justify-center shrink-0">
                    <Building2 className="w-4 h-4 text-[#5B0712]" />
                  </div>
                  <div className="truncate">
                    <p className="text-sm font-bold text-slate group-hover:text-[#5B0712] truncate">
                      {uni.university}
                    </p>
                    <p className="text-xs text-slate-muted">{uni.city} • {uni.tbiCount} TBI</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-muted group-hover:text-[#5B0712] group-hover:translate-x-0.5 transition-all shrink-0" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* How It Works */}
      <section className="py-16 bg-[#F5EFE6] border-t border-slate-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#7A0B1A]">How TBI Global Works</h2>
          <p className="text-sm text-slate-muted mt-2 max-w-lg mx-auto">
            A frictionless directory empowering researchers, students, and founders.
          </p>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-surface p-6 rounded-2xl border border-slate-border shadow-card text-left">
              <div className="w-10 h-10 rounded-xl bg-[#7A0B1A] text-[#D9CAB3] flex items-center justify-center font-bold mb-4 shadow-sm border border-[#7A0B1A]">
                1
              </div>
              <h3 className="text-base font-bold text-slate mb-1">Search & Filter</h3>
              <p className="text-sm text-slate-muted">
                Search across 500+ authentic records by university, incubator category, city, or status.
              </p>
            </div>

            <div className="bg-surface p-6 rounded-2xl border border-slate-border shadow-card text-left">
              <div className="w-10 h-10 rounded-xl bg-[#5B0712] text-[#D9CAB3] flex items-center justify-center font-bold mb-4 shadow-sm">
                2
              </div>
              <h3 className="text-base font-bold text-slate mb-1">Inspect Verified Details</h3>
              <p className="text-sm text-slate-muted">
                Review verified status, official contact emails, and verified portal links without fabricated information.
              </p>
            </div>

            <div className="bg-surface p-6 rounded-2xl border border-slate-border shadow-card text-left">
              <div className="w-10 h-10 rounded-xl bg-[#D9CAB3] text-[#7A0B1A] flex items-center justify-center font-bold mb-4 shadow-sm border border-[#8C7A6B]">
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

      {/* CTA styled with #7A0B1A and #D9CAB3 */}
      <section className="py-14 bg-gradient-to-r from-[#7A0B1A] via-[#7A0B1A] to-[#5B0712] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#FAF7F2]">
            Ready to find the right incubator for your next idea?
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#D9CAB3] max-w-xl mx-auto">
            Join founders and researchers discovering incubation opportunities across university ecosystems.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              to="/signup"
              className="px-6 py-2.5 rounded-xl bg-[#D9CAB3] hover:bg-[#FAF7F2] text-[#7A0B1A] text-sm font-bold transition-colors shadow-sm"
            >
              Get Started Free
            </Link>
            <Link
              to="/explore"
              className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#D9CAB3] text-sm font-semibold border border-[#D9CAB3]/30 transition-colors"
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
              <div className="flex items-center space-x-2 text-[#7A0B1A] font-bold text-base mb-2">
                <div className="w-6 h-6 rounded bg-[#7A0B1A] text-[#D9CAB3] text-xs flex items-center justify-center font-bold">
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
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#7A0B1A] mb-3">Explore</h4>
              <ul className="space-y-2 text-xs">
                <li><Link to="/explore" className="hover:text-[#5B0712]">Explore TBIs</Link></li>
                <li><Link to="/universities" className="hover:text-[#5B0712]">Universities</Link></li>
                <li><Link to="/categories" className="hover:text-[#5B0712]">Categories</Link></li>
                <li><Link to="/nearby" className="hover:text-[#5B0712]">Nearby TBIs</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#7A0B1A] mb-3">Platform</h4>
              <ul className="space-y-2 text-xs">
                <li><Link to="/suggest" className="hover:text-[#5B0712]">Suggest a TBI</Link></li>
                <li><Link to="/saved" className="hover:text-[#5B0712]">Saved TBIs</Link></li>
                <li><Link to="/dashboard" className="hover:text-[#5B0712]">Dashboard</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#7A0B1A] mb-3">Administration</h4>
              <ul className="space-y-2 text-xs">
                <li><Link to="/login" className="hover:text-[#5B0712]">Admin Login</Link></li>
                <li><Link to="/admin" className="hover:text-[#5B0712]">Admin Portal</Link></li>
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
