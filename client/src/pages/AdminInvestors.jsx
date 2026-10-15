import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit2, Trash2, ShieldCheck, ExternalLink, 
  Search, CheckCircle2, AlertCircle, X, RotateCcw 
} from 'lucide-react';
import { investorService } from '../services/investorService';
import { useAuth } from '../context/AuthContext';

export const AdminInvestors = () => {
  const { user } = useAuth();

  const [investors, setInvestors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  // Form Fields
  const initialForm = {
    name: '',
    legalName: '',
    type: 'Venture Capital',
    tagline: '',
    description: '',
    investmentThesis: '',
    logo: '',
    country: 'India',
    headquartersCity: '',
    sectors: '',
    stages: '',
    disclosedTicketMin: '',
    disclosedTicketMax: '',
    ticketRangeDisplay: '',
    website: '',
    applicationUrl: '',
    contactEmail: '',
    linkedinUrl: '',
    verificationStatus: 'Verified',
    sourceUrl: '',
    sourceNotes: '',
    lastVerifiedDate: new Date().toISOString().split('T')[0]
  };

  const [formData, setFormData] = useState(initialForm);

  const fetchInvestors = async () => {
    setLoading(true);
    try {
      const res = await investorService.getInvestors({ limit: 100, search });
      setInvestors(res.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching admin investors:', err);
      setError('Failed to fetch investor records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvestors();
  }, [search]);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (inv) => {
    setEditingId(inv.id);
    setFormData({
      name: inv.name || '',
      legalName: inv.legalName || '',
      type: inv.type || 'Venture Capital',
      tagline: inv.tagline || '',
      description: inv.description || '',
      investmentThesis: inv.investmentThesis || '',
      logo: inv.logo || '',
      country: inv.country || 'India',
      headquartersCity: inv.headquartersCity || '',
      sectors: Array.isArray(inv.sectors) ? inv.sectors.join(', ') : '',
      stages: Array.isArray(inv.stages) ? inv.stages.join(', ') : '',
      disclosedTicketMin: inv.disclosedTicketMin || '',
      disclosedTicketMax: inv.disclosedTicketMax || '',
      ticketRangeDisplay: inv.ticketRangeDisplay || '',
      website: inv.website || '',
      applicationUrl: inv.applicationUrl || '',
      contactEmail: inv.contactEmail || '',
      linkedinUrl: inv.linkedinUrl || '',
      verificationStatus: inv.verificationStatus || 'Verified',
      sourceUrl: inv.sourceUrl || '',
      sourceNotes: inv.sourceNotes || '',
      lastVerifiedDate: inv.lastVerifiedDate || new Date().toISOString().split('T')[0]
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to archive this investor record?')) {
      return;
    }
    try {
      await investorService.deleteInvestor(id);
      fetchInvestors();
    } catch (err) {
      console.error('Error archiving investor:', err);
      alert('Failed to archive investor.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Parse sectors and stages comma-separated
      const payload = {
        ...formData,
        sectors: formData.sectors ? formData.sectors.split(',').map(s => s.trim()).filter(Boolean) : [],
        stages: formData.stages ? formData.stages.split(',').map(s => s.trim()).filter(Boolean) : [],
        disclosedTicketMin: formData.disclosedTicketMin ? parseFloat(formData.disclosedTicketMin) : null,
        disclosedTicketMax: formData.disclosedTicketMax ? parseFloat(formData.disclosedTicketMax) : null
      };

      if (editingId) {
        await investorService.updateInvestor(editingId, payload);
      } else {
        await investorService.createInvestor(payload);
      }

      setIsModalOpen(false);
      fetchInvestors();
    } catch (err) {
      console.error('Error saving investor:', err);
      alert(err.response?.data?.message || 'Failed to save investor record.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 text-orange-400" />
            Investor Management & Data Quality
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Create, audit, verify, and maintain institutional investor profiles and verified links.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add New Investor
        </button>
      </div>

      {/* Search & Stats Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search investors to audit..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#131318] border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
          />
        </div>
        <div className="text-xs text-gray-400">
          Total Managed: <span className="text-white font-bold">{investors.length}</span>
        </div>
      </div>

      {/* Investors Table */}
      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#131318]">
        <table className="w-full text-left text-xs">
          <thead className="bg-black/40 text-gray-400 uppercase tracking-wider border-b border-white/10 text-[11px]">
            <tr>
              <th className="py-3.5 px-4">Investor Name</th>
              <th className="py-3.5 px-4">Type</th>
              <th className="py-3.5 px-4">HQ & Geography</th>
              <th className="py-3.5 px-4">Verification</th>
              <th className="py-3.5 px-4">Source URL</th>
              <th className="py-3.5 px-4">Last Audited</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-gray-300">
            {loading ? (
              <tr>
                <td colSpan="7" className="py-8 text-center text-gray-500">
                  Loading investors...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="7" className="py-8 text-center text-red-400">
                  {error}
                </td>
              </tr>
            ) : investors.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-8 text-center text-gray-500">
                  No investors found.
                </td>
              </tr>
            ) : (
              investors.map((inv) => (
                <tr key={inv.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-4 font-semibold text-white">
                    <div className="flex items-center gap-2">
                      <span>{inv.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-400">{inv.type}</td>
                  <td className="py-3 px-4">
                    {inv.headquartersCity ? `${inv.headquartersCity}, ` : ''}{inv.country || 'India'}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      inv.verificationStatus === 'Verified'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {inv.verificationStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 max-w-[180px] truncate">
                    {inv.sourceUrl ? (
                      <a
                        href={inv.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-400 hover:underline flex items-center gap-1 truncate"
                      >
                        <ExternalLink className="w-3 h-3 flex-shrink-0" />
                        {inv.sourceUrl}
                      </a>
                    ) : (
                      <span className="text-gray-600">None</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-gray-400">
                    {inv.lastVerifiedDate ? new Date(inv.lastVerifiedDate).toLocaleDateString() : '—'}
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEdit(inv)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                      title="Edit Investor"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(inv.id)}
                      className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                      title="Archive Investor"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for Add / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[#131318] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="text-lg font-bold text-white">
                {editingId ? 'Edit Investor Record' : 'Add New Investor'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 mb-1 font-medium">Investor / Firm Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-orange-500"
                    placeholder="e.g. Blume Ventures"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-1 font-medium">Legal Registered Name</label>
                  <input
                    type="text"
                    value={formData.legalName}
                    onChange={(e) => setFormData({ ...formData, legalName: e.target.value })}
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-orange-500"
                    placeholder="e.g. Blume Venture Advisors Pvt Ltd"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-1 font-medium">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="Venture Capital">Venture Capital</option>
                    <option value="Angel Network">Angel Network</option>
                    <option value="Corporate VC">Corporate VC</option>
                    <option value="Government / PSU Fund">Government / PSU Fund</option>
                    <option value="Family Office">Family Office</option>
                    <option value="Accelerator / Incubator Fund">Accelerator / Incubator Fund</option>
                    <option value="Seed Fund">Seed Fund</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 mb-1 font-medium">HQ City</label>
                  <input
                    type="text"
                    value={formData.headquartersCity}
                    onChange={(e) => setFormData({ ...formData, headquartersCity: e.target.value })}
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-orange-500"
                    placeholder="e.g. Bengaluru"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 mb-1 font-medium">Tagline</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-orange-500"
                  placeholder="e.g. Backing bold Indian founders building for India and the World"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1 font-medium">Description</label>
                <textarea
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1 font-medium">Investment Thesis</label>
                <textarea
                  rows="3"
                  value={formData.investmentThesis}
                  onChange={(e) => setFormData({ ...formData, investmentThesis: e.target.value })}
                  className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-orange-500"
                  placeholder="Describe investment criteria, sector focus, technical moats..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 mb-1 font-medium">Sectors (Comma separated)</label>
                  <input
                    type="text"
                    value={formData.sectors}
                    onChange={(e) => setFormData({ ...formData, sectors: e.target.value })}
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-orange-500"
                    placeholder="DeepTech, SaaS, Robotics, CleanTech"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-1 font-medium">Stages (Comma separated)</label>
                  <input
                    type="text"
                    value={formData.stages}
                    onChange={(e) => setFormData({ ...formData, stages: e.target.value })}
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-orange-500"
                    placeholder="Pre-Seed, Seed, Pre-Series A"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-1 font-medium">Ticket Range Display</label>
                  <input
                    type="text"
                    value={formData.ticketRangeDisplay}
                    onChange={(e) => setFormData({ ...formData, ticketRangeDisplay: e.target.value })}
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-orange-500"
                    placeholder="e.g. ₹25 Lakhs – ₹2 Crores or Not publicly disclosed"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-1 font-medium">Verification Status</label>
                  <select
                    value={formData.verificationStatus}
                    onChange={(e) => setFormData({ ...formData, verificationStatus: e.target.value })}
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="Verified">Verified</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Unverified">Unverified</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 mb-1 font-medium">Official Website</label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-orange-500"
                    placeholder="https://example.com"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-1 font-medium">Application / Pitch URL</label>
                  <input
                    type="url"
                    value={formData.applicationUrl}
                    onChange={(e) => setFormData({ ...formData, applicationUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-orange-500"
                    placeholder="https://example.com/pitch"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-1 font-medium">Primary Source URL (Audit)</label>
                  <input
                    type="url"
                    value={formData.sourceUrl}
                    onChange={(e) => setFormData({ ...formData, sourceUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-orange-500"
                    placeholder="https://sebi.gov.in or official filing"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-1 font-medium">Last Verification Date</label>
                  <input
                    type="date"
                    value={formData.lastVerifiedDate}
                    onChange={(e) => setFormData({ ...formData, lastVerifiedDate: e.target.value })}
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-gray-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingId ? 'Update Investor' : 'Create Investor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInvestors;