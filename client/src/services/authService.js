import api from './api';

export const authService = {
  async register(data) {
    const res = await api.post('/auth/register', data);
    if (res.data?.data?.token) {
      localStorage.setItem('tbi_token', res.data.data.token);
      localStorage.setItem('tbi_user', JSON.stringify(res.data.data));
    }
    return res.data;
  },

  async login(credentials) {
    const res = await api.post('/auth/login', credentials);
    if (res.data?.data?.token) {
      localStorage.setItem('tbi_token', res.data.data.token);
      localStorage.setItem('tbi_user', JSON.stringify(res.data.data));
    }
    return res.data;
  },

  async googleLogin(googleData) {
    const res = await api.post('/auth/google', googleData);
    if (res.data?.data?.token) {
      localStorage.setItem('tbi_token', res.data.data.token);
      localStorage.setItem('tbi_user', JSON.stringify(res.data.data));
    }
    return res.data;
  },

  async getMe() {
    const res = await api.get('/auth/me');
    return res.data;
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } catch (_) {}
    localStorage.removeItem('tbi_token');
    localStorage.removeItem('tbi_user');
  },

  getCurrentUser() {
    const saved = localStorage.getItem('tbi_user');
    return saved ? JSON.parse(saved) : null;
  },

  getToken() {
    return localStorage.getItem('tbi_token');
  }
};
