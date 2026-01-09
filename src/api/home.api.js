import axiosClient from './axios.client';
import { API_ENDPOINTS } from '../config/api.config';

export const homeAPI = {
  /**
   * Get all home page data (stats + popular dorms)
   * @returns {Promise} Response with stats and popular dorms
   */
  getHomePageData: async () => {
    const response = await axiosClient.get(API_ENDPOINTS.HOME);
    return response.data;
  },

  /**
   * Get statistics only
   * @returns {Promise} Response with statistics
   */
  getStats: async () => {
    const response = await axiosClient.get(API_ENDPOINTS.HOME_STATS);
    return response.data;
  },

  /**
   * Get popular dorms only
   * @returns {Promise} Response with popular dorms
   */
  getPopularDorms: async () => {
    const response = await axiosClient.get(API_ENDPOINTS.HOME_POPULAR);
    return response.data;
  },
};
