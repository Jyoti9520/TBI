import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Target,
  Sparkles,
  Award,
  Clock,
  Building2,
  CheckCircle2,
  ArrowRight,
  Shield,
  Layers,
  Search,
  Filter,
  ExternalLink
} from 'lucide-react';
import { schemeService } from '../services/schemeService';

export const GrantRadar = () => {
  const [schemes, setSchemes] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);

  // Eligibility Calculator Inputs
  const [stage, setStage] = useState('all');
  const [sector, setSector] = useState('all');
  const [founderType, setFounderType] = useState('all');

  const [matchResult, setMatchResult] = useState(null);
  const [calculating, setCalculating] = useState(false);

  useEffect(() => {
    fetchSchemes();
  }, [stage, sector, founderType]);

  const fetchSchemes = async () => {
    setLoading(true);
    try {
      const res = await schemeService.getSchemes({ stage, sector, founderType });
      if (res.success) {
        setSchemes(res.data);
        setMeta(res.meta);
      }
    } catch (err) {
      console.error('Failed to load schemes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCalculateMatch = async () => {
    setCalculating(true);
    try {
      const res = await schemeService.matchEligibility({ stage, sector, founderType });
      if (res.success) {
        setMatchResult(res);
      }
    } catch (err) {
      console.error('Calculation error:', err);
    } finally {
      setCalculating(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-[#7A0B1A] to-[#5B0712] rounded-3xl p-6 sm:p-8 text-white shadow-card relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/15 text-xs font-bold uppercase tracking-wider mb-3 text-amber-200 border border-white/20 backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#D99A2B]" />
            <span>National Incubation Funding Radar</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Indian University Grants &amp; Scheme Matcher
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
            Democratizing access to DST NIDHI, MeitY TIDE 2.0, BIRAC, and Startup India seed funds. Discover 100% non-dilutive capital and founder stipends hosted across 521 university incubators.
          </p>
        </div>

        {/* Highlight Stats Strip */}
        <div className="mt-6 pt-6 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl sm:text-3xl font-black text-[#D99A2B]">
              {meta?.totalGrantDisplay || '₹142.5 Cr+'}
            </div>
            <div className="text-[11px] text-slate-300 font-semibold uppercase mt-0.5">Annual Grant Pool</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-white">521</div>
            <div className="text-[11px] text-slate-300 font-semibold uppercase mt-0.5">Empanelled TBIs</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400">0%</div>
            <div className="text-[11px] text-slate-300 font-semibold uppercase mt-0.5">Equity Dilution (Grants)</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-amber-300">₹30k / mo</div>
            <div className="text-[11px] text-slate-300 font-semibold uppercase mt-0.5">Founder Living Stipend</div>
          </div>
        </div>
      </div>

      {/* AI Proposal Doctor Callout Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-[#7A0B1A]/5 to-[#7A0B1A]/10 border-2 border-[#D99A2B]/40 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#7A0B1A] text-white flex items-center justify-center shrink-0 shadow-sm">
            <Sparkles className="w-6 h-6 text-[#D99A2B]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-black uppercase tracking-wider text-[#7A0B1A]">AI Proposal &amp; Pitch Doctor</span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 bg-[#D99A2B] text-white rounded">NEW</span>
            </div>
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 mt-0.5">
              Have a raw project idea? Convert it into a screening-ready DST NIDHI DPR v2.4 proposal.
            </h3>
            <p className="text-xs text-[#647C98]">
              Automates TRL level classification, Bill of Materials (BOM) cost distribution, and patent defense moats.
            </p>
          </div>
        </div>
        <Link
          to="/proposal-doctor"
          className="px-5 py-2.5 rounded-xl bg-[#7A0B1A] text-white text-xs font-extrabold hover:bg-[#5B0712] transition shadow-xs flex items-center space-x-1.5 shrink-0"
        >
          <span>Launch AI Doctor</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* 2. Interactive Instant Eligibility Matcher Tool */}
      <div className="bg-white rounded-2xl border border-[#D9CAB3] p-6 shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-extrabold text-[#7A0B1A] flex items-center space-x-2">
              <Target className="w-5 h-5 text-[#D99A2B]" />
              <span>Interactive Grant Eligibility Calculator</span>
            </h2>
            <p className="text-xs text-[#647C98] mt-0.5">
              Select your venture stage and background to calculate your available funding pool.
            </p>
          </div>
          <button
            onClick={handleCalculateMatch}
            disabled={calculating}
            className="px-5 py-2.5 rounded-xl bg-[#7A0B1A] text-white text-xs font-bold hover:bg-[#5B0712] transition shadow-xs flex items-center justify-center space-x-2 shrink-0 cursor-pointer"
          >
            <span>{calculating ? 'Analyzing...' : '⚡ Match Eligible Grants'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Stage Selector */}
          <div>
            <label className="block text-xs font-bold text-[#7A0B1A] mb-1.5 uppercase tracking-wider">
              Startup Maturity Stage
            </label>
            <select
              value={stage}
              onChange={(e) => setStage(e.target.value)}
              className="w-full text-xs font-semibold bg-[#FAF7F2] border border-[#D9CAB3] rounded-xl px-3.5 py-2.5 text-[#243447] focus:outline-[#7A0B1A]"
            >
              <option value="all">All Stages (Overview)</option>
              <option value="idea">Idea Stage / Pre-Incubation (Need Stipend)</option>
              <option value="prototype">Working Prototype / MVP (Need ₹10L Grant)</option>
              <option value="early_revenue">Early Revenue / Traction (Need Seed Fund)</option>
            </select>
          </div>

          {/* Sector Selector */}
          <div>
            <label className="block text-xs font-bold text-[#7A0B1A] mb-1.5 uppercase tracking-wider">
              Target Technology Sector
            </label>
            <select
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              className="w-full text-xs font-semibold bg-[#FAF7F2] border border-[#D9CAB3] rounded-xl px-3.5 py-2.5 text-[#243447] focus:outline-[#7A0B1A]"
            >
              <option value="all">All Tech Sectors</option>
              <option value="deeptech">DeepTech / Hardware / Robotics</option>
              <option value="ai">AI / IoT / Emerging Digital</option>
              <option value="biotech">BioTech / HealthCare / MedTech</option>
              <option value="agritech">AgriTech &amp; Rural Tech</option>
            </select>
          </div>

          {/* Founder Type Selector */}
          <div>
            <label className="block text-xs font-bold text-[#7A0B1A] mb-1.5 uppercase tracking-wider">
              Founder Profile
            </label>
            <select
              value={founderType}
              onChange={(e) => setFounderType(e.target.value)}
              className="w-full text-xs font-semibold bg-[#FAF7F2] border border-[#D9CAB3] rounded-xl px-3.5 py-2.5 text-[#243447] focus:outline-[#7A0B1A]"
            >
              <option value="all">Any Background</option>
              <option value="student">Undergrad / College Student</option>
              <option value="researcher">Faculty / PhD Researcher</option>
              <option value="early_founder">Independent Innovator / Alum</option>
              <option value="woman">Woman-led Venture (Special Quotas)</option>
            </select>
          </div>
        </div>

        {/* Calculated Result Banner */}
        {matchResult && (
          <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#D9CAB3] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-[#16A36A]/10 border border-[#16A36A]/30 flex items-center justify-center text-[#16A36A] font-bold">
                ✓
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800">
                  Profile Matched: <span className="text-[#7A0B1A]">{matchResult.matchedCount} National Schemes</span>
                </div>
                <div className="text-[11px] text-[#647C98]">
                  Available non-dilutive capital you can apply for right now.
                </div>
              </div>
            </div>
            <div className="text-right sm:text-right w-full sm:w-auto border-t sm:border-t-0 pt-2 sm:pt-0">
              <div className="text-xs text-[#647C98] font-medium uppercase">Maximum Eligibility Pool</div>
              <div className="text-2xl font-black text-[#7A0B1A]">{matchResult.maxEligibleDisplay}</div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Detailed Schemes Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-[#7A0B1A]">
            Government Schemes &amp; Grant Programs ({schemes.length})
          </h2>
          <span className="text-xs text-[#647C98] font-medium">Click any scheme for participating university incubators</span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-sm font-semibold text-[#647C98]">
            Loading national schemes directory...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {schemes.map((scheme) => (
              <div
                key={scheme.id}
                className="bg-white rounded-2xl border border-[#D9CAB3] hover:border-[#7A0B1A] transition-all duration-200 p-6 shadow-2xs hover:shadow-card flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#FAF7F2] border border-[#D9CAB3] text-[#7A0B1A]">
                      <Building2 className="w-3 h-3 text-[#D99A2B]" />
                      <span>{scheme.ministry}</span>
                    </div>
                    <span className="text-xs font-black text-[#16A36A] bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      {scheme.maxAmount}
                    </span>
                  </div>

                  <h3 className="text-lg font-extrabold text-[#7A0B1A] group-hover:text-[#5B0712] transition-colors">
                    {scheme.name}
                  </h3>
                  <p className="text-xs font-semibold text-slate-700 mt-0.5">{scheme.fullName}</p>

                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#D9CAB3]/60">
                      <span className="text-[10px] font-bold text-[#647C98] uppercase block">Equity Terms</span>
                      <strong className="text-[#7A0B1A] font-extrabold">{scheme.equity}</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#D9CAB3]/60">
                      <span className="text-[10px] font-bold text-[#647C98] uppercase block">Grant Duration</span>
                      <strong className="text-slate-900 font-extrabold">{scheme.duration}</strong>
                    </div>
                  </div>

                  <div className="mt-4">
                    <span className="text-xs font-bold text-slate-800 block mb-1.5">Key Eligibility Points:</span>
                    <ul className="space-y-1 text-xs text-[#647C98]">
                      {scheme.eligibilityCriteria.slice(0, 3).map((item, idx) => (
                        <li key={idx} className="flex items-start space-x-1.5">
                          <span className="text-[#16A36A] font-bold shrink-0">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-4">
                    <span className="text-xs font-bold text-slate-800 block mb-1.5">Participating Hub Examples:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {scheme.sampleHostInstitutions.map((host, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-50 border border-slate-200 text-slate-700"
                        >
                          {host}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-[#647C98] font-medium">{scheme.stageLabel}</span>
                  <Link
                    to={`/explore?q=${encodeURIComponent(scheme.name.split('-')[0])}`}
                    className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[#7A0B1A] text-white text-xs font-bold hover:bg-[#5B0712] transition shadow-2xs"
                  >
                    <span>Find Host TBIs</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. Link to Student Roadmap */}
      <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#D9CAB3] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-extrabold text-[#7A0B1A]">
            Don't know how to prepare your proposal?
          </h3>
          <p className="text-xs text-[#647C98] mt-1">
            Check our visual Step-by-Step Roadmaps designed for college undergrads and first-time founders.
          </p>
        </div>
        <Link
          to="/roadmap"
          className="px-5 py-2.5 rounded-xl bg-white border border-[#D9CAB3] text-[#7A0B1A] text-xs font-bold hover:bg-[#FAF7F2] hover:border-[#7A0B1A] transition shadow-2xs shrink-0"
        >
          View Campus-to-Company Roadmap →
        </Link>
      </div>
    </div>
  );
};
