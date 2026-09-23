import api from './api';

export const userService = {
  async getFavorites() {
    const res = await api.get('/users/favorites');
    return res.data;
  },

  async addFavorite(tbiId) {
    const res = await api.post(`/users/favorites/${tbiId}`);
    return res.data;
  },

  async removeFavorite(tbiId) {
    const res = await api.delete(`/users/favorites/${tbiId}`);
    return res.data;
  },

  async updateProfile(data) {
    const res = await api.put('/users/profile', data);
    return res.data;
  }
};
