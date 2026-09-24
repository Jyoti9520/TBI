import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Compass,
  MapPin,
  University,
  Layers,
  Bookmark,
  PlusCircle,
  ShieldCheck,
  Settings,
  LogOut,
  FolderTree,
  Users,
  FileSpreadsheet
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const Sidebar = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Explore TBIs', path: '/explore', icon: Compass },
    { name: 'Nearby', path: '/nearby', icon: MapPin },
    { name: 'Universities', path: '/universities', icon: University },
    { name: 'Categories', path: '/categories', icon: Layers },
    { name: 'Saved TBIs', path: '/saved', icon: Bookmark },
    { name: 'Suggest a TBI', path: '/suggest', icon: PlusCircle },
  ];

  return (
    <aside className="w-64 bg-surface border-r border-slate-border flex flex-col h-[calc(100vh-4rem)] sticky top-16 select-none shrink-0">
      {/* User Mini Profile */}
      <div className="p-4 border-b border-slate-border flex items-center space-x-3 bg-gradient-to-r from-[#FAF7F2] to-white">
        <div className="w-10 h-10 rounded-xl bg-[#5E0B15] text-[#D9CAB3] font-extrabold flex items-center justify-center shrink-0 shadow-xs border border-[#5E0B15] transition-transform duration-200 hover:scale-105">
          {user?.name ? user.name[0].toUpperCase() : 'U'}
        </div>
        <div className="overflow-hidden">
          <p className="text-sm font-bold text-[#5E0B15] truncate">{user?.name || 'User'}</p>
          <p className="text-xs text-slate-muted truncate">{user?.email}</p>
        </div>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `relative flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ease-in-out group ${
                  isActive
                    ? 'bg-[#5E0B15] text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-[#5E0B15] hover:bg-[#5E0B15]/[0.06]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Subtle Left Accent Indicator */}
                  {isActive && (
                    <span
                      className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1 h-5 rounded-full bg-[#BC8034] shadow-xs"
                      aria-hidden="true"
                    />
                  )}
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-200 ${
                      isActive
                        ? 'bg-white/15 text-white'
                        : 'text-slate-500 group-hover:text-[#5E0B15] group-hover:bg-[#5E0B15]/[0.08]'
                    }`}
                  >
                    <Icon className="w-4 h-4 transition-transform duration-200 group-hover:scale-105" />
                  </div>
                  <span className="truncate">{item.name}</span>
                </>
              )}
            </NavLink>
          );
        })}

        {/* Admin Navigation */}
        {isAdmin && (
          <div className="pt-4 mt-3 border-t border-slate-border space-y-1">
            <span className="px-3.5 text-[11px] font-bold text-slate-muted uppercase tracking-wider">
              Administration
            </span>
            <NavLink
              to="/admin"
              end
              className={({ isActive }) =>
                `relative flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ease-in-out group ${
                  isActive
                    ? 'bg-[#5E0B15] text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-[#5E0B15] hover:bg-[#5E0B15]/[0.06]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span
                      className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1 h-5 rounded-full bg-[#BC8034] shadow-xs"
                      aria-hidden="true"
                    />
                  )}
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-200 ${
                      isActive
                        ? 'bg-white/15 text-white'
                        : 'text-slate-500 group-hover:text-[#5E0B15] group-hover:bg-[#5E0B15]/[0.08]'
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
                    ? 'text-[#5E0B15] font-bold bg-[#5E0B15]/[0.08]'
                    : 'text-slate-500 hover:text-[#5E0B15] hover:bg-[#5E0B15]/[0.05]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 w-1 h-3.5 rounded-full bg-[#BC8034]"
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
                    ? 'text-[#5E0B15] font-bold bg-[#5E0B15]/[0.08]'
                    : 'text-slate-500 hover:text-[#5E0B15] hover:bg-[#5E0B15]/[0.05]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 w-1 h-3.5 rounded-full bg-[#BC8034]"
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
                    ? 'text-[#5E0B15] font-bold bg-[#5E0B15]/[0.08]'
                    : 'text-slate-500 hover:text-[#5E0B15] hover:bg-[#5E0B15]/[0.05]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 w-1 h-3.5 rounded-full bg-[#BC8034]"
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
          className={({ isActive }) =>
            `relative flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ease-in-out group ${
              isActive
                ? 'bg-[#5E0B15] text-white shadow-xs font-semibold'
                : 'text-slate-600 hover:text-[#5E0B15] hover:bg-[#5E0B15]/[0.06]'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <span
                  className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1 h-5 rounded-full bg-[#BC8034] shadow-xs"
                  aria-hidden="true"
                />
              )}
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-200 ${
                  isActive
                    ? 'bg-white/15 text-white'
                    : 'text-slate-500 group-hover:text-[#5E0B15] group-hover:bg-[#5E0B15]/[0.08]'
                }`}
              >
                <Settings className="w-4 h-4 transition-transform duration-200 group-hover:scale-105" />
              </div>
              <span className="truncate">Settings</span>
            </>
          )}
        </NavLink>
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:text-[#5E0B15] hover:bg-[#5E0B15]/[0.06] transition-all duration-200 ease-in-out group"
        >
          <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-200 text-slate-500 group-hover:text-[#5E0B15] group-hover:bg-[#5E0B15]/[0.08]">
            <LogOut className="w-4 h-4 transition-transform duration-200 group-hover:scale-105" />
          </div>
          <span className="truncate">Logout</span>
        </button>
      </div>
    </aside>
  );
};
