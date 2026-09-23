import api from './api';

export const adminService = {
  async getStats() {
    const res = await api.get('/admin/stats');
    return res.data;
  },

  async getUsers(params = {}) {
    const res = await api.get('/admin/users', { params });
    return res.data;
  },

  async updateUserRole(id, role) {
    const res = await api.put(`/admin/users/${id}/role`, { role });
    return res.data;
  },

  async toggleUserStatus(id, isActive) {
    const res = await api.put(`/admin/users/${id}/status`, { isActive });
    return res.data;
  },

  async createTbi(data) {
    const res = await api.post('/tbis', data);
    return res.data;
  },

  async updateTbi(id, data) {
    const res = await api.put(`/tbis/${id}`, data);
    return res.data;
  },

  async deleteTbi(id) {
    const res = await api.delete(`/tbis/${id}`);
    return res.data;
  },

  async importDataset(formData) {
    const res = await api.post('/admin/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return res.data;
  },

  async updateSuggestion(id, status, createTbiRecord = false) {
    const res = await api.put(`/suggestions/${id}`, { status, createTbiRecord });
    return res.data;
  }
};
