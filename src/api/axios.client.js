import axios from 'axios';
import { API_CONFIG } from '../config/api.config';

const axiosClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  withCredentials: true, // Include cookies in cross-origin requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosClient.interceptors.request.use(
  (config) => {
    // Add auth tokens and user role
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      const { state } = JSON.parse(authStorage);
      if (state?.token) {
        config.headers.Authorization = `Bearer ${state.token}`;
      }
      if (state?.user?.role) {
        config.headers['x-user-role'] = state.user.role;
      }
    }

    // Remove Content-Type for FormData to let browser set it with boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle errors globally
    if (error.response) {
      // Server responded with error
      // Don't log 401/404 noise to console
      if (error.response.status !== 401 && error.response.status !== 404) {
        console.error('API Error:', error.response.data);
      }
      // Handle 401 Unauthorized - token expired or invalid
      if (error.response.status === 401) {
        // Suppress loud errors for auth issues, just warn
        console.warn('Authentication expired/invalid:', error.response.config.url);

        // Get the request URL
        const requestUrl = error.config?.url || '';
        
        // Only logout for critical auth endpoints, not for optional features
        // We tolerate 401s on these specific non-critical background fetches
        const optionalAuthEndpoints = ['/auth/sessions', '/wishlist'];
        const isOptionalEndpoint = optionalAuthEndpoints.some(endpoint => requestUrl.includes(endpoint));
        
        // Only clear auth and redirect if it's NOT an optional endpoint
        if (!isOptionalEndpoint) {
          // Clear auth storage
          localStorage.removeItem('auth-storage');
          
          // Redirect to login if not already there
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
        }
      }
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error:', error.request);
    } else {
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
