import React, { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  X,
  ExternalLink,
  Shield,
  Clock
} from 'lucide-react';
import { tbiService } from '../services/tbiService';
import { adminService } from '../services/adminService';
import { Pagination } from '../components/Pagination';
import { getTbiDisplayData } from '../utils/tbiMapping';

export const AdminTbis = () => {
  const [tbis, setTbis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState('');

  // Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedTbi, setSelectedTbi] = useState(null);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const fetchTbis = async (currentPage = 1, searchQuery = '') => {
    setLoading(true);
    try {
      const res = await tbiService.getTbis({
        page: currentPage,
        limit: 15,
        search: searchQuery.trim()
      });
      if (res.success) {
        setTbis(res.data || []);
        setPage(res.page);
        setTotalPages(res.totalPages);
        setTotalCount(res.total);
      }
    } catch (err) {
      console.error('Admin fetch TBIs error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTbis(page, search);
  }, [page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchTbis(1, search);
  };

  const handleOpenEdit = (tbi) => {
    setSelectedTbi(tbi);
    setFormData({
      name: tbi.name || '',
      university: tbi.university || '',
      city: tbi.city || '',
      universityType: tbi.universityType || '',
      incubatorType: tbi.incubatorType || '',
      email: tbi.email || '',
      website: tbi.website || '',
      status: tbi.status || 'Unverified',
      logo: tbi.logo || '',
      description: tbi.description || '',
      phone: tbi.phone || '',
      address: tbi.address || '',
      state: tbi.state || '',
      country: tbi.country || 'India',
      latitude: tbi.latitude || '',
      longitude: tbi.longitude || ''
    });
    setEditModalOpen(true);
  };

  const handleOpenCreate = () => {
    setSelectedTbi(null);
    setFormData({
      name: '',
      university: '',
      city: '',
      universityType: 'Private',
      incubatorType: 'DST TBI',
      email: '',
      website: '',
      status: 'Verified',
      logo: '',
      description: '',
      phone: '',
      address: '',
      state: '',
      country: 'India',
      latitude: '',
      longitude: ''
    });
    setEditModalOpen(true);
  };

  const handleSaveTbi = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (selectedTbi) {
        // Update
        const res = await adminService.updateTbi(selectedTbi.id, formData);
        if (res.success) {
          setToastMessage('TBI updated successfully');
          setEditModalOpen(false);
          fetchTbis(page, search);
        }
      } else {
        // Create
        const res = await adminService.createTbi(formData);
        if (res.success) {
          setToastMessage('TBI created successfully');
          setEditModalOpen(false);
          fetchTbis(1, search);
        }
      }
    } catch (err) {
      console.error('Save TBI error:', err);
    } finally {
      setSaving(false);
      setTimeout(() => setToastMessage(''), 3000);
    }
  };

  const handleDeleteTbi = async (id, name) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${name}"?`)) {
      return;
    }

    try {
      const res = await adminService.deleteTbi(id);
      if (res.success) {
        setToastMessage('TBI deleted successfully');
        fetchTbis(page, search);
        setTimeout(() => setToastMessage(''), 3000);
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleToggleVerify = async (tbi) => {
    const nextStatus = tbi.status === 'Verified' ? 'Unverified' : 'Verified';
    try {
      const res = await adminService.updateTbi(tbi.id, { status: nextStatus });
      if (res.success) {
        setToastMessage(`TBI marked as ${nextStatus}`);
        fetchTbis(page, search);
        setTimeout(() => setToastMessage(''), 3000);
      }
    } catch (err) {
      console.error('Toggle status error:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#7A0B1A]">
            Manage Incubator Directory
          </h1>
          <p className="text-sm text-slate-muted mt-1">
            Browse, enrich, update, verify or delete TBI listings ({totalCount} total).
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center space-x-1.5 px-4 py-2 bg-[#7A0B1A] text-[#D9CAB3] text-xs font-semibold rounded-lg shadow-sm hover:bg-[#5B0712] transition-colors shrink-0 border border-[#7A0B1A]"
        >
          <Plus className="w-4 h-4" />
          <span>Add New TBI</span>
        </button>
      </div>

      {toastMessage && (
        <div className="p-3 bg-green-50 border border-green-200 text-status-success rounded-xl text-xs font-semibold animate-in fade-in">
          {toastMessage}
        </div>
      )}

      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-md">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-muted absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, university, city..."
            className="w-full pl-10 pr-4 py-2 bg-surface border border-slate-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-[#7A0B1A] hover:bg-[#5B0712] text-[#D9CAB3] font-semibold text-xs rounded-xl shadow-sm transition-colors border border-[#7A0B1A]"
        >
          Search
        </button>
      </form>

      {/* TBI Table */}
      <div className="bg-surface border border-slate-border rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-border text-slate-muted uppercase tracking-wider font-bold">
                <th className="py-3 px-4">TBI Name & University</th>
                <th className="py-3 px-4">City</th>
                <th className="py-3 px-4">Incubator Type</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-slate-muted">
                    Loading directory records...
                  </td>
                </tr>
              ) : tbis.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-slate-muted">
                    No incubators match your query.
                  </td>
                </tr>
              ) : (
                tbis.map((tbi) => {
                  const display = getTbiDisplayData(tbi);
                  return (
                    <tr key={tbi.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate text-sm max-w-xs truncate" title={display.universityName}>
                          {display.universityName}
                        </div>
                        <div className="text-[11px] text-[#7A0B1A] font-semibold max-w-xs truncate" title={display.incubatorName}>
                          {display.incubatorName}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate">{display.city || '—'}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate font-semibold text-[11px]">
                          {display.incubatorType || 'TBI'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-muted max-w-[150px] truncate" title={display.email || ''}>
                        {display.email || '—'}
                      </td>
                      <td className="py-3.5 px-4">
                        {display.status === 'Verified' ? (
                          <span className="inline-flex items-center space-x-1 text-status-success font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Verified</span>
                          </span>
                        ) : display.status === 'Under Verification' ? (
                          <span className="inline-flex items-center space-x-1 text-amber-600 font-semibold">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Under Review</span>
                          </span>
                        ) : (
                          <span className="text-slate-400">Unverified</span>
                        )}
                      </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <button
                          onClick={() => handleToggleVerify(tbi)}
                          className={`p-1.5 rounded transition-colors ${
                            tbi.status === 'Verified'
                              ? 'text-status-success hover:bg-green-50'
                              : 'text-slate-400 hover:text-green-600 hover:bg-green-50'
                          }`}
                          title={tbi.status === 'Verified' ? 'Unverify' : 'Verify'}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(tbi)}
                          className="p-1.5 rounded text-slate-muted hover:text-[#7A0B1A] hover:bg-[#D9CAB3]/30 transition-colors"
                          title="Edit / Enrich"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTbi(tbi.id, tbi.name)}
                          className="p-1.5 rounded text-slate-muted hover:text-status-error hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(p) => setPage(p)}
      />

      {/* Edit / Enrich Modal (Section 44) */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-surface rounded-2xl border border-slate-border shadow-2xl max-w-2xl w-full p-6 my-8 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-border">
              <h3 className="font-bold text-lg text-[#7A0B1A]">
                {selectedTbi ? 'Edit & Enrich TBI Record' : 'Add New TBI Record'}
              </h3>
              <button
                onClick={() => setEditModalOpen(false)}
                className="p-1 rounded-md text-slate-muted hover:text-slate"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTbi} className="space-y-4 mt-4 max-h-[70vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-muted uppercase tracking-wider mb-1">
                    TBI Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-border rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-muted uppercase tracking-wider mb-1">
                    University Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.university || ''}
                    onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-border rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-muted uppercase tracking-wider mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.city || ''}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-border rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-muted uppercase tracking-wider mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    value={formData.state || ''}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-border rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-muted uppercase tracking-wider mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status || 'Unverified'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-border rounded-lg text-sm"
                  >
                    <option value="Verified">Verified</option>
                    <option value="Under Verification">Under Verification</option>
                    <option value="Unverified">Unverified</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-muted uppercase tracking-wider mb-1">
                    Incubator Type
                  </label>
                  <input
                    type="text"
                    value={formData.incubatorType || ''}
                    onChange={(e) => setFormData({ ...formData, incubatorType: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-border rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-muted uppercase tracking-wider mb-1">
                    University Type
                  </label>
                  <input
                    type="text"
                    value={formData.universityType || ''}
                    onChange={(e) => setFormData({ ...formData, universityType: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-border rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-muted uppercase tracking-wider mb-1">
                    Official Email
                  </label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-border rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-muted uppercase tracking-wider mb-1">
                    Official Website URL
                  </label>
                  <input
                    type="text"
                    value={formData.website || ''}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-border rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-muted uppercase tracking-wider mb-1">
                    Logo Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.logo || ''}
                    onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 border border-slate-border rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-muted uppercase tracking-wider mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-border rounded-lg text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-muted uppercase tracking-wider mb-1">
                  Description / Focus Areas
                </label>
                <textarea
                  rows={2}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-border rounded-lg text-sm"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-border">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 border border-slate-border text-slate text-xs font-semibold rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-[#7A0B1A] hover:bg-[#5B0712] disabled:opacity-50 text-[#D9CAB3] text-xs font-semibold rounded-lg shadow-sm border border-[#7A0B1A]"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
