import React, { useState, useEffect } from 'react';
import { Users, Search, Shield, UserX, UserCheck } from 'lucide-react';
import { adminService } from '../services/adminService';
import { useAuth } from '../hooks/useAuth';
import { Pagination } from '../components/Pagination';

export const AdminUsers = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const fetchUsers = async (currentPage = 1, searchQuery = '') => {
    setLoading(true);
    try {
      const res = await adminService.getUsers({
        page: currentPage,
        limit: 15,
        search: searchQuery.trim()
      });
      if (res.success) {
        setUsers(res.data || []);
        setPage(res.page);
        setTotalPages(res.totalPages);
        setTotalCount(res.total);
      }
    } catch (err) {
      console.error('Fetch users error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(page, search);
  }, [page]);

  const handleRoleChange = async (targetUser, newRole) => {
    if (targetUser.id === currentUser?.id && newRole !== 'ADMIN') {
      alert('Security policy: You cannot remove your own admin access.');
      return;
    }

    try {
      const res = await adminService.updateUserRole(targetUser.id, newRole);
      if (res.success) {
        setToastMessage(`Updated ${targetUser.name}'s role to ${newRole}`);
        fetchUsers(page, search);
        setTimeout(() => setToastMessage(''), 3000);
      }
    } catch (err) {
      console.error('Role update error:', err);
    }
  };

  const handleToggleStatus = async (targetUser) => {
    if (targetUser.id === currentUser?.id) {
      alert('Security policy: You cannot deactivate your own account.');
      return;
    }

    const nextState = !targetUser.isActive;
    try {
      const res = await adminService.toggleUserStatus(targetUser.id, nextState);
      if (res.success) {
        setToastMessage(`User account ${nextState ? 'activated' : 'deactivated'}`);
        fetchUsers(page, search);
        setTimeout(() => setToastMessage(''), 3000);
      }
    } catch (err) {
      console.error('Status update error:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F150C] flex items-center space-x-2">
          <Users className="w-7 h-7 text-[#412D15]" />
          <span>User Management</span>
        </h1>
        <p className="text-sm text-slate-muted mt-1">
          Review accounts, grant administrative access, and manage access states ({totalCount} total).
        </p>
      </div>

      {toastMessage && (
        <div className="p-3 bg-green-50 border border-green-200 text-status-success rounded-xl text-xs font-semibold animate-in fade-in">
          {toastMessage}
        </div>
      )}

      {/* Users Table */}
      <div className="bg-surface border border-slate-border rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-border text-slate-muted uppercase tracking-wider font-bold">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Registered Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-slate-muted">
                    Loading users...
                  </td>
                </tr>
              ) : (
                users.map((u) => {
                  const isSelf = u.id === currentUser?.id;
                  return (
                    <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate">
                        <div className="flex items-center space-x-2">
                          <div className="w-7 h-7 rounded-full bg-[#E1DCC9] text-[#1F150C] font-bold flex items-center justify-center text-xs border border-[#CFC6A9]">
                            {u.name ? u.name[0].toUpperCase() : 'U'}
                          </div>
                          <span>{u.name}</span>
                          {isSelf && (
                            <span className="text-[10px] text-[#1F150C] font-bold bg-[#E1DCC9] px-1.5 py-0.5 rounded border border-[#CFC6A9]">
                              You
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-muted">{u.email}</td>
                      <td className="py-3.5 px-4">
                        <select
                          value={u.role}
                          disabled={isSelf}
                          onChange={(e) => handleRoleChange(u, e.target.value)}
                          className="px-2 py-1 bg-surface border border-slate-border rounded text-xs font-semibold focus:outline-none disabled:opacity-60"
                        >
                          <option value="USER">USER</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                            u.isActive
                              ? 'bg-green-50 text-status-success'
                              : 'bg-red-50 text-status-error'
                          }`}
                        >
                          {u.isActive ? 'Active' : 'Deactivated'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-muted">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {!isSelf && (
                          <button
                            onClick={() => handleToggleStatus(u)}
                            className={`p-1.5 rounded transition-colors text-xs font-semibold ${
                              u.isActive
                                ? 'text-status-error hover:bg-red-50'
                                : 'text-status-success hover:bg-green-50'
                            }`}
                          >
                            {u.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(p) => setPage(p)}
      />
    </div>
  );
};
