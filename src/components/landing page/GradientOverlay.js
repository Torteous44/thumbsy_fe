import React from 'react';
import '../../styles/components/GradientOverlay.css';

const GradientOverlay = ({ height = '540px' }) => {
  return (
    <div 
      className="gradient-overlay" 
      style={{ height: height }}
    />
  );
};

export default GradientOverlay; 