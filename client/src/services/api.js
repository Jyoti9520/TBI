import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('tbi_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle unauthenticated 401s
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Don't auto-redirect or prompt if checking /api/auth/me during boot
      if (!error.config.url.includes('/auth/me')) {
        localStorage.removeItem('tbi_token');
        localStorage.removeItem('tbi_user');
        window.dispatchEvent(
          new CustomEvent('auth-required', {
            detail: {
              title: 'Session Expired',
              subtitle: 'Your session has ended or requires login to continue.',
              context: 'session'
            }
          })
        );
      }
    }
    return Promise.reject(error);
  }
);

export default api;
