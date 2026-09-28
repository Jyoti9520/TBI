import api from './api';

export const schemeService = {
  async getSchemes(params = {}) {
    const res = await api.get('/schemes', { params });
    return res.data;
  },

  async matchEligibility(criteria) {
    const res = await api.post('/schemes/match', criteria);
    return res.data;
  },

  async getRoadmaps() {
    const res = await api.get('/schemes/roadmaps');
    return res.data;
  }
};
