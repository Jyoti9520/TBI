import api from './api';

export const investorService = {
  // Public directory with filtering & search
  async getInvestors(params = {}) {
    const res = await api.get('/investors', { params });
    return res.data;
  },

  // Single investor profile
  async getInvestorById(id) {
    const res = await api.get(`/investors/${id}`);
    return res.data;
  },

  // Filter metadata (sectors, stages, geographies, types)
  async getInvestorMeta() {
    const res = await api.get('/investors/meta');
    return res.data;
  },

  // Bookmark / Save investor
  async saveInvestor(id) {
    const res = await api.post(`/investors/${id}/save`);
    return res.data;
  },

  // Unsave investor
  async unsaveInvestor(id) {
    const res = await api.delete(`/investors/${id}/save`);
    return res.data;
  },

  // Get current user's saved investors
  async getSavedInvestors() {
    const res = await api.get('/investors/user/saved');
    return res.data;
  },

  // Admin: Create investor
  async createInvestor(data) {
    const res = await api.post('/investors', data);
    return res.data;
  },

  // Admin: Update investor
  async updateInvestor(id, data) {
    const res = await api.put(`/investors/${id}`, data);
    return res.data;
  },

  // Admin: Delete/Archive investor
  async deleteInvestor(id) {
    const res = await api.delete(`/investors/${id}`);
    return res.data;
  }
};
