import api from './api';

export const tbiService = {
  async getTbis(params = {}) {
    const res = await api.get('/tbis', { params });
    return res.data;
  },

  async getTbiById(id) {
    const res = await api.get(`/tbis/${id}`);
    return res.data;
  },

  async searchTbis(params = {}) {
    const res = await api.get('/tbis/search', { params });
    return res.data;
  },

  async getSuggestions(q) {
    const res = await api.get('/tbis/suggestions', { params: { q } });
    return res.data;
  },

  async getNearbyTbis(params = {}) {
    const res = await api.get('/tbis/nearby', { params });
    return res.data;
  },

  async getUniversities(params = {}) {
    const res = await api.get('/universities', { params });
    return res.data;
  },

  async getUniversityTbis(universityName) {
    const res = await api.get(`/universities/${encodeURIComponent(universityName)}/tbis`);
    return res.data;
  },

  async getCategories(params = {}) {
    const res = await api.get('/categories', { params });
    return res.data;
  },

  async getCategoryTbis(category, type) {
    const res = await api.get(`/categories/${encodeURIComponent(category)}`, {
      params: { type }
    });
    return res.data;
  },

  async submitSuggestion(data) {
    const res = await api.post('/suggestions', data);
    return res.data;
  },

  async getSuggestionsList() {
    const res = await api.get('/suggestions');
    return res.data;
  }
};
