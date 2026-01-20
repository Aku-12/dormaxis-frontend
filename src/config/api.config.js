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

  // Reviews
  REVIEWS_BY_DORM: (dormId) => `/reviews/${dormId}`,
  ADD_REVIEW: (dormId) => `/reviews/${dormId}`,
  DELETE_REVIEW: (reviewId) => `/reviews/review/${reviewId}`,

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

  // Bookings
  BOOKINGS: '/bookings',
  BOOKING_BY_ID: (id) => `/bookings/${id}`,
  BOOKING_CANCEL: (id) => `/bookings/${id}/cancel`,
  BOOKING_PREVIEW: '/bookings/preview',
  BOOKING_VALIDATE_PROMO: '/bookings/validate-promo',
  BOOKING_ADMIN_ALL: '/bookings/admin/all',
  BOOKING_ADMIN_STATUS: (id) => `/bookings/admin/${id}/status`,

  // Payments - eSewa
  PAYMENT_ESEWA_INITIATE: '/payments/esewa/initiate',
  PAYMENT_ESEWA_VERIFY: '/payments/esewa/verify',
  PAYMENT_ESEWA_STATUS: (bookingId) => `/payments/esewa/status/${bookingId}`,
  PAYMENT_ESEWA_FAILURE: '/payments/esewa/failure',
  
  // Payments - Khalti
  PAYMENT_KHALTI_INITIATE: '/payments/khalti/initiate',
  PAYMENT_KHALTI_VERIFY: '/payments/khalti/verify',
  PAYMENT_KHALTI_STATUS: (bookingId) => `/payments/khalti/status/${bookingId}`,
  
  // Payments - Common
  PAYMENT_DETAILS: (bookingId) => `/payments/${bookingId}`,

  // Admin
  ADMIN: '/admin',
};

