import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import routes from '../routes/index'; // Import centralized routes
import AuthCard from './AuthCard';
import '../styles/components/Navbar.css';

const Navbar = () => {
  const [showAuth, setShowAuth] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in by looking for access token
    const token = localStorage.getItem('access_token');
    setIsLoggedIn(!!token);
  }, [showAuth]); // Re-check when auth modal closes

  const handleAuthClick = (isSignUpMode) => {
    setIsSignUp(isSignUpMode);
    setShowAuth(true);
  };

  const handleLogout = () => {
    // Clear all auth tokens
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('token_type');
    localStorage.removeItem('expires_in');
    setIsLoggedIn(false);
  };

  return (
    <>
      <nav className="navbar">
        {/* Logo */}
        <div className="navbar-logo">
          <Link to={routes.home}>
            <img src="/assets/icons/thumbsy-icon.svg" alt="Thumbsy Logo" />
          </Link>
        </div>

        {/* Navigation Links */}
        <ul className="navbar-links">
          <li>
            <Link to={routes.home}>Home</Link>
          </li>
          <li>
            <Link to={routes.search}>Thumbsy</Link>
          </li>
          <li>
            <Link to={routes.about}>About us</Link>
          </li>
        </ul>

        {/* Conditional Auth Buttons or Profile Link */}
        <div className="navbar-auth">
          {isLoggedIn ? (
            <div className="profile-section">
              <Link to={routes.profile} className="profile-link">Profile</Link>
              <button 
                className="auth-button logout"
                onClick={handleLogout}
              >
                Log out
              </button>
            </div>
          ) : (
            <>
              <button 
                className="auth-button login"
                onClick={() => handleAuthClick(false)}
              >
                Log in
              </button>
              <button 
                className="auth-button signup"
                onClick={() => handleAuthClick(true)}
              >
                Sign up
              </button>
            </>
          )}
        </div>
      </nav>

      <AuthCard 
        isVisible={showAuth}
        onClose={() => setShowAuth(false)}
        defaultIsSignUp={isSignUp}
      />
    </>
  );
};

export default Navbar;
