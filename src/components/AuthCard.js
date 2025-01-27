import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/components/AuthCard.css';
import { useAuth } from '../contexts/AuthContext';

const AuthCard = ({ isVisible, onClose, defaultIsSignUp = true }) => {
  const { login, signup } = useAuth();
  const [isLogin, setIsLogin] = useState(!defaultIsSignUp);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  
  // Reset the form state when the visibility or default mode changes
  useEffect(() => {
    if (isVisible) {
      setIsLogin(!defaultIsSignUp);
      // Reset form data when modal opens
      setFormData({ username: '', email: '', password: '' });
      setError('');
    }
  }, [isVisible, defaultIsSignUp]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    // Validate password for signup
    if (!isLogin) {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
      if (!passwordRegex.test(formData.password)) {
        setError('Password must be at least 8 characters and include uppercase, lowercase, and numbers');
        return;
      }
      if (formData.username.length < 3) {
        setError('Username must be at least 3 characters');
        return;
      }
    }
    
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        onClose();
      } else {
        await signup(formData.username, formData.email, formData.password);
        // Automatically log in after successful signup
        await login(formData.email, formData.password);
        onClose();
      }
    } catch (err) {
      setError(err.message);
      console.error('Auth error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          className="auth-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div 
            className="auth-card"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            onClick={e => e.stopPropagation()}
          >
            <div className="auth-header">
              <h2>{isLogin ? 'Welcome back' : 'Create account'}</h2>
              <button className="close-button" onClick={onClose}>&times;</button>
            </div>
            
            <form className="auth-form" onSubmit={handleSubmit}>
              {error && <div className="auth-error">{error}</div>}
              {isLogin ? (
                <>
                  <input 
                    type="email" 
                    name="email"
                    placeholder="Email" 
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                  <input 
                    type="password" 
                    name="password"
                    placeholder="Password" 
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                  <button 
                    type="submit" 
                    className="auth-submit" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="loading-spinner" />
                    ) : (
                      'Log in'
                    )}
                  </button>
                  <p className="auth-switch">
                    Don't have an account? 
                    <button 
                      type="button" 
                      onClick={() => setIsLogin(false)}
                      disabled={isLoading}
                    >
                      Sign up
                    </button>
                  </p>
                </>
              ) : (
                <>
                  <input 
                    type="text" 
                    name="username"
                    placeholder="Username (min 3 characters)" 
                    value={formData.username}
                    onChange={handleInputChange}
                    minLength={3}
                    required
                  />
                  <input 
                    type="email" 
                    name="email"
                    placeholder="Email" 
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                  <input 
                    type="password" 
                    name="password"
                    placeholder="Password (min 8 chars, upper, lower, number)" 
                    value={formData.password}
                    onChange={handleInputChange}
                    pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                    required
                  />
                  <button 
                    type="submit" 
                    className="auth-submit" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="loading-spinner" />
                    ) : (
                      'Create account'
                    )}
                  </button>
                  <p className="auth-switch">
                    Already have an account? 
                    <button 
                      type="button" 
                      onClick={() => setIsLogin(true)}
                      disabled={isLoading}
                    >
                      Log in
                    </button>
                  </p>
                </>
              )}
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthCard; 