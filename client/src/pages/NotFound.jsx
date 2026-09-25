import React from 'react';
import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-16 h-16 rounded-2xl bg-[#D9CAB3] text-[#7A0B1A] flex items-center justify-center font-extrabold text-2xl mb-4 border border-[#8C7A6B]">
        404
      </div>
      <h1 className="text-2xl font-bold text-[#7A0B1A]">Page Not Found</h1>
      <p className="text-sm text-slate-muted mt-2 max-w-sm">
        The page you are looking for doesn't exist, has been removed, or is temporarily unavailable.
      </p>
      <div className="mt-6">
        <Link
          to="/"
          className="inline-flex items-center space-x-2 px-5 py-2.5 bg-[#7A0B1A] text-[#D9CAB3] text-xs font-semibold rounded-xl shadow-sm hover:bg-[#5B0712] transition-colors border border-[#7A0B1A]"
        >
          <Compass className="w-4 h-4" />
          <span>Back to Homepage</span>
        </Link>
      </div>
    </div>
  );
};
