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
          <Link to="/" className="flex items-center space-x-2.5 group">
            <img
              src="/tbi-nexus-logo.png"
              alt="TBI Nexus"
              className="w-9 h-9 rounded-xl object-cover shadow-xs transition-transform duration-200 group-hover:scale-105 border border-[#5B0712]"
            />
            <div className="flex flex-col">
              <span className="font-extrabold text-[#7A0B1A] tracking-tight text-lg leading-tight">
                TBI NEXUS
              </span>
              <span className="text-[10px] uppercase tracking-wider text-[#647C98] font-bold">
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
                    className="flex items-center space-x-1.5 text-xs font-bold px-2.5 py-1.5 rounded-lg bg-[#FAF7F2] text-[#7A0B1A] border border-[#D9CAB3] hover:bg-[#7A0B1A] hover:text-white transition-colors duration-200 group"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-[#D99A2B] group-hover:text-white transition-transform duration-200 group-hover:scale-105" />
                    <span>Admin</span>
                  </Link>
                )}

                <Link
                  to="/dashboard"
                  className="flex items-center space-x-2 text-sm text-[#243447] font-semibold px-3 py-1.5 rounded-lg hover:bg-[#FAF7F2] border border-slate-border transition-colors duration-200"
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name || 'User'}
                      referrerPolicy="no-referrer"
                      className="w-6 h-6 rounded-full object-cover border border-[#7A0B1A]"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-[#7A0B1A] text-white text-xs flex items-center justify-center font-bold">
                      {user?.name ? user.name[0].toUpperCase() : 'U'}
                    </div>
                  )}
                  <span className="max-w-[120px] truncate">{user?.name}</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1.5 p-2 text-[#647C98] hover:text-status-error hover:bg-red-50 active:scale-[0.97] rounded-lg transition-all duration-200 text-xs font-semibold cursor-pointer"
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
                  className="text-sm font-bold text-[#7A0B1A] hover:text-[#5B0712] px-4 py-2 rounded-xl transition-all duration-200 hover:bg-[#FAF7F2] active:scale-[0.97]"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="text-sm font-bold text-white bg-[#7A0B1A] hover:bg-[#5B0712] px-5 py-2 rounded-xl shadow-xs hover:shadow-sm active:scale-[0.97] active:translate-y-[1px] transition-all duration-200 border border-[#7A0B1A]"
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

