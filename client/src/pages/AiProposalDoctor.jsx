import React, { useState } from 'react';
import {
  Sparkles,
  FileText,
  Copy,
  Check,
  Printer,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  DollarSign,
  Award,
  Layers,
  ArrowRight
} from 'lucide-react';
import { schemeService } from '../services/schemeService';

export const AiProposalDoctor = () => {
  const [ideaTitle, setIdeaTitle] = useState('');
  const [rawDescription, setRawDescription] = useState('');
  const [targetScheme, setTargetScheme] = useState('NIDHI-PRAYAS');
  const [sector, setSector] = useState('DeepTech / Robotics');
  const [founderBackground, setFounderBackground] = useState('Student (Undergrad/BTech)');

  const [loading, setLoading] = useState(false);
  const [proposal, setProposal] = useState(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);

  const sampleIdeas = [
    {
      title: 'Smart Solar-Powered Hydroponic Irrigation Kit for Polyhouses',
      desc: 'College final year project me banaya hai. Soil moisture aur humidity sensors se micro-pumps automatically on hote hain. Solar battery backup hai aur phone app pe data aata hai. Villagers and small farmers can grow veggies with 70% less water.',
      scheme: 'NIDHI-PRAYAS',
      sector: 'AgriTech & Rural Tech'
    },
    {
      title: 'Low-Cost Portable Vein Detector for Pediatric Clinics',
      desc: 'Near-Infrared (NIR) camera module aur custom optical filters use karke subcutaneous veins screen pe real-time highlight karta hai taaki nurses ko bachho me IV injections lagate waqt multiple pricks na karni pade. Total manufacturing cost ₹8,000 se kam aati hai.',
      scheme: 'NIDHI-PRAYAS',
      sector: 'BioTech / HealthCare / MedTech'
    },
    {
      title: 'Autonomous AI Drone Inspection for Transmission Power Lines',
      desc: 'Drone with onboard edge compute camera that identifies micro-cracks and thermal hot-spots in high voltage lines without manual human climbing. Currently bench-tested on dummy lines.',
      scheme: 'NIDHI-EIR',
      sector: 'DeepTech / Robotics'
    }
  ];

  const handleApplySample = (sample) => {
    setIdeaTitle(sample.title);
    setRawDescription(sample.desc);
    setTargetScheme(sample.scheme);
    setSector(sample.sector);
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!rawDescription.trim()) {
      setError('Please provide at least a simple description of what you are building.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await schemeService.generateAiProposal({
        ideaTitle: ideaTitle.trim() || 'Indigenous Tech Solution',
        rawDescription: rawDescription.trim(),
        targetScheme,
        sector,
        founderBackground
      });

      if (res.success && res.data) {
        setProposal(res.data);
      } else {
        setError(res.message || 'Failed to generate proposal');
      }
    } catch (err) {
      console.error('Proposal generation error:', err);
      setError('Server connection error. Please ensure backend is reachable.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!proposal) return;
    const fullText = `
GOVERNMENT OF INDIA - GRANT PROPOSAL SUMMARY
Generated for: ${proposal.executiveSummary.projectTitle}
Target Scheme: ${proposal.meta.targetScheme}
Standard: ${proposal.meta.standard}

1. EXECUTIVE SUMMARY
- Project Title: ${proposal.executiveSummary.projectTitle}
- Target Sector: ${proposal.executiveSummary.targetSector}
- Founder Category: ${proposal.executiveSummary.founderCategory}
- TRL Level: ${proposal.executiveSummary.technologyReadinessLevel}
- TRL Context: ${proposal.executiveSummary.trlContext}

2. FORMAL PROBLEM STATEMENT
${proposal.sections.problemStatement}

3. PROPOSED INNOVATION & ARCHITECTURE
${proposal.sections.proposedInnovation}

4. TECHNICAL NOVELTY & DEFENSE (MOAT)
${proposal.sections.noveltyAndMoat}

5. TARGET MARKET & IMPACT
${proposal.sections.targetMarketAndBeneficiaries}

6. 18-MONTH MILESTONE SCHEDULE
${proposal.sections.milestoneTimeline.map(m => `* ${m.month}: ${m.milestone}`).join('\n')}

7. BILL OF MATERIALS (BOM) & BUDGET ALLOCATION
${proposal.sections.budgetBreakdown.map(b => `* ${b.item} - ${b.amount} (${b.percentage})`).join('\n')}

SCREENING COMMITTEE TIPS:
${proposal.sections.screeningTips.map(t => `- ${t}`).join('\n')}
    `.trim();

    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* 1. Hero Header */}
      <div className="bg-gradient-to-r from-[#7A0B1A] via-[#650814] to-[#4A050E] rounded-3xl p-6 sm:p-8 text-white shadow-card relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/15 text-xs font-bold uppercase tracking-wider mb-3 text-amber-200 border border-white/20 backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#D99A2B]" />
            <span>AI Grant Proposal &amp; Pitch Doctor</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Convert Raw College Ideas into ₹10 Lakh Govt Grant Proposals
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
            80% of student grant applications get rejected because they sound like generic startup ideas. Our Pitch Doctor translates your idea into formal Department of Science &amp; Technology (DST) terminology, calculates your Technology Readiness Level (TRL), and structures an approved Bill of Materials (BOM) budget.
          </p>
        </div>

        {/* Feature Badges */}
        <div className="mt-6 pt-6 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-medium text-slate-200">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
            <span>DST NIDHI DPR v2.4 Spec</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-amber-400"></div>
            <span>PRAYAS &amp; EIR Formats</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-blue-400"></div>
            <span>Auto TRL 2-5 Mapping</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-purple-400"></div>
            <span>100% Non-Dilutive Grant Ready</span>
          </div>
        </div>
      </div>

      {/* 2. Main Two-Column Layout: Form on Left, Proposal on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Input (5 Columns) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#D9CAB3] p-6 shadow-card space-y-5">
          <div>
            <h2 className="text-lg font-extrabold text-[#7A0B1A] flex items-center space-x-2">
              <FileText className="w-5 h-5 text-[#D99A2B]" />
              <span>Project Details (Kuch bhi simple likhein)</span>
            </h2>
            <p className="text-xs text-[#647C98] mt-0.5">
              No formal English required. Write in simple Hinglish or conversational text.
            </p>
          </div>

          {/* Quick Pre-fill Samples */}
          <div>
            <span className="text-[11px] font-bold text-[#647C98] uppercase tracking-wider block mb-2">
              ⚡ Click to test with sample ideas:
            </span>
            <div className="flex flex-wrap gap-2">
              {sampleIdeas.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplySample(sample)}
                  className="text-[11px] font-semibold px-2.5 py-1.5 rounded-lg bg-[#FAF7F2] border border-[#D9CAB3] hover:border-[#7A0B1A] text-[#7A0B1A] transition cursor-pointer text-left truncate max-w-full"
                >
                  {sample.title.split(' ').slice(0, 4).join(' ')}...
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleGenerate} className="space-y-4">
            {/* Target Scheme */}
            <div>
              <label className="block text-xs font-bold text-[#7A0B1A] mb-1 uppercase tracking-wider">
                Target Government Grant / Scheme
              </label>
              <select
                value={targetScheme}
                onChange={(e) => setTargetScheme(e.target.value)}
                className="w-full text-xs font-semibold bg-[#FAF7F2] border border-[#D9CAB3] rounded-xl px-3.5 py-2.5 text-[#243447] focus:outline-[#7A0B1A]"
              >
                <option value="NIDHI-PRAYAS">DST NIDHI-PRAYAS (Up to ₹10 Lakhs for Prototype)</option>
                <option value="NIDHI-EIR">DST NIDHI-EIR (₹30,000 / month Living Stipend)</option>
                <option value="MeitY TIDE 2.0">MeitY TIDE 2.0 (₹4L - ₹7L Grant for Digital Tech)</option>
                <option value="BIRAC BIG">BIRAC BIG (Up to ₹50 Lakhs for BioTech/MedTech)</option>
                <option value="SISFS">Startup India Seed Fund (Up to ₹20 Lakhs)</option>
              </select>
            </div>

            {/* Idea Title */}
            <div>
              <label className="block text-xs font-bold text-[#7A0B1A] mb-1 uppercase tracking-wider">
                Working Project Name / Title
              </label>
              <input
                type="text"
                placeholder="e.g., Portable Vein Finder for Rural Clinics"
                value={ideaTitle}
                onChange={(e) => setIdeaTitle(e.target.value)}
                className="w-full text-xs font-semibold bg-[#FAF7F2] border border-[#D9CAB3] rounded-xl px-3.5 py-2.5 text-[#243447] focus:outline-[#7A0B1A]"
              />
            </div>

            {/* Sector & Background */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#7A0B1A] mb-1 uppercase tracking-wider">
                  Domain / Sector
                </label>
                <select
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  className="w-full text-xs font-semibold bg-[#FAF7F2] border border-[#D9CAB3] rounded-xl px-3 py-2 text-[#243447] focus:outline-[#7A0B1A]"
                >
                  <option value="DeepTech / Robotics">DeepTech / Robotics</option>
                  <option value="AI / IoT / Software">AI / IoT / Software</option>
                  <option value="BioTech / HealthCare / MedTech">BioTech / MedTech</option>
                  <option value="AgriTech & Rural Tech">AgriTech & Rural Tech</option>
                  <option value="CleanTech & Renewable Energy">CleanTech / EV</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#7A0B1A] mb-1 uppercase tracking-wider">
                  Founder Background
                </label>
                <select
                  value={founderBackground}
                  onChange={(e) => setFounderBackground(e.target.value)}
                  className="w-full text-xs font-semibold bg-[#FAF7F2] border border-[#D9CAB3] rounded-xl px-3 py-2 text-[#243447] focus:outline-[#7A0B1A]"
                >
                  <option value="Student (Undergrad/BTech)">College Undergrad</option>
                  <option value="Postgraduate / PhD Scholar">PhD / MTech Scholar</option>
                  <option value="University Faculty / Professor">University Faculty</option>
                  <option value="Recent Graduate / Alum">Recent Alum (0-3 Yrs)</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-[#7A0B1A] uppercase tracking-wider">
                  Idea / Solution Description
                </label>
                <span className="text-[10px] text-[#647C98]">Describe in your own words</span>
              </div>
              <textarea
                rows={5}
                placeholder="Aapka idea kya hai? Kya problem solve kr rha hai? Konsi technology use kr rhe ho aur abhi kitna banaya hai? Kuch bhi simple bhasha me likho..."
                value={rawDescription}
                onChange={(e) => setRawDescription(e.target.value)}
                className="w-full text-xs font-medium bg-[#FAF7F2] border border-[#D9CAB3] rounded-xl p-3.5 text-[#243447] focus:outline-[#7A0B1A] leading-relaxed resize-y"
              />
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-[#7A0B1A] text-white text-xs font-bold hover:bg-[#5B0712] transition shadow-xs flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-[#D99A2B]" />
                  <span>Synthesizing DST DPR v2.4 Proposal...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#D99A2B]" />
                  <span>Generate Screening-Ready Proposal ⚡</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Output: Screening Ready DPR Sheet (7 Columns) */}
        <div className="lg:col-span-7 space-y-4">
          {!proposal && !loading && (
            <div className="bg-white rounded-2xl border border-dashed border-[#D9CAB3] p-12 text-center space-y-4 shadow-2xs">
              <div className="w-16 h-16 rounded-2xl bg-[#FAF7F2] border border-[#D9CAB3] flex items-center justify-center mx-auto text-[#7A0B1A]">
                <FileText className="w-8 h-8 text-[#D99A2B]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#7A0B1A]">
                  Your Screening Proposal Will Appear Here
                </h3>
                <p className="text-xs text-[#647C98] max-w-md mx-auto mt-1 leading-relaxed">
                  Fill in your idea on the left and click "Generate". We will format it into formal DST project proposal sections with milestone timelines and a non-dilutive budget breakdown.
                </p>
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => handleApplySample(sampleIdeas[0])}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[#FAF7F2] border border-[#D9CAB3] text-[#7A0B1A] text-xs font-bold hover:bg-[#7A0B1A]/5 transition cursor-pointer"
                >
                  <span>Try Sample Idea: Hydroponic Irrigation Kit</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {loading && (
            <div className="bg-white rounded-2xl border border-[#D9CAB3] p-12 text-center space-y-4 shadow-card">
              <div className="w-16 h-16 rounded-2xl bg-[#7A0B1A]/10 border border-[#7A0B1A]/20 flex items-center justify-center mx-auto text-[#7A0B1A] animate-pulse">
                <Sparkles className="w-8 h-8 text-[#D99A2B] animate-spin" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#7A0B1A]">
                  Drafting Technical Proposal...
                </h3>
                <p className="text-xs text-[#647C98] max-w-sm mx-auto mt-1">
                  Evaluating Technology Readiness Level (TRL), structuring non-dilutive Bill of Materials, and formulating defense moats...
                </p>
              </div>
            </div>
          )}

          {proposal && !loading && (
            <div className="bg-white rounded-2xl border border-[#D9CAB3] shadow-card overflow-hidden animate-fade-in print:border-none print:shadow-none">
              {/* Proposal Header Actions Bar */}
              <div className="bg-[#FAF7F2] border-b border-[#D9CAB3] px-6 py-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold text-[#647C98] uppercase tracking-wider block">
                    {proposal.meta.standard}
                  </span>
                  <h3 className="text-sm font-extrabold text-[#7A0B1A]">
                    Official Proposal Document Preview
                  </h3>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleCopy}
                    className="px-3 py-1.5 rounded-lg bg-white border border-[#D9CAB3] text-[#7A0B1A] text-xs font-bold hover:bg-white/80 transition flex items-center space-x-1.5 cursor-pointer shadow-2xs"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied Full Proposal!' : 'Copy Proposal'}</span>
                  </button>

                  <button
                    onClick={handlePrint}
                    className="px-3 py-1.5 rounded-lg bg-[#7A0B1A] text-white text-xs font-bold hover:bg-[#5B0712] transition flex items-center space-x-1.5 cursor-pointer shadow-2xs"
                  >
                    <Printer className="w-3.5 h-3.5 text-[#D99A2B]" />
                    <span>Print / Save PDF</span>
                  </button>
                </div>
              </div>

              {/* Proposal Body */}
              <div className="p-6 sm:p-8 space-y-6 text-slate-800 text-xs leading-relaxed">
                {/* Executive Summary Box */}
                <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#D9CAB3] space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-bold text-[#647C98] uppercase tracking-wider block">
                        Project Title (Formalised)
                      </span>
                      <h4 className="text-base font-extrabold text-[#7A0B1A]">
                        {proposal.executiveSummary.projectTitle}
                      </h4>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-[#16A36A]/10 text-[#16A36A] border border-[#16A36A]/30 shrink-0">
                      {proposal.meta.targetScheme}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-[#D9CAB3]/60 text-[11px]">
                    <div>
                      <span className="text-[#647C98] block">Sector Focus:</span>
                      <strong className="text-slate-900 font-bold">{proposal.executiveSummary.targetSector}</strong>
                    </div>
                    <div>
                      <span className="text-[#647C98] block">Applicant Profile:</span>
                      <strong className="text-slate-900 font-bold">{proposal.executiveSummary.founderCategory}</strong>
                    </div>
                    <div>
                      <span className="text-[#647C98] block">Readiness Level:</span>
                      <strong className="text-[#7A0B1A] font-extrabold">{proposal.executiveSummary.technologyReadinessLevel}</strong>
                    </div>
                  </div>

                  <p className="text-[11px] text-[#647C98] italic pt-1">
                    "{proposal.executiveSummary.trlContext}"
                  </p>
                </div>

                {/* Section 1: Problem Statement */}
                <div>
                  <h5 className="font-bold text-[#7A0B1A] uppercase tracking-wider text-[11px] mb-1 flex items-center space-x-1.5">
                    <span>1. Problem Statement &amp; Market Need</span>
                  </h5>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 font-normal leading-relaxed text-slate-700">
                    {proposal.sections.problemStatement}
                  </div>
                </div>

                {/* Section 2: Proposed Innovation */}
                <div>
                  <h5 className="font-bold text-[#7A0B1A] uppercase tracking-wider text-[11px] mb-1 flex items-center space-x-1.5">
                    <span>2. Proposed Technical Innovation</span>
                  </h5>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 font-normal leading-relaxed text-slate-700">
                    {proposal.sections.proposedInnovation}
                  </div>
                </div>

                {/* Section 3: Novelty & Moat */}
                <div>
                  <h5 className="font-bold text-[#7A0B1A] uppercase tracking-wider text-[11px] mb-1 flex items-center space-x-1.5">
                    <span>3. Technical Novelty &amp; Defensibility (Patent Moat)</span>
                  </h5>
                  <div className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-200 font-normal leading-relaxed text-slate-700 whitespace-pre-line">
                    {proposal.sections.noveltyAndMoat}
                  </div>
                </div>

                {/* Section 4: Target Market & Beneficiaries */}
                <div>
                  <h5 className="font-bold text-[#7A0B1A] uppercase tracking-wider text-[11px] mb-1 flex items-center space-x-1.5">
                    <span>4. Target Beneficiaries &amp; Market Size</span>
                  </h5>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 font-normal leading-relaxed text-slate-700">
                    {proposal.sections.targetMarketAndBeneficiaries}
                  </div>
                </div>

                {/* Section 5: 18-Month Timeline */}
                <div>
                  <h5 className="font-bold text-[#7A0B1A] uppercase tracking-wider text-[11px] mb-2 flex items-center space-x-1.5">
                    <span>5. 18-Month Milestone Roadmap</span>
                  </h5>
                  <div className="space-y-2">
                    {proposal.sections.milestoneTimeline.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-start space-x-3 p-2.5 rounded-lg bg-slate-50 border border-slate-200"
                      >
                        <span className="font-extrabold text-[#7A0B1A] text-[11px] shrink-0 w-28">
                          {item.month}:
                        </span>
                        <span className="text-slate-700 font-medium">{item.milestone}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 6: Bill of Materials & Budget Breakdown */}
                <div>
                  <h5 className="font-bold text-[#7A0B1A] uppercase tracking-wider text-[11px] mb-2 flex items-center space-x-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-[#D99A2B]" />
                    <span>6. Non-Dilutive Grant Budget Breakdown (DST Format)</span>
                  </h5>
                  <div className="overflow-x-auto rounded-xl border border-slate-200">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#FAF7F2] text-[#7A0B1A] font-bold border-b border-slate-200">
                        <tr>
                          <th className="p-3">Expense Head / Component</th>
                          <th className="p-3 text-right">Rupee Allocation</th>
                          <th className="p-3 text-right">Share (%)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                        {proposal.sections.budgetBreakdown.map((b, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="p-3">{b.item}</td>
                            <td className="p-3 text-right font-bold text-[#7A0B1A]">{b.amount}</td>
                            <td className="p-3 text-right text-slate-500">{b.percentage}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Section 7: Screening Committee Advice */}
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 space-y-2">
                  <div className="font-extrabold text-xs flex items-center space-x-1.5 text-[#7A0B1A]">
                    <ShieldCheck className="w-4 h-4 text-[#D99A2B]" />
                    <span>Expert Advice for your Screening Committee Interview:</span>
                  </div>
                  <ul className="space-y-1 text-[11px] list-disc list-inside">
                    {proposal.sections.screeningTips.map((tip, idx) => (
                      <li key={idx}>{tip}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
