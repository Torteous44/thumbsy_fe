import React from 'react';
import '../styles/components/SearchBar.css';

const SearchBar = () => {
  return (
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
  );
};

export default SearchBar;
