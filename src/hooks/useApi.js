import { useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

export const useApi = () => {
  const { refreshToken, logout } = useAuth();

  const fetchWithAuth = useCallback(async (url, options = {}) => {
    try {
      // Add auth header
      const token = localStorage.getItem('access_token');
      if (!token) throw new Error('No access token');

      const response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${token}`
        }
      });

      // Handle 401 by trying to refresh token
      if (response.status === 401) {
        try {
          const refreshResult = await refreshToken();
          
          // Retry original request with new token
          const retryResponse = await fetch(url, {
            ...options,
            headers: {
              ...options.headers,
              'Authorization': `Bearer ${refreshResult.access_token}`
            }
          });

          if (!retryResponse.ok) {
            throw new Error(retryResponse.statusText);
          }

          return retryResponse.json();
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          logout();
          throw new Error('Session expired. Please login again.');
        }
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Request failed');
      }

      return response.json();
    } catch (error) {
      console.error('API call failed:', error);
      if (error.message === 'No access token') {
        logout();
      }
      throw error;
    }
  }, [refreshToken, logout]);

  return { fetchWithAuth };
}; 