import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  Building2,
  CheckCircle2,
  Clock,
  MapPin,
  Users,
  FileSpreadsheet,
  AlertCircle,
  Check,
  X
} from 'lucide-react';
import { adminService } from '../services/adminService';
import { tbiService } from '../services/tbiService';
import { StatsCard } from '../components/StatsCard';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [moderatingId, setModeratingId] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, suggRes] = await Promise.all([
        adminService.getStats(),
        tbiService.getSuggestionsList()
      ]);
      if (statsRes.success) setStats(statsRes.data);
      if (suggRes.success) setSuggestions(suggRes.data || []);
    } catch (err) {
      console.error('Admin dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleModerateSuggestion = async (id, status, createTbiRecord = false) => {
    setModeratingId(id);
    try {
      const res = await adminService.updateSuggestion(id, status, createTbiRecord);
      if (res.success) {
        setToastMessage(`Suggestion ${status.toLowerCase()} successfully`);
        loadAdminData();
        setTimeout(() => setToastMessage(''), 3000);
      }
    } catch (err) {
      console.error('Moderation error:', err);
    } finally {
      setModeratingId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F150C] flex items-center space-x-2">
            <Shield className="w-7 h-7 text-[#412D15]" />
            <span>Administrator Control Center</span>
          </h1>
          <p className="text-sm text-slate-muted mt-1">
            Global ecosystem oversight, data governance, and review queue.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <Link
            to="/admin/import"
            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-[#1F150C] text-[#E1DCC9] text-xs font-semibold rounded-lg shadow-sm hover:bg-[#412D15] transition-colors border border-[#000000]"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Import Dataset</span>
          </Link>
          <Link
            to="/admin/tbis"
            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-surface border border-slate-border text-slate text-xs font-semibold rounded-lg hover:bg-slate-50 transition-colors"
          >
            <span>Manage TBIs</span>
          </Link>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3 bg-green-50 border border-green-200 text-status-success rounded-xl text-xs font-semibold animate-in fade-in">
          {toastMessage}
        </div>
      )}

      {/* Dynamic Statistics Cards Grid (Section 42) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total TBIs"
          value={stats?.totalTbis}
          icon={Building2}
          color="navy"
        />
        <StatsCard
          title="Verified Status"
          value={stats?.verifiedTbis}
          icon={CheckCircle2}
          color="green"
        />
        <StatsCard
          title="Under Verification"
          value={stats?.underVerificationTbis}
          icon={Clock}
          color="amber"
        />
        <StatsCard
          title="Registered Users"
          value={stats?.totalUsers}
          icon={Users}
          color="teal"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard
          title="Unique Universities"
          value={stats?.uniqueUniversities}
          icon={Building2}
          color="navy"
        />
        <StatsCard
          title="Unique Cities"
          value={stats?.uniqueCities}
          icon={MapPin}
          color="teal"
        />
        <StatsCard
          title="Pending Suggestions"
          value={stats?.pendingSuggestions}
          icon={Clock}
          color="amber"
        />
      </div>

      {/* Pending Suggestions Review Section */}
      <div className="bg-surface border border-slate-border rounded-2xl p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-[#1F150C] flex items-center space-x-2">
            <Clock className="w-4 h-4 text-[#412D15]" />
            <span>Pending Community Suggestions ({suggestions.length})</span>
          </h2>
        </div>

        {loading ? (
          <div className="h-32 bg-slate-50 rounded-xl animate-pulse" />
        ) : suggestions.length === 0 ? (
          <p className="text-xs text-slate-muted py-4 text-center">
            No suggestions pending review.
          </p>
        ) : (
          <div className="divide-y divide-slate-100">
            {suggestions.map((s) => (
              <div key={s.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-slate">{s.tbiName}</h4>
                  <p className="text-xs text-slate-muted">
                    {s.university} • {s.city || 'City N/A'} • {s.incubatorType || 'Type N/A'}
                  </p>
                  {s.description && (
                    <p className="text-xs text-slate-500 mt-1 max-w-xl">{s.description}</p>
                  )}
                  <p className="text-[11px] text-slate-400 mt-1">
                    Submitted by: {s.submitter?.email || 'Anonymous'} • Status: <span className="font-semibold text-amber-600">{s.status}</span>
                  </p>
                </div>

                {s.status === 'Pending' && (
                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => handleModerateSuggestion(s.id, 'Approved', true)}
                      disabled={moderatingId === s.id}
                      className="flex items-center space-x-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
                      title="Approve and create TBI"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve & Add</span>
                    </button>
                    <button
                      onClick={() => handleModerateSuggestion(s.id, 'Rejected', false)}
                      disabled={moderatingId === s.id}
                      className="flex items-center space-x-1 px-3 py-1.5 bg-slate-100 hover:bg-red-50 hover:text-status-error text-slate-muted text-xs font-semibold rounded-lg transition-colors"
                      title="Reject"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
