import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Building2, MapPin, Globe, Mail, Linkedin, Bookmark, CheckCircle2, 
  ExternalLink, ArrowLeft, DollarSign, Calendar, Layers, ShieldCheck, 
  Share2, AlertCircle, Building, Briefcase
} from 'lucide-react';
import { investorService } from '../services/investorService';
import { useAuth } from '../context/AuthContext';

export const InvestorDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [investor, setInvestor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    setLoading(true);
    setError(null);

    investorService.getInvestorById(id)
      .then(res => {
        if (!isCancelled) {
          setInvestor(res.data);
          setIsSaved(res.data.isSaved || false);
        }
      })
      .catch(err => {
        if (!isCancelled) {
          console.error('Error fetching investor details:', err);
          setError('Failed to load investor profile.');
        }
      })
      .finally(() => {
        if (!isCancelled) setLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [id]);

  const handleToggleSave = async () => {
    if (!user) {
      alert('Please sign in to save investors.');
      return;
    }
    setSaving(true);
    try {
      if (isSaved) {
        await investorService.unsaveInvestor(investor.id);
        setIsSaved(false);
      } else {
        await investorService.saveInvestor(investor.id);
        setIsSaved(true);
      }
    } catch (err) {
      console.error('Error saving investor:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] text-white p-6 sm:p-10 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
        <p className="text-gray-400 text-xs tracking-wide">Loading investor profile...</p>
      </div>
    );
  }

  if (error || !investor) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] text-white p-6 flex flex-col items-center justify-center">
        <div className="max-w-md w-full bg-[#131318] border border-white/10 rounded-3xl p-8 text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
          <h2 className="text-lg font-bold">Investor Not Found</h2>
          <p className="text-xs text-gray-400">{error || 'The requested investor profile does not exist.'}</p>
          <Link
            to="/funding"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Directory
          </Link>
        </div>
      </div>
    );
  }

  const logoSrc = investor.logo || investor.logoUrl;
  const ticketDisplay = () => {
    if (investor.ticketRangeDisplay && investor.ticketRangeDisplay !== 'Not publicly disclosed') {
      return investor.ticketRangeDisplay;
    }
    if (investor.disclosedTicketMin && investor.disclosedTicketMax) {
      return `${investor.currency || 'INR'} ${investor.disclosedTicketMin.toLocaleString()} - ${investor.disclosedTicketMax.toLocaleString()}`;
    }
    if (investor.disclosedTicketMin) {
      return `From ${investor.currency || 'INR'} ${investor.disclosedTicketMin.toLocaleString()}`;
    }
    return 'Not publicly disclosed';
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white p-4 sm:p-6 lg:p-10 space-y-8">
      {/* Back Button */}
      <div>
        <Link
          to="/funding"
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Funding & Investors
        </Link>
      </div>

      {/* Header Banner Card */}
      <div className="relative rounded-3xl bg-[#131318] border border-white/10 p-6 sm:p-8 backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-5">
            <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center p-3 overflow-hidden flex-shrink-0">
              {logoSrc ? (
                <img src={logoSrc} alt={investor.name} className="w-full h-full object-contain" />
              ) : (
                <Building2 className="w-10 h-10 text-orange-400" />
              )}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {investor.name}
                </h1>
                {investor.verificationStatus === 'Verified' ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verified Institution
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    {investor.verificationStatus}
                  </span>
                )}
              </div>
              <p className="text-gray-400 text-xs sm:text-sm mt-1 max-w-2xl">
                {investor.tagline || investor.description}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 mt-3">
                <span className="font-medium text-gray-300">{investor.type}</span>
                {investor.headquartersCity && (
                  <span className="flex items-center gap-1 text-gray-400">
                    <MapPin className="w-3.5 h-3.5 text-gray-500" />
                    {investor.headquartersCity}, {investor.country || 'India'}
                  </span>
                )}
                {investor.lastVerifiedDate && (
                  <span className="flex items-center gap-1 text-gray-500">
                    <Calendar className="w-3.5 h-3.5" />
                    Last verified {new Date(investor.lastVerifiedDate).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 self-start md:self-center">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-200 transition-colors"
            >
              <Share2 className="w-4 h-4 text-gray-400" />
              {copied ? 'Copied Link!' : 'Share'}
            </button>
            <button
              onClick={handleToggleSave}
              disabled={saving}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                isSaved
                  ? 'bg-orange-500/10 border-orange-500/30 text-orange-400 hover:bg-orange-500/20'
                  : 'bg-white/5 border-white/10 text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-orange-400' : ''}`} />
              {isSaved ? 'Saved to Portfolio' : 'Bookmark Investor'}
            </button>
            {investor.applicationUrl && (
              <a
                href={investor.applicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-colors shadow-lg shadow-orange-500/20"
              >
                Pitch Deck / Apply
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Overview vs Details Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 cols): Overview, Thesis, Portfolio */}
        <div className="lg:col-span-2 space-y-8">
          {/* Investment Thesis & About */}
          <div className="rounded-3xl bg-[#131318] border border-white/10 p-6 sm:p-8 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-orange-400" />
              Investment Thesis & Overview
            </h2>
            <div className="text-sm text-gray-300 leading-relaxed space-y-4">
              <p>
                {investor.investmentThesis || 'Investment thesis details are reviewed during official application or pitch rounds.'}
              </p>
              {investor.description && investor.description !== investor.investmentThesis && (
                <p className="text-gray-400 text-xs leading-relaxed">
                  {investor.description}
                </p>
              )}
            </div>
          </div>

          {/* Sectors and Stages */}
          <div className="rounded-3xl bg-[#131318] border border-white/10 p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                Focus Sectors & Domains
              </h3>
              <div className="flex flex-wrap gap-2">
                {investor.sectors && investor.sectors.length > 0 ? (
                  investor.sectors.map((sec) => (
                    <span
                      key={sec}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-orange-500/10 text-orange-300 border border-orange-500/20"
                    >
                      {sec}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-gray-500">General Technology / Sector Agnostic</span>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                Target Investment Stages
              </h3>
              <div className="flex flex-wrap gap-2">
                {investor.stages && investor.stages.length > 0 ? (
                  investor.stages.map((st) => (
                    <span
                      key={st}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/5 text-gray-200 border border-white/10"
                    >
                      {st}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-gray-500">Not publicly disclosed</span>
                )}
              </div>
            </div>
          </div>

          {/* Portfolio Companies */}
          <div className="rounded-3xl bg-[#131318] border border-white/10 p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-orange-400" />
                Select Portfolio Companies
              </h2>
              <span className="text-xs text-gray-500">Publicly Disclosed</span>
            </div>

            {investor.portfolioCompanies && investor.portfolioCompanies.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {investor.portfolioCompanies.map((comp, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2 hover:border-white/10 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white">{comp.name}</h4>
                      {comp.stage && (
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-gray-300 border border-white/5">
                          {comp.stage}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-400 flex items-center justify-between">
                      <span>{comp.sector || 'Technology'}</span>
                      {comp.year && <span>{comp.year}</span>}
                    </div>
                    {comp.tbiAffiliation && (
                      <div className="text-[11px] text-orange-400/90 font-medium pt-1 border-t border-white/5">
                        Incubated at: {comp.tbiAffiliation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-500">Portfolio companies not publicly disclosed or in stealth.</p>
            )}
          </div>

          {/* Connected TBIs & University Incubators */}
          <div className="rounded-3xl bg-[#131318] border border-white/10 p-6 sm:p-8 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Building className="w-5 h-5 text-orange-400" />
              Verified Incubator & University Connections
            </h2>
            {investor.connectedTbis && investor.connectedTbis.length > 0 ? (
              <div className="space-y-3">
                {investor.connectedTbis.map((tbi) => (
                  <div
                    key={tbi.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-black/40 border border-white/5"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-white">{tbi.name}</h4>
                      <p className="text-xs text-gray-400">{tbi.university || tbi.city}</p>
                      {tbi.InvestorTbiConnection?.description && (
                        <p className="text-[11px] text-gray-500 mt-1">
                          {tbi.InvestorTbiConnection.description}
                        </p>
                      )}
                    </div>
                    <Link
                      to={`/tbi/${tbi.id}`}
                      className="px-3.5 py-1.5 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/20 text-xs font-semibold self-start sm:self-center transition-colors"
                    >
                      View TBI Profile
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-500">No public institutional TBI affiliations linked yet.</p>
            )}
          </div>
        </div>

        {/* Right Column (1 col): Key Facts & Official Information */}
        <div className="space-y-6">
          {/* Quick Metrics Card */}
          <div className="rounded-3xl bg-[#131318] border border-white/10 p-6 space-y-5">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Investment Parameters
            </h3>

            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                <span className="text-gray-400 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-orange-400" />
                  Ticket Size Range
                </span>
                <p className="text-sm font-bold text-white">{ticketDisplay()}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                <span className="text-gray-400">Geographic Preferences</span>
                <p className="text-xs font-semibold text-gray-200">
                  {investor.geographicPreferences && investor.geographicPreferences.length > 0
                    ? investor.geographicPreferences.join(', ')
                    : 'India & Global'}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                <span className="text-gray-400">Headquarters</span>
                <p className="text-xs font-semibold text-gray-200">
                  {investor.headquartersCity || 'India'}
                </p>
              </div>
            </div>
          </div>

          {/* Official Verification & Source Audit */}
          <div className="rounded-3xl bg-[#131318] border border-white/10 p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Source & Verification
            </h3>
            <div className="space-y-3 text-xs text-gray-400">
              <div className="flex items-center justify-between">
                <span>Verification Status:</span>
                <span className="font-semibold text-emerald-400">{investor.verificationStatus}</span>
              </div>
              {investor.lastVerifiedDate && (
                <div className="flex items-center justify-between">
                  <span>Last Audited:</span>
                  <span className="text-gray-200">{new Date(investor.lastVerifiedDate).toLocaleDateString()}</span>
                </div>
              )}
              {investor.sourceUrl && (
                <div className="pt-2 border-t border-white/5">
                  <span className="block text-[11px] text-gray-500 mb-1">Primary Source:</span>
                  <a
                    href={investor.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-400 hover:underline flex items-center gap-1 truncate text-xs"
                  >
                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                    {investor.sourceUrl}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Official Links */}
          <div className="rounded-3xl bg-[#131318] border border-white/10 p-6 space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
              Official Links
            </h3>
            {investor.website && (
              <a
                href={investor.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5 hover:border-white/20 text-xs text-gray-300 hover:text-white transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-orange-400" />
                  Official Website
                </span>
                <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
              </a>
            )}
            {investor.contactEmail && (
              <a
                href={`mailto:${investor.contactEmail}`}
                className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5 hover:border-white/20 text-xs text-gray-300 hover:text-white transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-orange-400" />
                  Contact Email
                </span>
                <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
              </a>
            )}
            {investor.linkedinUrl && (
              <a
                href={investor.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5 hover:border-white/20 text-xs text-gray-300 hover:text-white transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Linkedin className="w-4 h-4 text-orange-400" />
                  LinkedIn Page
                </span>
                <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestorDetails;