import React from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export const Toast = ({ message, type = 'success', onClose }) => {
  if (!message) return null;

  const isSuccess = type === 'success';

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center space-x-3 px-4 py-3 rounded-xl shadow-hover bg-surface border border-slate-border animate-in slide-in-from-bottom-2 duration-150">
      {isSuccess ? (
        <CheckCircle2 className="w-5 h-5 text-status-success shrink-0" />
      ) : (
        <AlertCircle className="w-5 h-5 text-status-error shrink-0" />
      )}
      <span className="text-sm font-semibold text-slate">{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="p-1 rounded text-slate-muted hover:text-slate transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
