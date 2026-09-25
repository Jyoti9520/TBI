import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Mail,
  Globe,
  Heart,
  BadgeCheck,
  Clock,
  Navigation,
  University,
  Rocket,
  ArrowRight,
  Loader2,
  Check,
  GitCompare
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { userService } from '../services/userService';
import { getTbiDisplayData } from '../utils/tbiMapping';
import { showToast } from './Toast';
import { StatusBadge } from './StatusBadge';

export const TbiCard = ({
  tbi,
  onFavoriteToggle,
  isComparing = false,
  onToggleCompare
}) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isFavorited, setIsFavorited] = useState(tbi?.isFavorited || false);
  const [loadingFav, setLoadingFav] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsFavorited(tbi?.isFavorited || false);
  }, [tbi?.isFavorited]);

  // Map backend dataset fields to clean UI representations
  const {
    universityName,
    incubatorName,
    incubatorType,
    city,
    email,
    websiteUrl,
    hasValidWebsite,
    displayHostname,
    status,
    firstLetter
  } = getTbiDisplayData(tbi);

  const handleToggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (loadingFav) return;
    setLoadingFav(true);

    const willBeFavorited = !isFavorited;
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 260);

    try {
      if (isFavorited) {
        setIsFavorited(false);
        await userService.removeFavorite(tbi.id);
        showToast('Removed from your TBIs');
        if (onFavoriteToggle) onFavoriteToggle(tbi.id, false);
        window.dispatchEvent(new CustomEvent('favorites-updated', { detail: { id: tbi.id, isSaved: false } }));
      } else {
        setIsFavorited(true);
        await userService.addFavorite(tbi.id);
        showToast('Saved to your TBIs');
        if (onFavoriteToggle) onFavoriteToggle(tbi.id, true);
        window.dispatchEvent(new CustomEvent('favorites-updated', { detail: { id: tbi.id, isSaved: true } }));
      }
    } catch (err) {
      console.error('Favorite error:', err);
      setIsFavorited(!willBeFavorited);
      showToast('Could not update saved status', 'error');
    } finally {
      setLoadingFav(false);
    }
  };

  const isVerified = status === 'Verified';
  const isUnderVerification = status === 'Under Verification';

  return (
    <div className="bg-surface border border-slate-border rounded-xl p-5 shadow-subtle hover:shadow-card hover:-translate-y-1 hover:border-[#7A0B1A]/40 transition-all duration-200 ease-out flex flex-col justify-between group relative">
      {/* Top Section: University/Logo/Initial & Favorite Heart Button */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3.5">
          {/* University Logo / Initial with subtle container */}
          <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] border border-[#D9CAB3] flex items-center justify-center font-extrabold text-[#7A0B1A] text-lg shrink-0 shadow-xs overflow-hidden transition-transform duration-200 group-hover:scale-105">
            {tbi?.logo ? (
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

          <div className="flex items-center space-x-1.5">
            {/* Distance Badge if available */}
            {tbi?.distance !== null && tbi?.distance !== undefined && (
              <span className="flex items-center space-x-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-[#FAF7F2] text-[#7A0B1A] border border-[#D9CAB3]">
                <Navigation className="w-3 h-3 text-[#7A0B1A]" />
                <span>{tbi.distance} km</span>
              </span>
            )}

            {/* Compare Checkbox / Button */}
            {onToggleCompare && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onToggleCompare(tbi);
                }}
                className={`inline-flex items-center space-x-1 px-2 py-1 rounded-lg text-[11px] font-semibold transition-all duration-200 cursor-pointer border ${
                  isComparing
                    ? 'bg-[#7A0B1A] text-white border-[#7A0B1A] shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:text-[#7A0B1A] hover:border-[#D9CAB3] hover:bg-[#FAF7F2]'
                }`}
                title={isComparing ? 'Remove from compare' : 'Add to compare (max 3)'}
                aria-pressed={isComparing}
              >
                <div
                  className={`w-3.5 h-3.5 rounded flex items-center justify-center border transition-colors ${
                    isComparing
                      ? 'bg-white text-[#7A0B1A] border-white'
                      : 'border-slate-300 bg-white'
                  }`}
                >
                  {isComparing ? (
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  ) : null}
                </div>
                <span>Compare</span>
              </button>
            )}

            {/* Favorite Heart Button */}
            <button
              onClick={handleToggleFavorite}
              disabled={loadingFav}
              className={`p-2 rounded-full transition-all duration-200 cursor-pointer ${
                isFavorited
                  ? 'text-red-500 bg-red-50 hover:bg-red-100 shadow-2xs'
                  : 'text-slate-400 hover:text-red-500 hover:bg-red-50/60'
              }`}
              title={isFavorited ? 'Remove from saved' : 'Save to your TBIs'}
              aria-label={isFavorited ? 'Remove from saved' : 'Save to your TBIs'}
            >
              <Heart
                className={`w-4 h-4 transition-colors duration-200 ${
                  isFavorited ? 'fill-red-500 text-red-500' : 'fill-none stroke-current'
                } ${isAnimating ? 'animate-heart-pop' : ''}`}
              />
            </button>
          </div>
        </div>

        {/* Middle Section: University Name, TBI / Incubator Name, Incubator Type Badge */}
        <div>
          {/* University Name */}
          <h3 className="text-base font-bold text-[#243447] group-hover:text-[#7A0B1A] transition-colors duration-200 line-clamp-2 leading-snug">
            <Link to={`/tbi/${tbi.id}`} title={universityName}>
              {universityName}
            </Link>
          </h3>

          {/* TBI / Incubator Name (with Rocket icon) */}
          <p className="text-xs font-semibold text-[#7A0B1A] mt-1.5 flex items-center space-x-1.5 leading-snug">
            <div className="w-5 h-5 rounded-md bg-[#FAF7F2] border border-[#D9CAB3]/70 flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110">
              <Rocket className="w-3 h-3 text-[#7A0B1A]" />
            </div>
            <span className="truncate" title={incubatorName}>
              {incubatorName}
            </span>
          </p>

          {/* Incubator Type Badge */}
          {incubatorType && (
            <div className="mt-2.5">
              <span className="inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-[#FAF7F2] text-[#7A0B1A] border border-[#D9CAB3] shadow-2xs">
                {incubatorType}
              </span>
            </div>
          )}
        </div>

        {/* Information Section: City with MapPin & Official Email with Mail icon */}
        <div className="mt-4 space-y-1.5 text-xs text-[#647C98]">
          {/* City with MapPin icon */}
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 rounded-md bg-[#FAF7F2] border border-[#D9CAB3]/70 flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110">
              <MapPin className="w-3 h-3 text-[#7A0B1A]" />
            </div>
            <span className="truncate text-[#243447] font-medium" title={city}>
              {city}
            </span>
          </div>

          {/* Official Email with Mail icon */}
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 rounded-md bg-[#FAF7F2] border border-[#D9CAB3]/70 flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110">
              <Mail className="w-3 h-3 text-[#D99A2B]" />
            </div>
            {email ? (
              <a
                href={`mailto:${email}`}
                className="truncate hover:text-[#7A0B1A] hover:underline text-[#647C98] font-medium transition-colors duration-200"
                title={`Send email to ${email}`}
              >
                {email}
              </a>
            ) : (
              <span className="text-[#647C98]/60 italic">Email not available</span>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Section: Verification Status & View Details Button */}
      <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
        {/* Verification Status */}
        <StatusBadge status={status} />

        {/* View Details Button & Official Website */}
        <div className="flex items-center space-x-2">
          {hasValidWebsite && websiteUrl ? (
            <a
              href={websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg text-slate-muted hover:text-[#7A0B1A] hover:bg-[#FAF7F2] transition-colors duration-200"
              title={`Visit official website: ${displayHostname || websiteUrl}`}
            >
              <Globe className="w-3.5 h-3.5 text-[#7A0B1A]" />
            </a>
          ) : null}

          {/* View Details Button with Arrow Animation and Loading State */}
          <Link
            to={`/tbi/${tbi.id}`}
            onClick={(e) => {
              if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
                return;
              }
              setIsNavigating(true);
            }}
            className="group/btn inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-[#7A0B1A] hover:bg-[#5B0712] text-white text-xs font-semibold shadow-xs hover:shadow-sm active:scale-[0.97] active:translate-y-[1px] transition-all duration-200 select-none"
          >
            {isNavigating ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                <span>Opening...</span>
              </>
            ) : (
              <>
                <span>View Details</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 ease-out group-hover/btn:translate-x-1" />
              </>
            )}
          </Link>
        </div>
      </div>
    </div>
  );
};
