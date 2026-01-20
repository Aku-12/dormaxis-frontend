import axiosClient from './axios.client';
import { API_ENDPOINTS } from '../config/api.config';

export const bookingAPI = {
  /**
   * Get booking preview with pricing
   * @param {string} dormId - Dorm ID
   * @param {string} promoCode - Optional promo code
   * @returns {Promise} Response with pricing preview
   */
  getBookingPreview: async (dormId, promoCode = null) => {
    const params = { dormId };
    if (promoCode) params.promoCode = promoCode;
    const response = await axiosClient.get(API_ENDPOINTS.BOOKING_PREVIEW, { params });
    return response.data;
  },

  /**
   * Create a new booking
   * @param {Object} bookingData - Booking data
   * @returns {Promise} Response with created booking
   */
  createBooking: async (bookingData) => {
    const response = await axiosClient.post(API_ENDPOINTS.BOOKINGS, bookingData);
    return response.data;
  },

  /**
   * Get user's bookings
   * @param {Object} params - Query parameters (status, page, limit)
   * @returns {Promise} Response with bookings array
   */
  getUserBookings: async (params = {}) => {
    const response = await axiosClient.get(API_ENDPOINTS.BOOKINGS, { params });
    return response.data;
  },

  /**
   * Get single booking by ID
   * @param {string} id - Booking ID
   * @returns {Promise} Response with booking data
   */
  getBookingById: async (id) => {
    const response = await axiosClient.get(API_ENDPOINTS.BOOKING_BY_ID(id));
    return response.data;
  },

  /**
   * Cancel a booking
   * @param {string} id - Booking ID
   * @returns {Promise} Response with updated booking
   */
  cancelBooking: async (id) => {
    const response = await axiosClient.put(API_ENDPOINTS.BOOKING_CANCEL(id));
    return response.data;
  },

  /**
   * Validate a promo code
   * @param {string} code - Promo code
   * @param {number} amount - Booking amount
   * @returns {Promise} Response with promo details
   */
  validatePromoCode: async (code, amount) => {
    const response = await axiosClient.post(API_ENDPOINTS.BOOKING_VALIDATE_PROMO, { code, amount });
    return response.data;
  },

  // Admin methods
  /**
   * Get all bookings (admin)
   * @param {Object} params - Query parameters
   * @returns {Promise} Response with all bookings
   */
  getAllBookings: async (params = {}) => {
    const response = await axiosClient.get(API_ENDPOINTS.BOOKING_ADMIN_ALL, { params });
    return response.data;
  },

  /**
   * Update booking status (admin)
   * @param {string} id - Booking ID
   * @param {string} status - New status
   * @returns {Promise} Response with updated booking
   */
  updateBookingStatus: async (id, status) => {
    const response = await axiosClient.put(API_ENDPOINTS.BOOKING_ADMIN_STATUS(id), { status });
    return response.data;
  }
};
