import React from 'react';
import { Calendar, Building2, ExternalLink } from 'lucide-react';

export const GrantCard = ({ grant }) => {
  return (
    <div className="group relative flex flex-col justify-between rounded-2xl bg-[#131318] border border-white/10 hover:border-emerald-500/40 p-6 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/5 backdrop-blur-xl">
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className={'py-0.5 px-2.5 rounded-full text-[11px] font-semibold ' + (
              grant.isGrant
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
            )}>
              {grant.isGrant ? '100% Non-Dilutive Grant' : 'Seed Component Scheme'}
            </span>
          </div>
          <span className="text-xs text-gray-500 font-medium capitalize">
            {grant.geographicScope || 'National'}
          </span>
        </div>

        <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors mb-1">
          {grant.title}
        </h3>

        <div className="flex items-center gap-1.5 text-xs text-emerald-400/90 font-medium mb-3">
          <Building2 className="w-3.5 h-3.5" />
          <span>{grant.agencyOrSponsor || 'Government of India'}</span>
        </div>

        <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed mb-5">
          {grant.shortDescription || grant.description}
        </p>

        <div className="space-y-2 p-3.5 rounded-xl bg-black/40 border border-white/5 mb-5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400">Funding Amount</span>
            <span className="font-bold text-white">
              {grant.grantAmountDisplay || (grant.maxAmount ? (grant.currency + ' ' + grant.maxAmount) : 'Variable grant')}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-gray-500" />
              Deadline
            </span>
            <span className="font-medium text-gray-300">
              {grant.isRollingDeadline ? 'Rolling / Open Throughout Year' : (grant.deadline ? new Date(grant.deadline).toLocaleDateString() : 'Rolling / Open')}
            </span>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-white/5">
        {grant.applicationUrl ? (
          <a
            href={grant.applicationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            Apply on Official Portal
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        ) : (
          <div className="text-center py-2 text-xs text-gray-500">
            Apply via accredited Partner TBIs
          </div>
        )}
      </div>
    </div>
  );
};

export default GrantCard;