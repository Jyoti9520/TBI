import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ChevronDown,
  Building2,
  Layers,
  Compass,
  GitCompare,
  FileText,
  Route,
  Target,
  ShieldCheck,
  Search,
  ExternalLink,
  BookOpen,
  DollarSign,
  TrendingUp,
  Cpu,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const ModernNavbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header
      ref={navRef}
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-[#D9CAB3]/70'
          : 'bg-[#FAF7F2]/90 backdrop-blur-sm border-b border-[#D9CAB3]/40'
      }`}
    >
      {/* Top Micro-Ticker (Market Signal Bar) */}
      <div className="bg-[#7A0B1A] text-white text-[11px] font-semibold py-1.5 px-4 text-center tracking-wide flex items-center justify-center space-x-2 sm:space-x-4 overflow-x-auto">
        <span className="flex items-center space-x-1.5 text-amber-300 font-bold shrink-0">
          <Sparkles className="w-3 h-3 text-[#D99A2B]" />
          <span>DST NIDHI &amp; MeitY Grant Radar Active:</span>
        </span>
        <span className="text-slate-200 shrink-0">₹142.5 Cr+ Non-Dilutive Capital Open Across 521 TBIs</span>
        <Link
          to="/proposal-doctor"
          className="underline decoration-amber-300 text-amber-200 hover:text-white shrink-0 font-bold ml-1"
        >
          Check AI Eligibility →
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group shrink-0">
            <div className="relative">
              <img
                src="/tbi-nexus-logo.png"
                alt="TBI Nexus"
                className="w-10 h-10 rounded-xl object-cover shadow-xs border-2 border-[#7A0B1A] transition-transform duration-300 group-hover:scale-105"
              />
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center space-x-1.5">
                <span className="font-black text-[#7A0B1A] tracking-tight text-xl leading-none font-display">
                  TBI NEXUS
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded font-extrabold bg-[#D99A2B]/20 text-[#7A0B1A] border border-[#D99A2B]/40">
                  INDIA
                </span>
              </div>
              <span className="text-[10px] uppercase tracking-wider text-[#647C98] font-bold mt-0.5">
                National Incubation &amp; Grant Network
              </span>
            </div>
          </Link>

          {/* Desktop Navigation with High-End Mega-Dropdowns */}
          <nav className="hidden lg:flex items-center space-x-1 font-semibold text-xs text-[#243447]">
            {/* 1. Explore Ecosystem (Dropdown) */}
            <div className="relative">
              <button
                onClick={() => setActiveDropdown(activeDropdown === 'explore' ? null : 'explore')}
                className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl transition-colors cursor-pointer ${
                  activeDropdown === 'explore'
                    ? 'bg-[#7A0B1A]/10 text-[#7A0B1A] font-bold'
                    : 'hover:text-[#7A0B1A] hover:bg-[#7A0B1A]/5'
                }`}
              >
                <span>Directory</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'explore' ? 'rotate-180 text-[#7A0B1A]' : 'text-slate-400'}`} />
              </button>

              {activeDropdown === 'explore' && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-[#D9CAB3] p-3 grid gap-1.5 animate-fade-in z-50">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#647C98]">
                    Explore 521 Verified Hubs
                  </div>
                  <Link
                    to="/explore"
                    onClick={() => setActiveDropdown(null)}
                    className="flex items-start space-x-3 p-2.5 rounded-xl hover:bg-[#FAF7F2] transition group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] border border-[#D9CAB3] flex items-center justify-center shrink-0 text-[#7A0B1A] group-hover:bg-[#7A0B1A] group-hover:text-white transition">
                      <Compass className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-[#243447] group-hover:text-[#7A0B1A]">National TBI Directory</div>
                      <div className="text-[11px] text-[#647C98]">Filter 521 hubs by state, scheme &amp; funding</div>
                    </div>
                  </Link>

                  <Link
                    to="/universities"
                    onClick={() => setActiveDropdown(null)}
                    className="flex items-start space-x-3 p-2.5 rounded-xl hover:bg-[#FAF7F2] transition group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] border border-[#D9CAB3] flex items-center justify-center shrink-0 text-[#7A0B1A] group-hover:bg-[#7A0B1A] group-hover:text-white transition">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-[#243447] group-hover:text-[#7A0B1A]">Universities &amp; Colleges</div>
                      <div className="text-[11px] text-[#647C98]">IITs, NITs, Central &amp; State university hubs</div>
                    </div>
                  </Link>

                  <Link
                    to="/categories"
                    onClick={() => setActiveDropdown(null)}
                    className="flex items-start space-x-3 p-2.5 rounded-xl hover:bg-[#FAF7F2] transition group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] border border-[#D9CAB3] flex items-center justify-center shrink-0 text-[#7A0B1A] group-hover:bg-[#7A0B1A] group-hover:text-white transition">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-[#243447] group-hover:text-[#7A0B1A]">Sectors &amp; Schemes</div>
                      <div className="text-[11px] text-[#647C98]">DeepTech, BioTech, AgriTech, Atal Incubation</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* 2. Grant Radar (High Priority Highlight) */}
            <Link
              to="/grants"
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-[#243447] hover:text-[#7A0B1A] hover:bg-[#7A0B1A]/5 transition"
            >
              <Target className="w-4 h-4 text-[#D99A2B]" />
              <span>Grant Radar</span>
              <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                ₹10L-₹50L
              </span>
            </Link>

            {/* 3. AI Pitch Doctor (Flagship New Tool) */}
            <Link
              to="/proposal-doctor"
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#7A0B1A]/10 to-[#D99A2B]/10 border border-[#D99A2B]/40 text-[#7A0B1A] font-bold hover:shadow-xs transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D99A2B] animate-pulse" />
              <span>AI Proposal Doctor</span>
              <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-[#7A0B1A] text-white">
                PRO
              </span>
            </Link>

            {/* 4. Campus Roadmap */}
            <Link
              to="/roadmap"
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-[#243447] hover:text-[#7A0B1A] hover:bg-[#7A0B1A]/5 transition"
            >
              <Route className="w-4 h-4 text-[#647C98]" />
              <span>Student Roadmap</span>
            </Link>

            {/* 5. Compare Incubators */}
            <Link
              to="/compare"
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-[#243447] hover:text-[#7A0B1A] hover:bg-[#7A0B1A]/5 transition"
            >
              <GitCompare className="w-4 h-4 text-[#647C98]" />
              <span>Compare</span>
            </Link>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center space-x-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-[#FAF7F2] text-[#7A0B1A] border border-[#D9CAB3] hover:bg-[#7A0B1A] hover:text-white transition group"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#D99A2B] group-hover:text-white" />
                    <span>Admin</span>
                  </Link>
                )}

                <Link
                  to="/dashboard"
                  className="flex items-center space-x-2 text-xs font-bold text-[#243447] px-3.5 py-2 rounded-xl bg-white border border-[#D9CAB3] hover:border-[#7A0B1A] transition shadow-2xs"
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name || 'User'}
                      referrerPolicy="no-referrer"
                      className="w-5 h-5 rounded-full object-cover border border-[#7A0B1A]"
                    />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-[#7A0B1A] text-white text-[10px] flex items-center justify-center font-bold">
                      {user?.name ? user.name[0].toUpperCase() : 'U'}
                    </div>
                  )}
                  <span className="max-w-[100px] truncate">{user?.name || 'Dashboard'}</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2 text-[#647C98] hover:text-[#7A0B1A] hover:bg-red-50 rounded-xl transition cursor-pointer"
                  title="Logout"
                >
                  <span className="text-xs font-semibold">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2.5">
                <Link
                  to="/login"
                  className="text-xs font-bold text-[#7A0B1A] hover:text-[#5B0712] px-4 py-2 rounded-xl transition hover:bg-[#7A0B1A]/5"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="text-xs font-bold text-white bg-[#7A0B1A] hover:bg-[#5B0712] px-5 py-2.5 rounded-xl shadow-xs hover:shadow-md transition active:scale-[0.98] border border-[#7A0B1A] flex items-center space-x-1.5"
                >
                  <span>Join Ecosystem</span>
                  <span>→</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
