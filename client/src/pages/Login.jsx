import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide both email and password');
      return;
    }

    setLoading(true);

    try {
      const res = await login({ email, password });
      if (res.success) {
        navigate(from, { replace: true });
      } else {
        setError(res.message || 'Login failed');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Invalid email or password. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-extrabold text-[#1F150C]">Welcome back</h2>
        <p className="text-xs text-slate-muted mt-1">
          Access your saved incubators and dashboard
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
              className="w-full pl-10 pr-3.5 py-2.5 bg-surface border border-slate-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#412D15]/20 focus:border-[#412D15]"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-muted">
              Password
            </label>
            <span className="text-xs text-[#412D15] hover:underline cursor-pointer">
              Forgot password?
            </span>
          </div>
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
              className="w-full pl-10 pr-10 py-2.5 bg-surface border border-slate-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#412D15]/20 focus:border-[#412D15]"
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

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 px-4 bg-[#1F150C] hover:bg-[#412D15] disabled:opacity-50 text-[#E1DCC9] font-semibold text-sm rounded-xl shadow-sm transition-colors mt-2 border border-[#000000]"
        >
          {loading ? 'Signing in...' : 'Login'}
        </button>
      </form>

      <div className="mt-6 text-center text-xs text-slate-muted border-t border-slate-100 pt-4">
        <span>Don't have an account? </span>
        <Link to="/signup" className="font-semibold text-[#412D15] hover:underline">
          Create account
        </Link>
      </div>

      <div className="mt-3 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-center text-[11px] text-slate-muted">
        <span className="font-bold text-slate">Demo Admin:</span> admin@tbiglobal.org | <span className="font-bold text-slate">Password:</span> Admin@12345
      </div>
    </div>
  );
};
