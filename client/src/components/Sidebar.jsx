import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Search,
  MapPin,
  Building2,
  Layers,
  Bookmark,
  PlusCircle,
  Shield,
  Settings,
  LogOut
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
    { name: 'Explore TBIs', path: '/explore', icon: Search },
    { name: 'Nearby', path: '/nearby', icon: MapPin },
    { name: 'Universities', path: '/universities', icon: Building2 },
    { name: 'Categories', path: '/categories', icon: Layers },
    { name: 'Saved TBIs', path: '/saved', icon: Bookmark },
    { name: 'Suggest a TBI', path: '/suggest', icon: PlusCircle },
  ];

  return (
    <aside className="w-64 bg-surface border-r border-slate-border flex flex-col h-[calc(100vh-4rem)] sticky top-16 select-none shrink-0">
      {/* User Mini Profile */}
      <div className="p-4 border-b border-slate-border flex items-center space-x-3 bg-gradient-to-r from-[#FAF7F2] to-white">
        <div className="w-10 h-10 rounded-xl bg-[#5E0B15] text-[#D9CAB3] font-extrabold flex items-center justify-center shrink-0 shadow-sm border border-[#5E0B15]">
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
                `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#5E0B15] text-[#D9CAB3] shadow-sm font-bold'
                    : 'text-slate-muted hover:text-[#5E0B15] hover:bg-[#D9CAB3]/40'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.name}</span>
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
                `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-[#D9CAB3] text-[#5E0B15] shadow-sm border border-[#8C7A6B]'
                    : 'text-[#90323D] hover:bg-[#D9CAB3]/40'
                }`
              }
            >
              <Shield className="w-4 h-4 shrink-0 text-[#90323D]" />
              <span>Admin Overview</span>
            </NavLink>
            <NavLink
              to="/admin/tbis"
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3.5 py-2 rounded-lg text-xs font-semibold pl-9 transition-all ${
                  isActive ? 'text-[#5E0B15] font-bold bg-[#D9CAB3]' : 'text-slate-muted hover:text-slate'
                }`
              }
            >
              <span>Manage TBIs</span>
            </NavLink>
            <NavLink
              to="/admin/users"
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3.5 py-2 rounded-lg text-xs font-semibold pl-9 transition-all ${
                  isActive ? 'text-[#5E0B15] font-bold bg-[#D9CAB3]' : 'text-slate-muted hover:text-slate'
                }`
              }
            >
              <span>Manage Users</span>
            </NavLink>
            <NavLink
              to="/admin/import"
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3.5 py-2 rounded-lg text-xs font-semibold pl-9 transition-all ${
                  isActive ? 'text-[#5E0B15] font-bold bg-[#D9CAB3]' : 'text-slate-muted hover:text-slate'
                }`
              }
            >
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
            `flex items-center space-x-3 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
              isActive
                ? 'bg-[#D9CAB3] text-[#5E0B15] font-bold'
                : 'text-slate-muted hover:text-[#5E0B15] hover:bg-[#D9CAB3]/40'
            }`
          }
        >
          <Settings className="w-4 h-4 shrink-0" />
          <span>Settings</span>
        </NavLink>
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-3.5 py-2 rounded-xl text-sm font-medium text-status-error hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
