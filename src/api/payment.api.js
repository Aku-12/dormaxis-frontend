import axiosClient from './axios.client';
import { API_ENDPOINTS } from '../config/api.config';

export const paymentAPI = {
  // ============================================
  // ESEWA PAYMENT METHODS
  // ============================================

  /**
   * Initiate eSewa payment
   * @param {string} bookingId - Booking ID
   * @returns {Promise} Response with payment URL and form data
   */
  initiateEsewaPayment: async (bookingId) => {
    const response = await axiosClient.post(API_ENDPOINTS.PAYMENT_ESEWA_INITIATE, { bookingId });
    return response.data;
  },

  /**
   * Verify eSewa payment after redirect
   * @param {string} data - Base64 encoded response from eSewa
   * @param {string} bookingId - Booking ID
   * @returns {Promise} Response with verification result
   */
  verifyEsewaPayment: async (data, bookingId) => {
    const response = await axiosClient.post(API_ENDPOINTS.PAYMENT_ESEWA_VERIFY, { data, bookingId });
    return response.data;
  },

  /**
   * Check eSewa payment status
   * @param {string} bookingId - Booking ID
   * @returns {Promise} Response with payment status
   */
  checkEsewaPaymentStatus: async (bookingId) => {
    const response = await axiosClient.get(API_ENDPOINTS.PAYMENT_ESEWA_STATUS(bookingId));
    return response.data;
  },

  /**
   * Report eSewa payment failure
   * @param {string} bookingId - Booking ID
   * @returns {Promise} Response
   */
  reportEsewaPaymentFailure: async (bookingId) => {
    const response = await axiosClient.post(API_ENDPOINTS.PAYMENT_ESEWA_FAILURE, { bookingId });
    return response.data;
  },

  // ============================================
  // KHALTI PAYMENT METHODS
  // ============================================

  /**
   * Initiate Khalti payment
   * @param {string} bookingId - Booking ID
   * @returns {Promise} Response with payment URL
   */
  initiateKhaltiPayment: async (bookingId) => {
    const response = await axiosClient.post(API_ENDPOINTS.PAYMENT_KHALTI_INITIATE, { bookingId });
    return response.data;
  },

  /**
   * Verify Khalti payment after redirect
   * @param {Object} params - Callback parameters from Khalti
   * @returns {Promise} Response with verification result
   */
  verifyKhaltiPayment: async (params) => {
    const response = await axiosClient.post(API_ENDPOINTS.PAYMENT_KHALTI_VERIFY, params);
    return response.data;
  },

  /**
   * Check Khalti payment status
   * @param {string} bookingId - Booking ID
   * @returns {Promise} Response with payment status
   */
  checkKhaltiPaymentStatus: async (bookingId) => {
    const response = await axiosClient.get(API_ENDPOINTS.PAYMENT_KHALTI_STATUS(bookingId));
    return response.data;
  },

  // ============================================
  // COMMON METHODS
  // ============================================

  /**
   * Get payment details for a booking
   * @param {string} bookingId - Booking ID
   * @returns {Promise} Response with payment details
   */
  getPaymentDetails: async (bookingId) => {
    const response = await axiosClient.get(API_ENDPOINTS.PAYMENT_DETAILS(bookingId));
    return response.data;
  }
};
