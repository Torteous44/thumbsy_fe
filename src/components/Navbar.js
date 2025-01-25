import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import routes from '../routes'; // Import centralized routes
import AuthCard from './AuthCard';
import '../styles/components/Navbar.css';

const Navbar = () => {
  const [showAuth, setShowAuth] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true);

  const handleAuthClick = (isSignUpMode) => {
    setIsSignUp(isSignUpMode);
    setShowAuth(true);
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

        {/* Auth Buttons */}
        <div className="navbar-auth">
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
