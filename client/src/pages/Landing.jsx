import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Compass,
  Building2,
  CheckCircle2,
  Layers,
  ArrowRight,
  ShieldCheck,
  Globe2,
  GitCompare,
  MapPin,
  ChevronRight
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
          tbiService.getTbis({ status: 'Verified', limit: 6 }).catch(() => ({ success: false })),
          tbiService.getCategories().catch(() => ({ success: false })),
          tbiService.getUniversities({ limit: 6 }).catch(() => ({ success: false }))
        ]);

        if (active) {
          if (statsRes?.success && statsRes.data) setStats(statsRes.data);
          if (tbisRes?.success && Array.isArray(tbisRes.data)) setFeaturedTbis(tbisRes.data);
          if (catsRes?.success && catsRes.data?.incubatorTypes && Array.isArray(catsRes.data.incubatorTypes)) {
            setPopularCategories(catsRes.data.incubatorTypes.slice(0, 6));
          }
          if (unisRes?.success && Array.isArray(unisRes.data)) setTopUniversities(unisRes.data.slice(0, 6));
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
    if (query && query.trim()) {
      navigate(`/explore?q=${encodeURIComponent(query.trim())}`);
    } else {
      navigate('/explore');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white selection:bg-primary-light selection:text-primary">
      <Navbar />

      {/* Hero Section: Dark Tech Ecosystem with Glowing Perspective Wave (YNOS Aesthetic) */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 bg-[#0a0a0c] text-white overflow-hidden border-b border-white/10">
        {/* Background 3D Perspective Glowing Grid Effect */}
        <div className="absolute inset-0 perspective-grid-container pointer-events-none opacity-80">
          <div className="perspective-grid-plane" />
        </div>

        {/* Ambient Radial Glows */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[350px] bg-gradient-to-b from-orange-500/20 via-orange-600/10 to-transparent blur-[120px] pointer-events-none rounded-full" />
        <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#0a0a0c] to-transparent pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* YNOS-style Sub-pills: OPPORTUNITIES • GROWTH • FUNDING • IMPACT */}
          <div className="inline-flex items-center space-x-2 text-xs sm:text-sm font-bold tracking-widest text-orange-400 uppercase mb-6">
            <span>OPPORTUNITIES</span>
            <span className="text-orange-500/70">•</span>
            <span>GROWTH</span>
            <span className="text-orange-500/70">•</span>
            <span>INCUBATION</span>
            <span className="text-orange-500/70">•</span>
            <span>IMPACT</span>
          </div>

          {/* Main Hero Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.14] max-w-4xl mx-auto font-heading">
            Navigate the Indian Technology &amp; Incubator Ecosystem with Ease &amp; Accuracy
          </h1>

          {/* Supporting Description */}
          <p className="mt-5 text-sm sm:text-base md:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
            TBI Nexus is a national intelligence hub that saves time, effort, and cost with the most comprehensive, up-to-date insights across Technology Business Incubators, Universities, Labs, Government Schemes, and Startup Hubs.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/signup"
              className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-lg bg-white text-dark hover:bg-slate-100 text-sm font-bold tracking-wide uppercase shadow-lg hover:shadow-orange-500/20 transition-all active:scale-[0.98]"
            >
              <span>SIGN-UP FOR FREE</span>
            </Link>
            <Link
              to="/explore"
              className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-lg bg-white/10 hover:bg-white/15 text-white border border-white/20 text-sm font-semibold tracking-wide transition-all"
            >
              <Compass className="w-4 h-4 text-orange-400" />
              <span>Explore 500+ TBIs</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          {/* Search Input Bar embedded in Hero */}
          <form
            onSubmit={handleSearchSubmit}
            className="mt-10 max-w-2xl mx-auto flex items-center bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/20 shadow-2xl focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-400/30 transition-all duration-150"
          >
            <div className="pl-3 pr-2 text-slate-400">
              <Search className="w-5 h-5 text-orange-400" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by university, city, incubator name, or technology sector..."
              className="w-full text-sm font-normal text-white placeholder:text-slate-400 focus:outline-none bg-transparent"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold shadow-md transition-all active:scale-[0.98] shrink-0 cursor-pointer"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Orange Accent Metrics Strip (YNOS-style) */}
      <section className="py-4 bg-[#f97316] text-white border-b border-orange-600 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center divide-y md:divide-y-0 md:divide-x divide-white/20">
            <div className="p-1">
              <p className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
                {stats?.totalTbis ?? (loading ? '...' : '521')}
              </p>
              <p className="text-[11px] font-bold text-orange-100 uppercase tracking-wider">
                Total Incubators
              </p>
            </div>
            <div className="p-1">
              <p className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
                {stats?.uniqueUniversities ?? (loading ? '...' : '350+')}
              </p>
              <p className="text-[11px] font-bold text-orange-100 uppercase tracking-wider">
                Host Universities
              </p>
            </div>
            <div className="p-1">
              <p className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
                {stats?.uniqueCities ?? (loading ? '...' : '150+')}
              </p>
              <p className="text-[11px] font-bold text-orange-100 uppercase tracking-wider">
                Cities Across India
              </p>
            </div>
            <div className="p-1">
              <p className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
                {stats?.verifiedTbis ?? (loading ? '...' : '400+')}
              </p>
              <p className="text-[11px] font-bold text-orange-100 uppercase tracking-wider">
                Accredited Hubs
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Platform Capabilities */}
      <section className="py-14 sm:py-16 bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-dark tracking-tight font-heading">
              Platform Features
            </h2>
            <p className="mt-2 text-sm text-slate-muted">
              Structured discovery and benchmarking tools for researchers, founders, and institutions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <Link
              to="/explore"
              className="p-5 rounded-card bg-white border border-border hover:border-primary hover:shadow-hover transition-all duration-150 group"
            >
              <div className="w-10 h-10 rounded-lg bg-primary-light text-primary flex items-center justify-center mb-4 transition-colors">
                <Search className="w-5 h-5 text-primary" />
              </div>
              <p className="text-sm font-bold text-dark group-hover:text-primary transition-colors">
                Smart Search &amp; Filter
              </p>
              <p className="text-xs text-slate-muted mt-1.5 leading-relaxed">
                Filter by city, university type, incubation recognition, and status.
              </p>
            </Link>

            <Link
              to="/explore?status=Verified"
              className="p-5 rounded-card bg-white border border-border hover:border-primary hover:shadow-hover transition-all duration-150 group"
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-status-success flex items-center justify-center mb-4 transition-colors">
                <ShieldCheck className="w-5 h-5 text-status-success" />
              </div>
              <p className="text-sm font-bold text-dark group-hover:text-primary transition-colors">
                Verified Hubs
              </p>
              <p className="text-xs text-slate-muted mt-1.5 leading-relaxed">
                Official contact records, director names, and verified portal links.
              </p>
            </Link>

            <Link
              to="/compare"
              className="p-5 rounded-card bg-white border border-border hover:border-primary hover:shadow-hover transition-all duration-150 group"
            >
              <div className="w-10 h-10 rounded-lg bg-primary-light text-primary flex items-center justify-center mb-4 transition-colors">
                <GitCompare className="w-5 h-5 text-primary" />
              </div>
              <p className="text-sm font-bold text-dark group-hover:text-primary transition-colors">
                Compare Incubators
              </p>
              <p className="text-xs text-slate-muted mt-1.5 leading-relaxed">
                Side-by-side comparison of focus areas, facilities, and university backing.
              </p>
            </Link>

            <Link
              to="/universities"
              className="p-5 rounded-card bg-white border border-border hover:border-primary hover:shadow-hover transition-all duration-150 group"
            >
              <div className="w-10 h-10 rounded-lg bg-sky-50 text-secondary-accent flex items-center justify-center mb-4 transition-colors">
                <Building2 className="w-5 h-5 text-secondary-accent" />
              </div>
              <p className="text-sm font-bold text-dark group-hover:text-primary transition-colors">
                University Hubs
              </p>
              <p className="text-xs text-slate-muted mt-1.5 leading-relaxed">
                Explore premier IIT, NIT, Central, and State university incubation systems.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured TBIs Section */}
      <section className="py-14 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center space-x-1.5 text-primary text-xs font-bold uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span>Verified Directory</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-dark font-heading">
              Featured Incubators
            </h2>
            <p className="text-sm text-slate-muted mt-1">
              Technology business incubators with verified credentials and contact details.
            </p>
          </div>
          <Link
            to="/explore"
            className="inline-flex items-center space-x-1.5 text-sm font-semibold text-primary hover:text-primary-hover transition-colors shrink-0"
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

      {/* Popular Incubator Categories */}
      {popularCategories.length > 0 && (
        <section className="py-14 sm:py-16 bg-background-secondary border-y border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-extrabold text-dark font-heading">
                  Explore by Incubator Type
                </h2>
                <p className="text-sm text-slate-muted mt-1">
                  Browse incubators based on institutional recognition and funding programs.
                </p>
              </div>
              <Link
                to="/categories"
                className="text-sm font-semibold text-primary hover:underline flex items-center space-x-1"
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
                  className="p-4 rounded-card border border-border bg-white hover:border-primary hover:shadow-hover transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center space-x-3 overflow-hidden">
                    <div className="w-9 h-9 rounded-lg bg-primary-light text-primary flex items-center justify-center font-bold text-xs shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <p className="text-sm font-bold text-dark group-hover:text-primary truncate">
                        {cat.name}
                      </p>
                      <p className="text-xs text-slate-muted">{cat.count} TBIs registered</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Top Universities Section */}
      {topUniversities.length > 0 && (
        <section className="py-14 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-extrabold text-dark font-heading">
                Leading Innovation Universities
              </h2>
              <p className="text-sm text-slate-muted mt-1">
                Colleges and universities pioneering entrepreneurial ecosystems.
              </p>
            </div>
            <Link
              to="/universities"
              className="text-sm font-semibold text-primary hover:underline flex items-center space-x-1"
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
                className="p-4 rounded-card border border-border bg-white hover:border-primary hover:shadow-hover transition-all flex items-center justify-between group"
              >
                <div className="flex items-center space-x-3 overflow-hidden">
                  <div className="w-9 h-9 rounded-lg bg-background-secondary text-primary border border-border flex items-center justify-center shrink-0">
                    <Building2 className="w-4 h-4 text-primary" />
                  </div>
                  <div className="truncate">
                    <p className="text-sm font-bold text-dark group-hover:text-primary truncate">
                      {uni.university}
                    </p>
                    <p className="text-xs text-slate-muted">{uni.city} • {uni.tbiCount} TBI</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* How TBI Nexus Works */}
      <section className="py-14 sm:py-16 bg-background-secondary border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-dark font-heading">
            How TBI Nexus Works
          </h2>
          <p className="text-sm text-slate-muted mt-2 max-w-lg mx-auto">
            A reliable directory connecting founders, students, and research institutions.
          </p>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="bg-white p-6 rounded-card border border-border shadow-subtle">
              <div className="w-9 h-9 rounded-lg bg-primary-light text-primary flex items-center justify-center font-bold text-sm mb-4">
                1
              </div>
              <h3 className="text-base font-bold text-dark mb-1">Search &amp; Filter</h3>
              <p className="text-sm text-slate-secondary">
                Search across 500+ authentic records by university, incubator category, city, or status.
              </p>
            </div>

            <div className="bg-white p-6 rounded-card border border-border shadow-subtle">
              <div className="w-9 h-9 rounded-lg bg-primary-light text-primary flex items-center justify-center font-bold text-sm mb-4">
                2
              </div>
              <h3 className="text-base font-bold text-dark mb-1">Inspect Verified Details</h3>
              <p className="text-sm text-slate-secondary">
                Review verified status, official contact emails, and verified portal links without fabricated info.
              </p>
            </div>

            <div className="bg-white p-6 rounded-card border border-border shadow-subtle">
              <div className="w-9 h-9 rounded-lg bg-primary-light text-primary flex items-center justify-center font-bold text-sm mb-4">
                3
              </div>
              <h3 className="text-base font-bold text-dark mb-1">Save &amp; Connect</h3>
              <p className="text-sm text-slate-secondary">
                Bookmark incubation centres to your personal dashboard and reach out directly to incubation officers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Clean Call To Action */}
      <section className="py-14 bg-dark text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-heading">
            Ready to find the right incubator for your next venture?
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
            Join founders and researchers discovering incubation opportunities across university ecosystems.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              to="/signup"
              className="px-6 py-2.5 rounded-btn bg-primary hover:bg-primary-hover text-white text-sm font-semibold transition-colors shadow-subtle"
            >
              Get Started Free
            </Link>
            <Link
              to="/explore"
              className="px-6 py-2.5 rounded-btn bg-dark-secondary hover:bg-slate-800 text-white text-sm font-semibold border border-slate-700 transition-colors"
            >
              Explore Directory
            </Link>
          </div>
        </div>
      </section>

      {/* Redesigned Corporate Dark Footer */}
      <footer className="bg-dark text-slate-400 border-t border-slate-800 py-12 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-2.5 text-white font-bold text-base mb-2.5">
                <img
                  src="/tbi-nexus-logo.png"
                  alt="TBI Nexus"
                  className="w-7 h-7 rounded-lg object-cover border border-slate-700 shadow-subtle"
                />
                <span className="font-heading">TBI NEXUS</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                The comprehensive discovery platform for university and startup technology business incubators. Grounded in verified institutional records.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 font-heading">
                Platform
              </h4>
              <ul className="space-y-2 text-xs">
                <li><Link to="/explore" className="hover:text-white transition-colors">Explore TBIs</Link></li>
                <li><Link to="/universities" className="hover:text-white transition-colors">Universities</Link></li>
                <li><Link to="/categories" className="hover:text-white transition-colors">Categories</Link></li>
                <li><Link to="/compare" className="hover:text-white transition-colors">Compare TBIs</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 font-heading">
                Resources
              </h4>
              <ul className="space-y-2 text-xs">
                <li><Link to="/suggest" className="hover:text-white transition-colors">Suggest a TBI</Link></li>
                <li><Link to="/saved" className="hover:text-white transition-colors">Saved TBIs</Link></li>
                <li><Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 font-heading">
                Administration
              </h4>
              <ul className="space-y-2 text-xs">
                <li><Link to="/login" className="hover:text-white transition-colors">Admin Login</Link></li>
                <li><Link to="/admin" className="hover:text-white transition-colors">Admin Portal</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
            <p>© 2026 TBI Nexus. All rights reserved.</p>
            <p className="mt-2 sm:mt-0 text-[11px]">
              Independent technology incubator discovery platform.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
