// SearchBar.js
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RangeSlider from './RangeSlider';
import '../styles/components/SearchBar.css'; 

const SearchBar = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Framer Motion variants for the filter panel
  const filterPanelVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: 'auto',
      transition: { duration: 0.3 }
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: { duration: 0.2 }
    }
  };

  return (
    <div className="search-wrapper">
      <div className="search-bar-container">
        {/* Top row: search + filter toggle button */}
        <div className="search-input-section">
          <div className="search-icon">
            <img src="/assets/images/SearchIcon.svg" alt="Search Icon" />
          </div>
          <input
            type="text"
            placeholder="Search for a product"
            className="search-input"
          />
          <button
            className="filter-button"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <img
              src="/assets/images/SearchFilter.svg"
              alt="Search Filter Icon"
            />
          </button>
        </div>

        {/* Filter panel */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              className="filter-panel"
              variants={filterPanelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Price Section with RangeSlider */}
              <div className="filter-section">
                <h3>Price</h3>
                <RangeSlider />
              </div>

              {/* Characteristics Section */}
              <div className="filter-section">
                <h3>Characteristics</h3>
                <div className="filter-tags">
                  <button className="add-tag">+</button>
                  <button className="filter-tag">
                    <span>High quality</span>
                    <span className="remove-tag">×</span>
                  </button>
                  <button className="filter-tag">
                    <span>Trendy</span>
                    <span className="remove-tag">×</span>
                  </button>
                  <button className="filter-tag">
                    <span>Colorful</span>
                    <span className="remove-tag">×</span>
                  </button>
                  <button className="filter-tag">
                    <span>Design focused</span>
                    <span className="remove-tag">×</span>
                  </button>
                </div>
              </div>

              {/* Brands Section */}
              <div className="filter-section">
                <h3>Brands</h3>
                <div className="filter-tags">
                  <button className="add-tag">+</button>
                  <button className="filter-tag">
                    <span>Small business</span>
                    <span className="remove-tag">×</span>
                  </button>
                  <button className="filter-tag">
                    <span>Local</span>
                    <span className="remove-tag">×</span>
                  </button>
                  <button className="filter-tag">
                    <span>Eco-friendly</span>
                    <span className="remove-tag">×</span>
                  </button>
                </div>
              </div>

              {/* Review Sources Section */}
              <div className="filter-section">
                <h3>Review sources</h3>
                <div className="filter-tags">
                  <button className="add-tag">+</button>
                  <button className="filter-tag">
                    <span>Tech reviews</span>
                    <span className="remove-tag">×</span>
                  </button>
                  <button className="filter-tag">
                    <span>Online forums</span>
                    <span className="remove-tag">×</span>
                  </button>
                  <button className="filter-tag">
                    <span>Newspapers</span>
                    <span className="remove-tag">×</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SearchBar;
