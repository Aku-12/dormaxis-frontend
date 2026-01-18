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
  DORMS_FILTERS: '/dorms/filters',
  DORM_BY_ID: (id) => `/dorms/${id}`,

  // Auth
  AUTH_REGISTER: '/auth/register',
  AUTH_LOGIN: '/auth/login',
  AUTH_PROFILE: '/auth/profile',
  AUTH_LOGOUT: '/auth/logout',
  AUTH_UPDATE_PROFILE: '/auth/profile',
  AUTH_UPLOAD_AVATAR: '/auth/avatar',
  AUTH_DELETE_AVATAR: '/auth/avatar',

  // Wishlist
  WISHLIST: '/wishlist',
  WISHLIST_ADD: (dormId) => `/wishlist/${dormId}`,
  WISHLIST_REMOVE: (dormId) => `/wishlist/${dormId}`,
  WISHLIST_CHECK: (dormId) => `/wishlist/check/${dormId}`,

  // Admin
  ADMIN: '/admin',
};
