import axiosClient from './axios.client';
import { API_ENDPOINTS } from '../config/api.config';

export const mfaAPI = {
  /**
   * Get MFA status for current user
   * @returns {Promise} Response with MFA status
   */
  getStatus: async () => {
    const response = await axiosClient.get(API_ENDPOINTS.MFA_STATUS);
    return response.data;
  },

  /**
   * Start MFA setup - returns QR code and secret
   * @returns {Promise} Response with secret and QR code URL
   */
  setup: async () => {
    const response = await axiosClient.post(API_ENDPOINTS.MFA_SETUP);
    return response.data;
  },

  /**
   * Verify TOTP code and enable MFA
   * @param {string} token - 6-digit TOTP code
   * @returns {Promise} Response with backup codes
   */
  verifySetup: async (token) => {
    const response = await axiosClient.post(API_ENDPOINTS.MFA_VERIFY_SETUP, { token });
    return response.data;
  },

  /**
   * Verify MFA during login
   * @param {string} tempToken - Temporary token from login
   * @param {string} mfaToken - 6-digit TOTP code
   * @returns {Promise} Response with auth token
   */
  verify: async (tempToken, mfaToken) => {
    const response = await axiosClient.post(API_ENDPOINTS.MFA_VERIFY, { tempToken, mfaToken });
    return response.data;
  },

  /**
   * Use backup code during login
   * @param {string} tempToken - Temporary token from login
   * @param {string} backupCode - Backup code
   * @returns {Promise} Response with auth token
   */
  useBackupCode: async (tempToken, backupCode) => {
    const response = await axiosClient.post(API_ENDPOINTS.MFA_USE_BACKUP, { tempToken, backupCode });
    return response.data;
  },

  /**
   * Disable MFA
   * @param {string} password - User's password for verification
   * @returns {Promise} Response with success message
   */
  disable: async (password) => {
    const response = await axiosClient.post(API_ENDPOINTS.MFA_DISABLE, { password });
    return response.data;
  },

  /**
   * Regenerate backup codes
   * @param {string} password - User's password for verification
   * @returns {Promise} Response with new backup codes
   */
  regenerateBackupCodes: async (password) => {
    const response = await axiosClient.post(API_ENDPOINTS.MFA_BACKUP_CODES, { password });
    return response.data;
  },
};
