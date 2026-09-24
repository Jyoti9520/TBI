import React from 'react';
import { Outlet, Link } from 'react-router-dom';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-background">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center space-x-2">
          <div className="w-10 h-10 rounded-xl bg-[#5E0B15] flex items-center justify-center text-[#D9CAB3] font-extrabold text-xl shadow-sm border border-[#5E0B15]">
            T
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-[#5E0B15]">
            TBI GLOBAL
          </span>
        </Link>
        <p className="text-xs uppercase tracking-widest text-[#90323D] font-bold mt-1">
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
