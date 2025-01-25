import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/components/AuthCard.css';

const AuthCard = ({ isVisible, onClose, defaultIsSignUp = true }) => {
  const [isLogin, setIsLogin] = useState(!defaultIsSignUp);
  
  // Reset the form state when the visibility or default mode changes
  useEffect(() => {
    if (isVisible) {
      setIsLogin(!defaultIsSignUp);
    }
  }, [isVisible, defaultIsSignUp]);

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
            
            <div className="auth-form">
              {isLogin ? (
                <>
                  <input type="email" placeholder="Email" />
                  <input type="password" placeholder="Password" />
                  <button className="auth-submit">Log in</button>
                  <p className="auth-switch">
                    Don't have an account? 
                    <button onClick={() => setIsLogin(false)}>Sign up</button>
                  </p>
                </>
              ) : (
                <>
                  <input type="text" placeholder="Username" />
                  <input type="email" placeholder="Email" />
                  <input type="password" placeholder="Password" />
                  <button className="auth-submit">Create account</button>
                  <p className="auth-switch">
                    Already have an account? 
                    <button onClick={() => setIsLogin(true)}>Log in</button>
                  </p>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthCard; 