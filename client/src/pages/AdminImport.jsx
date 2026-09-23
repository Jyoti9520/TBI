import React, { useState } from 'react';
import { UploadCloud, FileSpreadsheet, CheckCircle2, AlertCircle, FileText } from 'lucide-react';
import { adminService } from '../services/adminService';

export const AdminImport = () => {
  const [file, setFile] = useState(null);
  const [duplicateAction, setDuplicateAction] = useState('update'); // 'update' | 'skip'
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setReport(null);
      setError('');
    }
  };

  const handleImport = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select an .xlsx, .csv, or .json file to import');
      return;
    }

    setLoading(true);
    setError('');
    setReport(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('duplicateAction', duplicateAction);

    try {
      const res = await adminService.importDataset(formData);
      if (res.success) {
        setReport(res.report);
      } else {
        setError(res.message || 'Import failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error occurred while importing dataset');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy flex items-center space-x-2">
          <FileSpreadsheet className="w-7 h-7 text-teal" />
          <span>Dataset Importer</span>
        </h1>
        <p className="text-sm text-slate-muted mt-1">
          Upload bulk incubator records in Excel (.xlsx), CSV, or JSON format.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-status-error text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Upload Box */}
      <div className="bg-surface border border-slate-border rounded-2xl p-6 sm:p-8 shadow-card">
        <form onSubmit={handleImport} className="space-y-6">
          <div className="border-2 border-dashed border-slate-border hover:border-teal rounded-2xl p-8 text-center bg-slate-50/50 transition-colors">
            <UploadCloud className="w-12 h-12 text-slate-muted mx-auto mb-3" />
            <p className="text-sm font-bold text-slate">
              {file ? file.name : 'Select or drag your dataset file here'}
            </p>
            <p className="text-xs text-slate-muted mt-1">
              Supports .xlsx, .xls, .csv, and .json files up to 15MB
            </p>

            <input
              type="file"
              accept=".xlsx,.xls,.csv,.json"
              onChange={handleFileChange}
              id="dataset-upload"
              className="hidden"
            />
            <label
              htmlFor="dataset-upload"
              className="mt-4 inline-block px-4 py-2 bg-white border border-slate-border rounded-xl text-xs font-semibold text-navy hover:bg-slate-50 cursor-pointer shadow-subtle transition-colors"
            >
              Browse Files
            </label>
          </div>

          {/* Duplicate Resolution Strategy */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-border space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-muted">
              Duplicate Detection Strategy
            </label>
            <p className="text-xs text-slate-muted">
              Records are matched on <span className="font-semibold text-slate">University + City + TBI Name</span>.
            </p>

            <div className="flex gap-4 pt-1">
              <label className="flex items-center space-x-2 text-xs font-semibold text-slate cursor-pointer">
                <input
                  type="radio"
                  name="dup"
                  value="update"
                  checked={duplicateAction === 'update'}
                  onChange={() => setDuplicateAction('update')}
                />
                <span>Update Existing Records</span>
              </label>

              <label className="flex items-center space-x-2 text-xs font-semibold text-slate cursor-pointer">
                <input
                  type="radio"
                  name="dup"
                  value="skip"
                  checked={duplicateAction === 'skip'}
                  onChange={() => setDuplicateAction('skip')}
                />
                <span>Skip Duplicates</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !file}
            className="w-full py-3 bg-navy hover:bg-navy-600 disabled:opacity-50 text-white font-semibold text-sm rounded-xl shadow-sm transition-colors"
          >
            {loading ? 'Processing & Validating Records...' : 'Start Dataset Import'}
          </button>
        </form>
      </div>

      {/* Dynamic Import Report (Section 46) */}
      {report && (
        <div className="bg-surface border border-slate-border rounded-2xl p-6 sm:p-8 shadow-card space-y-4 animate-in fade-in">
          <div className="flex items-center space-x-2 border-b border-slate-border pb-3">
            <CheckCircle2 className="w-5 h-5 text-status-success" />
            <h3 className="text-base font-bold text-navy">Import Report Summary</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-slate-50 rounded-xl">
              <p className="text-xs font-semibold text-slate-muted">Total Rows</p>
              <p className="text-xl font-extrabold text-navy mt-1">{report.totalRows}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-xl">
              <p className="text-xs font-semibold text-status-success">Valid</p>
              <p className="text-xl font-extrabold text-status-success mt-1">{report.valid}</p>
            </div>
            <div className="p-3 bg-red-50 rounded-xl">
              <p className="text-xs font-semibold text-status-error">Invalid</p>
              <p className="text-xl font-extrabold text-status-error mt-1">{report.invalid}</p>
            </div>
            <div className="p-3 bg-teal-50 rounded-xl">
              <p className="text-xs font-semibold text-teal">Inserted</p>
              <p className="text-xl font-extrabold text-teal mt-1">{report.inserted}</p>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl">
              <p className="text-xs font-semibold text-amber-700">Updated</p>
              <p className="text-xl font-extrabold text-amber-700 mt-1">{report.updated}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <p className="text-xs font-semibold text-slate-muted">Skipped</p>
              <p className="text-xl font-extrabold text-slate-muted mt-1">{report.skipped}</p>
            </div>
          </div>

          {report.errors && report.errors.length > 0 && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs space-y-1">
              <p className="font-bold text-status-error">Validation Errors Log:</p>
              {report.errors.map((err, i) => (
                <p key={i} className="text-slate-600">
                  Row {err.row}: {err.reason}
                </p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
