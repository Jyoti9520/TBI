import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut, ShieldCheck } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 12);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header
      className={`sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b transition-all duration-200 ${
        scrolled ? 'border-border shadow-sm' : 'border-border/60'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <img
              src="/tbi-nexus-logo.png"
              alt="TBI Nexus"
              className="w-8 h-8 rounded-lg object-cover border border-border shadow-subtle transition-transform duration-200 group-hover:scale-105"
            />
            <div className="flex flex-col">
              <span className="font-extrabold text-dark tracking-tight text-base sm:text-lg leading-tight group-hover:text-primary transition-colors">
                TBI NEXUS
              </span>
              <span className="text-[10px] uppercase tracking-wider text-slate-muted font-semibold">
                National Incubator Directory
              </span>
            </div>
          </Link>

          {/* Right Action: Login / Signup or User Profile */}
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center space-x-2.5">
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center space-x-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-slate-hover text-primary border border-border hover:bg-primary hover:text-white transition-colors duration-150"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Admin</span>
                  </Link>
                )}

                <Link
                  to="/dashboard"
                  className="flex items-center space-x-2 text-sm text-dark font-medium px-3 py-1.5 rounded-lg hover:bg-slate-hover border border-border transition-colors duration-150"
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name || 'User'}
                      referrerPolicy="no-referrer"
                      className="w-5 h-5 rounded-full object-cover border border-primary"
                    />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-primary text-white text-[10px] flex items-center justify-center font-bold">
                      {user?.name ? user.name[0].toUpperCase() : 'U'}
                    </div>
                  )}
                  <span className="max-w-[110px] truncate">{user?.name || 'Dashboard'}</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 p-2 text-slate-muted hover:text-status-error hover:bg-red-50 rounded-lg transition-colors text-xs font-medium cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2.5">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-slate-secondary hover:text-dark px-3.5 py-2 rounded-lg hover:bg-slate-hover transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="text-sm font-semibold text-white bg-primary hover:bg-primary-hover px-4 py-2 rounded-lg shadow-subtle hover:shadow-card active:scale-[0.98] transition-all duration-150"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
