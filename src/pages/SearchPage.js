import React from 'react';
import '../styles/components/SearchPage.css';

const SearchPage = () => {
  return (
    <div className="search-page">
      {/* Header Section */}
      <header className="search-header">
        <div className="header-icon">
          <img src="/assets/images/thumbsy-icon.svg" alt="Thumbsy Icon" />
        </div>
        <h1>Get a recommendation list tailored to you.</h1>
        <p>
          Search for products and get tailored recommendations. Like products
          and get recommendations based on your taste profile.
        </p>
      </header>

      {/* Search Bar */}
      <div className="search-bar-container">
  <input
    type="text"
    placeholder="Search for a product"
    className="search-input"
  />
  <button className="filter-button">
    <img src="/assets/images/SearchFilter.svg" alt="Search Filter Icon" />
  </button>
</div>


      {/* Product Carousels */}
      <section className="product-section">
        <div className="product-category">
          <h2>Trending products</h2>
          <span className="see-more">›</span>
        </div>
        <div className="product-carousel">
          {/* Add product images here */}
          <img src="/assets/images/product1.jpg" alt="Product 1" />
          <img src="/assets/images/product2.jpg" alt="Product 2" />
          <img src="/assets/images/product3.jpg" alt="Product 3" />
          <img src="/assets/images/product4.jpg" alt="Product 4" />
        </div>
      </section>

      <section className="product-section">
        <div className="product-category">
          <h2>Most liked products</h2>
          <span className="see-more">›</span>
        </div>
        <div className="product-carousel">
          {/* Add product images here */}
          <img src="/assets/images/product5.jpg" alt="Product 5" />
          <img src="/assets/images/product6.jpg" alt="Product 6" />
          <img src="/assets/images/product7.jpg" alt="Product 7" />
          <img src="/assets/images/product8.jpg" alt="Product 8" />
        </div>
      </section>

      {/* Footer Note */}
      <footer className="search-footer">
  <p>
    <img
      src="/assets/images/Information.svg"
      alt="Information Icon"
      className="info-icon"
    />
    Thumbsy learns what you like as you use it. Like products to develop a taste profile.
  </p>
</footer>

    </div>
  );
};

export default SearchPage;
