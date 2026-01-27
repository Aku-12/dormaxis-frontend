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
      login: async (credentials, recaptchaToken = null) => {
        console.log('--- useAuthStore: login action ---');
        set({ loading: true, error: null, mfaRequired: false });
        try {
          const response = await authAPI.login(credentials, recaptchaToken);
          console.log('Auth API login response:', response);
          
          // Check if MFA is required
          if (response.mfaRequired) {
            console.log('MFA required, setting temp token:', response.data.tempToken);
            set({
              mfaRequired: true,
              mfaTempToken: response.data.tempToken,
              mfaMethod: response.data.mfaMethod || 'totp',
              loading: false,
            });
            return { success: true, mfaRequired: true };
          }

          if (response.success) {
            console.log('Login success, user:', response.data.user);
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
            console.warn('Login failed in store:', response.error);
            set({ error: response.error || 'Login failed', loading: false });
            return { success: false, error: response.error };
          }
        } catch (error) {
          console.error('Login action error:', error);
          const errorMessage = error.response?.data?.error || error.message || 'Login failed';
          set({ error: errorMessage, loading: false });
          return { success: false, error: errorMessage };
        }
      },

      // Verify MFA token
      verifyMFA: async (mfaToken) => {
        console.log('--- useAuthStore: verifyMFA action ---');
        set({ loading: true, error: null });
        const { mfaTempToken } = get();
        console.log('Using temp token for MFA verification:', mfaTempToken);
        
        try {
          const response = await axiosClient.post('/mfa/verify', {
            tempToken: mfaTempToken,
            mfaToken,
          });
          console.log('MFA verify API response:', response.data);

          if (response.data.success) {
            console.log('MFA verify success, user:', response.data.data.user);
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
            console.warn('MFA verify failed in store:', response.data.error);
            set({ error: response.data.error || 'Invalid MFA code', loading: false });
            return { success: false, error: response.data.error };
          }
        } catch (error) {
          console.error('MFA verify action error:', error);
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

      register: async (userData, recaptchaToken = null) => {
        set({ loading: true, error: null });
        try {
          const response = await authAPI.register(userData, recaptchaToken);
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

      googleLogin: async (token) => {
        set({ loading: true, error: null });
        try {
          const response = await authAPI.googleLogin(token);
          
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
            set({ error: response.error || 'Google login failed', loading: false });
            return { success: false, error: response.error };
          }
        } catch (error) {
          const errorMessage = error.response?.data?.error || error.message || 'Google login failed';
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

      getSessions: async () => {
        set({ loading: true, error: null });
        try {
          const response = await authAPI.getSessions();
          if (response.success) {
            set({ loading: false });
            return { success: true, data: response.data };
          } else {
            set({ error: 'Failed to fetch sessions', loading: false });
            return { success: false, error: response.error };
          }
        } catch (error) {
          const errorMessage = error.response?.data?.error || 'Failed to fetch sessions';
          set({ error: errorMessage, loading: false });
          return { success: false, error: errorMessage };
        }
      },

      revokeSession: async (sessionId) => {
        set({ loading: true, error: null });
        try {
          const response = await authAPI.revokeSession(sessionId);
          if (response.success) {
            set({ loading: false });
            return { success: true, message: response.message };
          } else {
            set({ error: 'Failed to revoke session', loading: false });
            return { success: false, error: response.error };
          }
        } catch (error) {
          const errorMessage = error.response?.data?.error || 'Failed to revoke session';
          set({ error: errorMessage, loading: false });
          return { success: false, error: errorMessage };
        }
      },

      revokeAllSessions: async () => {
        set({ loading: true, error: null });
        try {
          const response = await authAPI.revokeAllSessions();
          if (response.success) {
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              loading: false,
              mfaRequired: false,
              mfaTempToken: null,
            });
            return { success: true, message: response.message };
          } else {
            set({ error: 'Failed to revoke sessions', loading: false });
            return { success: false, error: response.error };
          }
        } catch (error) {
          const errorMessage = error.response?.data?.error || 'Failed to revoke sessions';
          set({ error: errorMessage, loading: false });
          return { success: false, error: errorMessage };
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

      updateUser: (userData) => {
        set({ user: { ...get().user, ...userData } });
      },

      setUser: (user) => {
        set({ user });
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

