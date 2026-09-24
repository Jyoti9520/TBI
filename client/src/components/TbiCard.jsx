import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Mail,
  ExternalLink,
  Heart,
  CheckCircle2,
  Clock,
  Navigation
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { userService } from '../services/userService';

export const TbiCard = ({ tbi, onFavoriteToggle }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isFavorited, setIsFavorited] = useState(tbi.isFavorited || false);
  const [loadingFav, setLoadingFav] = useState(false);

  const getFirstLetter = (name) => {
    if (!name) return 'T';
    const cleaned = name.replace(/[^a-zA-Z0-9]/g, ' ').trim();
    return cleaned.length > 0 ? cleaned[0].toUpperCase() : 'T';
  };

  const handleToggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (loadingFav) return;
    setLoadingFav(true);

    try {
      if (isFavorited) {
        await userService.removeFavorite(tbi.id);
        setIsFavorited(false);
        if (onFavoriteToggle) onFavoriteToggle(tbi.id, false);
      } else {
        await userService.addFavorite(tbi.id);
        setIsFavorited(true);
        if (onFavoriteToggle) onFavoriteToggle(tbi.id, true);
      }
    } catch (err) {
      console.error('Favorite error:', err);
    } finally {
      setLoadingFav(false);
    }
  };

  const isVerified = tbi.status === 'Verified';
  const isUnderVerification = tbi.status === 'Under Verification';

  return (
    <div className="bg-surface border border-slate-border rounded-xl p-5 shadow-card hover:shadow-hover hover:border-[#412D15] transition-all duration-200 flex flex-col justify-between group relative">
      {/* Top Header with Avatar & Favorite Heart */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          {/* Avatar / Logo */}
          <div className="w-12 h-12 rounded-xl bg-[#E1DCC9] border border-[#CFC6A9] flex items-center justify-center font-extrabold text-[#1F150C] text-lg shrink-0 shadow-sm overflow-hidden">
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

          <div className="flex items-center space-x-1.5">
            {/* Distance Badge if available */}
            {tbi.distance !== null && tbi.distance !== undefined && (
              <span className="flex items-center space-x-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-[#E1DCC9] text-[#1F150C] border border-[#412D15]/30">
                <Navigation className="w-3 h-3 text-[#412D15]" />
                <span>{tbi.distance} km</span>
              </span>
            )}

            {/* Favorite Button */}
            <button
              onClick={handleToggleFavorite}
              disabled={loadingFav}
              className={`p-2 rounded-full transition-colors ${
                isFavorited
                  ? 'text-red-500 bg-red-50 hover:bg-red-100'
                  : 'text-slate-muted hover:text-red-500 hover:bg-slate-100'
              }`}
              title={isFavorited ? 'Remove from saved' : 'Save TBI'}
              aria-label="Toggle Favorite"
            >
              <Heart
                className={`w-4 h-4 transition-transform active:scale-125 ${
                  isFavorited ? 'fill-current' : ''
                }`}
              />
            </button>
          </div>
        </div>

        {/* Title and University */}
        <h3 className="text-base font-bold text-slate group-hover:text-[#412D15] transition-colors line-clamp-2 leading-snug">
          <Link to={`/tbi/${tbi.id}`}>{tbi.name}</Link>
        </h3>

        <p className="text-xs font-semibold text-slate-muted mt-1 truncate">
          {tbi.university}
        </p>

        {/* Incubator Type Pill styled with Color Hunt #E1DCC9 and #412D15 */}
        {tbi.incubatorType && (
          <div className="mt-2.5">
            <span className="inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-[#E1DCC9] text-[#1F150C] border border-[#CFC6A9] shadow-sm">
              {tbi.incubatorType}
            </span>
          </div>
        )}

        {/* Location & Email Details */}
        <div className="mt-4 space-y-1.5 text-xs text-slate-muted">
          <div className="flex items-center space-x-2">
            <MapPin className="w-3.5 h-3.5 text-[#412D15] shrink-0" />
            <span className="truncate">{tbi.city || 'Location not specified'}</span>
          </div>

          <div className="flex items-center space-x-2">
            <Mail className="w-3.5 h-3.5 text-[#634723] shrink-0" />
            {tbi.email ? (
              <a
                href={`mailto:${tbi.email}`}
                className="truncate hover:text-[#412D15] hover:underline transition-colors"
                title={`Send email to ${tbi.email}`}
              >
                {tbi.email}
              </a>
            ) : (
              <span className="text-slate-400 italic">Email not available</span>
            )}
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
        {/* Verification Status */}
        <div>
          {isVerified ? (
            <span className="inline-flex items-center space-x-1 text-xs font-semibold text-status-success">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Verified</span>
            </span>
          ) : isUnderVerification ? (
            <span className="inline-flex items-center space-x-1 text-xs font-semibold text-amber-700">
              <Clock className="w-3.5 h-3.5" />
              <span>Under Verification</span>
            </span>
          ) : (
            <span className="text-xs text-slate-400">Unverified</span>
          )}
        </div>

        {/* Actions: View Details & Official Website */}
        <div className="flex items-center space-x-2">
          {tbi.hasValidWebsite && tbi.websiteUrl ? (
            <a
              href={tbi.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg text-slate-muted hover:text-[#1F150C] hover:bg-[#E1DCC9]/40 transition-colors"
              title="Visit official website"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          ) : null}

          <Link
            to={`/tbi/${tbi.id}`}
            className="px-3 py-1.5 rounded-lg bg-[#1F150C] hover:bg-[#412D15] text-[#E1DCC9] text-xs font-semibold transition-all shadow-sm"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};
