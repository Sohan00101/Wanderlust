import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const listingApi = {
  getAll: (params = {}) => api.get('/listings', { params }),
  getById: (id) => api.get(`/listings/${id}`),
  create: (data) => {
    // If data is FormData, let browser set Content-Type
    const config = data instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
    return api.post('/listings', data, config);
  },
  update: (id, data) => {
    const config = data instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
    return api.put(`/listings/${id}`, data, config);
  },
  delete: (id) => api.delete(`/listings/${id}`),
};

export const reviewApi = {
  add: (listingId, data) => api.post(`/listings/${listingId}/reviews`, data),
  delete: (listingId, reviewId) => api.delete(`/listings/${listingId}/reviews/${reviewId}`),
};

export const authApi = {
  getCurrentUser: () => api.get('/users/current'),
  login: (credentials) => api.post('/users/login', credentials),
  signup: (userData) => api.post('/users/signup', userData),
  logout: () => api.post('/users/logout'),
};

export default api;
