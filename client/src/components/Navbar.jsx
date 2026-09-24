import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur border-b border-slate-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-9 h-9 rounded-xl bg-[#1F150C] flex items-center justify-center text-[#E1DCC9] font-extrabold text-lg shadow-sm transition-transform group-hover:scale-105 border border-[#412D15]">
              T
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-[#1F150C] tracking-tight text-lg leading-tight">
                TBI GLOBAL
              </span>
              <span className="text-[10px] uppercase tracking-wider text-[#412D15] font-bold">
                Incubator Directory
              </span>
            </div>
          </Link>

          {/* Right Action: Only Login and Sign Up (or User/Logout if logged in) */}
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center space-x-1 text-xs font-bold px-2.5 py-1.5 rounded-lg bg-[#E1DCC9] text-[#1F150C] border border-[#412D15]/30 hover:bg-[#CFC6A9] transition-colors"
                  >
                    <Shield className="w-3.5 h-3.5 text-[#412D15]" />
                    <span>Admin</span>
                  </Link>
                )}

                <Link
                  to="/dashboard"
                  className="flex items-center space-x-2 text-sm text-[#1F150C] font-medium px-3 py-1.5 rounded-lg hover:bg-[#E1DCC9]/40 border border-slate-border transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-[#1F150C] text-[#E1DCC9] text-xs flex items-center justify-center font-bold">
                    {user?.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                  <span className="max-w-[120px] truncate">{user?.name}</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1.5 p-2 text-slate-muted hover:text-status-error hover:bg-red-50 rounded-lg transition-colors text-xs font-semibold"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2.5">
                <Link
                  to="/login"
                  className="text-sm font-bold text-[#1F150C] hover:text-[#412D15] px-4 py-2 rounded-xl transition-colors hover:bg-[#E1DCC9]/30"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="text-sm font-bold text-[#E1DCC9] bg-[#1F150C] hover:bg-[#412D15] px-5 py-2 rounded-xl shadow-sm transition-colors border border-[#000000]"
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

