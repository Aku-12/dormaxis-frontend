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

  /**
   * Update user profile
   * @param {Object} profileData - Profile data to update
   * @returns {Promise} Response with updated user data
   */
  updateProfile: async (profileData) => {
    const response = await axiosClient.put(API_ENDPOINTS.AUTH_UPDATE_PROFILE, profileData);
    return response.data;
  },

  /**
   * Upload user avatar
   * @param {File} file - Image file to upload
   * @returns {Promise} Response with avatar URL
   */
  uploadAvatar: async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);

    // Don't set Content-Type header - let axios set it automatically with boundary
    const response = await axiosClient.post(API_ENDPOINTS.AUTH_UPLOAD_AVATAR, formData);
    return response.data;
  },

  /**
   * Delete user avatar
   * @returns {Promise} Response with success message
   */
  deleteAvatar: async () => {
    const response = await axiosClient.delete(API_ENDPOINTS.AUTH_DELETE_AVATAR);
    return response.data;
  },

  /**
   * Get active sessions
   * @returns {Promise} Response with list of active sessions
   */
  getSessions: async () => {
    const response = await axiosClient.get(API_ENDPOINTS.AUTH_SESSIONS);
    return response.data;
  },

  /**
   * Revoke a specific session
   * @param {string} sessionId - ID of session to revoke
   * @returns {Promise} Response with success message
   */
  revokeSession: async (sessionId) => {
    const response = await axiosClient.delete(`${API_ENDPOINTS.AUTH_SESSIONS}/${sessionId}`);
    return response.data;
  },

  /**
   * Revoke all other sessions
   * @returns {Promise} Response with success message
   */
  revokeAllSessions: async () => {
    const response = await axiosClient.delete(API_ENDPOINTS.AUTH_SESSIONS);
    return response.data;
  },

  /**
   * Change password
   * @param {Object} passwordData - Current and new password
   * @returns {Promise} Response with success message
   */
  changePassword: async (passwordData) => {
    const response = await axiosClient.post('/auth/change-password', passwordData);
    return response.data;
  },

  /**
   * Google Login
   * @param {string} token - Google ID Token
   * @returns {Promise} Response with user data and token
   */
  googleLogin: async (token) => {
    const response = await axiosClient.post('/auth/google', { token });
    return response.data;
  },

  /**
   * Delete user account
   * @param {string} password - Current password for verification (optional for Google users)
   * @returns {Promise} Response with success message
   */
  deleteAccount: async (password) => {
    const response = await axiosClient.delete('/auth/account', {
      data: { password }
    });
    return response.data;
  }
};
