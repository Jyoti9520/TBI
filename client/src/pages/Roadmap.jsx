import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Compass,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Calendar,
  DollarSign,
  FileText,
  Lightbulb,
  Cpu,
  GraduationCap
} from 'lucide-react';
import { schemeService } from '../services/schemeService';

export const Roadmap = () => {
  const [roadmaps, setRoadmaps] = useState([]);
  const [activeTrack, setActiveTrack] = useState('student-track');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoadmaps = async () => {
      try {
        const res = await schemeService.getRoadmaps();
        if (res.success) {
          setRoadmaps(res.data);
        }
      } catch (err) {
        console.error('Roadmaps load error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoadmaps();
  }, []);

  const currentRoadmap = roadmaps.find((r) => r.trackId === activeTrack) || roadmaps[0];

  return (
    <div className="space-y-8">
      {/* 1. Header Banner */}
      <div className="bg-white rounded-3xl border border-[#D9CAB3] p-6 sm:p-8 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#FAF7F2] text-xs font-bold uppercase tracking-wider mb-2.5 text-[#7A0B1A] border border-[#D9CAB3]">
            <Compass className="w-3.5 h-3.5 text-[#D99A2B]" />
            <span>Zero-Jargon Execution Framework</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#7A0B1A] tracking-tight">
            Campus-to-Company Incubation Roadmaps
          </h1>
          <p className="mt-2 text-sm text-[#647C98] leading-relaxed">
            You don't need ₹10 Lakhs of savings or an angel investor to begin. Follow the exact sequential milestone path to transform university innovation into a capitalized venture.
          </p>
        </div>

        {/* Track Switcher */}
        <div className="bg-[#FAF7F2] p-1.5 rounded-2xl border border-[#D9CAB3] flex sm:flex-col gap-1 w-full md:w-auto shrink-0">
          <button
            onClick={() => setActiveTrack('student-track')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-2 cursor-pointer ${
              activeTrack === 'student-track'
                ? 'bg-[#7A0B1A] text-white shadow-xs'
                : 'text-[#647C98] hover:text-[#7A0B1A]'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Student &amp; Early Innovator Track</span>
          </button>
          <button
            onClick={() => setActiveTrack('deeptech-track')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-2 cursor-pointer ${
              activeTrack === 'deeptech-track'
                ? 'bg-[#7A0B1A] text-white shadow-xs'
                : 'text-[#647C98] hover:text-[#7A0B1A]'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>DeepTech &amp; Hardware Track</span>
          </button>
        </div>
      </div>

      {/* 2. Visual Timeline */}
      {currentRoadmap && (
        <div className="bg-white rounded-3xl border border-[#D9CAB3] p-6 sm:p-8 shadow-card space-y-8">
          <div>
            <span className="text-xs font-extrabold text-[#D99A2B] uppercase tracking-wider">Active Track</span>
            <h2 className="text-2xl font-extrabold text-[#7A0B1A] tracking-tight mt-0.5">
              {currentRoadmap.title}
            </h2>
            <p className="text-sm text-[#647C98] mt-1">{currentRoadmap.subtitle}</p>
          </div>

          <div className="relative border-l-2 border-[#D9CAB3] ml-4 sm:ml-6 space-y-10 pl-6 sm:pl-8">
            {currentRoadmap.steps.map((step) => (
              <div key={step.stepNumber} className="relative group">
                {/* Step Circle Indicator */}
                <div className="absolute -left-[35px] sm:-left-[43px] top-0 w-8 h-8 rounded-full bg-[#FAF7F2] border-2 border-[#7A0B1A] flex items-center justify-center font-black text-xs text-[#7A0B1A] shadow-xs group-hover:scale-110 group-hover:bg-[#7A0B1A] group-hover:text-white transition">
                  {step.stepNumber}
                </div>

                <div className="bg-[#FAF7F2]/60 rounded-2xl border border-[#D9CAB3] p-5 sm:p-6 hover:border-[#7A0B1A] hover:bg-white transition-all duration-200 shadow-2xs space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <h3 className="text-base sm:text-lg font-extrabold text-[#7A0B1A]">
                      {step.title}
                    </h3>
                    <span className="inline-flex items-center space-x-1 text-xs font-bold px-2.5 py-1 rounded-md bg-white border border-[#D9CAB3] text-[#647C98] self-start sm:self-auto">
                      <Calendar className="w-3.5 h-3.5 text-[#D99A2B]" />
                      <span>{step.duration}</span>
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                    {step.focus}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="p-3 rounded-xl bg-white border border-[#D9CAB3]/70 text-xs">
                      <div className="flex items-center space-x-1 text-[11px] font-bold text-[#16A36A] uppercase tracking-wider mb-1">
                        <DollarSign className="w-3.5 h-3.5" />
                        <span>Recommended Target Funding:</span>
                      </div>
                      <strong className="text-slate-900 font-bold">{step.grantTarget}</strong>
                    </div>

                    <div className="p-3 rounded-xl bg-white border border-[#D9CAB3]/70 text-xs">
                      <div className="flex items-center space-x-1 text-[11px] font-bold text-[#7A0B1A] uppercase tracking-wider mb-1">
                        <FileText className="w-3.5 h-3.5" />
                        <span>Stage Deliverable:</span>
                      </div>
                      <span className="text-slate-700">{step.deliverable}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-[#647C98]">
              Ready to find an incubator matching your current step?
            </span>
            <Link
              to="/grants"
              className="px-6 py-3 rounded-xl bg-[#7A0B1A] text-white text-xs font-bold hover:bg-[#5B0712] transition shadow-xs flex items-center space-x-2"
            >
              <span>Check Eligible Grants on Radar →</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
