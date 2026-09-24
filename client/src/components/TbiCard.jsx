import React, { useState } from 'react';
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
  Loader2
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { userService } from '../services/userService';
import { getTbiDisplayData } from '../utils/tbiMapping';

export const TbiCard = ({ tbi, onFavoriteToggle }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isFavorited, setIsFavorited] = useState(tbi?.isFavorited || false);
  const [loadingFav, setLoadingFav] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

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
    <div className="bg-surface border border-slate-border rounded-xl p-5 shadow-subtle hover:shadow-card hover:-translate-y-1 hover:border-[#90323D]/50 transition-all duration-200 ease-out flex flex-col justify-between group relative">
      {/* Top Section: University/Logo/Initial & Favorite Heart Button */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3.5">
          {/* University Logo / Initial with subtle container */}
          <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] border border-[#D9CAB3] flex items-center justify-center font-extrabold text-[#5E0B15] text-lg shrink-0 shadow-xs overflow-hidden transition-transform duration-200 group-hover:scale-105">
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
              <span className="flex items-center space-x-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-[#D9CAB3]/40 text-[#5E0B15] border border-[#8C7A6B]/30">
                <Navigation className="w-3 h-3 text-[#90323D]" />
                <span>{tbi.distance} km</span>
              </span>
            )}

            {/* Favorite Heart Button */}
            <button
              onClick={handleToggleFavorite}
              disabled={loadingFav}
              className={`p-2 rounded-full transition-colors duration-200 ${
                isFavorited
                  ? 'text-red-500 bg-red-50 hover:bg-red-100'
                  : 'text-slate-muted hover:text-red-500 hover:bg-slate-100'
              }`}
              title={isFavorited ? 'Remove from saved' : 'Save TBI'}
              aria-label="Toggle Favorite"
            >
              <Heart
                className={`w-4 h-4 transition-transform duration-200 active:scale-125 ${
                  isFavorited ? 'fill-current' : ''
                }`}
              />
            </button>
          </div>
        </div>

        {/* Middle Section: University Name, TBI / Incubator Name, Incubator Type Badge */}
        <div>
          {/* University Name */}
          <h3 className="text-base font-bold text-slate-800 group-hover:text-[#5E0B15] transition-colors duration-200 line-clamp-2 leading-snug">
            <Link to={`/tbi/${tbi.id}`} title={universityName}>
              {universityName}
            </Link>
          </h3>

          {/* TBI / Incubator Name (with Rocket icon) */}
          <p className="text-xs font-semibold text-[#90323D] mt-1.5 flex items-center space-x-1.5 leading-snug">
            <div className="w-5 h-5 rounded-md bg-[#FAF7F2] border border-[#D9CAB3]/70 flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110">
              <Rocket className="w-3 h-3 text-[#90323D]" />
            </div>
            <span className="truncate" title={incubatorName}>
              {incubatorName}
            </span>
          </p>

          {/* Incubator Type Badge */}
          {incubatorType && (
            <div className="mt-2.5">
              <span className="inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-[#D9CAB3]/40 text-[#5E0B15] border border-[#8C7A6B]/30 shadow-2xs">
                {incubatorType}
              </span>
            </div>
          )}
        </div>

        {/* Information Section: City with MapPin & Official Email with Mail icon */}
        <div className="mt-4 space-y-1.5 text-xs text-slate-600">
          {/* City with MapPin icon */}
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 rounded-md bg-[#FAF7F2] border border-[#D9CAB3]/70 flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110">
              <MapPin className="w-3 h-3 text-[#90323D]" />
            </div>
            <span className="truncate">{city}</span>
          </div>

          {/* Official Email with Mail icon */}
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 rounded-md bg-[#FAF7F2] border border-[#D9CAB3]/70 flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110">
              <Mail className="w-3 h-3 text-[#BC8034]" />
            </div>
            {email ? (
              <a
                href={`mailto:${email}`}
                className="truncate hover:text-[#5E0B15] hover:underline transition-colors duration-200"
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

      {/* Bottom Section: Verification Status & View Details Button */}
      <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
        {/* Verification Status (BadgeCheck for verified, Clock for under verification) */}
        <div>
          {isVerified ? (
            <span className="inline-flex items-center space-x-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
              <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verified</span>
            </span>
          ) : isUnderVerification ? (
            <span className="inline-flex items-center space-x-1.5 text-xs font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
              <Clock className="w-3.5 h-3.5 text-amber-700" />
              <span>Under Verification</span>
            </span>
          ) : (
            <span className="inline-flex items-center text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
              Unverified
            </span>
          )}
        </div>

        {/* View Details Button & Official Website */}
        <div className="flex items-center space-x-2">
          {tbi?.hasValidWebsite && tbi?.websiteUrl ? (
            <a
              href={tbi.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg text-slate-muted hover:text-[#5E0B15] hover:bg-[#D9CAB3]/40 transition-colors duration-200"
              title="Visit official website"
            >
              <Globe className="w-3.5 h-3.5 text-[#90323D]" />
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
            className="group/btn inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-[#5E0B15] hover:bg-[#490911] text-white text-xs font-semibold shadow-xs hover:shadow-sm active:scale-[0.97] active:translate-y-[1px] transition-all duration-200 select-none"
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
