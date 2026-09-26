import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = authService.getToken();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await authService.getMe();
        if (res.success && res.data) {
          setUser(res.data);
          localStorage.setItem('tbi_user', JSON.stringify(res.data));
        } else {
          setUser(null);
        }
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    const res = await authService.login(credentials);
    if (res.success && res.data) {
      setUser(res.data);
    }
    return res;
  };

  const googleLogin = async (googleData) => {
    const res = await authService.googleLogin(googleData);
    if (res.success && res.data) {
      setUser(res.data);
    }
    return res;
  };

  const register = async (data) => {
    const res = await authService.register(data);
    if (res.success && res.data) {
      setUser(res.data);
    }
    return res;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const updateUser = (updated) => {
    setUser(prev => ({ ...prev, ...updated }));
  };

  const [authModal, setAuthModal] = useState({ isOpen: false });

  const openAuthModal = (options = {}) => {
    setAuthModal({
      isOpen: true,
      title: options.title || 'Login to continue',
      subtitle: options.subtitle || 'Create an account or login to access this feature and keep your TBI discoveries saved.',
      contextMessage: options.contextMessage || '',
      context: options.context || 'general',
      returnPath: options.returnPath || (window.location.pathname + window.location.search),
      onSuccess: options.onSuccess || null
    });
  };

  const closeAuthModal = () => {
    setAuthModal({ isOpen: false });
  };

  const requireAuth = (callback, options = {}) => {
    if (user) {
      if (typeof callback === 'function') {
        callback();
      }
      return true;
    }
    openAuthModal({
      ...options,
      onSuccess: callback
    });
    return false;
  };

  useEffect(() => {
    const handleAuthRequiredEvent = (e) => {
      openAuthModal(e.detail || {});
    };
    window.addEventListener('auth-required', handleAuthRequiredEvent);
    return () => window.removeEventListener('auth-required', handleAuthRequiredEvent);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'ADMIN',
        authModal,
        openAuthModal,
        closeAuthModal,
        requireAuth,
        login,
        googleLogin,
        register,
        logout,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
