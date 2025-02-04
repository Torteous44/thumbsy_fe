import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';

const API_ENDPOINTS = {
  LOGIN: 'https://thumbsybackend.onrender.com/api/auth/login',
  REFRESH: 'https://thumbsybackend.onrender.com/api/auth/refresh',
  PROFILE: 'https://thumbsybackend.onrender.com/api/profile',
  SIGNUP: 'https://thumbsybackend.onrender.com/api/auth/signup'
};

const apiCall = async (endpoint, options = {}) => {
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const requestConfig = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  const response = await fetch(endpoint, requestConfig);
  const data = await response.json();
  
  if (!response.ok) {
    const error = new Error(data.detail || 'API call failed');
    error.response = response;
    error.data = data;
    throw error;
  }

  return data;
};

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('token_type');
    localStorage.removeItem('expires_in');
    localStorage.removeItem('user_id');
    setIsAuthenticated(false);
    setUser(null);
  }, []);

  const refreshToken = useCallback(async () => {
    try {
      const currentRefreshToken = localStorage.getItem('refresh_token');
      if (!currentRefreshToken) {
        throw new Error('No refresh token available');
      }
  
      const data = await apiCall(API_ENDPOINTS.REFRESH, {
        method: 'POST',
        body: JSON.stringify({
          refresh_token: currentRefreshToken
        })
      });
  
      // Store new tokens
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      localStorage.setItem('token_type', data.token_type);
      localStorage.setItem('expires_in', data.expires_in.toString());
      localStorage.setItem('user_id', data.user_id.toString());
  
      return data;
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
      throw error;
    }
  }, [logout]);

  const fetchUserProfile = useCallback(async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No access token');
      }

      const data = await apiCall(API_ENDPOINTS.PROFILE, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setUser(data);
      return data;
    } catch (error) {
      if (error.response?.status === 401) {
        // Try to refresh the token and retry
        try {
          await refreshToken();
          const newToken = localStorage.getItem('access_token');
          const data = await apiCall(API_ENDPOINTS.PROFILE, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${newToken}`
            }
          });
          setUser(data);
          return data;
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          logout();
          throw refreshError;
        }
      }
      console.error('Failed to fetch profile:', error);
      throw error;
    }
  }, [refreshToken, logout]);

  const checkAuth = useCallback(async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setIsAuthenticated(false);
        setUser(null);
        return false;
      }

      setIsAuthenticated(true);
      await fetchUserProfile(); // Add profile fetch here
      return true;
    } catch (error) {
      console.error('Auth check failed:', error);
      logout();
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [logout, fetchUserProfile]);

  const login = useCallback(async (email, password) => {
    try {
      const formData = new URLSearchParams({
        username: email,
        password: password
      });

      const data = await apiCall(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString()
      });

      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      localStorage.setItem('token_type', data.token_type);
      localStorage.setItem('expires_in', data.expires_in.toString());
      localStorage.setItem('user_id', data.user_id.toString());

      setIsAuthenticated(true);
      await fetchUserProfile();
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }, [fetchUserProfile]);

  const signup = useCallback(async (username, email, password) => {
    try {
      // Match the exact format from the curl command
      const requestBody = {
        email: email,
        username: username,
        password: password
      };

      const data = await apiCall(API_ENDPOINTS.SIGNUP, {
        method: 'POST',
        body: JSON.stringify(requestBody)
      });

      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      localStorage.setItem('token_type', data.token_type);
      localStorage.setItem('expires_in', data.expires_in.toString());
      localStorage.setItem('user_id', data.user_id.toString());

      setIsAuthenticated(true);
      await fetchUserProfile();
      return data;
    } catch (error) {
      console.error('Signup failed:', error.data || error);
      throw error;
    }
  }, [fetchUserProfile]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      isLoading,
      user,
      login,
      signup,
      logout,
      refreshToken,
      checkAuth,
      fetchUserProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 