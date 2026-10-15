import React from 'react';
import { Outlet, Link } from 'react-router-dom';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-[#0a0a0c] text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center space-x-3.5 group">
          <img
            src="/tbi-campus-icon.png"
            alt="TBI Campus"
            className="h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_0_15px_rgba(249,115,22,0.4)]"
          />
          <div className="flex flex-col text-left">
            <span className="font-extrabold font-heading text-2xl tracking-tight text-white leading-none">
              TBI <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-400">CAMPUS</span>
            </span>
            <span className="text-[10px] uppercase tracking-[0.18em] text-orange-400/90 font-semibold mt-1 leading-none">
              National Incubator Directory
            </span>
          </div>
        </Link>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-[#131318] py-8 px-6 sm:px-10 shadow-2xl border border-white/10 rounded-2xl">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
