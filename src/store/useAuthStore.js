import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authAPI } from '../api';

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      // Actions
      login: async (credentials) => {
        set({ loading: true, error: null });
        try {
          const response = await authAPI.login(credentials);
          if (response.success) {
            set({
              user: response.data.user,
              token: response.data.token,
              isAuthenticated: true,
              loading: false,
            });
            return { success: true };
          } else {
            set({ error: response.error || 'Login failed', loading: false });
            return { success: false, error: response.error };
          }
        } catch (error) {
          const errorMessage = error.response?.data?.error || error.message || 'Login failed';
          set({ error: errorMessage, loading: false });
          return { success: false, error: errorMessage };
        }
      },

      register: async (userData) => {
        set({ loading: true, error: null });
        try {
          const response = await authAPI.register(userData);
          if (response.success) {
            set({ loading: false });
            return { success: true, message: response.message };
          } else {
            set({ error: response.error || 'Registration failed', loading: false });
            return { success: false, error: response.error };
          }
        } catch (error) {
          const errorMessage = error.response?.data?.error || error.message || 'Registration failed';
          set({ error: errorMessage, loading: false });
          return { success: false, error: errorMessage };
        }
      },

      logout: async () => {
        try {
          await authAPI.logout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            error: null,
          });
        }
      },

      getProfile: async () => {
        const { user } = get();
        if (!user?._id) return;

        set({ loading: true, error: null });
        try {
          const response = await authAPI.getProfile(user._id);
          if (response.success) {
            set({ user: response.data, loading: false });
          } else {
            set({ error: response.error || 'Failed to get profile', loading: false });
          }
        } catch (error) {
          const errorMessage = error.response?.data?.error || error.message || 'Failed to get profile';
          set({ error: errorMessage, loading: false });
        }
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage', // localStorage key
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }), // Only persist these fields
    }
  )
);

export default useAuthStore;
