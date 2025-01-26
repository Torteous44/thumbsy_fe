import React, { useState } from 'react';
import '../styles/components/SearchPage.css';
import SearchBar from '../components/SearchBar';

const SearchPage = () => {
  const [searchResults, setSearchResults] = useState(null);

  const handleResultsReceived = (results) => {
    setSearchResults(results);
    // You might want to navigate to a results page or show results in this page
    console.log('Received results:', results);
  };

  return (
    <div className="search-page">
      {/* Header Section */}
      <header className="search-header">
        <img 
          src="/assets/icons/thumbsy-icon.svg" 
          alt="Thumbsy" 
          className="header-icon"
        />
        <h1>Get a recommendation list tailored to you.</h1>
        <div className="header-description">
          <p className="header-description">
            Search for products and get tailored recommendations.<br />
            Like products and get recommendations based on your taste profile.
          </p>
        </div>
      </header>

      <SearchBar onResultsReceived={handleResultsReceived} />

      {/* Show results or footer based on search state */}
      {!searchResults && (
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
      )}
    </div>
  );
};

export default SearchPage;
