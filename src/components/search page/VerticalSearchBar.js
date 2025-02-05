import React, { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';
import RangeSlider from './RangeSlider';
import '../../styles/components/search bar/VerticalSearchBar.css';

const VerticalSearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [characteristics, setCharacteristics] = useState([]);
  const [selectedCharacteristics, setSelectedCharacteristics] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCharacteristics = async (category) => {
    if (!category.trim()) {
      setCharacteristics([]);
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
    } catch (err) {
      setError(err.message || 'Failed to load suggestions');
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
    // Format the search parameters to match the endpoint requirements
    const searchParams = {
      query: query.trim(),
      min_price: priceRange.min,
      max_price: priceRange.max,
      characteristics: selectedCharacteristics,
      review_sources: [], // Empty as per requirement
      brands: [""] // Empty as per requirement
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
            placeholder="Sneakers..."
          />
        </div>

        {isLoading && (
          <div className="thumbsy-loading">
            Generating characteristics...
          </div>
        )}
        
        {error && (
          <div className="thumbsy-error">
            {error}
            <button onClick={() => fetchCharacteristics(query)} className="thumbsy-retry-button">
              Retry
            </button>
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