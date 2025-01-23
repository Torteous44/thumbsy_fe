import React from 'react';
import '../styles/components/LandingPage.css'; // Import the specific styles for the page
import ScrollingProductGrid from '../components/ScrollingProductGrid';

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <header className="hero-section">
        <h1 className="hero-title">Get recommendations and reviews tailored for you.</h1>
        <p className="hero-subtitle">A whole new way to shop. Based on your tastes.</p>
        <div className="cta-buttons">
          <button className="btn btn-primary">Sign up</button>
          <button className="btn btn-secondary">Learn more</button>
        </div>
      </header>
      {/* Replace the static product showcase with the scrolling grid */}
      <ScrollingProductGrid />
    </div>
  );
};

export default LandingPage;
