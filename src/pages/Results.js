import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import ProductDetail from '../components/results page/ProductDetail';
import SearchBar from '../components/search page/SearchBar';
import ProductCard from '../components/results page/ProductCard';
import '../styles/pages/Results.css';

const Results = () => {
  const location = useLocation();
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');

  const formatHeader = useCallback((query) => {
    if (!query) return null;

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
  }, []);

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

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const token = localStorage.getItem('access_token');
        
        if (!token) throw new Error('Authentication required');
        if (!location.state?.query) throw new Error('No search query provided');

        const payload = {
          user_id: parseInt(localStorage.getItem('user_id')),
          query: location.state.query.query || "",
          min_price: parseInt(location.state.query.min_price) || 0,
          max_price: parseInt(location.state.query.max_price) || 1000,
          review_sources: location.state.query.review_sources || [],
          characteristics: location.state.query.characteristics || [],
          brands: location.state.query.brands || [""]
        };

        const response = await fetch('https://thumbsybackend.onrender.com/api/recommend-products/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        // Get the reader for streaming
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          
          if (done) break;
          
          // Decode the chunk and add it to our buffer
          buffer += decoder.decode(value, { stream: true });
          
          // Split buffer by newlines to get complete JSON objects
          const lines = buffer.split('\n');
          
          // Keep the last (potentially incomplete) line in the buffer
          buffer = lines.pop() || '';
          
          // Process complete JSON objects
          for (const line of lines) {
            try {
              if (!line.trim()) continue;
              
              const product = JSON.parse(line);
              if (product.type === 'product' && product.data) {
                setResults(prev => [...prev, product.data]);
              }
            } catch (parseError) {
              console.warn('Failed to parse product:', parseError);
            }
          }
        }

        // Process any remaining data in the buffer
        if (buffer.trim()) {
          try {
            const product = JSON.parse(buffer);
            if (product.type === 'product' && product.data) {
              setResults(prev => [...prev, product.data]);
            }
          } catch (parseError) {
            console.warn('Failed to parse final product:', parseError);
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
      setResults([]); // Reset results before fetching
      fetchResults();
    }
  }, [location.state]);

  const productList = useMemo(() => (
    <div className="grid-products">
      {sortResults.map((product, index) => (
        <ProductCard
          key={`${product.product_name}-${index}`}
          product={product}
          onClick={() => setSelectedProduct(product)}
        />
      ))}
    </div>
  ), [sortResults, setSelectedProduct]);

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