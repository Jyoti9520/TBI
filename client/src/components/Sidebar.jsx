import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Compass,
  University,
  Layers,
  Bookmark,
  PlusCircle,
  ShieldCheck,
  Settings,
  LogOut,
  FolderTree,
  Users,
  FileSpreadsheet,
  GitCompare
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { userService } from '../services/userService';
import { getCompareTbis } from '../utils/compareStorage';

export const Sidebar = () => {
  const { user, isAuthenticated, isAdmin, logout, openAuthModal } = useAuth();
  const navigate = useNavigate();
  const [savedCount, setSavedCount] = useState(0);
  const [compareCount, setCompareCount] = useState(() => getCompareTbis().length);

  useEffect(() => {
    const handleCompareUpdate = (e) => {
      setCompareCount(e.detail ? e.detail.length : getCompareTbis().length);
    };
    window.addEventListener('compare-tbis-updated', handleCompareUpdate);
    return () => window.removeEventListener('compare-tbis-updated', handleCompareUpdate);
  }, []);

  useEffect(() => {
    if (!user) {
      setSavedCount(0);
      return;
    }

    const fetchSaved = () => {
      userService
        .getFavorites()
        .then((res) => {
          if (res.success) setSavedCount(res.total || 0);
        })
        .catch(() => {});
    };

    fetchSaved();

    window.addEventListener('favorites-updated', fetchSaved);
    return () => window.removeEventListener('favorites-updated', fetchSaved);
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Explore TBIs', path: '/explore', icon: Compass },
    { name: 'Universities', path: '/universities', icon: University },
    { name: 'Categories', path: '/categories', icon: Layers },
    { name: 'Compare TBIs', path: '/compare', icon: GitCompare },
    { name: 'Saved TBIs', path: '/saved', icon: Bookmark, requiresAuth: true, context: 'saved', contextMessage: 'Login to access and manage your bookmarked incubators.' },
    { name: 'Suggest a TBI', path: '/suggest', icon: PlusCircle },
  ];

  return (
    <aside className="w-64 bg-surface border-r border-slate-border flex flex-col h-[calc(100vh-4rem)] sticky top-16 select-none shrink-0">
      {/* Main Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={(e) => {
                if (item.requiresAuth && !isAuthenticated) {
                  e.preventDefault();
                  openAuthModal({
                    title: `Login to view ${item.name}`,
                    subtitle: 'Create an account or login to access this user feature.',
                    contextMessage: item.contextMessage,
                    context: item.context || 'general',
                    returnPath: item.path
                  });
                }
              }}
              className={({ isActive }) =>
                `relative flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ease-in-out group ${
                  isActive
                    ? 'bg-[#7A0B1A] text-white shadow-xs font-semibold'
                    : 'text-[#243447] hover:text-[#7A0B1A] hover:bg-[#7A0B1A]/[0.06]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Subtle Left Accent Indicator */}
                  {isActive && (
                    <span
                      className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1 h-5 rounded-full bg-[#D99A2B] shadow-xs"
                      aria-hidden="true"
                    />
                  )}
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-200 ${
                      isActive
                        ? 'bg-white/15 text-white'
                        : 'text-[#647C98] group-hover:text-[#7A0B1A] group-hover:bg-[#7A0B1A]/[0.08]'
                    }`}
                  >
                    <Icon className="w-4 h-4 transition-transform duration-200 group-hover:scale-105" />
                  </div>
                  <span className="truncate">{item.name}</span>
                  {item.name === 'Saved TBIs' && savedCount > 0 && (
                    <span
                      className={`ml-auto text-[11px] px-2 py-0.5 rounded-full font-bold transition-colors ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-[#FAF7F2] text-[#7A0B1A] border border-[#D9CAB3] group-hover:bg-[#7A0B1A]/10'
                      }`}
                    >
                      {savedCount}
                    </span>
                  )}
                  {item.name === 'Compare TBIs' && compareCount > 0 && (
                    <span
                      className={`ml-auto text-[11px] px-2 py-0.5 rounded-full font-bold transition-colors ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-[#FAF7F2] text-[#7A0B1A] border border-[#D9CAB3] group-hover:bg-[#7A0B1A]/10'
                      }`}
                    >
                      {compareCount}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}

        {/* Admin Navigation */}
        {isAdmin && (
          <div className="pt-4 mt-3 border-t border-slate-border space-y-1">
            <span className="px-3.5 text-[11px] font-bold text-[#647C98] uppercase tracking-wider">
              Administration
            </span>
            <NavLink
              to="/admin"
              end
              className={({ isActive }) =>
                `relative flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ease-in-out group ${
                  isActive
                    ? 'bg-[#7A0B1A] text-white shadow-xs font-semibold'
                    : 'text-[#243447] hover:text-[#7A0B1A] hover:bg-[#7A0B1A]/[0.06]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span
                      className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1 h-5 rounded-full bg-[#D99A2B] shadow-xs"
                      aria-hidden="true"
                    />
                  )}
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-200 ${
                      isActive
                        ? 'bg-white/15 text-white'
                        : 'text-[#647C98] group-hover:text-[#7A0B1A] group-hover:bg-[#7A0B1A]/[0.08]'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 transition-transform duration-200 group-hover:scale-105" />
                  </div>
                  <span className="truncate">Admin Overview</span>
                </>
              )}
            </NavLink>
            <NavLink
              to="/admin/tbis"
              className={({ isActive }) =>
                `relative flex items-center space-x-2.5 px-3.5 py-2 rounded-lg text-xs font-semibold pl-10 transition-all duration-200 ease-in-out group ${
                  isActive
                    ? 'text-[#7A0B1A] font-bold bg-[#7A0B1A]/[0.08]'
                    : 'text-[#647C98] hover:text-[#7A0B1A] hover:bg-[#7A0B1A]/[0.05]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 w-1 h-3.5 rounded-full bg-[#D99A2B]"
                      aria-hidden="true"
                    />
                  )}
                  <FolderTree className="w-3.5 h-3.5 shrink-0 transition-transform duration-200 group-hover:scale-105" />
                  <span className="truncate">Manage TBIs</span>
                </>
              )}
            </NavLink>
            <NavLink
              to="/admin/users"
              className={({ isActive }) =>
                `relative flex items-center space-x-2.5 px-3.5 py-2 rounded-lg text-xs font-semibold pl-10 transition-all duration-200 ease-in-out group ${
                  isActive
                    ? 'text-[#7A0B1A] font-bold bg-[#7A0B1A]/[0.08]'
                    : 'text-[#647C98] hover:text-[#7A0B1A] hover:bg-[#7A0B1A]/[0.05]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 w-1 h-3.5 rounded-full bg-[#D99A2B]"
                      aria-hidden="true"
                    />
                  )}
                  <Users className="w-3.5 h-3.5 shrink-0 transition-transform duration-200 group-hover:scale-105" />
                  <span className="truncate">Manage Users</span>
                </>
              )}
            </NavLink>
            <NavLink
              to="/admin/import"
              className={({ isActive }) =>
                `relative flex items-center space-x-2.5 px-3.5 py-2 rounded-lg text-xs font-semibold pl-10 transition-all duration-200 ease-in-out group ${
                  isActive
                    ? 'text-[#7A0B1A] font-bold bg-[#7A0B1A]/[0.08]'
                    : 'text-[#647C98] hover:text-[#7A0B1A] hover:bg-[#7A0B1A]/[0.05]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 w-1 h-3.5 rounded-full bg-[#D99A2B]"
                      aria-hidden="true"
                    />
                  )}
                  <FileSpreadsheet className="w-3.5 h-3.5 shrink-0 transition-transform duration-200 group-hover:scale-105" />
                  <span className="truncate">Import Dataset</span>
                </>
              )}
            </NavLink>
          </div>
        )}
      </nav>

      {/* Footer / Account options */}
      <div className="p-3 border-t border-slate-border space-y-1">
        <NavLink
          to="/settings"
          onClick={(e) => {
            if (!isAuthenticated) {
              e.preventDefault();
              openAuthModal({
                title: 'Login to access Settings',
                subtitle: 'Manage your profile and account preferences.',
                contextMessage: 'Login to customize your account and notifications.',
                context: 'settings',
                returnPath: '/settings'
              });
            }
          }}
          className={({ isActive }) =>
            `relative flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ease-in-out group ${
              isActive
                ? 'bg-[#7A0B1A] text-white shadow-xs font-semibold'
                : 'text-[#243447] hover:text-[#7A0B1A] hover:bg-[#7A0B1A]/[0.06]'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <span
                  className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1 h-5 rounded-full bg-[#D99A2B] shadow-xs"
                  aria-hidden="true"
                />
              )}
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-200 ${
                  isActive
                    ? 'bg-white/15 text-white'
                    : 'text-[#647C98] group-hover:text-[#7A0B1A] group-hover:bg-[#7A0B1A]/[0.08]'
                }`}
              >
                <Settings className="w-4 h-4 transition-transform duration-200 group-hover:scale-105" />
              </div>
              <span className="truncate">Settings</span>
            </>
          )}
        </NavLink>

        {isAuthenticated ? (
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-[#243447] hover:text-[#7A0B1A] hover:bg-[#7A0B1A]/[0.06] transition-all duration-200 ease-in-out group cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-200 text-[#647C98] group-hover:text-[#7A0B1A] group-hover:bg-[#7A0B1A]/[0.08]">
              <LogOut className="w-4 h-4 transition-transform duration-200 group-hover:scale-105" />
            </div>
            <span className="truncate">Logout</span>
          </button>
        ) : (
          <button
            onClick={() =>
              openAuthModal({
                title: 'Login to continue',
                subtitle: 'Sign in to access your profile and saved incubators.',
                context: 'general',
                returnPath: '/dashboard'
              })
            }
            className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-[#7A0B1A] hover:bg-[#7A0B1A]/[0.06] transition-all duration-200 ease-in-out group cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-200 text-[#7A0B1A] group-hover:bg-[#7A0B1A]/[0.08]">
              <LogOut className="w-4 h-4 transition-transform duration-200 group-hover:scale-105" />
            </div>
            <span className="truncate font-bold">Sign In</span>
          </button>
        )}
      </div>
    </aside>
  );
};
