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
  Globe2,
  GitCompare,
  ChevronDown
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

      {/* Hero Section (First Viewport: Navbar -> Badge -> Headline -> Description -> CTA -> Scroll Indicator) */}
      <section className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between pt-8 sm:pt-12 pb-4 sm:pb-6 border-b border-slate-border bg-gradient-to-b from-[#D9CAB3]/25 via-[#FAF7F2] to-[#FAF7F2] overflow-hidden">
        {/* Extremely Subtle Ambient Warm Glow */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_50%_40%,rgba(217,202,179,0.22),transparent_70%)]" />

        {/* Top Spacer for Vertical Balance */}
        <div className="hidden sm:block sm:h-2" />

        {/* Centered Hero Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center my-auto flex flex-col items-center relative z-10">
          {/* 1. Ecosystem Subheading / Tagline */}
          <p className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-[#7A0B1A]/80 mb-4 sm:mb-6">
            India's Verified University &amp; Startup Incubator Ecosystem
          </p>

          {/* 2. Main Hero Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-[68px] font-extrabold text-[#7A0B1A] tracking-tight leading-[1.12] sm:leading-[1.14] max-w-3xl mx-auto">
            Discover Where{' '}
            <span className="text-[#5B0712] underline decoration-[#D99A2B] decoration-4 underline-offset-8">
              Innovation
            </span>{' '}
            Begins.
          </h1>

          {/* 3. Short Supporting Description */}
          <p className="mt-6 sm:mt-8 text-base sm:text-lg lg:text-xl text-[#647C98] max-w-2xl mx-auto font-normal leading-relaxed">
            Discover verified university incubators, innovation hubs, and startup ecosystems across India.
          </p>

          {/* 4. Primary and Secondary Action CTAs */}
          <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/explore"
              className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-xl bg-[#7A0B1A] text-white text-sm font-bold hover:bg-[#5B0712] active:scale-[0.98] transition-all duration-200 shadow-sm hover:shadow-md border border-[#7A0B1A]"
            >
              <span>Explore Incubators →</span>
            </Link>
            <Link
              to="/universities"
              className="inline-flex items-center space-x-2 px-7 py-3.5 rounded-xl bg-white border border-[#D9CAB3] text-[#7A0B1A] text-sm font-bold hover:bg-[#FAF7F2] hover:border-[#7A0B1A] active:scale-[0.98] transition-all duration-200 shadow-2xs"
            >
              <Building2 className="w-4 h-4 text-[#D99A2B]" />
              <span>Browse Universities</span>
            </Link>
          </div>
        </div>

        {/* 5. Subtle Scroll Indicator */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center pt-4 pb-2">
          <a
            href="#explore-features"
            className="inline-flex flex-col items-center space-y-1.5 text-xs font-semibold text-[#647C98] hover:text-[#7A0B1A] transition-colors cursor-pointer group"
          >
            <span className="text-[11px] tracking-wider uppercase opacity-75 group-hover:opacity-100 transition-opacity">
              Scroll to explore
            </span>
            <ChevronDown className="w-4 h-4 text-[#7A0B1A] animate-bounce" />
          </a>
        </div>
      </section>

      {/* Feature Cards Section (Below the fold) */}
      <section id="explore-features" className="py-16 md:py-20 bg-surface border-b border-slate-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#7A0B1A] tracking-tight">
              Explore TBI Nexus
            </h2>
            <p className="mt-2 text-sm text-[#647C98]">
              Comprehensive discovery and benchmarking tools for India's technology incubation infrastructure.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
            <Link
              to="/explore"
              className="flex items-start space-x-3.5 p-5 rounded-2xl bg-[#FAF7F2]/60 border border-[#D9CAB3] hover:border-[#7A0B1A]/50 hover:bg-white shadow-2xs hover:shadow-card transition-all duration-200 group"
            >
              <div className="w-10 h-10 rounded-xl bg-white border border-[#D9CAB3] flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform duration-200">
                <Search className="w-5 h-5 text-[#7A0B1A]" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#243447] group-hover:text-[#7A0B1A] transition-colors">
                  Search &amp; Filter
                </p>
                <p className="text-xs text-[#647C98] mt-1 leading-relaxed">
                  Search by city, university, incubator scheme, and sector.
                </p>
              </div>
            </Link>

            <Link
              to="/explore?status=Verified"
              className="flex items-start space-x-3.5 p-5 rounded-2xl bg-[#FAF7F2]/60 border border-[#D9CAB3] hover:border-[#7A0B1A]/50 hover:bg-white shadow-2xs hover:shadow-card transition-all duration-200 group"
            >
              <div className="w-10 h-10 rounded-xl bg-white border border-[#D9CAB3] flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform duration-200">
                <ShieldCheck className="w-5 h-5 text-[#16A36A]" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#243447] group-hover:text-[#7A0B1A] transition-colors">
                  Verified Hubs
                </p>
                <p className="text-xs text-[#647C98] mt-1 leading-relaxed">
                  Direct official contact emails, directors, and websites.
                </p>
              </div>
            </Link>

            <Link
              to="/compare"
              className="flex items-start space-x-3.5 p-5 rounded-2xl bg-[#FAF7F2]/60 border border-[#D9CAB3] hover:border-[#7A0B1A]/50 hover:bg-white shadow-2xs hover:shadow-card transition-all duration-200 group"
            >
              <div className="w-10 h-10 rounded-xl bg-white border border-[#D9CAB3] flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform duration-200">
                <GitCompare className="w-5 h-5 text-[#7A0B1A]" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#243447] group-hover:text-[#7A0B1A] transition-colors">
                  Compare TBIs
                </p>
                <p className="text-xs text-[#647C98] mt-1 leading-relaxed">
                  Side-by-side comparison of focus areas and amenities.
                </p>
              </div>
            </Link>

            <Link
              to="/explore"
              className="flex items-start space-x-3.5 p-5 rounded-2xl bg-[#FAF7F2]/60 border border-[#D9CAB3] hover:border-[#7A0B1A]/50 hover:bg-white shadow-2xs hover:shadow-card transition-all duration-200 group"
            >
              <div className="w-10 h-10 rounded-xl bg-white border border-[#D9CAB3] flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform duration-200">
                <MapPin className="w-5 h-5 text-[#D99A2B]" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#243447] group-hover:text-[#7A0B1A] transition-colors">
                  Nearby Proximity
                </p>
                <p className="text-xs text-[#647C98] mt-1 leading-relaxed">
                  Nationwide directory covering incubators in 150+ cities.
                </p>
              </div>
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
              <div className="flex items-center space-x-2.5 text-[#7A0B1A] font-bold text-base mb-2">
                <img
                  src="/tbi-nexus-logo.png"
                  alt="TBI Nexus"
                  className="w-7 h-7 rounded-lg object-cover border border-[#5B0712] shadow-2xs"
                />
                <span>TBI NEXUS</span>
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
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#7A0B1A] mb-3">Platform</h4>
              <ul className="space-y-2 text-xs">
                <li><Link to="/compare" className="hover:text-[#5B0712]">Compare TBIs</Link></li>
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
            <p>© 2026 TBI Nexus. All rights reserved.</p>
            <p className="mt-2 sm:mt-0 text-[11px]">
              Independent incubator discovery directory grounded in verified university records.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
