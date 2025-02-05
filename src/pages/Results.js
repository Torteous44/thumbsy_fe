import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProductDetail from '../components/results page/ProductDetail';
import SearchBar from '../components/search page/SearchBar';
import ProductCard from '../components/results page/ProductCard';
import VerticalSearchBar from '../components/search page/VerticalSearchBar';
import '../styles/pages/Results.css';

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');

  const headerData = useMemo(() => {
    if (!location.state?.query) return null;
    const query = location.state.query;
    return {
      title: query.query,
      filters: [
        ...(query.characteristics || []),
        query.min_price && query.max_price ? 
          `$${query.min_price} - $${query.max_price}` : '',
      ].filter(Boolean)
    };
  }, [location.state?.query]);

  const sortResults = useMemo(() => {
    if (!sortBy) return results;
    
    return [...results].sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'price') {
        const priceA = parseFloat(a.data.price.toString().replace('$', ''));
        const priceB = parseFloat(b.data.price.toString().replace('$', ''));
        comparison = priceA - priceB;
      } else if (sortBy === 'name') {
        comparison = a.data.product_name.localeCompare(b.data.product_name);
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [results, sortBy, sortDirection]);

  const handleSort = (type) => {
    if (sortBy === type) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(type);
      setSortDirection('asc');
    }
  };

  const fetchResults = async (searchParams) => {
    setIsLoading(true);
    setError(null);
    setResults([]);
    
    try {
      const token = localStorage.getItem('access_token');
      const payload = {
        user_id: parseInt(localStorage.getItem('user_id')),
        query: searchParams.query || "",
        min_price: parseInt(searchParams.min_price) || 0,
        max_price: parseInt(searchParams.max_price) || 1000,
        review_sources: searchParams.review_sources || [],
        characteristics: searchParams.characteristics || [],
        brands: searchParams.brands || [""]
      };

      const response = await fetch('https://thumbsybackend.onrender.com/api/recommend-products/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Failed to fetch recommendations');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let tempResults = [];

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        
        // Process complete JSON objects
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // Keep the incomplete line in buffer

        for (const line of lines) {
          if (line.trim()) {
            try {
              const productWrapper = JSON.parse(line);
              console.log('Received product:', productWrapper.data);
              tempResults.push(productWrapper);
              
              // Update results immediately to show products as they come in
              setResults(prev => [...prev, productWrapper]);
            } catch (e) {
              console.error('Error parsing product:', e);
            }
          }
        }
      }

    } catch (err) {
      setError('Failed to load recommendations. Please try again.');
      console.error('Error fetching results:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (searchParams) => {
    navigate('/search', { state: { query: searchParams } });
    fetchResults(searchParams);
  };

  useEffect(() => {
    if (location.state?.query) {
      fetchResults(location.state.query);
    }
  }, [location.state?.query]);

  return (
    <div className="product-results-container">
      <VerticalSearchBar onSearch={handleSearch} />
      
      <div className="recommendation-content">
        <div className="mobile-search-bar-section">
          <SearchBar onSearch={handleSearch} />
          {headerData?.filters && (
            <div className="filter-tags">
              {headerData.filters.map((filter, index) => (
                <span key={index} className="filter-tag">{filter}</span>
              ))}
            </div>
          )}
        </div>

        {error ? (
          <div className="results-error">
            <p>{error}</p>
            <button onClick={() => fetchResults(location.state?.query)}>Try Again</button>
          </div>
        ) : (
          <>
            {results.length > 0 && (
              <div className="results-controls">
                <h2>Our recommended products:</h2>
                <div className="results-sort">
                  <button 
                    className={`sort-button ${sortBy === 'price' ? 'active' : ''}`}
                    onClick={() => handleSort('price')}
                  >
                    Price {sortBy === 'price' && (sortDirection === 'asc' ? ' ↑' : ' ↓')}
                  </button>
                  <button 
                    className={`sort-button ${sortBy === 'name' ? 'active' : ''}`}
                    onClick={() => handleSort('name')}
                  >
                    Name {sortBy === 'name' && (sortDirection === 'asc' ? ' ↑' : ' ↓')}
                  </button>
                </div>
              </div>
            )}

            <div className="product-recommendations-list">
              {console.log('Products being mapped:', sortResults)}
              {sortResults.map((productWrapper, index) => (
                <div key={`${productWrapper.data.id}-${index}`} className="product-card-wrapper">
                  <ProductCard 
                    product={productWrapper.data} 
                    onClick={() => setSelectedProduct(productWrapper.data)} 
                  />
                </div>
              ))}
            </div>

            {isLoading && results.length === 0 && (
              <div className="search-loading-container">
                <div className="dots-loader">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <div className="search-loading-message">Analyzing your preferences...</div>
                <div className="search-loading-message">Applying taste profile...</div>
                <div className="search-loading-message">Compiling recommendations...</div>
              </div>
            )}
          </>
        )}
        
        {selectedProduct && (
          <ProductDetail 
            product={selectedProduct} 
            onClose={() => setSelectedProduct(null)} 
          />
        )}
      </div>
    </div>
  );
};

export default Results; 