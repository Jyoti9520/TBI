import api from './api';

export const fundingService = {
  // Public directory of grants and funding schemes
  async getFundingOpportunities(params = {}) {
    const res = await api.get('/funding', { params });
    return res.data;
  },

  // Single funding opportunity detail
  async getFundingOpportunityById(id) {
    const res = await api.get(`/funding/${id}`);
    return res.data;
  }
};
