import axiosClient from './axios.client';
import { API_ENDPOINTS } from '../config/api.config';

export const authAPI = {
  /**
   * Register new user
   * @param {Object} userData - User registration data
   * @returns {Promise} Response with user data
   */
  register: async (userData) => {
    const response = await axiosClient.post(API_ENDPOINTS.AUTH_REGISTER, userData);
    return response.data;
  },

  /**
   * Login user
   * @param {Object} credentials - Email and password
   * @returns {Promise} Response with user data and token
   */
  login: async (credentials) => {
    const response = await axiosClient.post(API_ENDPOINTS.AUTH_LOGIN, credentials);
    return response.data;
  },

  /**
   * Get user profile
   * @param {string} userId - User ID
   * @returns {Promise} Response with user profile
   */
  getProfile: async (userId) => {
    const response = await axiosClient.get(API_ENDPOINTS.AUTH_PROFILE, {
      params: { userId }
    });
    return response.data;
  },

  /**
   * Logout user
   * @returns {Promise} Response with success message
   */
  logout: async () => {
    const response = await axiosClient.post(API_ENDPOINTS.AUTH_LOGOUT);
    return response.data;
  },
};
