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
  AUTH_SESSIONS: '/auth/sessions',

  // MFA
  MFA_STATUS: '/mfa/status',
  MFA_SETUP: '/mfa/setup',
  MFA_VERIFY_SETUP: '/mfa/verify-setup',
  MFA_VERIFY: '/mfa/verify',
  MFA_USE_BACKUP: '/mfa/use-backup',
  MFA_DISABLE: '/mfa/disable',
  MFA_BACKUP_CODES: '/mfa/backup-codes',

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

  // Payments - Stripe
  PAYMENT_CREATE_SESSION: '/payments/create-checkout-session',
  PAYMENT_VERIFY: '/payments/verify-payment',
  
  // Payments - Common
  PAYMENT_DETAILS: (bookingId) => `/payments/${bookingId}`,

  // Admin
  ADMIN: '/admin',
};

