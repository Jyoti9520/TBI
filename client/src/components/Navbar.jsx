import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut, ShieldCheck } from 'lucide-react';
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
            <div className="w-9 h-9 rounded-xl bg-[#5E0B15] flex items-center justify-center text-[#D9CAB3] font-extrabold text-lg shadow-sm transition-transform group-hover:scale-105 border border-[#90323D]">
              T
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-[#5E0B15] tracking-tight text-lg leading-tight">
                TBI GLOBAL
              </span>
              <span className="text-[10px] uppercase tracking-wider text-[#90323D] font-bold">
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
                    className="flex items-center space-x-1.5 text-xs font-bold px-2.5 py-1.5 rounded-lg bg-[#D9CAB3] text-[#5E0B15] border border-[#90323D]/30 hover:bg-[#8C7A6B] hover:text-white transition-colors duration-200 group"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-[#90323D] group-hover:text-white transition-transform duration-200 group-hover:scale-105" />
                    <span>Admin</span>
                  </Link>
                )}

                <Link
                  to="/dashboard"
                  className="flex items-center space-x-2 text-sm text-[#5E0B15] font-medium px-3 py-1.5 rounded-lg hover:bg-[#D9CAB3]/40 border border-slate-border transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-[#5E0B15] text-[#D9CAB3] text-xs flex items-center justify-center font-bold">
                    {user?.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                  <span className="max-w-[120px] truncate">{user?.name}</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1.5 p-2 text-slate-muted hover:text-status-error hover:bg-red-50 active:scale-[0.97] rounded-lg transition-all duration-200 text-xs font-semibold cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4 transition-transform duration-200 hover:scale-105" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2.5">
                <Link
                  to="/login"
                  className="text-sm font-bold text-[#5E0B15] hover:text-[#90323D] px-4 py-2 rounded-xl transition-all duration-200 hover:bg-[#D9CAB3]/30 active:scale-[0.97]"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="text-sm font-bold text-[#D9CAB3] bg-[#5E0B15] hover:bg-[#90323D] px-5 py-2 rounded-xl shadow-xs hover:shadow-sm active:scale-[0.97] active:translate-y-[1px] transition-all duration-200 border border-[#5E0B15]"
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

