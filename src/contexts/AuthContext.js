import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';

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

  const checkAuth = useCallback(async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setIsAuthenticated(false);
        setUser(null);
        return false;
      }
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Auth check failed:', error);
      logout();
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [logout]);

  // Check if user is authenticated on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = useCallback(async (email, password) => {
    try {
      const response = await fetch('https://qrbackend-ghtk.onrender.com/auth/login', {
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

      // Store tokens
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      localStorage.setItem('token_type', data.token_type);
      localStorage.setItem('expires_in', data.expires_in.toString());

      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }, []);

  const signup = useCallback(async (username, email, password) => {
    try {
      const response = await fetch('https://qrbackend-ghtk.onrender.com/auth/signup', {
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

  const refreshToken = useCallback(async () => {
    try {
      const currentRefreshToken = localStorage.getItem('refresh_token');
      if (!currentRefreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await fetch('https://qrbackend-ghtk.onrender.com/auth/refresh', {
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

      // Store new tokens
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      localStorage.setItem('token_type', data.token_type);
      localStorage.setItem('expires_in', data.expires_in.toString());

      return data;
    } catch (error) {
      console.error('Token refresh failed:', error);
      // Clear all auth data on refresh failure
      logout();
      throw error;
    }
  }, [logout]);

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      isLoading,
      user,
      login,
      signup,
      logout,
      refreshToken,
      checkAuth
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