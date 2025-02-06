import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { debounce } from 'lodash';
import RangeSlider from './RangeSlider';
import '../../styles/components/search bar/VerticalSearchBar.css';
import { useModal } from '../../contexts/ModalContext';
import { useAuth } from '../../contexts/AuthContext';

const VerticalSearchBar = ({ onSearch }) => {
  const { openAuthCard } = useModal();
  const { isAuthenticated } = useAuth();
  const [query, setQuery] = useState('');
  const [characteristics, setCharacteristics] = useState([]);
  const [selectedCharacteristics, setSelectedCharacteristics] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPlaceholder, setCurrentPlaceholder] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const typewriterRef = useRef(null);
  const currentIndexRef = useRef(0);
  const currentPositionRef = useRef(0);

  const placeholders = useMemo(() => [
    "Sneakers...",
    "Gaming laptop...",
    "Wireless headphones...",
    "Smart watch...",
    "Coffee maker...",
    "Backpack...",
    "Running shoes...",
    "Smartphone...",
    "Digital camera...",
    "Bluetooth speaker...",
    "Mechanical keyboard...",
    "Gaming mouse...",
    "Yoga mat...",
    "Air purifier...",
    "Electric scooter...",
    "Drone...",
    "Fitness tracker...",
    "Standing desk...",
    "Robot vacuum...",
    "Ergonomic chair...",
    "Smart thermostat...",
    "Portable charger...",
    "Wireless earbuds...",
    "Gaming console...",
    "Tablet...",
    "Smart doorbell...",
    "Blender...",
    "Air fryer...",
    "Security camera...",
    "Smart light bulbs...",
    "Electric toothbrush...",
    "Instant pot...",
    "Noise cancelling headphones...",
    "Smart speaker...",
    "Projector...",
    "Smartpen...",
    "Water bottle...",
    "Sunglasses...",
    "Hiking boots...",
    "Sleeping bag..."
  ], []);

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
    if (!query) {
      setIsTyping(false);
      currentPositionRef.current = 0;
      currentIndexRef.current = 0;
      typePlaceholder();
    }
  };

  const fetchCharacteristics = async (category) => {
    if (!category.trim()) {
      setCharacteristics([]);
      setSelectedCharacteristics([]);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('https://thumbsybackend.onrender.com/llm/characteristics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ category: category.trim().toLowerCase() })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch characteristics');
      }
      
      const data = await response.json();
      setCharacteristics(data.suggestions || []);
      setSelectedCharacteristics([]);
    } catch (err) {
      setError(
        err.message === 'Invalid category. Please provide a valid consumer product category.' 
          ? 'Please enter a valid product category (e.g., "laptop", "headphones", "camera").'
          : 'Failed to load suggestions'
      );
      console.error('Error fetching characteristics:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedFetch = useCallback(
    debounce((category) => fetchCharacteristics(category), 500),
    []
  );

  useEffect(() => {
    if (query) {
      debouncedFetch(query);
    } else {
      setCharacteristics([]);
    }
    
    return () => {
      debouncedFetch.cancel();
    };
  }, [query, debouncedFetch]);

  const handleCharacteristicClick = (characteristic) => {
    setSelectedCharacteristics(prev => 
      prev.includes(characteristic)
        ? prev.filter(c => c !== characteristic)
        : [...prev, characteristic]
    );
  };

  const handleSearch = () => {
    if (!isAuthenticated) {
      openAuthCard(true);
      return;
    }

    const searchParams = {
      query: query.trim(),
      min_price: priceRange.min,
      max_price: priceRange.max,
      characteristics: selectedCharacteristics,
      review_sources: [],
      brands: [""]
    };
    
    onSearch(searchParams);
  };

  return (
    <div className="thumbsy-vertical-search">
      <div className="thumbsy-search-content">
        <div className="thumbsy-search-header">
          <h2>Search for a product</h2>
          <p>Get recommendations generated, tailored for you.</p>
        </div>

        <div className="thumbsy-search-input">
          <label htmlFor="product-search">Product name</label>
          <input
            id="product-search"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={currentPlaceholder}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
          />
        </div>

        {isLoading && (
          <div className="thumbsy-loading">
            Generating characteristics...
          </div>
        )}
        
        {error && (
          <div className="thumbsy-error">
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 20 20" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM11 15H9V13H11V15ZM11 11H9V5H11V11Z" 
                fill="#DC2626"
              />
            </svg>
            <p>{error}</p>
            {!error.includes('valid product category') && (
              <button onClick={() => fetchCharacteristics(query)} className="thumbsy-retry-button">
                Retry
              </button>
            )}
          </div>
        )}

        <div className="thumbsy-characteristics-container">
          {characteristics.length > 0 && (
            <div className="thumbsy-characteristics">
              <h3>Characteristics ({selectedCharacteristics.length})</h3>
              <div className="thumbsy-characteristics-tags">
                {characteristics.map((characteristic, index) => (
                  <button
                    key={index}
                    className={`thumbsy-characteristic-tag ${
                      selectedCharacteristics.includes(characteristic) ? 'selected' : ''
                    }`}
                    onClick={() => handleCharacteristicClick(characteristic)}
                  >
                    {characteristic}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="thumbsy-fixed-bottom">
        <div className="thumbsy-price-range">
          <h3>Price Range</h3>
          <RangeSlider
            min={0}
            max={1000}
            value={priceRange}
            onChange={setPriceRange}
            step={10}
            formatLabel={(value) => `$${value}`}
          />
        </div>

        <button 
          className="thumbsy-generate-button"
          onClick={handleSearch}
          disabled={!query.trim()}
        >
          Generate recommendations
        </button>
      </div>
    </div>
  );
};

export default VerticalSearchBar; 