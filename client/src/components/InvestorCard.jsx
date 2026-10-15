import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Bookmark, CheckCircle2, MapPin, DollarSign, ExternalLink } from 'lucide-react';
import { investorService } from '../services/investorService';
import { useAuth } from '../context/AuthContext';

export const InvestorCard = ({ investor, onBookmarkToggle }) => {
  const { user } = useAuth();
  const [isSaved, setIsSaved] = React.useState(investor.isSaved || false);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    setIsSaved(investor.isSaved || false);
  }, [investor.isSaved]);

  const handleToggleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      alert('Please log in to save investors.');
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
      if (onBookmarkToggle) onBookmarkToggle(!isSaved);
    } catch (err) {
      console.error('Error toggling save investor:', err);
    } finally {
      setSaving(false);
    }
  };

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

  const logoSrc = investor.logo || investor.logoUrl;

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl bg-[#131318] border border-white/10 hover:border-orange-500/40 p-6 transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/5 backdrop-blur-xl">
      <div>
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center p-2 overflow-hidden flex-shrink-0 group-hover:border-orange-500/30 transition-colors">
              {logoSrc ? (
                <img src={logoSrc} alt={investor.name} className="w-full h-full object-contain" />
              ) : (
                <Building2 className="w-6 h-6 text-orange-400" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-white text-base group-hover:text-orange-400 transition-colors line-clamp-1">
                  {investor.name}
                </h3>
                {investor.verificationStatus === 'Verified' && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" title="Verified Investor" />
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                <span className="capitalize font-medium text-gray-300">{investor.type}</span>
                {investor.country && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-gray-500" />
                      {investor.country}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={handleToggleSave}
            disabled={saving}
            className={'p-2 rounded-xl border transition-all ' + (
              isSaved
                ? 'bg-orange-500/10 border-orange-500/30 text-orange-400 hover:bg-orange-500/20'
                : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
            )}
            title={isSaved ? 'Remove from saved' : 'Save investor'}
          >
            <Bookmark className={'w-4 h-4 ' + (isSaved ? 'fill-orange-400' : '')} />
          </button>
        </div>

        <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 mb-4">
          {investor.tagline || investor.description || 'Institutional investment firm actively backing high-growth ventures.'}
        </p>

        <div className="space-y-2.5 mb-5">
          <div className="flex items-center justify-between text-xs py-1.5 px-3 rounded-lg bg-black/40 border border-white/5">
            <span className="text-gray-400 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-orange-400" />
              Ticket Size
            </span>
            <span className="font-medium text-gray-200">{ticketDisplay()}</span>
          </div>

          {investor.stages && investor.stages.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              {investor.stages.slice(0, 3).map((st) => (
                <span key={st} className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-white/5 text-gray-300 border border-white/5">
                  {st}
                </span>
              ))}
              {investor.stages.length > 3 && (
                <span className="text-[10px] text-gray-500">+{investor.stages.length - 3}</span>
              )}
            </div>
          )}

          {investor.sectors && investor.sectors.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {investor.sectors.slice(0, 3).map((sec) => (
                <span key={sec} className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-orange-500/10 text-orange-300 border border-orange-500/20">
                  {sec}
                </span>
              ))}
              {investor.sectors.length > 3 && (
                <span className="text-[10px] text-gray-500">+{investor.sectors.length - 3}</span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 pt-4 border-t border-white/5">
        <Link
          to={'/funding/investor/' + investor.id}
          className="flex-1 py-2 px-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-medium text-xs text-center transition-colors shadow-sm"
        >
          View Profile & Thesis
        </Link>
        {investor.website && (
          <a
            href={investor.website}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white transition-colors"
            title="Visit official website"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>
    </div>
  );
};

export default InvestorCard;
