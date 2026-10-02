import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, LogIn, UserPlus, X, Bookmark, GitCompare, PlusCircle, Settings, MapPin, Sparkles } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const AuthRequiredModal = () => {
  const { authModal, closeAuthModal } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && authModal?.isOpen) {
        closeAuthModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [authModal?.isOpen, closeAuthModal]);

  if (!authModal?.isOpen) return null;

  const {
    title = 'Login to continue',
    subtitle = 'Create an account or login to access this feature and keep your TBI discoveries saved.',
    contextMessage,
    context = 'general',
    returnPath = location.pathname + location.search
  } = authModal;

  const handleLogin = () => {
    closeAuthModal();
    navigate('/login', { state: { from: { pathname: returnPath } } });
  };

  const handleSignup = () => {
    closeAuthModal();
    navigate('/signup', { state: { from: { pathname: returnPath } } });
  };

  const getContextIcon = () => {
    switch (context) {
      case 'save':
        return <Bookmark className="w-6 h-6 text-primary" />;
      case 'compare':
        return <GitCompare className="w-6 h-6 text-primary" />;
      case 'suggest':
        return <PlusCircle className="w-6 h-6 text-primary" />;
      case 'settings':
        return <Settings className="w-6 h-6 text-primary" />;
      case 'nearby':
        return <MapPin className="w-6 h-6 text-primary" />;
      case 'saved':
        return <Bookmark className="w-6 h-6 text-primary" />;
      default:
        return <Lock className="w-6 h-6 text-primary" />;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={closeAuthModal}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div
        className="relative w-full max-w-md bg-[#131318] rounded-2xl border border-white/10 shadow-2xl p-6 sm:p-7 overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle decorative top accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary-accent" />

        {/* Close Button */}
        <button
          type="button"
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-muted hover:text-dark hover:bg-slate-hover transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon & Title */}
        <div className="flex flex-col items-center text-center mt-2">
          <div className="w-14 h-14 rounded-2xl bg-primary-light border border-orange-200 flex items-center justify-center shadow-xs mb-4">
            {getContextIcon()}
          </div>

          <h2
            id="auth-modal-title"
            className="text-xl sm:text-2xl font-bold font-heading text-dark tracking-tight"
          >
            {title}
          </h2>

          <p className="text-xs sm:text-sm text-slate-body mt-1.5 max-w-sm leading-relaxed">
            {subtitle}
          </p>

          {contextMessage && (
            <div className="mt-3.5 px-3.5 py-2 rounded-xl bg-slate-bg border border-border text-xs font-semibold text-primary text-center w-full">
              {contextMessage}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 space-y-3">
          <button
            type="button"
            onClick={handleLogin}
            className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-semibold shadow-xs hover:shadow-sm active:scale-[0.98] transition-all cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>Login to Continue</span>
          </button>

          <button
            type="button"
            onClick={handleSignup}
            className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-white hover:bg-slate-hover text-dark text-sm font-semibold border border-border hover:border-slate-300 active:scale-[0.98] transition-all cursor-pointer shadow-xs"
          >
            <UserPlus className="w-4 h-4 text-slate-muted" />
            <span>Create Free Account</span>
          </button>

          <button
            type="button"
            onClick={closeAuthModal}
            className="w-full py-2 text-xs font-medium text-slate-muted hover:text-dark transition-colors cursor-pointer"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
};
