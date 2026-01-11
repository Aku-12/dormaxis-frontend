import { create } from 'zustand';
import { homeAPI } from '../api';

const useHomeStore = create((set) => ({
  // State
  stats: {
    students: 0,
    dorms: 0,
    rating: 0,
  },
  popularDorms: [],
  loading: false,
  error: null,

  // Actions
  fetchHomePageData: async () => {
    set({ loading: true, error: null });
    try {
      const response = await homeAPI.getHomePageData();
      if (response.success) {
        set({
          stats: response.data.stats,
          popularDorms: response.data.popularDorms,
          loading: false,
        });
      } else {
        set({ error: 'Failed to fetch data', loading: false });
      }
    } catch (error) {
      set({
        error: error.response?.data?.error || error.message || 'An error occurred',
        loading: false,
      });
    }
  },

  fetchStats: async () => {
    try {
      const response = await homeAPI.getStats();
      if (response.success) {
        set({ stats: response.data });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  },

  fetchPopularDorms: async () => {
    set({ loading: true, error: null });
    try {
      const response = await homeAPI.getPopularDorms();
      if (response.success) {
        set({ popularDorms: response.data, loading: false });
      }
    } catch (error) {
      set({
        error: error.response?.data?.error || error.message || 'An error occurred',
        loading: false,
      });
    }
  },

  // Reset state
  resetHomeStore: () => {
    set({
      stats: { students: 0, dorms: 0, rating: 0 },
      popularDorms: [],
      loading: false,
      error: null,
    });
  },
}));

export default useHomeStore;
