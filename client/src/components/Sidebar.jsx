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
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, accent: 'text-[#90323D]' },
    { name: 'Explore TBIs', path: '/explore', icon: Compass, accent: 'text-[#90323D]' },
    { name: 'Nearby', path: '/nearby', icon: MapPin, accent: 'text-[#BC8034]' },
    { name: 'Universities', path: '/universities', icon: University, accent: 'text-[#5E0B15]' },
    { name: 'Categories', path: '/categories', icon: Layers, accent: 'text-[#8C7A6B]' },
    { name: 'Saved TBIs', path: '/saved', icon: Bookmark, accent: 'text-[#90323D]' },
    { name: 'Suggest a TBI', path: '/suggest', icon: PlusCircle, accent: 'text-[#BC8034]' },
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
                `flex items-center space-x-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-[#5E0B15] text-[#D9CAB3] shadow-xs font-bold'
                    : 'text-slate-600 hover:text-[#5E0B15] hover:bg-[#D9CAB3]/30'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 ${
                      isActive
                        ? 'bg-white/15 text-[#D9CAB3]'
                        : `bg-[#FAF7F2] border border-[#D9CAB3]/60 ${item.accent}`
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span>{item.name}</span>
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
                `flex items-center space-x-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-[#D9CAB3] text-[#5E0B15] shadow-xs border border-[#8C7A6B]/30 font-bold'
                    : 'text-[#90323D] hover:bg-[#D9CAB3]/30'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 ${
                      isActive
                        ? 'bg-[#5E0B15] text-[#D9CAB3]'
                        : 'bg-[#FAF7F2] border border-[#D9CAB3]/60 text-[#90323D]'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span>Admin Overview</span>
                </>
              )}
            </NavLink>
            <NavLink
              to="/admin/tbis"
              className={({ isActive }) =>
                `flex items-center space-x-2.5 px-3 py-1.5 rounded-lg text-xs font-semibold pl-9 transition-all duration-200 group ${
                  isActive ? 'text-[#5E0B15] font-bold bg-[#D9CAB3]/50' : 'text-slate-muted hover:text-[#5E0B15]'
                }`
              }
            >
              <FolderTree className="w-3.5 h-3.5 text-[#90323D] shrink-0 transition-transform duration-200 group-hover:scale-105" />
              <span>Manage TBIs</span>
            </NavLink>
            <NavLink
              to="/admin/users"
              className={({ isActive }) =>
                `flex items-center space-x-2.5 px-3 py-1.5 rounded-lg text-xs font-semibold pl-9 transition-all duration-200 group ${
                  isActive ? 'text-[#5E0B15] font-bold bg-[#D9CAB3]/50' : 'text-slate-muted hover:text-[#5E0B15]'
                }`
              }
            >
              <Users className="w-3.5 h-3.5 text-[#8C7A6B] shrink-0 transition-transform duration-200 group-hover:scale-105" />
              <span>Manage Users</span>
            </NavLink>
            <NavLink
              to="/admin/import"
              className={({ isActive }) =>
                `flex items-center space-x-2.5 px-3 py-1.5 rounded-lg text-xs font-semibold pl-9 transition-all duration-200 group ${
                  isActive ? 'text-[#5E0B15] font-bold bg-[#D9CAB3]/50' : 'text-slate-muted hover:text-[#5E0B15]'
                }`
              }
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-[#BC8034] shrink-0 transition-transform duration-200 group-hover:scale-105" />
              <span>Import Dataset</span>
            </NavLink>
          </div>
        )}
      </nav>

      {/* Footer / Account options */}
      <div className="p-3 border-t border-slate-border space-y-1">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center space-x-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 group ${
              isActive
                ? 'bg-[#D9CAB3] text-[#5E0B15] font-bold'
                : 'text-slate-600 hover:text-[#5E0B15] hover:bg-[#D9CAB3]/30'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 ${
                  isActive
                    ? 'bg-[#5E0B15] text-[#D9CAB3]'
                    : 'bg-[#FAF7F2] border border-[#D9CAB3]/60 text-slate-500'
                }`}
              >
                <Settings className="w-4 h-4" />
              </div>
              <span>Settings</span>
            </>
          )}
        </NavLink>
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-sm font-medium text-status-error hover:bg-red-50 transition-colors duration-200 group"
        >
          <div className="w-7 h-7 rounded-lg bg-red-50 border border-red-200/50 flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 text-status-error">
            <LogOut className="w-4 h-4" />
          </div>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
