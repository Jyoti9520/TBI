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
        return <Bookmark className="w-6 h-6 text-[#7A0B1A]" />;
      case 'compare':
        return <GitCompare className="w-6 h-6 text-[#7A0B1A]" />;
      case 'suggest':
        return <PlusCircle className="w-6 h-6 text-[#7A0B1A]" />;
      case 'settings':
        return <Settings className="w-6 h-6 text-[#7A0B1A]" />;
      case 'nearby':
        return <MapPin className="w-6 h-6 text-[#7A0B1A]" />;
      case 'saved':
        return <Bookmark className="w-6 h-6 text-[#7A0B1A]" />;
      default:
        return <Lock className="w-6 h-6 text-[#7A0B1A]" />;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={closeAuthModal}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div
        className="relative w-full max-w-md bg-white rounded-2xl border border-[#D9CAB3] shadow-2xl p-6 sm:p-7 overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle decorative top accent line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#7A0B1A] via-[#D99A2B] to-[#7A0B1A]" />

        {/* Close Button */}
        <button
          type="button"
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-[#243447] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon & Title */}
        <div className="flex flex-col items-center text-center mt-2">
          <div className="w-14 h-14 rounded-2xl bg-[#FAF7F2] border border-[#D9CAB3] flex items-center justify-center shadow-xs mb-4">
            {getContextIcon()}
          </div>

          <h2
            id="auth-modal-title"
            className="text-xl sm:text-2xl font-extrabold text-[#7A0B1A] tracking-tight"
          >
            {title}
          </h2>

          <p className="text-xs sm:text-sm text-[#647C98] mt-1.5 max-w-sm leading-relaxed">
            {subtitle}
          </p>

          {contextMessage && (
            <div className="mt-3.5 px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#D9CAB3]/70 text-xs font-semibold text-[#7A0B1A] text-center w-full">
              {contextMessage}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 space-y-3">
          <button
            type="button"
            onClick={handleLogin}
            className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-[#7A0B1A] hover:bg-[#5B0712] text-white text-sm font-bold shadow-xs hover:shadow-sm active:scale-[0.98] transition-all cursor-pointer border border-[#7A0B1A]"
          >
            <LogIn className="w-4 h-4" />
            <span>Login to Continue</span>
          </button>

          <button
            type="button"
            onClick={handleSignup}
            className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-[#FAF7F2] hover:bg-white text-[#7A0B1A] text-sm font-bold border border-[#D9CAB3] hover:border-[#7A0B1A] active:scale-[0.98] transition-all cursor-pointer shadow-2xs"
          >
            <UserPlus className="w-4 h-4" />
            <span>Create Free Account</span>
          </button>

          <button
            type="button"
            onClick={closeAuthModal}
            className="w-full py-2 text-xs font-semibold text-[#647C98] hover:text-[#243447] transition-colors cursor-pointer"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
};
