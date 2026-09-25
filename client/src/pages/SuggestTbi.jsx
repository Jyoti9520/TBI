import React, { useState } from 'react';
import {
  PlusCircle,
  ArrowRight,
  BadgeCheck,
  AlertCircle,
  Loader2,
  Building2,
  Rocket,
  MapPin,
  Layers,
  Mail,
  Globe,
  FileText
} from 'lucide-react';
import { tbiService } from '../services/tbiService';

const UNIVERSITY_TYPES = [
  'Central University',
  'State University',
  'Deemed University',
  'Private University',
  'Institute of National Importance (IIT/NIT/IIM)',
  'Autonomous College',
  'Other'
];

const INCUBATOR_TYPES = [
  'DST TBI',
  'NIDHI-TBI',
  'University Incubator',
  'Section 8 Incubator',
  'Atal Incubation Centre (AIC)',
  'STEP',
  'BioNEST / BIRAC',
  'Other'
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_REGEX = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/i;

export const SuggestTbi = () => {
  const [formData, setFormData] = useState({
    university: '',
    tbiName: '',
    city: '',
    universityType: '',
    incubatorType: '',
    email: '',
    website: '',
    description: ''
  });

  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    // Clear field-specific validation error on change
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validate = () => {
    const errors = {};

    // Required fields: University Name *, Incubator / TBI Name *, City *
    if (!formData.university.trim()) {
      errors.university = 'University Name is required.';
    }

    if (!formData.tbiName.trim()) {
      errors.tbiName = 'Incubator / TBI Name is required.';
    }

    if (!formData.city.trim()) {
      errors.city = 'City is required.';
    }

    // Optional Official Email: valid email format when provided
    if (formData.email.trim() && !EMAIL_REGEX.test(formData.email.trim())) {
      errors.email = 'Please provide a valid email address (e.g., contact@incubator.edu.in).';
    }

    // Optional Website: valid URL format when provided
    if (formData.website.trim() && !URL_REGEX.test(formData.website.trim())) {
      errors.website = 'Please provide a valid website URL (e.g., https://example.edu.in).';
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSuccess(false);

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors({});
    setLoading(true);

    try {
      const res = await tbiService.submitSuggestion({
        university: formData.university.trim(),
        tbiName: formData.tbiName.trim(),
        city: formData.city.trim(),
        universityType: formData.universityType.trim() || null,
        incubatorType: formData.incubatorType.trim() || null,
        email: formData.email.trim() || null,
        website: formData.website.trim() || null,
        description: formData.description.trim() || null
      });

      if (res.success) {
        setIsSuccess(true);
        setFormData({
          university: '',
          tbiName: '',
          city: '',
          universityType: '',
          incubatorType: '',
          email: '',
          website: '',
          description: ''
        });
      } else {
        setErrorMessage(res.message || 'Submission could not be completed.');
      }
    } catch (err) {
      console.error('Submission error:', err);
      const serverMsg = err.response?.data?.message;
      if (err.response?.status === 404 || !tbiService.submitSuggestion) {
        setErrorMessage('The submission service is currently unavailable. Please try again later.');
      } else {
        setErrorMessage(serverMsg || 'Failed to submit suggestion. Please verify your details.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#5E0B15] flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#D9CAB3] flex items-center justify-center shrink-0 shadow-xs transition-transform duration-200 hover:scale-105">
            <PlusCircle className="w-5 h-5 text-[#90323D]" />
          </div>
          <span>Suggest a TBI</span>
        </h1>
        <p className="text-sm text-slate-muted mt-1 leading-relaxed">
          Know of a university incubation centre not yet listed in our directory? Submit its details below to help us map the national innovation ecosystem.
        </p>
      </div>

      {/* Main Submission Form Card */}
      <div className="bg-surface border border-slate-border rounded-2xl p-6 sm:p-8 shadow-card">
        
        {/* Success Banner */}
        {isSuccess && (
          <div className="mb-6 p-5 rounded-2xl bg-emerald-50/90 border border-emerald-200 text-emerald-900 animate-in fade-in duration-200">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 text-emerald-700">
                <BadgeCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-emerald-900 flex items-center space-x-1">
                  <span>✓ Suggestion submitted successfully</span>
                </h3>
                <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
                  Thank you. The information will be reviewed before being added to the directory.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Global Error Banner */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-status-error text-xs sm:text-sm flex items-center space-x-2.5">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          
          {/* Row 1: University Name * & Incubator / TBI Name * */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center space-x-1">
                <Building2 className="w-3.5 h-3.5 text-[#90323D]" />
                <span>University Name <span className="text-red-500 font-bold">*</span></span>
              </label>
              <input
                type="text"
                name="university"
                value={formData.university}
                onChange={handleChange}
                placeholder="e.g. Delhi Technological University"
                className={`w-full px-3.5 py-2.5 bg-surface border rounded-xl text-sm placeholder:text-slate-muted focus:outline-none focus:ring-2 transition-all ${
                  validationErrors.university
                    ? 'border-red-400 focus:ring-red-200 focus:border-red-500'
                    : 'border-slate-border focus:ring-[#90323D]/20 focus:border-[#90323D]'
                }`}
              />
              {validationErrors.university && (
                <p className="text-xs text-red-600 mt-1 font-medium">
                  {validationErrors.university}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center space-x-1">
                <Rocket className="w-3.5 h-3.5 text-[#90323D]" />
                <span>Incubator / TBI Name <span className="text-red-500 font-bold">*</span></span>
              </label>
              <input
                type="text"
                name="tbiName"
                value={formData.tbiName}
                onChange={handleChange}
                placeholder="e.g. DTU Innovation and Incubation Foundation"
                className={`w-full px-3.5 py-2.5 bg-surface border rounded-xl text-sm placeholder:text-slate-muted focus:outline-none focus:ring-2 transition-all ${
                  validationErrors.tbiName
                    ? 'border-red-400 focus:ring-red-200 focus:border-red-500'
                    : 'border-slate-border focus:ring-[#90323D]/20 focus:border-[#90323D]'
                }`}
              />
              {validationErrors.tbiName && (
                <p className="text-xs text-red-600 mt-1 font-medium">
                  {validationErrors.tbiName}
                </p>
              )}
            </div>
          </div>

          {/* Row 2: City * & University Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-[#90323D]" />
                <span>City <span className="text-red-500 font-bold">*</span></span>
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="e.g. New Delhi"
                className={`w-full px-3.5 py-2.5 bg-surface border rounded-xl text-sm placeholder:text-slate-muted focus:outline-none focus:ring-2 transition-all ${
                  validationErrors.city
                    ? 'border-red-400 focus:ring-red-200 focus:border-red-500'
                    : 'border-slate-border focus:ring-[#90323D]/20 focus:border-[#90323D]'
                }`}
              />
              {validationErrors.city && (
                <p className="text-xs text-red-600 mt-1 font-medium">
                  {validationErrors.city}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center space-x-1">
                <Building2 className="w-3.5 h-3.5 text-[#90323D]" />
                <span>University Type</span>
              </label>
              <select
                name="universityType"
                value={formData.universityType}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-surface border border-slate-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#90323D]/20 focus:border-[#90323D] transition-all cursor-pointer"
              >
                <option value="">Select University Type (Optional)</option>
                {UNIVERSITY_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 3: Incubator Type & Official Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center space-x-1">
                <Layers className="w-3.5 h-3.5 text-[#90323D]" />
                <span>Incubator Type</span>
              </label>
              <select
                name="incubatorType"
                value={formData.incubatorType}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-surface border border-slate-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#90323D]/20 focus:border-[#90323D] transition-all cursor-pointer"
              >
                <option value="">Select Incubator Type (Optional)</option>
                {INCUBATOR_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center space-x-1">
                <Mail className="w-3.5 h-3.5 text-[#90323D]" />
                <span>Official Email</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="contact@incubator.edu.in"
                className={`w-full px-3.5 py-2.5 bg-surface border rounded-xl text-sm placeholder:text-slate-muted focus:outline-none focus:ring-2 transition-all ${
                  validationErrors.email
                    ? 'border-red-400 focus:ring-red-200 focus:border-red-500'
                    : 'border-slate-border focus:ring-[#90323D]/20 focus:border-[#90323D]'
                }`}
              />
              {validationErrors.email && (
                <p className="text-xs text-red-600 mt-1 font-medium">
                  {validationErrors.email}
                </p>
              )}
            </div>
          </div>

          {/* Row 4: Website */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center space-x-1">
              <Globe className="w-3.5 h-3.5 text-[#90323D]" />
              <span>Website</span>
            </label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://incubator.edu.in"
              className={`w-full px-3.5 py-2.5 bg-surface border rounded-xl text-sm placeholder:text-slate-muted focus:outline-none focus:ring-2 transition-all ${
                validationErrors.website
                  ? 'border-red-400 focus:ring-red-200 focus:border-red-500'
                  : 'border-slate-border focus:ring-[#90323D]/20 focus:border-[#90323D]'
              }`}
            />
            {validationErrors.website && (
              <p className="text-xs text-red-600 mt-1 font-medium">
                {validationErrors.website}
              </p>
            )}
          </div>

          {/* Row 5: Additional Information */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center space-x-1">
              <FileText className="w-3.5 h-3.5 text-[#90323D]" />
              <span>Additional Information</span>
            </label>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide any additional context, key domain specializations (e.g. AI/DeepTech, AgriTech, MedTech), lab infrastructure, or notable achievements..."
              className="w-full px-3.5 py-2.5 bg-surface border border-slate-border rounded-xl text-sm placeholder:text-slate-muted focus:outline-none focus:ring-2 focus:ring-[#90323D]/20 focus:border-[#90323D] transition-all"
            />
          </div>

          {/* Form Actions */}
          <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-slate-muted">
              Fields marked with <span className="text-red-500 font-bold">*</span> are required.
            </span>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-2.5 bg-[#5E0B15] hover:bg-[#490911] disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-xs hover:shadow-sm active:scale-[0.98] transition-all cursor-pointer border border-[#5E0B15]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <span>Submit Suggestion →</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
