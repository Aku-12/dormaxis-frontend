import { create } from 'zustand';
import { dormsAPI } from '../api';

const useDormStore = create((set) => ({
  // State
  dorms: [],
  currentDorm: null,
  filters: {},
  loading: false,
  error: null,

  // Actions
  fetchAllDorms: async (filters = {}) => {
    set({ loading: true, error: null, filters });
    try {
      const response = await dormsAPI.getAllDorms(filters);
      if (response.success) {
        set({ dorms: response.data, loading: false });
      } else {
        set({ error: 'Failed to fetch dorms', loading: false });
      }
    } catch (error) {
      set({
        error: error.response?.data?.error || error.message || 'An error occurred',
        loading: false,
      });
    }
  },

  fetchDormById: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await dormsAPI.getDormById(id);
      if (response.success) {
        set({ currentDorm: response.data, loading: false });
      } else {
        set({ error: 'Failed to fetch dorm', loading: false });
      }
    } catch (error) {
      set({
        error: error.response?.data?.error || error.message || 'An error occurred',
        loading: false,
      });
    }
  },

  createDorm: async (dormData) => {
    set({ loading: true, error: null });
    try {
      const response = await dormsAPI.createDorm(dormData);
      if (response.success) {
        set((state) => ({
          dorms: [...state.dorms, response.data],
          loading: false,
        }));
        return response.data;
      } else {
        set({ error: 'Failed to create dorm', loading: false });
        return null;
      }
    } catch (error) {
      set({
        error: error.response?.data?.error || error.message || 'An error occurred',
        loading: false,
      });
      return null;
    }
  },

  updateDorm: async (id, dormData) => {
    set({ loading: true, error: null });
    try {
      const response = await dormsAPI.updateDorm(id, dormData);
      if (response.success) {
        set((state) => ({
          dorms: state.dorms.map((dorm) =>
            dorm._id === id ? response.data : dorm
          ),
          currentDorm: response.data,
          loading: false,
        }));
        return response.data;
      } else {
        set({ error: 'Failed to update dorm', loading: false });
        return null;
      }
    } catch (error) {
      set({
        error: error.response?.data?.error || error.message || 'An error occurred',
        loading: false,
      });
      return null;
    }
  },

  deleteDorm: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await dormsAPI.deleteDorm(id);
      if (response.success) {
        set((state) => ({
          dorms: state.dorms.filter((dorm) => dorm._id !== id),
          loading: false,
        }));
        return true;
      } else {
        set({ error: 'Failed to delete dorm', loading: false });
        return false;
      }
    } catch (error) {
      set({
        error: error.response?.data?.error || error.message || 'An error occurred',
        loading: false,
      });
      return false;
    }
  },

  // Update filters
  setFilters: (filters) => {
    set({ filters });
  },

  // Clear current dorm
  clearCurrentDorm: () => {
    set({ currentDorm: null });
  },

  // Reset store
  resetDormStore: () => {
    set({
      dorms: [],
      currentDorm: null,
      filters: {},
      loading: false,
      error: null,
    });
  },
}));

export default useDormStore;
