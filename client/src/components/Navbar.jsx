import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Compass,
  Building2,
  Layers,
  MapPin,
  Bookmark,
  Shield,
  User,
  LogOut,
  Menu,
  X,
  PlusCircle
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Explore', path: '/explore', icon: Compass },
    { name: 'Universities', path: '/universities', icon: Building2 },
    { name: 'Categories', path: '/categories', icon: Layers },
    { name: 'Nearby', path: '/nearby', icon: MapPin },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur border-b border-slate-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center space-x-8">
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

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      active
                        ? 'bg-[#E1DCC9] text-[#1F150C] font-bold border border-[#412D15]/30'
                        : 'text-slate-muted hover:text-[#1F150C] hover:bg-[#E1DCC9]/40'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-[#1F150C]' : 'text-slate-muted'}`} />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Link
                  to="/suggest"
                  className="flex items-center space-x-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-[#E1DCC9] text-[#1F150C] hover:bg-[#CFC6A9] transition-colors shadow-sm border border-[#412D15]/30"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Suggest TBI</span>
                </Link>

                <Link
                  to="/saved"
                  className={`p-2 rounded-lg transition-colors ${
                    isActive('/saved')
                      ? 'text-[#1F150C] bg-[#E1DCC9]'
                      : 'text-slate-muted hover:text-[#1F150C] hover:bg-slate-50'
                  }`}
                  title="Saved TBIs"
                >
                  <Bookmark className="w-4 h-4" />
                </Link>

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
                  className="flex items-center space-x-2 text-sm text-[#1F150C] font-medium px-3 py-1.5 rounded-lg hover:bg-[#E1DCC9]/40 border border-slate-border"
                >
                  <div className="w-6 h-6 rounded-full bg-[#1F150C] text-[#E1DCC9] text-xs flex items-center justify-center font-bold">
                    {user?.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                  <span className="max-w-[120px] truncate">{user?.name}</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-muted hover:text-status-error hover:bg-red-50 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-[#1F150C] hover:text-[#412D15] px-3.5 py-2 rounded-lg transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="text-sm font-bold text-[#E1DCC9] bg-[#1F150C] hover:bg-[#412D15] px-4 py-2 rounded-lg shadow-sm transition-colors border border-[#000000]"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-muted hover:text-[#1B3650] hover:bg-slate-100 transition-colors"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-border bg-surface px-4 pt-2 pb-4 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium ${
                  active ? 'bg-[#E1DCC9] text-[#1F150C] font-bold' : 'text-slate hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4 text-[#412D15]" />
                <span>{link.name}</span>
              </Link>
            );
          })}

          <div className="pt-2 border-t border-slate-border">
            {isAuthenticated ? (
              <div className="space-y-1">
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-[#1F150C]"
                >
                  <User className="w-4 h-4 text-[#412D15]" />
                  <span>Dashboard ({user?.name})</span>
                </Link>
                <Link
                  to="/saved"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-slate"
                >
                  <Bookmark className="w-4 h-4 text-[#412D15]" />
                  <span>Saved TBIs</span>
                </Link>
                <Link
                  to="/suggest"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-2 px-3 py-2 text-sm font-bold text-[#1F150C] bg-[#E1DCC9] rounded-lg"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Suggest a TBI</span>
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-2 px-3 py-2 text-sm font-bold text-[#1F150C] bg-[#E1DCC9] rounded-lg"
                  >
                    <Shield className="w-4 h-4 text-[#412D15]" />
                    <span>Admin Panel</span>
                  </Link>
                )}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-sm font-medium text-status-error hover:bg-red-50 rounded-lg"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-sm font-semibold border border-slate-border rounded-lg text-[#1F150C]"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-sm font-bold bg-[#1F150C] text-[#E1DCC9] rounded-lg"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
