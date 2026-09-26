import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { ToastContainer } from '../components/Toast';
import { AuthRequiredModal } from '../components/AuthRequiredModal';

export const DashboardLayout = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <div className="hidden md:block">
          <Sidebar />
        </div>
        <main
          key={location.pathname}
          className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto animate-page-enter"
        >
          <Outlet />
        </main>
      </div>
      <ToastContainer />
      <AuthRequiredModal />
    </div>
  );
};
