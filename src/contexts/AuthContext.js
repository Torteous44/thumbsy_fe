import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';

const API_ENDPOINTS = {
  LOGIN: 'https://qrbackend-ghtk.onrender.com/auth/login',
  REFRESH: 'https://qrbackend-ghtk.onrender.com/auth/refresh',
  PROFILE: 'https://qrbackend-ghtk.onrender.com/search/profile',
  SIGNUP: 'https://qrbackend-ghtk.onrender.com/auth/signup'
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
    setIsAuthenticated(false);
    setUser(null);
  }, []);

  const refreshToken = useCallback(async () => {
    try {
      const currentRefreshToken = localStorage.getItem('refresh_token');
      if (!currentRefreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await fetch(API_ENDPOINTS.REFRESH, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          refresh_token: currentRefreshToken
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Token refresh failed');
      }

      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      localStorage.setItem('token_type', data.token_type);
      localStorage.setItem('expires_in', data.expires_in.toString());

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

      const response = await fetch(API_ENDPOINTS.PROFILE, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (response.status === 401) {
        // Try to refresh the token and retry
        const refreshData = await refreshToken();
        const retryResponse = await fetch(API_ENDPOINTS.PROFILE, {
          headers: {
            'Authorization': `Bearer ${refreshData.access_token}`,
            'Accept': 'application/json'
          }
        });

        if (!retryResponse.ok) {
          throw new Error('Failed to fetch profile after token refresh');
        }

        const userData = await retryResponse.json();
        setUser(userData);
        return userData;
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch profile: ${response.status}`);
      }

      const userData = await response.json();
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      throw error;
    }
  }, [refreshToken]);

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
      const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          username: email,
          password: password
        }).toString()
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Login failed');
      }

      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      localStorage.setItem('token_type', data.token_type);
      localStorage.setItem('expires_in', data.expires_in.toString());

      setIsAuthenticated(true);
      await fetchUserProfile(); // Add profile fetch after successful login
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }, [fetchUserProfile]);

  const signup = useCallback(async (username, email, password) => {
    try {
      const response = await fetch(API_ENDPOINTS.SIGNUP, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Signup failed');
      }

      return data;
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    }
  }, []);

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