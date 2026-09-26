import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  University,
  Rocket,
  MapPin,
  Mail,
  Globe,
  ExternalLink,
  Heart,
  BadgeCheck,
  Clock,
  Layers,
  Phone,
  Share2,
  Calendar
} from 'lucide-react';
import { tbiService } from '../services/tbiService';
import { userService } from '../services/userService';
import { useAuth } from '../hooks/useAuth';
import { getTbiDisplayData } from '../utils/tbiMapping';
import { addRecentlyViewed } from '../utils/recentTbis';
import { showToast } from '../components/Toast';
import { StatusBadge } from '../components/StatusBadge';

export const TbiDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, requireAuth } = useAuth();

  const [tbi, setTbi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFavorited, setIsFavorited] = useState(false);
  const [savingFav, setSavingFav] = useState(false);
  const [isAnimatingFav, setIsAnimatingFav] = useState(false);
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
          addRecentlyViewed(res.data);
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
      requireAuth(null, {
        title: 'Login to save TBIs',
        subtitle: 'Create a free account or login to bookmark incubation centres to your personal list.',
        contextMessage: `Login to save "${tbi?.university || 'this TBI'}" to your collection.`,
        context: 'save',
        returnPath: window.location.pathname
      });
      return;
    }

    if (savingFav || !tbi) return;
    setSavingFav(true);

    const willBeFavorited = !isFavorited;
    setIsAnimatingFav(true);
    setTimeout(() => setIsAnimatingFav(false), 260);

    try {
      if (isFavorited) {
        setIsFavorited(false);
        await userService.removeFavorite(tbi.id);
        showToast('Removed from your TBIs');
        window.dispatchEvent(new CustomEvent('favorites-updated', { detail: { id: tbi.id, isSaved: false } }));
      } else {
        setIsFavorited(true);
        await userService.addFavorite(tbi.id);
        showToast('Saved to your TBIs');
        window.dispatchEvent(new CustomEvent('favorites-updated', { detail: { id: tbi.id, isSaved: true } }));
      }
    } catch (err) {
      console.error('Favorite error:', err);
      setIsFavorited(!willBeFavorited);
      showToast('Could not update saved status', 'error');
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
          className="px-4 py-2 bg-[#7A0B1A] text-[#D9CAB3] text-xs font-bold rounded-lg shadow-sm hover:bg-[#5B0712] transition-colors"
        >
          Back to Explore
        </Link>
      </div>
    );
  }

  const {
    universityName,
    incubatorName,
    incubatorType,
    city,
    email,
    website,
    websiteUrl,
    hasValidWebsite,
    displayHostname,
    status: displayStatus,
    firstLetter
  } = getTbiDisplayData(tbi);

  const isVerified = displayStatus === 'Verified';
  const isUnderVerification = displayStatus === 'Under Verification';

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Back button */}
      <div>
        <Link
          to="/explore"
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#5B0712] hover:text-[#7A0B1A] transition-colors"
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
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#D9CAB3] border border-[#8C7A6B] flex items-center justify-center font-extrabold text-[#7A0B1A] text-2xl sm:text-3xl shrink-0 shadow-sm overflow-hidden">
              {tbi.logo ? (
                <img
                  src={tbi.logo}
                  alt={universityName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                firstLetter
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <StatusBadge status={displayStatus} />

                {incubatorType && (
                  <span className="text-xs font-bold text-[#7A0B1A] bg-[#D9CAB3] px-2.5 py-0.5 rounded-md border border-[#8C7A6B]/40 shadow-xs">
                    {incubatorType}
                  </span>
                )}
              </div>

              {/* Primary Title: University Name */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#7A0B1A] leading-tight">
                {universityName}
              </h1>

              {/* Secondary prominent info: Incubator / TBI Name */}
              <p className="text-base font-semibold text-[#5B0712] mt-1.5 flex items-center space-x-2">
                <Rocket className="w-4 h-4 shrink-0 text-[#5B0712]" />
                <span>{incubatorName}</span>
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={handleShare}
              className="p-2.5 rounded-xl border border-slate-border text-slate-muted hover:text-[#7A0B1A] hover:bg-[#D9CAB3]/40 transition-colors"
              title="Copy share link"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={handleToggleFavorite}
              disabled={savingFav}
              className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                isFavorited
                  ? 'bg-red-50 text-red-600 border-red-200 shadow-sm'
                  : 'bg-surface text-slate-600 border-slate-border hover:bg-slate-50 hover:text-red-500'
              }`}
            >
              <Heart
                className={`w-4 h-4 transition-colors duration-200 ${
                  isFavorited ? 'fill-red-500 text-red-500' : 'fill-none stroke-current'
                } ${isAnimatingFav ? 'animate-heart-pop' : ''}`}
              />
              <span>{isFavorited ? 'Saved' : 'Save TBI'}</span>
            </button>
          </div>
        </div>

        {copied && (
          <div className="text-xs font-bold text-[#7A0B1A] bg-[#D9CAB3] px-3 py-1.5 rounded-lg border border-[#5B0712]/30 text-center animate-in fade-in">
            Link copied to clipboard!
          </div>
        )}

        <hr className="border-slate-100" />

        {/* Detailed Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] border border-[#D9CAB3]/70 flex items-center justify-center shrink-0 mt-0.5">
              <University className="w-4 h-4 text-[#7A0B1A]" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-muted">
                University
              </p>
              <p className="font-semibold text-slate mt-0.5">{universityName}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] border border-[#D9CAB3]/70 flex items-center justify-center shrink-0 mt-0.5">
              <Rocket className="w-4 h-4 text-[#5B0712]" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-muted">
                Incubator / Centre
              </p>
              <p className="font-semibold text-slate mt-0.5">{incubatorName}</p>
              {incubatorType && (
                <span className="text-xs text-[#5B0712] font-semibold">
                  {incubatorType}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] border border-[#D9CAB3]/70 flex items-center justify-center shrink-0 mt-0.5">
              <MapPin className="w-4 h-4 text-[#5B0712]" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-muted">
                Location
              </p>
              <p className="font-semibold text-slate mt-0.5">
                {city}
                {tbi.state ? `, ${tbi.state}` : ''}
              </p>
              <span className="text-xs text-slate-muted">
                {tbi.country || 'India'}
              </span>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] border border-[#D9CAB3]/70 flex items-center justify-center shrink-0 mt-0.5">
              <Mail className="w-4 h-4 text-[#BC8034]" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-muted">
                Official Email
              </p>
              {email ? (
                <a
                  href={`mailto:${email}`}
                  className="font-semibold text-[#5B0712] hover:underline transition-colors mt-0.5 block"
                >
                  {email}
                </a>
              ) : (
                <p className="text-xs text-slate-400 italic mt-0.5">Not available</p>
              )}
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] border border-[#D9CAB3]/70 flex items-center justify-center shrink-0 mt-0.5">
              <Globe className="w-4 h-4 text-[#7A0B1A]" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-muted flex items-center space-x-1">
                <span>🌐</span>
                <span>Website</span>
              </p>
              {hasValidWebsite && websiteUrl ? (
                <a
                  href={websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 font-bold text-[#7A0B1A] hover:text-[#5B0712] hover:underline mt-0.5"
                  title={`Open ${websiteUrl} in new tab`}
                >
                  <span>{displayHostname || websiteUrl}</span>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0 text-[#7A0B1A]" />
                </a>
              ) : (
                <p className="text-xs text-slate-400 italic mt-0.5">Website URL not available</p>
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
