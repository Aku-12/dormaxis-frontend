/**
 * DormAxis Theme Configuration
 * Centralized color palette and theme settings
 */

export const colors = {
  // Primary Colors
  primary: {
    DEFAULT: '#4A90B8',
    light: '#5AA0C8',
    dark: '#3A7A9A',
    darker: '#2C5F7C',
  },

  // Secondary Colors
  secondary: {
    DEFAULT: '#1e3a5f',
    light: '#2d4a6f',
    dark: '#162d4d',
  },

  // Background Colors
  background: {
    light: '#E8F3F8',
    lighter: '#F0F7FA',
    card: '#FFFFFF',
    page: '#F9FAFB',
  },

  // Text Colors
  text: {
    primary: '#1F2937',
    secondary: '#4B5563',
    muted: '#6B7280',
    light: '#9CA3AF',
    inverse: '#FFFFFF',
  },

  // Accent Colors
  accent: {
    blue: '#BADCE8',
    blueLight: '#D1E7F0',
    cyan: '#00D8FF',
  },

  // Status Colors
  status: {
    success: '#16a34a',
    successLight: '#22c55e',
    successBg: '#f0fdf4',
    warning: '#ca8a04',
    warningLight: '#eab308',
    warningBg: '#fefce8',
    error: '#dc2626',
    errorLight: '#ef4444',
    errorBg: '#fef2f2',
    info: '#0ea5e9',
    infoBg: '#f0f9ff',
  },

  // Rating Colors
  rating: {
    filled: '#fbbf24',
    empty: '#e2e8f0',
  },

  // Border Colors
  border: {
    light: '#e5e7eb',
    DEFAULT: '#d1d5db',
    dark: '#9ca3af',
  },

  // Password Strength Colors
  passwordStrength: {
    veryWeak: '#dc2626',
    weak: '#ea580c',
    fair: '#ca8a04',
    strong: '#16a34a',
    veryStrong: '#059669',
  },
};

// Tailwind class mappings for easy use
export const theme = {
  // Button variants
  button: {
    primary: 'bg-primary hover:bg-primary-dark text-white',
    secondary: 'bg-secondary hover:bg-secondary-light text-white',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
    ghost: 'text-primary hover:bg-primary/10',
    danger: 'bg-status-error hover:bg-red-700 text-white',
  },

  // Input styles
  input: {
    base: 'w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors',
    error: 'border-status-error focus:ring-status-error',
  },

  // Card styles
  card: {
    base: 'bg-white rounded-xl shadow-sm',
    hover: 'hover:shadow-md transition-shadow',
  },

  // Badge variants
  badge: {
    featured: 'bg-primary text-white',
    popular: 'bg-amber-500 text-white',
    new: 'bg-green-500 text-white',
    verified: 'bg-blue-500 text-white',
  },
};

export default { colors, theme };
