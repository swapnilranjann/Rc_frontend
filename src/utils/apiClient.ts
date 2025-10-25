import axios from 'axios';
import { API_CONFIG, STORAGE_KEYS, ERROR_MESSAGES } from '../config/constants';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor - add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle common errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;

      // Handle 401 - Unauthorized
      if (status === 401) {
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        window.location.href = '/';
        return Promise.reject(new Error(ERROR_MESSAGES.UNAUTHORIZED));
      }

      // Handle other errors
      const message = error.response.data?.message || error.response.data?.error;
      return Promise.reject(new Error(message || getErrorMessage(status)));
    }

    // Network error
    if (error.request) {
      return Promise.reject(new Error(ERROR_MESSAGES.NETWORK_ERROR));
    }

    return Promise.reject(error);
  }
);

function getErrorMessage(status: number): string {
  switch (status) {
    case 403:
      return ERROR_MESSAGES.FORBIDDEN;
    case 404:
      return ERROR_MESSAGES.NOT_FOUND;
    case 429:
      return ERROR_MESSAGES.RATE_LIMIT;
    case 400:
      return ERROR_MESSAGES.VALIDATION_ERROR;
    default:
      return ERROR_MESSAGES.SERVER_ERROR;
  }
}

export default apiClient;

