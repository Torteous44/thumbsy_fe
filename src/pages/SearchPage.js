import React, { useState, useEffect } from 'react';
import '../styles/pages/SearchPage.css';
import SearchBar from '../components/search page/SearchBar';

const SearchPage = () => {
  const [searchResults, setSearchResults] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);

  // Preload the icon images and font
  useEffect(() => {
    Promise.all([
      // Preload images
      new Promise((resolve) => {
        const thumbsyIcon = new Image();
        thumbsyIcon.onload = resolve;
        thumbsyIcon.src = '/assets/icons/thumbsy-icon.svg';
      }),
      new Promise((resolve) => {
        const infoIcon = new Image();
        infoIcon.onload = resolve;
        infoIcon.src = '/assets/icons/Information.svg';
      }),
      // Preload font if you're using a custom font
      document.fonts.ready
    ]).then(() => {
      setIsLoaded(true);
    });
  }, []);

  const handleResultsReceived = (results) => {
    setSearchResults(results);
    // You might want to navigate to a results page or show results in this page
    console.log('Received results:', results);
  };

  return (
    <div className={`search-page ${isLoaded ? 'content-loaded' : ''} ${isFilterExpanded ? 'filters-expanded' : ''}`}>
      {/* Header Section */}
      <header className="search-header">
        <div className="icon-wrapper">
          <img 
            src="/assets/icons/thumbsy-icon.svg" 
            alt="Thumbsy" 
            className="header-icon"
            width="48"
            height="48"
          />
        </div>
        <h1 className="header-title">Get a recommendation list tailored to you.</h1>
        <div className="header-description">
          <p>
            Search for products and get tailored recommendations.<br />
            Like products and get recommendations based on your taste profile.
          </p>
        </div>
      </header>

      <SearchBar onResultsReceived={handleResultsReceived} onExpandChange={setIsFilterExpanded} />

      {/* Show results or footer based on search state */}
      {!searchResults && (
        <div className="search-footer">
          <p>
            <span className="info-icon-wrapper">
              <img
                src="/assets/icons/Information.svg"
                alt="Information Icon"
                className="info-icon"
                width="24"
                height="24"
              />
            </span>
            Thumbsy learns what you like as you use it. Like products to develop a taste profile.
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
