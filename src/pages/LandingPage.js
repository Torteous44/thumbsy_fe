import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/pages/LandingPage.css'; // Import the specific styles for the page
import ScrollingProductGrid from '../components/landing page/ScrollingProductGrid';
import Footer from '../components/Footer';
import routes from '../routes';
import { useAuth } from '../contexts/AuthContext';
import { useModal } from '../contexts/ModalContext';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const { openAuthCard } = useModal();
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);

  // Preload assets
  useEffect(() => {
    Promise.all([
      // Preload any images used in the landing page
      new Promise((resolve) => {
        const thumbsyIcon = new Image();
        thumbsyIcon.onload = resolve;
        thumbsyIcon.src = '/assets/icons/thumbsy-icon.svg';
      }),
      // Wait for fonts to load
      document.fonts.ready,
      // Add a small delay to ensure smooth transition
      new Promise(resolve => setTimeout(resolve, 100))
    ]).then(() => {
      setIsLoaded(true);
    });
  }, []);

  const handleLearnMore = () => {
    navigate(routes.about);
  };

  return (
    <div className={`landing-page ${isLoaded ? 'content-loaded' : ''}`}>
      {/* Hero Section */}
      <header className="hero-section">
        <h1 className="hero-title">Get recommendations and reviews tailored for you.</h1>
        <p className="hero-subtitle">A whole new way to shop. Based on your tastes.</p>
        <div className="cta-buttons">
          <button 
            className={`btn ${isAuthenticated ? 'btn-profile' : 'btn-primary'}`}
            onClick={() => isAuthenticated ? navigate('/profile') : openAuthCard(true)}
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
      
      <Footer />
    </div>
  );
};

export default LandingPage;
