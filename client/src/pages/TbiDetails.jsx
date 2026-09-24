import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Building2,
  MapPin,
  Mail,
  Globe,
  ExternalLink,
  Heart,
  CheckCircle2,
  Clock,
  Layers,
  Phone,
  Share2,
  Calendar
} from 'lucide-react';
import { tbiService } from '../services/tbiService';
import { userService } from '../services/userService';
import { useAuth } from '../hooks/useAuth';

export const TbiDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [tbi, setTbi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFavorited, setIsFavorited] = useState(false);
  const [savingFav, setSavingFav] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let active = true;
    const fetchTbi = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await tbiService.getTbiById(id);
        if (active && res.success) {
          setTbi(res.data);
          setIsFavorited(res.data.isFavorited || false);
        }
      } catch (err) {
        if (active) {
          setError('TBI not found or error loading incubator profile.');
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchTbi();
    return () => {
      active = false;
    };
  }, [id]);

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (savingFav || !tbi) return;
    setSavingFav(true);

    try {
      if (isFavorited) {
        await userService.removeFavorite(tbi.id);
        setIsFavorited(false);
      } else {
        await userService.addFavorite(tbi.id);
        setIsFavorited(true);
      }
    } catch (err) {
      console.error('Favorite error:', err);
    } finally {
      setSavingFav(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getFirstLetter = (name) => {
    if (!name) return 'T';
    const cleaned = name.replace(/[^a-zA-Z0-9]/g, ' ').trim();
    return cleaned.length > 0 ? cleaned[0].toUpperCase() : 'T';
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-8 space-y-6">
        <div className="h-6 bg-slate-200 rounded w-32 animate-pulse" />
        <div className="h-64 bg-surface rounded-2xl border border-slate-border animate-pulse" />
      </div>
    );
  }

  if (error || !tbi) {
    return (
      <div className="max-w-md mx-auto py-16 text-center">
        <h2 className="text-xl font-bold text-slate mb-2">TBI Profile Not Found</h2>
        <p className="text-sm text-slate-muted mb-6">
          The requested technology business incubator does not exist or has been removed.
        </p>
        <Link
          to="/explore"
          className="px-4 py-2 bg-[#1F150C] text-[#E1DCC9] text-xs font-bold rounded-lg shadow-sm hover:bg-[#412D15] transition-colors"
        >
          Back to Explore
        </Link>
      </div>
    );
  }

  const isVerified = tbi.status === 'Verified';
  const isUnderVerification = tbi.status === 'Under Verification';

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Back button */}
      <div>
        <Link
          to="/explore"
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#412D15] hover:text-[#1F150C] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Explore</span>
        </Link>
      </div>

      {/* Hero Header Card */}
      <div className="bg-surface border border-slate-border rounded-2xl p-6 sm:p-8 shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div className="flex items-start space-x-4">
            {/* Avatar / Logo */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#E1DCC9] border border-[#CFC6A9] flex items-center justify-center font-extrabold text-[#1F150C] text-2xl sm:text-3xl shrink-0 shadow-sm overflow-hidden">
              {tbi.logo ? (
                <img
                  src={tbi.logo}
                  alt={tbi.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                getFirstLetter(tbi.name)
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                {isVerified ? (
                  <span className="inline-flex items-center space-x-1 text-xs font-semibold text-status-success bg-green-50 px-2.5 py-0.5 rounded-full border border-green-200">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verified Ecosystem</span>
                  </span>
                ) : isUnderVerification ? (
                  <span className="inline-flex items-center space-x-1 text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Under Verification</span>
                  </span>
                ) : (
                  <span className="text-xs text-slate-400">Unverified</span>
                )}

                {tbi.incubatorType && (
                  <span className="text-xs font-bold text-[#1F150C] bg-[#E1DCC9] px-2.5 py-0.5 rounded-full border border-[#CFC6A9] shadow-sm">
                    {tbi.incubatorType}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F150C] leading-tight">
                {tbi.name}
              </h1>

              <p className="text-sm font-semibold text-slate-muted mt-1">
                {tbi.university}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={handleShare}
              className="p-2.5 rounded-xl border border-slate-border text-slate-muted hover:text-[#1F150C] hover:bg-[#E1DCC9]/40 transition-colors"
              title="Copy share link"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={handleToggleFavorite}
              disabled={savingFav}
              className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl border text-xs font-bold transition-all ${
                isFavorited
                  ? 'bg-red-50 text-red-600 border-red-200 shadow-sm'
                  : 'bg-surface text-slate border-slate-border hover:bg-slate-50'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current text-red-500' : ''}`} />
              <span>{isFavorited ? 'Saved' : 'Save TBI'}</span>
            </button>
          </div>
        </div>

        {copied && (
          <div className="text-xs font-bold text-[#1F150C] bg-[#E1DCC9] px-3 py-1.5 rounded-lg border border-[#412D15]/30 text-center animate-in fade-in">
            Link copied to clipboard!
          </div>
        )}

        <hr className="border-slate-100" />

        {/* Detailed Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
          <div className="flex items-start space-x-3">
            <Building2 className="w-5 h-5 text-[#412D15] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-muted">
                University
              </p>
              <p className="font-semibold text-slate mt-0.5">{tbi.university}</p>
              {tbi.universityType && (
                <span className="text-xs text-[#412D15] font-semibold">
                  {tbi.universityType}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <MapPin className="w-5 h-5 text-[#412D15] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-muted">
                Location
              </p>
              <p className="font-semibold text-slate mt-0.5">
                {tbi.city || 'City not specified'}
                {tbi.state ? `, ${tbi.state}` : ''}
              </p>
              <span className="text-xs text-slate-muted">
                {tbi.country || 'India'}
              </span>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Mail className="w-5 h-5 text-[#412D15] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-muted">
                Official Email
              </p>
              {tbi.email ? (
                <a
                  href={`mailto:${tbi.email}`}
                  className="font-semibold text-[#412D15] hover:underline transition-colors mt-0.5 block"
                >
                  {tbi.email}
                </a>
              ) : (
                <p className="text-xs text-slate-400 italic mt-0.5">Not available</p>
              )}
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Globe className="w-5 h-5 text-[#412D15] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-muted">
                Website
              </p>
              {tbi.hasValidWebsite && tbi.websiteUrl ? (
                <a
                  href={tbi.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 font-bold text-[#412D15] hover:underline mt-0.5"
                >
                  <span>Visit Official Website</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : tbi.website ? (
                <p className="font-medium text-slate text-xs mt-0.5">
                  {tbi.website} <span className="text-slate-400">(Portal reference)</span>
                </p>
              ) : (
                <p className="text-xs text-slate-400 italic mt-0.5">Not available</p>
              )}
            </div>
          </div>
        </div>

        {/* Future Enrichment details (description, phone, etc.) */}
        {tbi.description && (
          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-muted mb-2">
              About the Incubator
            </h3>
            <p className="text-sm text-slate-muted leading-relaxed whitespace-pre-line">
              {tbi.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
