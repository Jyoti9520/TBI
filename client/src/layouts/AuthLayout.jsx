import React from 'react';
import { Outlet, Link } from 'react-router-dom';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-background">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center space-x-2.5">
          <img
            src="/tbi-nexus-logo.png"
            alt="TBI Nexus"
            className="w-11 h-11 rounded-xl object-cover shadow-sm border border-[#7A0B1A]"
          />
          <span className="font-extrabold text-2xl tracking-tight text-[#7A0B1A]">
            TBI NEXUS
          </span>
        </Link>
        <p className="text-xs uppercase tracking-widest text-[#5B0712] font-bold mt-1">
          Technology Business Incubators
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-surface py-8 px-6 sm:px-10 shadow-card border border-slate-border rounded-2xl">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
