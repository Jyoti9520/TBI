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
    <aside className="w-64 bg-white border-r border-border flex flex-col h-[calc(100vh-4rem)] sticky top-16 select-none shrink-0">
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
                `relative flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ease-in-out group ${
                  isActive
                    ? 'bg-primary text-white shadow-subtle font-semibold'
                    : 'text-slate-secondary hover:text-dark hover:bg-slate-hover'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-150 ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'text-slate-muted group-hover:text-primary group-hover:bg-primary-light'
                    }`}
                  >
                    <Icon className="w-4 h-4 transition-transform duration-150 group-hover:scale-105" />
                  </div>
                  <span className="truncate">{item.name}</span>
                  {item.name === 'Saved TBIs' && savedCount > 0 && (
                    <span
                      className={`ml-auto text-[11px] px-2 py-0.5 rounded-full font-semibold transition-colors ${
                        isActive
                          ? 'bg-white/25 text-white'
                          : 'bg-background-secondary text-slate-secondary border border-border group-hover:bg-primary-light group-hover:text-primary'
                      }`}
                    >
                      {savedCount}
                    </span>
                  )}
                  {item.name === 'Compare TBIs' && compareCount > 0 && (
                    <span
                      className={`ml-auto text-[11px] px-2 py-0.5 rounded-full font-semibold transition-colors ${
                        isActive
                          ? 'bg-white/25 text-white'
                          : 'bg-background-secondary text-slate-secondary border border-border group-hover:bg-primary-light group-hover:text-primary'
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
          <div className="pt-4 mt-3 border-t border-border space-y-1">
            <span className="px-3.5 text-[11px] font-bold text-slate-muted uppercase tracking-wider">
              Administration
            </span>
            <NavLink
              to="/admin"
              end
              className={({ isActive }) =>
                `relative flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ease-in-out group ${
                  isActive
                    ? 'bg-primary text-white shadow-subtle font-semibold'
                    : 'text-slate-secondary hover:text-dark hover:bg-slate-hover'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-150 ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'text-slate-muted group-hover:text-primary group-hover:bg-primary-light'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 transition-transform duration-150 group-hover:scale-105" />
                  </div>
                  <span className="truncate">Admin Overview</span>
                </>
              )}
            </NavLink>
            <NavLink
              to="/admin/tbis"
              className={({ isActive }) =>
                `relative flex items-center space-x-2.5 px-3.5 py-2 rounded-lg text-xs font-semibold pl-10 transition-all duration-150 ease-in-out group ${
                  isActive
                    ? 'text-primary font-bold bg-primary-light'
                    : 'text-slate-muted hover:text-dark hover:bg-slate-hover'
                }`
              }
            >
              {() => (
                <>
                  <FolderTree className="w-3.5 h-3.5 shrink-0 transition-transform duration-150 group-hover:scale-105" />
                  <span className="truncate">Manage TBIs</span>
                </>
              )}
            </NavLink>
            <NavLink
              to="/admin/users"
              className={({ isActive }) =>
                `relative flex items-center space-x-2.5 px-3.5 py-2 rounded-lg text-xs font-semibold pl-10 transition-all duration-150 ease-in-out group ${
                  isActive
                    ? 'text-primary font-bold bg-primary-light'
                    : 'text-slate-muted hover:text-dark hover:bg-slate-hover'
                }`
              }
            >
              {() => (
                <>
                  <Users className="w-3.5 h-3.5 shrink-0 transition-transform duration-150 group-hover:scale-105" />
                  <span className="truncate">Manage Users</span>
                </>
              )}
            </NavLink>
            <NavLink
              to="/admin/import"
              className={({ isActive }) =>
                `relative flex items-center space-x-2.5 px-3.5 py-2 rounded-lg text-xs font-semibold pl-10 transition-all duration-150 ease-in-out group ${
                  isActive
                    ? 'text-primary font-bold bg-primary-light'
                    : 'text-slate-muted hover:text-dark hover:bg-slate-hover'
                }`
              }
            >
              {() => (
                <>
                  <FileSpreadsheet className="w-3.5 h-3.5 shrink-0 transition-transform duration-150 group-hover:scale-105" />
                  <span className="truncate">Import Dataset</span>
                </>
              )}
            </NavLink>
          </div>
        )}
      </nav>

      {/* Footer / Account options */}
      <div className="p-3 border-t border-border space-y-1">
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
            `relative flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ease-in-out group ${
              isActive
                ? 'bg-primary text-white shadow-subtle font-semibold'
                : 'text-slate-secondary hover:text-dark hover:bg-slate-hover'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-150 ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'text-slate-muted group-hover:text-primary group-hover:bg-primary-light'
                }`}
              >
                <Settings className="w-4 h-4 transition-transform duration-150 group-hover:scale-105" />
              </div>
              <span className="truncate">Settings</span>
            </>
          )}
        </NavLink>

        {isAuthenticated ? (
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-secondary hover:text-status-error hover:bg-red-50 transition-all duration-150 ease-in-out group cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-150 text-slate-muted group-hover:text-status-error">
              <LogOut className="w-4 h-4 transition-transform duration-150 group-hover:scale-105" />
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
            className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-primary hover:bg-primary-light transition-all duration-150 ease-in-out group cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-150 text-primary">
              <LogOut className="w-4 h-4 transition-transform duration-150 group-hover:scale-105" />
            </div>
            <span className="truncate font-semibold">Sign In</span>
          </button>
        )}
      </div>
    </aside>
  );
};
