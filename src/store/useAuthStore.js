import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authAPI } from '../api';
import axiosClient from '../api/axios.client';

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,
      // MFA state
      mfaRequired: false,
      mfaTempToken: null,
      mfaMethod: null,

      // Actions
      login: async (credentials) => {
        set({ loading: true, error: null, mfaRequired: false });
        try {
          const response = await authAPI.login(credentials);
          
          // Check if MFA is required
          if (response.mfaRequired) {
            set({
              mfaRequired: true,
              mfaTempToken: response.data.tempToken,
              mfaMethod: response.data.mfaMethod || 'totp',
              loading: false,
            });
            return { success: true, mfaRequired: true };
          }

          if (response.success) {
            set({
              user: response.data.user,
              token: response.data.token,
              isAuthenticated: true,
              loading: false,
              mfaRequired: false,
              mfaTempToken: null,
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

      // Verify MFA token
      verifyMFA: async (mfaToken) => {
        set({ loading: true, error: null });
        const { mfaTempToken } = get();
        
        try {
          const response = await axiosClient.post('/mfa/verify', {
            tempToken: mfaTempToken,
            mfaToken,
          });

          if (response.data.success) {
            set({
              user: response.data.data.user,
              token: response.data.data.token,
              isAuthenticated: true,
              loading: false,
              mfaRequired: false,
              mfaTempToken: null,
            });
            return { success: true };
          } else {
            set({ error: response.data.error || 'Invalid MFA code', loading: false });
            return { success: false, error: response.data.error };
          }
        } catch (error) {
          const errorMessage = error.response?.data?.error || 'Invalid MFA code';
          set({ error: errorMessage, loading: false });
          return { success: false, error: errorMessage };
        }
      },

      // Use backup code
      useBackupCode: async (backupCode) => {
        set({ loading: true, error: null });
        const { mfaTempToken } = get();
        
        try {
          const response = await axiosClient.post('/mfa/use-backup', {
            tempToken: mfaTempToken,
            backupCode,
          });

          if (response.data.success) {
            set({
              user: response.data.data.user,
              token: response.data.data.token,
              isAuthenticated: true,
              loading: false,
              mfaRequired: false,
              mfaTempToken: null,
            });
            return { 
              success: true, 
              remainingCodes: response.data.data.remainingBackupCodes 
            };
          } else {
            set({ error: response.data.error || 'Invalid backup code', loading: false });
            return { success: false, error: response.data.error };
          }
        } catch (error) {
          const errorMessage = error.response?.data?.error || 'Invalid backup code';
          set({ error: errorMessage, loading: false });
          return { success: false, error: errorMessage };
        }
      },

      // Cancel MFA
      cancelMFA: () => {
        set({
          mfaRequired: false,
          mfaTempToken: null,
          mfaMethod: null,
          error: null,
        });
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
            mfaRequired: false,
            mfaTempToken: null,
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

