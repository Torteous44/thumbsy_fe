import React from 'react';
import '../styles/components/LandingPage.css'; // Import the specific styles for the page

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <header className="hero-section">
        <h1>Get recommendations and reviews tailored for you.</h1>
        <p>A whole new way to shop. Based on your tastes.</p>
        <div className="cta-buttons">
          <button className="btn btn-primary">Sign up</button>
          <button className="btn btn-secondary">Learn more</button>
        </div>
      </header>

      {/* Product Showcase Section */}
      <section className="product-showcase">
        <div className="product-grid">
          {/* Placeholder images */}
          <img src="/assets/images/product1.jpg" alt="Product 1" />
          <img src="/assets/images/product2.jpg" alt="Product 2" />
          <img src="/assets/images/product3.jpg" alt="Product 3" />
          <img src="/assets/images/product4.jpg" alt="Product 4" />
          <img src="/assets/images/product5.jpg" alt="Product 5" />
          <img src="/assets/images/product6.jpg" alt="Product 6" />
          <img src="/assets/images/product7.jpg" alt="Product 7" />
          <img src="/assets/images/product8.jpg" alt="Product 8" />
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
