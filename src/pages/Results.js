import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductDetail from '../components/ProductDetail';
import '../styles/pages/Results.css';

const Results = () => {
  const location = useLocation();
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [error, setError] = useState(null);
  const [metadata, setMetadata] = useState(null);

  const formatHeader = (query) => {
    if (!query) return null;

    if (metadata) {
      console.log('Metadata received:', metadata);
      
      // Include characteristics from the original query since they might not be in metadata
      const allFilters = [
        metadata.price_range || '',
        ...(query.characteristics || []),  // Add characteristics from query
        ...(metadata.filters || []),
        ...(metadata.sources || []).map(s => s.replace('_', ' '))
      ].filter(Boolean);

      console.log('Processed filters:', allFilters);

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
  };

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const tokenType = localStorage.getItem('token_type');
        
        if (!token) {
          throw new Error('Authentication required');
        }

        const searchQuery = location.state?.query;
        console.log('Received search query:', searchQuery);

        if (!searchQuery) {
          throw new Error('No search query provided');
        }

        const payload = {
          query: searchQuery.query || "",
          min_price: parseInt(searchQuery.min_price) || 0,
          max_price: parseInt(searchQuery.max_price) || 1000,
          review_sources: searchQuery.review_sources || [],
          characteristics: searchQuery.characteristics || [],
          brands: searchQuery.brands || []
        };

        console.log('Sending payload to backend:', payload);

        const response = await fetch('https://qrbackend-ghtk.onrender.com/recommendations/stream', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${tokenType} ${token}`,
            'Accept': 'application/x-ndjson'
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        setResults([]); // Clear previous results
        
        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value);
          console.log('Received chunk:', chunk); // Log raw chunk
          
          const lines = chunk.split('\n').filter(line => line.trim());
          
          for (const line of lines) {
            try {
              const data = JSON.parse(line);
              console.log('Parsed data:', data); // Log parsed data
              if (data.type === 'metadata') {
                setMetadata(data);
              } else if (data.type === 'product') {
                console.log('Adding product to results:', data.data); // Log product data
                setResults(prev => [...prev, data.data]);
              }
            } catch (e) {
              console.error('Error parsing chunk:', e);
            }
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

  const headerData = formatHeader(location.state?.query);

  return (
    <div className="grid-results-page">
      {headerData && (
        <header className="grid-page-header">
          <h1 className="grid-page-title">{headerData.title}</h1>
          <div className="grid-page-filters">
            {headerData.filters.map((filter, index) => (
              <span key={index} className="grid-page-filter-tag">
                {filter}
              </span>
            ))}
          </div>
        </header>
      )}

      <div className="grid-products">
        {results.map((product, index) => (
          <div 
            key={`${product.product_name}-${index}`}
            className="grid-card" 
            onClick={() => setSelectedProduct(product)}
          >
            <div className="grid-image-container">
              <img 
                src={product.image_url} 
                alt={product.product_name} 
                className="grid-image"
              />
              <span className="grid-price">{product.price}</span>
              <div className="grid-info">
                <div className="grid-header">
                  <h2>{product.product_name}</h2>
                  <p className="grid-brand">{product.brand}</p>
                </div>
                <button className="grid-see-more">Learn more</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedProduct && (
        <ProductDetail 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      )}

      {isLoading && (
        <div className="grid-loading">
          <div className="loading-dots">
            <motion.span
              animate={{
                y: ["0%", "-100%", "0%"],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0
              }}
            />
            <motion.span
              animate={{
                y: ["0%", "-100%", "0%"],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.2
              }}
            />
            <motion.span
              animate={{
                y: ["0%", "-100%", "0%"],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.4
              }}
            />
          </div>

        </div>
      )}

      {error && (
        <div className="grid-error">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default Results; 