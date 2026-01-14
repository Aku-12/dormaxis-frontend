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
  }
};

export default adminApi;
