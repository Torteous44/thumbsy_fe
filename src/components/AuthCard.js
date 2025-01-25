import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/components/AuthCard.css';

const AuthCard = ({ isVisible, onClose, defaultIsSignUp = true }) => {
  const [isLogin, setIsLogin] = useState(!defaultIsSignUp);
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
    
    try {
      const endpoint = isLogin ? 
        'https://qrbackend-ghtk.onrender.com/auth/login' : 
        'https://qrbackend-ghtk.onrender.com/auth/signup';
      
      const body = isLogin ? 
        `username=${formData.email}&password=${formData.password}` :
        JSON.stringify({
          email: formData.email,
          username: formData.username,
          password: formData.password
        });

      const headers = {
        'Content-Type': isLogin ? 
          'application/x-www-form-urlencoded' : 
          'application/json'
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body
      });

      if (!response.ok) {
        throw new Error('Authentication failed');
      }

      const data = await response.json();
      
      // Store tokens in localStorage
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      localStorage.setItem('token_type', data.token_type);
      localStorage.setItem('expires_in', data.expires_in.toString());
      
      // Close the modal
      onClose();
    } catch (err) {
      setError(err.message);
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
                  />
                  <input 
                    type="password" 
                    name="password"
                    placeholder="Password" 
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                  <button type="submit" className="auth-submit">Log in</button>
                  <p className="auth-switch">
                    Don't have an account? 
                    <button type="button" onClick={() => setIsLogin(false)}>Sign up</button>
                  </p>
                </>
              ) : (
                <>
                  <input 
                    type="text" 
                    name="username"
                    placeholder="Username" 
                    value={formData.username}
                    onChange={handleInputChange}
                  />
                  <input 
                    type="email" 
                    name="email"
                    placeholder="Email" 
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                  <input 
                    type="password" 
                    name="password"
                    placeholder="Password" 
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                  <button type="submit" className="auth-submit">Create account</button>
                  <p className="auth-switch">
                    Already have an account? 
                    <button type="button" onClick={() => setIsLogin(true)}>Log in</button>
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