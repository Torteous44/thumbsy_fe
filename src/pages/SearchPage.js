import React from 'react';
import '../styles/components/SearchPage.css';
import SearchBar from '../components/SearchBar';

const SearchPage = () => {
  return (
    <div className="search-page">
      {/* Header Section */}
      <header className="search-header">
        <div className="header-icon">
          <img src="/assets/icons/thumbsy-icon.svg" alt="Thumbsy Icon" />
        </div>
        <h1>Get a recommendation list tailored to you.</h1>
        <p>
          Search for products and get tailored recommendations. Like products
          and get recommendations based on your taste profile.
        </p>
      </header>

      <SearchBar />


      {/* Footer Note */}
      <footer className="search-footer">
  <p>
    <img
      src="/assets/icons/Information.svg"
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
