import axiosClient from './axios.client';

export const notificationAPI = {
  /**
   * Get all notifications for the logged-in user
   * @param {Object} params - Query params (page, limit)
   * @returns {Promise} Response with notifications
   */
  getNotifications: async (params = {}) => {
    const response = await axiosClient.get('/notifications', { params });
    return response.data;
  },

  /**
   * Get unread notification count
   * @returns {Promise} Response with unread count
   */
  getUnreadCount: async () => {
    const response = await axiosClient.get('/notifications/unread-count');
    return response.data;
  },

  /**
   * Mark a notification as read
   * @param {string} id - Notification ID
   * @returns {Promise} Response with updated notification
   */
  markAsRead: async (id) => {
    const response = await axiosClient.put(`/notifications/${id}/read`);
    return response.data;
  },

  /**
   * Mark all notifications as read
   * @returns {Promise} Response with success message
   */
  markAllAsRead: async () => {
    const response = await axiosClient.put('/notifications/read-all');
    return response.data;
  },

  /**
   * Delete a notification
   * @param {string} id - Notification ID
   * @returns {Promise} Response with success message
   */
  deleteNotification: async (id) => {
    const response = await axiosClient.delete(`/notifications/${id}`);
    return response.data;
  }
};
