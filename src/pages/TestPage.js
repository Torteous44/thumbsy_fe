import React from 'react';
import ProductCard from '../components/ProductCard';
import '../styles/components/ProductCard.css';

const TestPage = () => {
  return (
    <div style={{
      minHeight: '100vh',
      padding: '40px',
      backgroundColor: '#f5f5f5',
    }}>
      {/* Single centered card */}
      <div style={{
        marginBottom: '40px',
        display: 'flex',
        justifyContent: 'center'
      }}>
        <ProductCard />
      </div>

      {/* Removed multiple product cards */}
    </div>
  );
};

export default TestPage; 