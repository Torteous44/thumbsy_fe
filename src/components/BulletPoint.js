import React from 'react';
import '../styles/components/ProductCard.css';

const BulletPoint = ({ text }) => {
  return (
    <div className="bullet-point">
      <div className="bullet-dot" />
      <div className="bullet-text">{text}</div>
    </div>
  );
};

export default BulletPoint; 