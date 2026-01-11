export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  TIMEOUT: 10000,
};

export const API_ENDPOINTS = {
  // Home
  HOME: '/home',
  HOME_STATS: '/home/stats',
  HOME_POPULAR: '/home/popular',

  // Dorms
  DORMS: '/dorms',
  DORM_BY_ID: (id) => `/dorms/${id}`,

  // Auth
  AUTH_REGISTER: '/auth/register',
  AUTH_LOGIN: '/auth/login',
  AUTH_PROFILE: '/auth/profile',
  AUTH_LOGOUT: '/auth/logout',

  // Admin
  ADMIN: '/admin',
};
