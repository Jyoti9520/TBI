import React, { useState } from 'react';
import { PlusCircle, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { tbiService } from '../services/tbiService';

export const SuggestTbi = () => {
  const [formData, setFormData] = useState({
    university: '',
    city: '',
    universityType: 'Private',
    tbiName: '',
    incubatorType: 'DST TBI',
    email: '',
    website: '',
    description: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target.value;
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.university.trim() || !formData.tbiName.trim()) {
      setError('University Name and TBI Name are mandatory.');
      return;
    }

    setLoading(true);
    try {
      const res = await tbiService.submitSuggestion(formData);
      if (res.success) {
        setSuccess('TBI suggestion submitted successfully! It will be reviewed by the administration.');
        setFormData({
          university: '',
          city: '',
          universityType: 'Private',
          tbiName: '',
          incubatorType: 'DST TBI',
          email: '',
          website: '',
          description: ''
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error submitting suggestion.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F150C] flex items-center space-x-2">
          <PlusCircle className="w-7 h-7 text-[#412D15]" />
          <span>Suggest an Incubator</span>
        </h1>
        <p className="text-sm text-slate-muted mt-1">
          Know of a university incubation centre not listed in our directory? Help us map the innovation ecosystem.
        </p>
      </div>

      <div className="bg-surface border border-slate-border rounded-2xl p-6 sm:p-8 shadow-card">
        {success && (
          <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 text-status-success text-xs sm:text-sm flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-status-error text-xs sm:text-sm flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-muted mb-1.5">
                Incubator / TBI Name *
              </label>
              <input
                type="text"
                required
                name="tbiName"
                value={formData.tbiName}
                onChange={handleChange}
                placeholder="e.g. Centre for Innovation & Incubation"
                className="w-full px-3.5 py-2.5 bg-surface border border-slate-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-muted mb-1.5">
                University Name *
              </label>
              <input
                type="text"
                required
                name="university"
                value={formData.university}
                onChange={handleChange}
                placeholder="e.g. Delhi Technological University"
                className="w-full px-3.5 py-2.5 bg-surface border border-slate-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-muted mb-1.5">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="e.g. New Delhi"
                className="w-full px-3.5 py-2.5 bg-surface border border-slate-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-muted mb-1.5">
                Incubator Type
              </label>
              <select
                name="incubatorType"
                value={formData.incubatorType}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-surface border border-slate-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
              >
                <option value="DST TBI">DST TBI</option>
                <option value="NIDHI-TBI">NIDHI-TBI</option>
                <option value="Section 8 Incubator">Section 8 Incubator</option>
                <option value="STEP">STEP</option>
                <option value="University Incubator">University Incubator</option>
                <option value="Atal Incubation Centre (AIC)">Atal Incubation Centre (AIC)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-muted mb-1.5">
                Official Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="contact@incubator.edu.in"
                className="w-full px-3.5 py-2.5 bg-surface border border-slate-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-muted mb-1.5">
                Official Website
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://incubator.edu.in"
                className="w-full px-3.5 py-2.5 bg-surface border border-slate-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-muted mb-1.5">
              Additional Information / Description
            </label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="Tell us about the incubator's focus areas, facilities, or lab infrastructure..."
              className="w-full px-3.5 py-2.5 bg-surface border border-slate-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center space-x-2 px-6 py-2.5 bg-[#1F150C] hover:bg-[#412D15] disabled:opacity-50 text-[#E1DCC9] font-semibold text-sm rounded-xl shadow-sm transition-colors border border-[#000000]"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? 'Submitting...' : 'Submit Suggestion'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
