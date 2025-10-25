import { useState, useCallback } from 'react';
import axios, { AxiosRequestConfig } from 'axios';
import { API_CONFIG, ERROR_MESSAGES, STORAGE_KEYS } from '../config/constants';

interface UseApiOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
  showToast?: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
}

export const useApi = <T = any>(options: UseApiOptions = {}) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (
    url: string,
    config: AxiosRequestConfig = {}
  ): Promise<T | null> => {
    setLoading(true);
    setError(null);

    try {
      // Add auth token if available
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
      const headers = {
        ...config.headers,
        ...(token && { Authorization: `Bearer ${token}` })
      };

      const response = await axios({
        url: `${API_CONFIG.BASE_URL}${url}`,
        ...config,
        headers,
        timeout: API_CONFIG.TIMEOUT
      });

      setData(response.data);
      
      if (options.onSuccess) {
        options.onSuccess(response.data);
      }

      return response.data;
    } catch (err: any) {
      let errorMessage = ERROR_MESSAGES.SERVER_ERROR;

      if (err.response) {
        // Server responded with error
        const status = err.response.status;
        errorMessage = err.response.data?.message || err.response.data?.error;

        if (!errorMessage) {
          switch (status) {
            case 401:
              errorMessage = ERROR_MESSAGES.UNAUTHORIZED;
              // Clear auth and redirect
              localStorage.removeItem(STORAGE_KEYS.TOKEN);
              localStorage.removeItem(STORAGE_KEYS.USER);
              window.location.href = '/';
              break;
            case 403:
              errorMessage = ERROR_MESSAGES.FORBIDDEN;
              break;
            case 404:
              errorMessage = ERROR_MESSAGES.NOT_FOUND;
              break;
            case 429:
              errorMessage = ERROR_MESSAGES.RATE_LIMIT;
              break;
            case 400:
              errorMessage = ERROR_MESSAGES.VALIDATION_ERROR;
              break;
            default:
              errorMessage = ERROR_MESSAGES.SERVER_ERROR;
          }
        }
      } else if (err.request) {
        // Request made but no response
        errorMessage = ERROR_MESSAGES.NETWORK_ERROR;
      }

      setError(errorMessage);

      if (options.onError) {
        options.onError(errorMessage);
      }

      if (options.showToast) {
        options.showToast(errorMessage, 'error');
      }

      return null;
    } finally {
      setLoading(false);
    }
  }, [options]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { data, loading, error, execute, reset };
};

