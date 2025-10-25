// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  POSTS_LIMIT: 20,
  USERS_LIMIT: 10,
  COMMUNITIES_LIMIT: 12,
  EVENTS_LIMIT: 12
};

// Polling intervals (in milliseconds)
export const POLLING_INTERVALS = {
  UNREAD_COUNTS: 30000, // 30 seconds
  FEED_REFRESH: 60000,  // 1 minute
  NOTIFICATIONS: 30000  // 30 seconds
};

// Storage keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme'
};

// Routes
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  COMMUNITIES: '/communities',
  EVENTS: '/events',
  RIDES: '/rides',
  AUTH_SUCCESS: '/auth-success.html'
};

// Validation
export const VALIDATION = {
  MIN_BIO_LENGTH: 10,
  MAX_BIO_LENGTH: 500,
  MIN_POST_LENGTH: 1,
  MAX_POST_LENGTH: 5000,
  MIN_COMMENT_LENGTH: 1,
  MAX_COMMENT_LENGTH: 1000,
  MIN_MESSAGE_LENGTH: 1,
  MAX_MESSAGE_LENGTH: 2000
};

// File upload
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
};

// Toast notification duration
export const TOAST_DURATION = 3000; // 3 seconds

// Rate limiting (client-side hints)
export const RATE_LIMITS = {
  POST_CREATION: 5,      // 5 posts per minute
  MESSAGE_SENDING: 10,   // 10 messages per minute
  SEARCH_REQUESTS: 20    // 20 searches per minute
};

// Feature flags
export const FEATURES = {
  GOOGLE_AUTH_ENABLED: !!import.meta.env.VITE_GOOGLE_CLIENT_ID,
  DEV_LOGIN_ENABLED: import.meta.env.DEV || import.meta.env.MODE === 'development',
  NOTIFICATIONS_ENABLED: true,
  MESSAGES_ENABLED: true,
  FILE_UPLOAD_ENABLED: false // Set to true when Cloudinary is configured
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Please log in to continue.',
  FORBIDDEN: 'You don\'t have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  RATE_LIMIT: 'Too many requests. Please slow down.'
};

// Success messages
export const SUCCESS_MESSAGES = {
  POST_CREATED: 'Post created successfully! 🎉',
  POST_DELETED: 'Post deleted successfully',
  PROFILE_UPDATED: 'Profile updated successfully! ✅',
  COMMUNITY_JOINED: 'Joined community successfully!',
  EVENT_REGISTERED: 'Registered for event successfully!',
  MESSAGE_SENT: 'Message sent! ✓'
};

