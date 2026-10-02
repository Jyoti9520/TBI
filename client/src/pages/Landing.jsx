import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Sparkles,
  Target,
  ArrowRight,
  ShieldCheck,
  Building2,
  FileText,
  Compass,
  Zap,
  TrendingUp,
  Cpu,
  Layers,
  Award,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Clock,
  Filter,
  Users
} from 'lucide-react';
import { ModernNavbar } from '../components/ModernNavbar';
import { TbiCard } from '../components/TbiCard';
import { SkeletonCard } from '../components/SkeletonCard';
import { tbiService } from '../services/tbiService';
import { schemeService } from '../services/schemeService';

export const Landing = () => {
  const [query, setQuery] = useState('');
  const [selectedSchemeFilter, setSelectedSchemeFilter] = useState('ALL');
  const [stats, setStats] = useState(null);
  const [topTbis, setTopTbis] = useState([]);
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Instant Interactive Eligibility Micro-Widget State
  const [stage, setStage] = useState('idea');
  const [domain, setDomain] = useState('DeepTech / Hardware');
  const [calculatedGrant, setCalculatedGrant] = useState('₹10,00,000 (NIDHI-PRAYAS)');

  useEffect(() => {
    if (stage === 'idea') {
      setCalculatedGrant('₹30,000 / mo Stipend (NIDHI-EIR)');
    } else if (stage === 'prototype') {
      setCalculatedGrant('₹10,00,000 Non-Dilutive Grant (NIDHI-PRAYAS)');
    } else if (stage === 'pilot') {
      setCalculatedGrant('₹50,00,000 Commercialization Fund (BIRAC / SISFS)');
    }
  }, [stage, domain]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, tbisRes, schemesRes] = await Promise.all([
          tbiService.getStats().catch(() => ({ success: false })),
          tbiService.getTbis({ limit: 6, status: 'Verified' }).catch(() => ({ success: false })),
          schemeService.getSchemes().catch(() => ({ success: false }))
        ]);

        if (statsRes?.success && statsRes.data) setStats(statsRes.data);
        if (tbisRes?.success && Array.isArray(tbisRes.data)) setTopTbis(tbisRes.data);
        if (schemesRes?.success && Array.isArray(schemesRes.data)) setSchemes(schemesRes.data);
      } catch (err) {
        console.error('Failed to load landing data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/explore?q=${encodeURIComponent(query.trim())}`);
    } else {
      navigate('/explore');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#243447] flex flex-col font-sans selection:bg-[#7A0B1A] selection:text-white">
      {/* 1. High-End Modern Navbar with Mega Menu */}
      <ModernNavbar />

      {/* 2. Hero Section: Architectural Cleanliness + High-Value Intelligence Hook */}
      <section className="relative pt-12 pb-20 overflow-hidden border-b border-[#D9CAB3]/60 bg-gradient-to-b from-[#FAF7F2] via-white to-[#FAF7F2]">
        {/* Subtle Decorative Technical Grid & Radial Gradients */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#7A0B1A0a_1px,transparent_1px),linear-gradient(to_bottom,#7A0B1A0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-[#D99A2B]/10 to-[#7A0B1A]/10 blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            {/* Top Ecosystem Authority Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white border border-[#D9CAB3] shadow-2xs hover:border-[#7A0B1A] transition cursor-pointer">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-[#7A0B1A] tracking-wide">
                521 DST &amp; MeitY Technology Business Incubators Mapped
              </span>
              <span className="text-slate-300">|</span>
              <span className="text-xs font-semibold text-[#647C98]">Live Seed &amp; Grant Radar</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-[#7A0B1A] tracking-tight leading-[1.08] font-display">
              Where India's Next DeepTech <br />
              <span className="relative inline-block text-[#5B0712]">
                Breakthroughs
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-[#D99A2B]" viewBox="0 0 100 12" preserveAspectRatio="none">
                  <path d="M0,8 Q50,0 100,8" stroke="currentColor" strokeWidth="4" fill="none" />
                </svg>
              </span>{' '}
              Get Funded.
            </h1>

            {/* Sub-headline addressing the real pain point */}
            <p className="text-base sm:text-xl text-[#647C98] max-w-2xl mx-auto font-normal leading-relaxed">
              Don't dilute early equity. Discover ₹142+ Crore in non-dilutive DST NIDHI-PRAYAS grants, founder EIR stipends, and university prototyping labs across India.
            </p>

            {/* Omni-Search Box with Integrated Filters */}
            <div className="max-w-2xl mx-auto pt-2">
              <form
                onSubmit={handleSearch}
                className="bg-white p-2 rounded-2xl border-2 border-[#D9CAB3] hover:border-[#7A0B1A] focus-within:border-[#7A0B1A] focus-within:ring-4 focus-within:ring-[#7A0B1A]/10 shadow-card transition-all duration-300 flex items-center"
              >
                <div className="pl-3 pr-2 text-[#7A0B1A]">
                  <Search className="w-5 h-5 text-[#7A0B1A]" />
                </div>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by college (IIT Delhi, VIT), scheme (PRAYAS), or domain (Robotics)..."
                  className="w-full text-xs sm:text-sm font-medium text-[#243447] placeholder:text-[#647C98]/70 focus:outline-none bg-transparent"
                />
                <button
                  type="submit"
                  className="px-5 sm:px-6 py-3 rounded-xl bg-[#7A0B1A] hover:bg-[#5B0712] text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition active:scale-[0.98] shrink-0 cursor-pointer flex items-center space-x-1.5"
                >
                  <span>Search</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Instant Filter Pills */}
              <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs font-semibold">
                <span className="text-[#647C98] font-bold text-[11px] uppercase tracking-wider">Fast Track:</span>
                <Link
                  to="/grants"
                  className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100 transition flex items-center space-x-1"
                >
                  <Target className="w-3 h-3 text-emerald-600" />
                  <span>Grant Radar (₹10L-₹50L)</span>
                </Link>
                <Link
                  to="/proposal-doctor"
                  className="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 hover:bg-amber-100 transition flex items-center space-x-1"
                >
                  <Sparkles className="w-3 h-3 text-[#D99A2B]" />
                  <span>AI Proposal Doctor</span>
                </Link>
                <Link
                  to="/explore?q=NIDHI-PRAYAS"
                  className="px-2.5 py-1 rounded-lg bg-white border border-[#D9CAB3] text-[#7A0B1A] hover:border-[#7A0B1A] transition"
                >
                  PRAYAS Centers (85)
                </Link>
                <Link
                  to="/explore?q=IIT"
                  className="px-2.5 py-1 rounded-lg bg-white border border-[#D9CAB3] text-slate-700 hover:border-[#7A0B1A] transition"
                >
                  IIT Incubators (23)
                </Link>
              </div>
            </div>
          </div>

          {/* 3. Interactive Floating Intelligence Deck (Real-time Calculator Card) */}
          <div className="mt-14 max-w-5xl mx-auto bg-white rounded-3xl border border-[#D9CAB3] shadow-card p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-md bg-[#7A0B1A]/10 text-[#7A0B1A] text-[11px] font-extrabold uppercase tracking-wider">
                <Zap className="w-3.5 h-3.5 text-[#D99A2B]" />
                <span>Instant Founder Grant Calculator</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#7A0B1A]">
                Calculate how much government funding your project can unlock without equity.
              </h2>
              <p className="text-xs sm:text-sm text-[#647C98]">
                Select your venture stage below to view immediate non-dilutive eligibility across university hubs:
              </p>

              {/* Selector Tabs */}
              <div className="grid grid-cols-3 gap-2 pt-2">
                <button
                  onClick={() => setStage('idea')}
                  className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                    stage === 'idea'
                      ? 'border-[#7A0B1A] bg-[#7A0B1A]/5 shadow-xs'
                      : 'border-[#D9CAB3] bg-white hover:border-[#7A0B1A]/50'
                  }`}
                >
                  <div className="text-[10px] font-bold uppercase text-[#647C98]">TRL 2 - 3</div>
                  <div className="text-xs font-extrabold text-[#7A0B1A]">Idea / Research</div>
                </button>

                <button
                  onClick={() => setStage('prototype')}
                  className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                    stage === 'prototype'
                      ? 'border-[#7A0B1A] bg-[#7A0B1A]/5 shadow-xs'
                      : 'border-[#D9CAB3] bg-white hover:border-[#7A0B1A]/50'
                  }`}
                >
                  <div className="text-[10px] font-bold uppercase text-[#647C98]">TRL 3 - 5</div>
                  <div className="text-xs font-extrabold text-[#7A0B1A]">Prototype / MVP</div>
                </button>

                <button
                  onClick={() => setStage('pilot')}
                  className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                    stage === 'pilot'
                      ? 'border-[#7A0B1A] bg-[#7A0B1A]/5 shadow-xs'
                      : 'border-[#D9CAB3] bg-white hover:border-[#7A0B1A]/50'
                  }`}
                >
                  <div className="text-[10px] font-bold uppercase text-[#647C98]">TRL 6+</div>
                  <div className="text-xs font-extrabold text-[#7A0B1A]">Market Pilot</div>
                </button>
              </div>
            </div>

            {/* Calculated Output Box */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#7A0B1A] to-[#5B0712] rounded-2xl p-6 text-white shadow-md relative overflow-hidden flex flex-col justify-between h-full space-y-4">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-amber-300">
                  Recommended Grant Match
                </span>
                <div className="text-2xl sm:text-3xl font-black text-white mt-1 leading-tight">
                  {calculatedGrant}
                </div>
                <div className="mt-3 text-xs text-slate-200 space-y-1">
                  <div className="flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>0% Equity dilution (100% Grant-in-aid)</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Access to FabLabs &amp; CNC prototyping</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-white/20 flex items-center justify-between">
                <Link
                  to="/proposal-doctor"
                  className="text-xs font-bold text-amber-300 hover:text-white flex items-center space-x-1"
                >
                  <span>Generate DPR Proposal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  to="/grants"
                  className="px-3.5 py-1.5 rounded-lg bg-white text-[#7A0B1A] text-xs font-extrabold hover:bg-slate-100 transition shadow-2xs"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Live Ecosystem Metric Bar (Verifiable Numbers) */}
      <section className="py-8 bg-white border-b border-[#D9CAB3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
            <div className="p-2">
              <div className="text-3xl sm:text-4xl font-black text-[#7A0B1A]">
                {stats?.totalTbis ?? '521'}
              </div>
              <div className="text-xs font-bold text-[#647C98] uppercase tracking-wider mt-1">
                Empanelled TBIs
              </div>
            </div>
            <div className="p-2">
              <div className="text-3xl sm:text-4xl font-black text-[#D99A2B]">
                ₹142.5 Cr+
              </div>
              <div className="text-xs font-bold text-[#647C98] uppercase tracking-wider mt-1">
                Annual Grant Pool
              </div>
            </div>
            <div className="p-2">
              <div className="text-3xl sm:text-4xl font-black text-[#16A36A]">
                0%
              </div>
              <div className="text-xs font-bold text-[#647C98] uppercase tracking-wider mt-1">
                Equity Dilution
              </div>
            </div>
            <div className="p-2">
              <div className="text-3xl sm:text-4xl font-black text-[#5B0712]">
                {stats?.uniqueCities ?? '150+'}
              </div>
              <div className="text-xs font-bold text-[#647C98] uppercase tracking-wider mt-1">
                Cities Across India
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. What Makes TBI Nexus Different: DeepTech vs Generic Incubation */}
      <section className="py-16 sm:py-20 bg-[#FAF7F2] border-b border-[#D9CAB3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-[#7A0B1A]">
              Infrastructure Intelligence
            </h2>
            <h3 className="text-3xl sm:text-4xl font-black text-[#5B0712] mt-1 font-display">
              Engineered for DeepTech, Hardware &amp; Student Innovators
            </h3>
            <p className="text-sm text-[#647C98] mt-2">
              Private accelerators demand 7% equity for generic advice. TBI Nexus connects you directly with funded university research hubs offering physical equipment and grants.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-white rounded-2xl border border-[#D9CAB3] p-7 shadow-card hover:border-[#7A0B1A] transition-all group flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] border border-[#D9CAB3] flex items-center justify-center text-[#7A0B1A] group-hover:bg-[#7A0B1A] group-hover:text-white transition">
                  <Target className="w-6 h-6 text-[#D99A2B] group-hover:text-amber-300" />
                </div>
                <h4 className="text-lg font-extrabold text-[#7A0B1A]">
                  Grant &amp; Scheme Radar
                </h4>
                <p className="text-xs text-[#647C98] leading-relaxed">
                  Real-time database of DST NIDHI-PRAYAS, MeitY TIDE 2.0, BIRAC BIG, and SISFS programs with direct deadlines and university host lists.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                  ₹10L - ₹50L Non-Dilutive
                </span>
                <Link to="/grants" className="text-xs font-extrabold text-[#7A0B1A] hover:underline flex items-center">
                  <span>Explore</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </div>
            </div>

            {/* Feature 2: AI Proposal Doctor */}
            <div className="bg-white rounded-2xl border-2 border-[#D99A2B]/40 p-7 shadow-card hover:border-[#7A0B1A] transition-all group flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 px-3 py-1 bg-[#D99A2B] text-white text-[9px] font-extrabold uppercase tracking-wider rounded-bl-xl">
                FLAGSHIP AI
              </div>
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-[#7A0B1A]">
                  <Sparkles className="w-6 h-6 text-[#D99A2B]" />
                </div>
                <h4 className="text-lg font-extrabold text-[#7A0B1A]">
                  AI Grant Proposal Doctor
                </h4>
                <p className="text-xs text-[#647C98] leading-relaxed">
                  Enter your raw idea in plain words. Our engine formats it into a screening-ready DST DPR proposal with TRL ratings, patent moats, and BOM allocations.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-1 rounded">
                  DST DPR Spec v2.4
                </span>
                <Link to="/proposal-doctor" className="text-xs font-extrabold text-[#7A0B1A] hover:underline flex items-center">
                  <span>Launch Tool</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </div>
            </div>

            {/* Feature 3: Campus Roadmap */}
            <div className="bg-white rounded-2xl border border-[#D9CAB3] p-7 shadow-card hover:border-[#7A0B1A] transition-all group flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] border border-[#D9CAB3] flex items-center justify-center text-[#7A0B1A] group-hover:bg-[#7A0B1A] group-hover:text-white transition">
                  <Route className="w-6 h-6 text-[#7A0B1A] group-hover:text-white" />
                </div>
                <h4 className="text-lg font-extrabold text-[#7A0B1A]">
                  Campus-to-Company Roadmap
                </h4>
                <p className="text-xs text-[#647C98] leading-relaxed">
                  Clear visual roadmap showing college students and faculty how to file provisional patents, access university labs, and register on Startup India.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-bold text-blue-800 bg-blue-50 px-2 py-1 rounded">
                  4-Phase Milestone Path
                </span>
                <Link to="/roadmap" className="text-xs font-extrabold text-[#7A0B1A] hover:underline flex items-center">
                  <span>View Path</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Featured High-Profile TBIs Preview */}
      <section className="py-16 sm:py-20 bg-white border-b border-[#D9CAB3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-extrabold text-[#D99A2B] uppercase tracking-wider block">
                Top Incubation Facilities
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-[#7A0B1A] mt-1 font-display">
                Featured Innovation Hubs
              </h3>
              <p className="text-xs sm:text-sm text-[#647C98] mt-1">
                Verified university incubators with active funding programs and advanced prototyping infrastructure.
              </p>
            </div>
            <Link
              to="/explore"
              className="inline-flex items-center space-x-1.5 text-xs font-extrabold text-[#7A0B1A] hover:text-[#5B0712] transition shrink-0"
            >
              <span>Explore all 521 TBIs</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : topTbis.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {topTbis.slice(0, 6).map((tbi) => (
                <TbiCard key={tbi.id || tbi.name} tbi={tbi} />
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-[#647C98] bg-[#FAF7F2] rounded-2xl border border-[#D9CAB3]">
              Connecting to live university database... <Link to="/explore" className="text-[#7A0B1A] font-bold underline">Explore all 521 TBIs directly →</Link>
            </div>
          )}
        </div>
      </section>

      {/* 7. Bottom High-Impact CTA */}
      <section className="py-16 bg-gradient-to-r from-[#7A0B1A] via-[#650814] to-[#4A050E] text-white">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-200 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-[#D99A2B]" />
            <span>Start Building with 100% Non-Dilutive Capital</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Stop waiting for venture capital to build your physical prototype.
          </h2>
          <p className="text-sm sm:text-base text-slate-200 max-w-xl mx-auto font-normal">
            Apply to university-backed prototyping grants, access high-end lab machinery, and convert research into commercially viable ventures.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <Link
              to="/proposal-doctor"
              className="px-7 py-3.5 rounded-xl bg-[#D99A2B] hover:bg-[#c48820] text-slate-900 text-sm font-black transition shadow-md"
            >
              Draft Grant Proposal with AI →
            </Link>
            <Link
              to="/explore"
              className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-bold border border-white/20 transition"
            >
              Browse 521 Incubators
            </Link>
          </div>
        </div>
      </section>

      {/* 8. Modern Footer */}
      <footer className="bg-white border-t border-[#D9CAB3] py-12 text-xs text-[#647C98]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <img src="/tbi-nexus-logo.png" alt="TBI Nexus" className="w-7 h-7 rounded-lg border border-[#7A0B1A]" />
              <span className="font-extrabold text-base text-[#7A0B1A]">TBI NEXUS</span>
            </div>
            <p className="leading-relaxed">
              India's comprehensive Technology Business Incubator &amp; Government Grant Intelligence Network.
            </p>
          </div>

          <div>
            <h5 className="font-extrabold text-[#7A0B1A] uppercase tracking-wider mb-3">Discovery</h5>
            <ul className="space-y-2">
              <li><Link to="/explore" className="hover:text-[#7A0B1A]">Explore 521 TBIs</Link></li>
              <li><Link to="/universities" className="hover:text-[#7A0B1A]">Colleges &amp; Universities</Link></li>
              <li><Link to="/categories" className="hover:text-[#7A0B1A]">Incubation Categories</Link></li>
              <li><Link to="/compare" className="hover:text-[#7A0B1A]">Compare TBIs</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-extrabold text-[#7A0B1A] uppercase tracking-wider mb-3">Grant Intelligence</h5>
            <ul className="space-y-2">
              <li><Link to="/grants" className="hover:text-[#7A0B1A]">National Grant Radar</Link></li>
              <li><Link to="/proposal-doctor" className="hover:text-[#7A0B1A]">AI Grant Proposal Doctor</Link></li>
              <li><Link to="/roadmap" className="hover:text-[#7A0B1A]">Campus-to-Company Roadmap</Link></li>
              <li><Link to="/suggest" className="hover:text-[#7A0B1A]">Suggest a New TBI</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-extrabold text-[#7A0B1A] uppercase tracking-wider mb-3">Portal</h5>
            <ul className="space-y-2">
              <li><Link to="/login" className="hover:text-[#7A0B1A]">Student &amp; Founder Login</Link></li>
              <li><Link to="/admin" className="hover:text-[#7A0B1A]">Admin Control Center</Link></li>
              <li><Link to="/dashboard" className="hover:text-[#7A0B1A]">User Dashboard</Link></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-slate-400">
          <p>© 2026 TBI Nexus India. Grounded in verified DST, MeitY &amp; BIRAC records.</p>
          <p className="mt-2 sm:mt-0 font-semibold text-slate-500">Built for Indian Student &amp; DeepTech Founders</p>
        </div>
      </footer>
    </div>
  );
};
