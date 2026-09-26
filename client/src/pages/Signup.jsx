import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const { register, googleLogin } = useAuth();
  const navigate = useNavigate();
  const googleBtnRef = useRef(null);
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  // Handle successful Google token credential
  const handleGoogleCredentialResponse = async (response) => {
    setError('');
    setGoogleLoading(true);
    try {
      if (!response?.credential) {
        throw new Error('No credential token received from Google');
      }
      const res = await googleLogin({ credential: response.credential });
      if (res.success) {
        navigate('/dashboard', { replace: true });
      } else {
        setError(res.message || 'Google registration failed');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || 'Error signing up with Google. Please try again.'
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  const [gisButtonRendered, setGisButtonRendered] = useState(false);

  // Setup Google Identity Services
  useEffect(() => {
    let checkInterval = null;

    const setupGis = () => {
      if (window.google?.accounts?.id && clientId) {
        try {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: handleGoogleCredentialResponse,
            auto_select: false,
            cancel_on_tap_outside: true
          });

          if (googleBtnRef.current) {
            googleBtnRef.current.innerHTML = '';
            window.google.accounts.id.renderButton(googleBtnRef.current, {
              theme: 'outline',
              size: 'large',
              width: 340,
              text: 'signup_with',
              shape: 'rectangular',
              logo_alignment: 'left'
            });

            setTimeout(() => {
              if (googleBtnRef.current && googleBtnRef.current.children.length > 0) {
                setGisButtonRendered(true);
              }
            }, 300);
          }
          return true;
        } catch (err) {
          console.error('Failed to initialize Google Identity Services on signup:', err);
        }
      }
      return false;
    };

    if (!setupGis()) {
      checkInterval = setInterval(() => {
        if (setupGis()) {
          clearInterval(checkInterval);
        }
      }, 300);
    }

    return () => {
      if (checkInterval) clearInterval(checkInterval);
    };
  }, [clientId]);

  const handleCustomGoogleClick = () => {
    setError('');
    const isPlaceholder = !clientId || clientId.includes('<') || clientId.includes('>');
    if (isPlaceholder) {
      setError(
        'Google OAuth Client ID is currently a placeholder. Please replace <MY_GOOGLE_OAUTH_CLIENT_ID> in client/.env with your real Google Client ID from Google Cloud Console.'
      );
      return;
    }

    if (window.google?.accounts?.id) {
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed()) {
          setError(
            `Google prompt was not displayed (${notification.getNotDisplayedReason() || 'browser restriction'}). Ensure authorized origin is set.`
          );
        }
      });
    } else {
      setError('Google Sign-In is still initializing. Please wait a moment and try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Full name is required');
      return;
    }

    if (!email.trim()) {
      setError('Email address is required');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const res = await register({ name, email, password });
      if (res.success) {
        navigate('/dashboard', { replace: true });
      } else {
        setError(res.message || 'Registration failed');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Error creating account. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-extrabold text-[#7A0B1A]">Create your account</h2>
        <p className="text-xs text-slate-muted mt-1">
          Join TBI Nexus to discover and save innovation hubs
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-status-error text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-muted mb-1.5">
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-muted">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Jyoti Negi"
              className="w-full pl-10 pr-3.5 py-2.5 bg-surface border border-slate-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-muted mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-muted">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@domain.com"
              className="w-full pl-10 pr-3.5 py-2.5 bg-surface border border-slate-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-muted mb-1.5">
            Password (Min 8 characters)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-muted">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-10 py-2.5 bg-surface border border-slate-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-muted hover:text-slate"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-muted mb-1.5">
            Confirm Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-muted">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-3.5 py-2.5 bg-surface border border-slate-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 px-4 bg-[#7A0B1A] hover:bg-[#5B0712] disabled:opacity-50 text-[#D9CAB3] font-semibold text-sm rounded-xl shadow-sm transition-colors mt-2 border border-[#7A0B1A] cursor-pointer"
        >
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      <div className="mt-5">
        <div className="relative flex items-center justify-center my-4">
          <div className="border-t border-slate-200 w-full" />
          <span className="bg-surface px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Or
          </span>
          <div className="border-t border-slate-200 w-full" />
        </div>

        {/* Google Authentication Container */}
        <div className="w-full flex flex-col items-center justify-center min-h-[44px]">
          <div ref={googleBtnRef} className="w-full flex justify-center empty:hidden" />

          {googleLoading && (
            <div className="flex items-center space-x-2 mt-2 text-xs text-[#7A0B1A] font-semibold">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Verifying Google account...</span>
            </div>
          )}

          {!gisButtonRendered && (
            <button
              type="button"
              onClick={handleCustomGoogleClick}
              disabled={loading || googleLoading}
              className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 text-[#243447] font-semibold text-sm rounded-xl border border-slate-300 shadow-2xs hover:shadow-xs active:scale-[0.98] transition-all flex items-center justify-center space-x-2.5 cursor-pointer disabled:opacity-50"
            >
              {googleLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#7A0B1A]" />
                  <span>Connecting Google Account...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.15z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.27 21.36 7.35 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.94 0 12s.46 3.84 1.26 5.42l4.02-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.27 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      <div className="mt-5 text-center text-xs text-slate-muted border-t border-slate-100 pt-4">
        <span>Already have an account? </span>
        <Link to="/login" className="font-semibold text-[#5B0712] hover:underline">
          Login
        </Link>
      </div>
    </div>
  );
};
