import axiosClient from './axios.client';
import { API_ENDPOINTS } from '../config/api.config';

export const paymentAPI = {
  // ============================================
  // STRIPE PAYMENT METHODS
  // ============================================

  /**
   * Create Stripe Checkout Session
   * @param {Object} bookingData - Booking and payment details
   * @param {string} recaptchaToken - reCAPTCHA token (optional)
   * @returns {Promise} Response with session URL
   */
  createStripeCheckoutSession: async (bookingData, recaptchaToken = null) => {
    const payload = { ...bookingData };
    if (recaptchaToken) {
      payload.recaptchaToken = recaptchaToken;
    }
    const response = await axiosClient.post(API_ENDPOINTS.PAYMENT_CREATE_SESSION, payload);
    return response.data;
  },

  /**
   * Verify Stripe payment
   * @param {string} sessionId - Stripe session ID
   * @param {string} bookingId - Booking ID
   * @returns {Promise} Response with verification result
   */
  verifyStripePayment: async (sessionId, bookingId) => {
    const response = await axiosClient.post(API_ENDPOINTS.PAYMENT_VERIFY, { sessionId, bookingId });
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
