import axiosClient from './axios.client';
import { API_ENDPOINTS } from '../config/api.config';

export const dormsAPI = {
  /**
   * Get all dorms with optional filters
   * @param {Object} filters - Filter parameters
   * @returns {Promise} Response with dorms array and pagination info
   */
  getAllDorms: async (filters = {}) => {
    const response = await axiosClient.get(API_ENDPOINTS.DORMS, { params: filters });
    return response.data;
  },

  /**
   * Get filter options (blocks, types, beds, amenities)
   * @returns {Promise} Response with filter options
   */
  getFilterOptions: async () => {
    const response = await axiosClient.get(API_ENDPOINTS.DORMS_FILTERS);
    return response.data;
  },

  /**
   * Get single dorm by ID
   * @param {string} id - Dorm ID
   * @returns {Promise} Response with dorm data
   */
  getDormById: async (id) => {
    const response = await axiosClient.get(API_ENDPOINTS.DORM_BY_ID(id));
    return response.data;
  },

  /**
   * Create new dorm
   * @param {Object} dormData - Dorm data
   * @returns {Promise} Response with created dorm
   */
  createDorm: async (dormData) => {
    const response = await axiosClient.post(API_ENDPOINTS.DORMS, dormData);
    return response.data;
  },

  /**
   * Update dorm
   * @param {string} id - Dorm ID
   * @param {Object} dormData - Updated dorm data
   * @returns {Promise} Response with updated dorm
   */
  updateDorm: async (id, dormData) => {
    const response = await axiosClient.put(API_ENDPOINTS.DORM_BY_ID(id), dormData);
    return response.data;
  },

  /**
   * Delete dorm
   * @param {string} id - Dorm ID
   * @returns {Promise} Response with success message
   */
  deleteDorm: async (id) => {
    const response = await axiosClient.delete(API_ENDPOINTS.DORM_BY_ID(id));
    return response.data;
  },
};

export const wishlistAPI = {
  /**
   * Get user's wishlist
   * @returns {Promise} Response with wishlist dorms
   */
  getWishlist: async () => {
    const response = await axiosClient.get(API_ENDPOINTS.WISHLIST);
    return response.data;
  },

  /**
   * Add dorm to wishlist
   * @param {string} dormId - Dorm ID
   * @returns {Promise} Response with success message
   */
  addToWishlist: async (dormId) => {
    const response = await axiosClient.post(API_ENDPOINTS.WISHLIST_ADD(dormId));
    return response.data;
  },

  /**
   * Remove dorm from wishlist
   * @param {string} dormId - Dorm ID
   * @returns {Promise} Response with success message
   */
  removeFromWishlist: async (dormId) => {
    const response = await axiosClient.delete(API_ENDPOINTS.WISHLIST_REMOVE(dormId));
    return response.data;
  },

  /**
   * Check if dorm is in wishlist
   * @param {string} dormId - Dorm ID
   * @returns {Promise} Response with isInWishlist boolean
   */
  checkWishlist: async (dormId) => {
    const response = await axiosClient.get(API_ENDPOINTS.WISHLIST_CHECK(dormId));
    return response.data;
  },
};
