import React from 'react';
import { Outlet, Link } from 'react-router-dom';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-[#0a0a0c] text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center space-x-2.5">
          <img
            src="/tbi-nexus-logo.png"
            alt="TBI Global"
            className="w-10 h-10 rounded-xl object-cover shadow-xs border border-white/10"
          />
          <span className="font-bold font-heading text-2xl tracking-tight text-white">
            TBI GLOBAL
          </span>
        </Link>
        <p className="text-xs uppercase tracking-widest text-orange-400 font-semibold mt-1">
          Technology Business Incubators
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-[#131318] py-8 px-6 sm:px-10 shadow-2xl border border-white/10 rounded-2xl">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
