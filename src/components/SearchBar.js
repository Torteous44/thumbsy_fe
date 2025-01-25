// SearchBar.js
import React, { useState, memo, useMemo, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RangeSlider from './RangeSlider';
import '../styles/components/SearchBar.css'; 

const SearchBar = memo(() => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentPlaceholder, setCurrentPlaceholder] = useState('');
  
  const placeholders = useMemo(() => [
    "Search for the latest sneakers...",
    "Find the perfect laptop for work or gaming...",
    "Discover stylish backpacks for travel...",
    "Browse headphones with amazing sound quality...",
    "Search for budget-friendly smartphones...",
    "Explore trendy watches for every occasion...",
    "Find eco-friendly home products...",
    "Discover unique gifts for your loved ones...",
    "Browse the latest fashion accessories...",
    "Search for high-performance sports gear..."
  ], []);

  const typewriterRef = useRef(null);
  const currentIndexRef = useRef(0);
  const currentPositionRef = useRef(0);

  const typePlaceholder = useCallback(() => {
    const typeChar = () => {
      const currentText = placeholders[currentIndexRef.current];
      
      if (currentPositionRef.current <= currentText.length) {
        setCurrentPlaceholder(currentText.slice(0, currentPositionRef.current));
        currentPositionRef.current++;
        typewriterRef.current = setTimeout(typeChar, 75);
      } else {
        typewriterRef.current = setTimeout(erasePlaceholder, 2000);
      }
    };

    const erasePlaceholder = () => {
      const currentText = placeholders[currentIndexRef.current];
      
      if (currentPositionRef.current > 0) {
        currentPositionRef.current--;
        setCurrentPlaceholder(currentText.slice(0, currentPositionRef.current));
        typewriterRef.current = setTimeout(erasePlaceholder, 50);
      } else {
        currentIndexRef.current = (currentIndexRef.current + 1) % placeholders.length;
        typewriterRef.current = setTimeout(typeChar, 500);
      }
    };

    // Start typing
    currentPositionRef.current = 0;
    typeChar();
  }, [placeholders]);

  useEffect(() => {
    if (!isTyping) {
      typePlaceholder();
    }
    return () => {
      clearTimeout(typewriterRef.current);
    };
  }, [isTyping, typePlaceholder]);

  const handleInputFocus = () => {
    setIsTyping(true);
    setCurrentPlaceholder('');
    clearTimeout(typewriterRef.current);
  };

  const handleInputBlur = () => {
    if (!inputValue) {
      setIsTyping(false);
      currentPositionRef.current = 0;
      currentIndexRef.current = 0;
      typePlaceholder();
    }
  };

  // Framer Motion variants for the filter panel
  const filterPanelVariants = useMemo(() => ({
    hidden: { 
      opacity: 0, 
      height: 0,
      scale: 0.97,
      y: -10,
      transition: {
        height: { 
          type: "spring", 
          stiffness: 500, 
          damping: 30, 
          mass: 1 
        },
        opacity: { duration: 0.15 },
        scale: { duration: 0.2 },
        y: { duration: 0.2 }
      }
    },
    visible: {
      opacity: 1,
      height: 'auto',
      scale: 1,
      y: 0,
      transition: {
        height: { 
          type: "spring", 
          stiffness: 400, 
          damping: 25, 
          mass: 1,
          bounce: 0.1
        },
        opacity: { 
          duration: 0.2, 
          ease: "easeOut" 
        },
        scale: {
          type: "spring",
          stiffness: 450,
          damping: 15,
          mass: 0.5
        },
        y: {
          type: "spring",
          stiffness: 400,
          damping: 15
        }
      }
    },
    exit: {
      opacity: 0,
      height: 0,
      scale: 0.98,
      transition: {
        height: { 
          type: "linear",
          duration: 0.1,
          ease: "easeOut"
        },
        opacity: { 
          duration: 0.1,
          ease: "easeOut"
        },
        scale: {
          duration: 0.1,
          ease: "easeInOut"
        }
      }
    }
  }), []);

  return (
    <section className="search-wrapper" aria-label="Product search">
      <div className="search-bar-container" role="search">
        {/* Top row: search + filter toggle button */}
        <div className={`search-input-section ${isExpanded ? 'is-expanded' : ''}`}>
          {/* Screen reader only label for the search input */}
          <label htmlFor="search-input" className="sr-only">
            Search for a product
          </label>

          <div className="search-icon" aria-hidden="true">
            <img 
              src="/assets/icons/SearchIcon.svg" 
              alt="Search"
              width="20"
              height="20"
              loading="lazy"
            />
          </div>

          <input
            id="search-input"
            type="text"
            placeholder={isTyping ? '' : currentPlaceholder}
            className="search-input"
            aria-label="Search for a product"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
          />

          <button
            type="button"
            className="filter-button"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-expanded={isExpanded}
            aria-label="Toggle filter panel"
          >
            <img
              src="/assets/icons/SearchFilter.svg"
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
});

export default SearchBar;
