import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Mail,
  Globe,
  Heart,
  Navigation,
  ArrowRight,
  Loader2,
  Check,
  Building2,
  Layers
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
  const { isAuthenticated, requireAuth } = useAuth();
  const navigate = useNavigate();
  const [isFavorited, setIsFavorited] = useState(tbi?.isFavorited || false);
  const [loadingFav, setLoadingFav] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsFavorited(tbi?.isFavorited || false);
  }, [tbi?.isFavorited]);

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
      requireAuth(null, {
        title: 'Login to save TBIs',
        subtitle: 'Create a free account or login to bookmark incubation centres to your personal list.',
        contextMessage: `Login to save "${universityName || 'this TBI'}" to your collection.`,
        context: 'save',
        returnPath: window.location.pathname + window.location.search
      });
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

  return (
    <div
      className={`rounded-card p-5 shadow-card hover:shadow-hover hover:-translate-y-1 transition-all duration-200 ease-out flex flex-col justify-between group relative bg-white border ${
        isComparing
          ? 'border-primary ring-2 ring-primary/20'
          : 'border-border hover:border-primary'
      }`}
    >
      {/* Top Section: University Logo / Initial & Actions */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3.5">
          {/* University Initial / Logo container */}
          <div className="w-11 h-11 rounded-lg bg-background-secondary border border-border flex items-center justify-center font-bold text-primary text-base shrink-0 overflow-hidden transition-transform duration-200 group-hover:scale-105">
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
              <span className="flex items-center space-x-1 text-xs font-medium px-2 py-0.5 rounded-full bg-slate-hover text-primary border border-border">
                <Navigation className="w-3 h-3 text-primary" />
                <span>{tbi.distance} km</span>
              </span>
            )}

            {/* Compare Button */}
            {onToggleCompare && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onToggleCompare(tbi);
                }}
                className={`inline-flex items-center space-x-1.5 px-2 py-1 rounded-md text-xs font-medium transition-all duration-150 cursor-pointer border ${
                  isComparing
                    ? 'bg-primary text-white border-primary shadow-subtle'
                    : 'bg-white text-slate-secondary border-border hover:text-primary hover:border-primary hover:bg-slate-hover'
                }`}
                title={isComparing ? 'Remove from compare' : 'Add to compare (max 3)'}
                aria-pressed={isComparing}
              >
                <div
                  className={`w-3.5 h-3.5 rounded flex items-center justify-center border transition-colors ${
                    isComparing
                      ? 'bg-white text-primary border-white'
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
              className={`p-1.5 rounded-full transition-all duration-150 cursor-pointer ${
                isFavorited
                  ? 'text-red-500 bg-red-50 hover:bg-red-100'
                  : 'text-slate-muted hover:text-red-500 hover:bg-red-50/60'
              }`}
              title={isFavorited ? 'Remove from saved' : 'Save to your TBIs'}
              aria-label={isFavorited ? 'Remove from saved' : 'Save to your TBIs'}
            >
              <Heart
                className={`w-4 h-4 transition-colors duration-150 ${
                  isFavorited ? 'fill-red-500 text-red-500' : 'fill-none stroke-current'
                } ${isAnimating ? 'animate-heart-pop' : ''}`}
              />
            </button>
          </div>
        </div>

        {/* Middle Section: Titles */}
        <div>
          <h3 className="text-base font-bold text-dark group-hover:text-primary transition-colors duration-150 line-clamp-2 leading-snug font-heading">
            <Link to={`/tbi/${tbi.id}`} title={universityName}>
              {universityName}
            </Link>
          </h3>

          <p className="text-xs font-medium text-slate-secondary mt-1 flex items-center space-x-1.5 leading-snug">
            <span className="truncate" title={incubatorName}>
              {incubatorName}
            </span>
          </p>

          {incubatorType && (
            <div className="mt-2.5">
              <span className="inline-block text-[11px] font-semibold px-2 py-0.5 rounded-md bg-background-secondary text-slate-secondary border border-border">
                {incubatorType}
              </span>
            </div>
          )}
        </div>

        {/* Info Rows: City & Email */}
        <div className="mt-4 space-y-1.5 text-xs text-slate-muted">
          <div className="flex items-center space-x-2">
            <MapPin className="w-3.5 h-3.5 text-slate-muted shrink-0" />
            <span className="truncate text-slate-secondary font-medium" title={city}>
              {city}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <Mail className="w-3.5 h-3.5 text-slate-muted shrink-0" />
            {email ? (
              <a
                href={`mailto:${email}`}
                className="truncate hover:text-primary hover:underline text-slate-secondary font-medium transition-colors"
                title={`Send email to ${email}`}
              >
                {email}
              </a>
            ) : (
              <span className="text-slate-muted/60 italic">Email not available</span>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Section: Status Badge & View Button */}
      <div className="mt-5 pt-3.5 border-t border-border flex items-center justify-between">
        <StatusBadge status={status} />

        <div className="flex items-center space-x-2">
          {hasValidWebsite && websiteUrl ? (
            <a
              href={websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg text-slate-muted hover:text-primary hover:bg-slate-hover transition-colors"
              title={`Visit official website: ${displayHostname || websiteUrl}`}
            >
              <Globe className="w-4 h-4 text-slate-muted hover:text-primary" />
            </a>
          ) : null}

          <Link
            to={`/tbi/${tbi.id}`}
            onClick={(e) => {
              if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
                return;
              }
              setIsNavigating(true);
            }}
            className="group/btn inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-btn bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-subtle hover:shadow-card active:scale-[0.98] transition-all duration-150 select-none"
          >
            {isNavigating ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                <span>Opening...</span>
              </>
            ) : (
              <>
                <span>View Details</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-150 ease-out group-hover/btn:translate-x-0.5" />
              </>
            )}
          </Link>
        </div>
      </div>
    </div>
  );
};
