import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import ProductDetail from '../components/ProductDetail';
import SearchBar from '../components/SearchBar';
import '../styles/pages/Results.css';

const Results = () => {
  const location = useLocation();
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [error, setError] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [sortBy, setSortBy] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [productLikes, setProductLikes] = useState({});

  const formatHeader = useCallback((query) => {
    if (!query) return null;

    if (metadata) {
      const allFilters = [
        metadata.price_range || '',
        ...(metadata.filters || []),
        ...(metadata.sources || []).map(s => s.replace('_', ' '))
      ].filter(Boolean);

      return {
        title: metadata.title,
        filters: allFilters
      };
    }

    const filterCriteria = [
      query.max_price === 0 ? 'Any price' : `$${query.min_price || 0} - $${query.max_price || 0}`,
      ...(query.characteristics || []),
      ...(query.brands || []),
      ...((query.review_sources || []).map(source => source.replace('_', ' ')))
    ].filter(Boolean);

    return {
      title: `The best ${query.query} in ${new Date().getFullYear()}`,
      filters: filterCriteria
    };
  }, [metadata]);

  const headerData = useMemo(() => 
    formatHeader(location.state?.query), 
    [location.state?.query, formatHeader]
  );

  const sortResults = useMemo(() => {
    if (!sortBy) return results;
    
    return [...results].sort((a, b) => {
      if (sortBy === 'price') {
        const priceA = parseFloat(a.price.replace(/[^0-9.-]+/g, ''));
        const priceB = parseFloat(b.price.replace(/[^0-9.-]+/g, ''));
        return sortDirection === 'asc' ? priceA - priceB : priceB - priceA;
      }
      if (sortBy === 'name') {
        return sortDirection === 'asc' 
          ? a.product_name.localeCompare(b.product_name)
          : b.product_name.localeCompare(a.product_name);
      }
      return 0;
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

  const handleLikeToggle = useCallback(async (productId, isLiked, event) => {
    event.stopPropagation(); // Prevent card click event
    
    try {
      const token = localStorage.getItem('access_token');
      const tokenType = localStorage.getItem('token_type');
      
      if (!token) throw new Error('Authentication required');

      const response = await fetch(
        `https://qrbackend-ghtk.onrender.com/search/products/${productId}/like`,
        {
          method: isLiked ? 'DELETE' : 'POST',
          headers: {
            'Authorization': `${tokenType} ${token}`,
          }
        }
      );

      if (!response.ok) throw new Error('Failed to update like status');

      // Update local state
      setProductLikes(prev => ({
        ...prev,
        [productId]: {
          ...prev[productId],
          is_liked_by_user: !isLiked
        }
      }));

    } catch (error) {
      console.error('Error toggling like:', error);
    }
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const tokenType = localStorage.getItem('token_type');
        
        if (!token) throw new Error('Authentication required');
        if (!location.state?.query) throw new Error('No search query provided');

        const payload = {
          query: location.state.query.query || "",
          min_price: parseInt(location.state.query.min_price) || 0,
          max_price: parseInt(location.state.query.max_price) || 1000,
          review_sources: location.state.query.review_sources || [],
          characteristics: location.state.query.characteristics || [],
          brands: location.state.query.brands || []
        };

        const response = await fetch('https://qrbackend-ghtk.onrender.com/recommendations/stream', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${tokenType} ${token}`,
            'Accept': 'application/x-ndjson'
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error(`Request failed with status ${response.status}`);

        setResults([]);
        
        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        let buffer = '';
        
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          
          buffer += decoder.decode(value, { stream: true });
          
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';
          
          const newProducts = [];
          
          for (const line of lines) {
            if (!line.trim()) continue;
            
            try {
              const data = JSON.parse(line);
              if (data.type === 'metadata') {
                setMetadata(data);
              } else if (data.type === 'product') {
                newProducts.push(data.data);
              }
            } catch (e) {
              console.error('Error parsing chunk:', e);
            }
          }
          
          if (newProducts.length > 0) {
            setResults(prev => [...prev, ...newProducts]);
          }
        }

      } catch (err) {
        console.error('Error details:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (location.state?.query) {
      setIsLoading(true);
      setError(null);
      fetchResults();
    }
  }, [location.state]);

  // Fetch initial like status for all products
  useEffect(() => {
    const fetchLikeStatus = async (productId) => {
      try {
        const token = localStorage.getItem('access_token');
        const tokenType = localStorage.getItem('token_type');
        
        const response = await fetch(
          `https://qrbackend-ghtk.onrender.com/search/products/${productId}/likes`,
          {
            headers: token ? {
              'Authorization': `${tokenType} ${token}`
            } : {}
          }
        );

        if (!response.ok) throw new Error('Failed to fetch like status');
        
        const data = await response.json();
        setProductLikes(prev => ({
          ...prev,
          [productId]: data
        }));

      } catch (error) {
        console.error('Error fetching like status:', error);
      }
    };

    results.forEach(product => {
      if (product.id) {
        fetchLikeStatus(product.id);
      }
    });
  }, [results]);

  const productList = useMemo(() => (
    <div className="grid-products">
      {sortResults.map((product, index) => (
        <div className="result-card" key={`${product.product_name}-${index}`} onClick={() => setSelectedProduct(product)}>

          <div className="result-main">
            <div className="result-image">
              <img src={product.image_url} alt={product.product_name} />
            </div>
            <div className="result-content">
              <div className="title-row">
                <h2 className="result-title">{product.product_name}</h2>
                <div 
                  className="taste-profile-cell"
                  onClick={(e) => handleLikeToggle(
                    product.id, 
                    productLikes[product.id]?.is_liked_by_user,
                    e
                  )}
                >
                  <img 
                    src="/assets/icons/thumbsy-icon.svg" 
                    alt="Add to taste profile" 
                    className={`thumbsy-icon ${productLikes[product.id]?.is_liked_by_user ? 'liked' : ''}`}
                  />
                </div>
              </div>
              <div className="result-brand">{product.brand}</div>
              <div className="result-description">{product.description}</div>
              <div className="result-action">
                <div className="result-price">{product.price}</div>
                <button className="learn-more">Learn more ›</button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  ), [sortResults, setSelectedProduct, productLikes, handleLikeToggle]);

  return (
    <div className="results-container">
      <div className="search-section">
        <SearchBar />
        <div className="filter-tags">
          {headerData?.filters.map((filter, index) => (
            <span key={index} className="filter-tag">{filter}</span>
          ))}
        </div>
      </div>
      
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
      
      {productList}
      
      {isLoading && (
        <div className="grid-loading">
          <div className="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      )}
      {error && <div className="result-error">{error}</div>}
      {selectedProduct && (
        <ProductDetail 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      )}
    </div>
  );
};

export default Results; 