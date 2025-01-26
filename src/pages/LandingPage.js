import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/pages/LandingPage.css'; // Import the specific styles for the page
import ScrollingProductGrid from '../components/ScrollingProductGrid';
import AuthCard from '../components/AuthCard';
import routes from '../routes';
import { useAuth } from '../contexts/AuthContext';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showAuth, setShowAuth] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true);

  const handleAuthClick = () => {
    setIsSignUp(true);
    setShowAuth(true);
  };

  const handleLearnMore = () => {
    navigate(routes.about);
  };

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <header className="hero-section">
        <h1 className="hero-title">Get recommendations and reviews tailored for you.</h1>
        <p className="hero-subtitle">A whole new way to shop. Based on your tastes.</p>
        <div className="cta-buttons">
          <button 
            className={`btn ${isAuthenticated ? 'btn-profile' : 'btn-primary'}`}
            onClick={() => isAuthenticated ? navigate('/profile') : setShowAuth(true)}
          >
            {isAuthenticated ? 'Profile' : 'Sign Up'}
          </button>
          <button 
            className="btn btn-secondary"
            onClick={handleLearnMore}
          >
            Learn more
          </button>
        </div>
      </header>
      {/* Replace the static product showcase with the scrolling grid */}
      <ScrollingProductGrid />
      
      {showAuth && (
        <AuthCard 
          isVisible={showAuth}
          onClose={() => setShowAuth(false)}
          defaultIsSignUp={true}
        />
      )}
    </div>
  );
};

export default LandingPage;
