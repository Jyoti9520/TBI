import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export const showToast = (message, type = 'success') => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('app-toast', { detail: { message, type } }));
  }
};

export const ToastContainer = () => {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    let timer;
    const handleToast = (e) => {
      if (e.detail?.message) {
        setToast({ message: e.detail.message, type: e.detail.type || 'success' });
        clearTimeout(timer);
        timer = setTimeout(() => {
          setToast(null);
        }, 2800);
      }
    };

    window.addEventListener('app-toast', handleToast);
    return () => {
      window.removeEventListener('app-toast', handleToast);
      clearTimeout(timer);
    };
  }, []);

  if (!toast) return null;

  return (
    <Toast
      message={toast.message}
      type={toast.type}
      onClose={() => setToast(null)}
    />
  );
};

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
