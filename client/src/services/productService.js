import api from './api';

export const productService = {
  // Public
  getAll: (params = {}) => api.get('/products', { params }),
  getBySlug: (slug) => api.get(`/products/slug/${slug}`),

  // Admin
  getAllAdmin: (params = {}) => api.get('/products/admin/all', { params }),
  getById: (id) => api.get(`/products/admin/${id}`),

  create: (formData) =>
    api.post('/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),

  update: (id, formData) =>
    api.put(`/products/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),

  toggle: (id, field) => api.patch(`/products/${id}/toggle`, { field }),

  delete: (id) => api.delete(`/products/${id}`),
};
