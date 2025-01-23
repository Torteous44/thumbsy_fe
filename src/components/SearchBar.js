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
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: { duration: 0.2 },
    },
  };

  return (
    <section className="search-wrapper" aria-label="Product search">
      <div className="search-bar-container" role="search">
        {/* Top row: search + filter toggle button */}
        <div className="search-input-section">
          {/* Screen reader only label for the search input */}
          <label htmlFor="search-input" className="sr-only">
            Search for a product
          </label>

          <div className="search-icon" aria-hidden="true">
            <img src="/assets/images/SearchIcon.svg" alt="" />
          </div>

          <input
            id="search-input"
            type="text"
            placeholder="Search for a product"
            className="search-input"
            aria-label="Search for a product"
          />

          <button
            type="button"
            className="filter-button"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-expanded={isExpanded}
            aria-label="Toggle filter panel"
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
            <motion.aside
              className="filter-panel"
              variants={filterPanelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              aria-label="Filter panel"
            >
              {/* Price Section with RangeSlider */}
              <section className="filter-section">
                <h3>Price</h3>
                <RangeSlider />
              </section>

              {/* Characteristics Section */}
              <section className="filter-section">
                <h3>Characteristics</h3>
                <div className="filter-tags">
                  <button className="add-tag" aria-label="Add characteristic">
                    +
                  </button>

                  <button className="filter-tag" type="button">
                    <span>High quality</span>
                    <span className="remove-tag" aria-hidden="true">×</span>
                  </button>

                  <button className="filter-tag" type="button">
                    <span>Trendy</span>
                    <span className="remove-tag" aria-hidden="true">×</span>
                  </button>

                  <button className="filter-tag" type="button">
                    <span>Colorful</span>
                    <span className="remove-tag" aria-hidden="true">×</span>
                  </button>

                  <button className="filter-tag" type="button">
                    <span>Design focused</span>
                    <span className="remove-tag" aria-hidden="true">×</span>
                  </button>
                </div>
              </section>

              {/* Brands Section */}
              <section className="filter-section">
                <h3>Brands</h3>
                <div className="filter-tags">
                  <button className="add-tag" aria-label="Add brand">
                    +
                  </button>

                  <button className="filter-tag" type="button">
                    <span>Small business</span>
                    <span className="remove-tag" aria-hidden="true">×</span>
                  </button>

                  <button className="filter-tag" type="button">
                    <span>Local</span>
                    <span className="remove-tag" aria-hidden="true">×</span>
                  </button>

                  <button className="filter-tag" type="button">
                    <span>Eco-friendly</span>
                    <span className="remove-tag" aria-hidden="true">×</span>
                  </button>
                </div>
              </section>

              {/* Review Sources Section */}
              <section className="filter-section">
                <h3>Review sources</h3>
                <div className="filter-tags">
                  <button className="add-tag" aria-label="Add review source">
                    +
                  </button>

                  <button className="filter-tag" type="button">
                    <span>Tech reviews</span>
                    <span className="remove-tag" aria-hidden="true">×</span>
                  </button>

                  <button className="filter-tag" type="button">
                    <span>Online forums</span>
                    <span className="remove-tag" aria-hidden="true">×</span>
                  </button>

                  <button className="filter-tag" type="button">
                    <span>Newspapers</span>
                    <span className="remove-tag" aria-hidden="true">×</span>
                  </button>
                </div>
              </section>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default SearchBar;
