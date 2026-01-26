import axiosClient from './axios.client';
import { API_ENDPOINTS } from '../config/api.config';

const adminApi = {
  // Dashboard stats
  getDashboardStats: async () => {
    const response = await axiosClient.get(`${API_ENDPOINTS.ADMIN}/stats`);
    return response.data;
  },

  // Dorms management
  getAllDorms: async (page = 1, limit = 10) => {
    const response = await axiosClient.get(`${API_ENDPOINTS.ADMIN}/dorms?page=${page}&limit=${limit}`);
    return response.data;
  },

  getDormById: async (id) => {
    const response = await axiosClient.get(`${API_ENDPOINTS.ADMIN}/dorms/${id}`);
    return response.data;
  },

  createDorm: async (dormData) => {
    const response = await axiosClient.post(`${API_ENDPOINTS.ADMIN}/dorms`, dormData);
    return response.data;
  },

  updateDorm: async (id, dormData) => {
    const response = await axiosClient.put(`${API_ENDPOINTS.ADMIN}/dorms/${id}`, dormData);
    return response.data;
  },

  deleteDorm: async (id) => {
    const response = await axiosClient.delete(`${API_ENDPOINTS.ADMIN}/dorms/${id}`);
    return response.data;
  },

  uploadDormImages: async (files) => {
    const formData = new FormData();
    // Append each file to 'images' field
    Array.from(files).forEach(file => {
      formData.append('images', file);
    });
    
    const response = await axiosClient.post(`${API_ENDPOINTS.ADMIN}/dorms/upload-image`, formData);
    return response.data;
  },

  // Users management
  getAllUsers: async (page = 1, limit = 10) => {
    const response = await axiosClient.get(`${API_ENDPOINTS.ADMIN}/users?page=${page}&limit=${limit}`);
    return response.data;
  },

  getUserById: async (id) => {
    const response = await axiosClient.get(`${API_ENDPOINTS.ADMIN}/users/${id}`);
    return response.data;
  },

  updateUser: async (id, userData) => {
    const response = await axiosClient.put(`${API_ENDPOINTS.ADMIN}/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await axiosClient.delete(`${API_ENDPOINTS.ADMIN}/users/${id}`);
    return response.data;
  },

  // Bookings management
  getAllBookings: async (page = 1, limit = 10, status = '') => {
    let url = `${API_ENDPOINTS.BOOKINGS}/admin/all?page=${page}&limit=${limit}`;
    if (status) url += `&status=${status}`;
    const response = await axiosClient.get(url);
    return response.data;
  },

  updateBookingStatus: async (id, status) => {
    const response = await axiosClient.put(`${API_ENDPOINTS.BOOKINGS}/admin/${id}/status`, { status });
    return response.data;
  },

  // Audit logs management
  getAuditLogs: async (page = 1, limit = 20, filters = {}) => {
    let url = `${API_ENDPOINTS.ADMIN}/audit-logs?page=${page}&limit=${limit}`;
    if (filters.action) url += `&action=${filters.action}`;
    if (filters.targetType) url += `&targetType=${filters.targetType}`;
    if (filters.startDate) url += `&startDate=${filters.startDate}`;
    if (filters.endDate) url += `&endDate=${filters.endDate}`;
    if (filters.search) url += `&search=${encodeURIComponent(filters.search)}`;
    const response = await axiosClient.get(url);
    return response.data;
  },

  getAuditLogById: async (id) => {
    const response = await axiosClient.get(`${API_ENDPOINTS.ADMIN}/audit-logs/${id}`);
    return response.data;
  }
};

export default adminApi;
