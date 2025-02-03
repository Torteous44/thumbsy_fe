import React, { useState, memo, useMemo, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RangeSlider from './RangeSlider';
import '../../styles/components/SearchBar.css';
import { useNavigate } from 'react-router-dom';
import { useModal } from '../../contexts/ModalContext';

const SearchBar = memo(({ onSearch, onExpandChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentPlaceholder, setCurrentPlaceholder] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [apiError] = useState(null);

  const [characteristics, setCharacteristics] = useState([]);
  const [brands, setBrands] = useState([]);
  const [reviewSources, setReviewSources] = useState([]);

  const [activeInput, setActiveInput] = useState(null); // Tracks which section's `+` is active
  const [newFilterValue, setNewFilterValue] = useState(''); // Holds the input value for the active filter

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
    "Search for high-performance sports gear...",
    "Find your next favorite coffee maker...",
    "Discover premium wireless earbuds...",
    "Explore ergonomic office chairs...",
    "Find the best gaming monitors...",
    "Search for professional camera equipment...",
    "Browse sustainable fashion brands...",
    "Find smart home security systems...",
    "Discover luxury skincare products...",
    "Explore outdoor camping gear...",
    "Find premium kitchen appliances...",
    "Search for vintage vinyl records...",
    "Browse designer sunglasses...",
    "Find mechanical keyboards...",
    "Discover artisanal home decor...",
    "Search for fitness tracking devices...",
    "Explore premium audio systems...",
    "Find electric scooters and bikes...",
    "Browse minimalist watches...",
    "Discover premium yoga equipment...",
    "Find sustainable water bottles..."
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

    currentPositionRef.current = 0;
    typeChar();
  }, [placeholders]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isTyping && !isMobile) {
      typePlaceholder();
    }
    return () => {
      clearTimeout(typewriterRef.current);
    };
  }, [isTyping, typePlaceholder, isMobile]);

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

  const handleAddFilter = (setFilterState) => {
    if (newFilterValue.trim()) {
      setFilterState((prev) => [...prev, { id: Date.now(), value: newFilterValue.trim() }]);
      setNewFilterValue('');
      setActiveInput(null); // Close the input
    }
  };

  const handleRemoveFilter = (id, setFilterState) => {
    setFilterState((prev) => prev.filter((filter) => filter.id !== id));
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && inputValue.trim()) {
      // Check if user is authenticated
      const token = localStorage.getItem('access_token');
      if (!token) {
        // Show auth card if not authenticated
        openAuthCard(true);
        return;
      }
      handleSearch();
    }
  };

  const [isSearching] = useState(false);


  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });

  const handlePriceRangeChange = (newRange) => {
    setPriceRange(newRange);
  };

  const navigate = useNavigate();

  const { openAuthCard } = useModal();

  const handleSearch = async () => {
    if (!inputValue.trim()) return;

    // Check if user is authenticated
    const token = localStorage.getItem('access_token');
    if (!token) {
      // Show auth card if not authenticated
      openAuthCard(true);
      return;
    }

    // Format the query data
    const searchData = {
      query: inputValue.trim(),
      min_price: parseInt(priceRange.min),
      max_price: parseInt(priceRange.max),
      characteristics: characteristics.map(c => c.value.toLowerCase()),
      brands: brands.map(b => b.value.toLowerCase()),
      review_sources: reviewSources.map(rs => rs.value.toLowerCase().replace(' ', '_'))
    };

    // Navigate to results page
    navigate('/results', { state: { query: searchData } });
  };

  const filterInputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeInput && filterInputRef.current && !filterInputRef.current.contains(event.target)) {
        const addButton = document.querySelector('.add-tag');
        if (!addButton || !addButton.contains(event.target)) {
          setActiveInput(null);
          setNewFilterValue('');
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeInput]);

  const renderFilterSection = (title, filters, setFilters, sectionKey) => (
    <section className="filter-section">
      <h3>{title}</h3>
      <div className="filter-tags-search">
        {filters.map((filter) => (
          <motion.button
            key={filter.id}
            className="filter-tag-search"
            onClick={() => handleRemoveFilter(filter.id, setFilters)}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <span>{filter.value}</span>
            <span className="remove-tag" aria-hidden="true">×</span>
          </motion.button>
        ))}
        <motion.div
          className="add-tag-wrapper"
          initial={{ width: "36px", padding: "0" }}
          animate={{
            width: activeInput === sectionKey ? "200px" : "36px",
            padding: activeInput === sectionKey ? "0 8px" : "0",
          }}
          transition={{ 
            duration: activeInput === sectionKey ? 0.3 : 0, // Immediate close, smooth open
            ease: "easeOut"
          }}
        >
          {activeInput === sectionKey ? (
            <div className="add-tag-expanded" ref={filterInputRef}>
              <input
                type="text"
                className="add-tag-input"
                value={newFilterValue}
                onChange={(e) => setNewFilterValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    setActiveInput(null);
                    setNewFilterValue('');
                  } else if (e.key === 'Enter') {
                    handleAddFilter(setFilters);
                  }
                }}
                placeholder="Add a filter..."
                autoFocus
              />
              <button
                className="add-tag-check"
                onClick={() => handleAddFilter(setFilters)}
                style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <img 
                  src="/assets/icons/check.svg" 
                  alt="Add"
                  width="16"
                  height="16"
                />
              </button>
            </div>
          ) : (
            <button
              className="add-tag"
              onClick={() => setActiveInput(sectionKey)}
            >
              +
            </button>
          )}
        </motion.div>
      </div>
    </section>
  );

  // Add ref for the search container
  const searchContainerRef = useRef(null);

  // Add click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded]);

  // Add effect to notify parent of expansion state changes
  useEffect(() => {
    onExpandChange?.(isExpanded);
  }, [isExpanded, onExpandChange]);

  return (
    <section className="search-wrapper" aria-label="Product search">
      <div className="search-bar-container" ref={searchContainerRef} role="search">
        {apiError && (
          <div className="error-message" role="alert">
            {apiError}
          </div>
        )}
        <div className={`search-input-section ${isExpanded ? 'is-expanded' : ''}`}>
          <label htmlFor="search-input" className="sr-only">
            Search for a product
          </label>
          <div className="search-icon" aria-hidden="true">
            {isSearching ? (
              <span className="loading-spinner" />
            ) : (
              <img
                src="/assets/icons/SearchIcon.svg"
                alt="Search"
                width="20"
                height="20"
                loading="lazy"
              />
            )}
          </div>
          <input
            id="search-input"
            type="text"
            placeholder={isMobile ? "Search..." : currentPlaceholder}
            className="search-input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onKeyDown={handleKeyPress}
            disabled={isSearching}
          />
          <button
            type="button"
            className="filter-button"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-expanded={isExpanded}
          >
            <img src="/assets/icons/SearchFilter.svg" alt="Search Filter Icon" />
          </button>
        </div>
        <AnimatePresence mode="sync">
          {isExpanded && (
            <motion.aside
              className="filter-panel"
              initial={{ opacity: 0, y: -10 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                transition: {
                  duration: 0.3,
                  ease: "easeOut"
                }
              }}
              exit={{ 
                opacity: 0,
                y: -10,
                transition: {
                  duration: 0
                }
              }}
            >
              <div className="filter-panel-content">
                <section className="filter-section">
                  <h3>Price</h3>
                  <RangeSlider
                    min={0}
                    max={1000}
                    step={5}
                    value={priceRange}
                    onChange={handlePriceRangeChange}
                    formatLabel={(value) => `$${value}`}
                  />
                </section>
                {renderFilterSection("Characteristics", characteristics, setCharacteristics, "characteristics")}
                {renderFilterSection("Brands", brands, setBrands, "brands")}
                {renderFilterSection("Review Sources", reviewSources, setReviewSources, "reviewSources")}
                
                <motion.button
                  className="search-submit-button"
                  onClick={handleSearch}
                  whileHover={{ scale: 1.05 }}
                  aria-label="Search with filters"
                >
                  <img 
                    src="/assets/icons/ArrowRight.svg" 
                    alt="Search" 
                    width="24" 
                    height="24"
                  />
                </motion.button>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
});

export default SearchBar;
