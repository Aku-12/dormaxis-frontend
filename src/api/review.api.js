import axiosClient from './axios.client';

export const reviewAPI = {
  // Get reviews for a dorm
  getReviewsByDormId: async (dormId, page = 1) => {
    const response = await axiosClient.get(`/reviews/${dormId}?page=${page}`);
    return response.data;
  },

  // Add a review
  addReview: async (dormId, data) => {
    const response = await axiosClient.post(`/reviews/${dormId}`, data);
    return response.data;
  },

  // Delete a review
  deleteReview: async (reviewId) => {
    const response = await axiosClient.delete(`/reviews/review/${reviewId}`);
    return response.data;
  }
};
