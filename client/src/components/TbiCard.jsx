import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Mail,
  ExternalLink,
  Heart,
  CheckCircle2,
  Clock,
  Navigation,
  Building2
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { userService } from '../services/userService';
import { getTbiDisplayData } from '../utils/tbiMapping';

export const TbiCard = ({ tbi, onFavoriteToggle }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isFavorited, setIsFavorited] = useState(tbi?.isFavorited || false);
  const [loadingFav, setLoadingFav] = useState(false);

  // Map backend dataset fields to clean UI representations
  const {
    universityName,
    incubatorName,
    incubatorType,
    city,
    email,
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

  const isVerified = status === 'Verified';
  const isUnderVerification = status === 'Under Verification';

  return (
    <div className="bg-surface border border-slate-border rounded-xl p-5 shadow-card hover:shadow-hover hover:border-[#90323D] transition-all duration-200 flex flex-col justify-between group relative">
      {/* Top Header with Avatar & Favorite Heart (Requirement 8) */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          {/* Avatar / Logo */}
          <div className="w-12 h-12 rounded-xl bg-[#D9CAB3] border border-[#8C7A6B] flex items-center justify-center font-extrabold text-[#5E0B15] text-lg shrink-0 shadow-sm overflow-hidden">
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
              <span className="flex items-center space-x-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-[#D9CAB3] text-[#5E0B15] border border-[#90323D]/30">
                <Navigation className="w-3 h-3 text-[#90323D]" />
                <span>{tbi.distance} km</span>
              </span>
            )}

            {/* 8. Favorite Heart Button */}
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

        {/* 1. University name as the primary title */}
        <h3 className="text-base font-bold text-slate group-hover:text-[#90323D] transition-colors line-clamp-2 leading-snug">
          <Link to={`/tbi/${tbi.id}`} title={universityName}>
            {universityName}
          </Link>
        </h3>

        {/* 2. Incubator / TBI name as the secondary prominent information */}
        <p className="text-xs font-semibold text-[#5E0B15] mt-1.5 flex items-center space-x-1.5 leading-snug">
          <Building2 className="w-3.5 h-3.5 text-[#90323D] shrink-0" />
          <span className="truncate" title={incubatorName}>
            {incubatorName}
          </span>
        </p>

        {/* 3. Incubator Type as a badge */}
        {incubatorType && (
          <div className="mt-2.5">
            <span className="inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-[#D9CAB3] text-[#5E0B15] border border-[#8C7A6B] shadow-sm">
              {incubatorType}
            </span>
          </div>
        )}

        {/* 4. City with MapPin icon & 5. Official Email ID with Mail icon */}
        <div className="mt-4 space-y-1.5 text-xs text-slate-muted">
          {/* 4. City with MapPin icon */}
          <div className="flex items-center space-x-2">
            <MapPin className="w-3.5 h-3.5 text-[#90323D] shrink-0" />
            <span className="truncate">{city}</span>
          </div>

          {/* 5. Official Email ID with Mail icon */}
          <div className="flex items-center space-x-2">
            <Mail className="w-3.5 h-3.5 text-[#BC8034] shrink-0" />
            {email ? (
              <a
                href={`mailto:${email}`}
                className="truncate hover:text-[#90323D] hover:underline transition-colors"
                title={`Send email to ${email}`}
              >
                {email}
              </a>
            ) : (
              <span className="text-slate-400 italic">Email not available</span>
            )}
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
        {/* 6. Status at the bottom */}
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

        {/* 7. View Details button & Official Website */}
        <div className="flex items-center space-x-2">
          {tbi?.hasValidWebsite && tbi?.websiteUrl ? (
            <a
              href={tbi.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg text-slate-muted hover:text-[#5E0B15] hover:bg-[#D9CAB3]/40 transition-colors"
              title="Visit official website"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          ) : null}

          {/* 7. View Details button */}
          <Link
            to={`/tbi/${tbi.id}`}
            className="px-3 py-1.5 rounded-lg bg-[#5E0B15] hover:bg-[#90323D] text-[#D9CAB3] text-xs font-semibold transition-all shadow-sm"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};
