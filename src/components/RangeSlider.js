// RangeSlider.js
import React, { useState } from 'react';
import '../styles/components/SearchBar.css'; // Assuming your CSS is here

const RangeSlider = () => {
  const min = 0;
  const max = 1000;

  // You can customize the initial values
  const [priceRange, setPriceRange] = useState([200, 620]);

  // Calculate the percentage positions of the two thumbs
  const minPercent = (priceRange[0] / max) * 100;
  const maxPercent = (priceRange[1] / max) * 100;

  // Event handler for the lower thumb
  const handleMinChange = (e) => {
    const value = parseInt(e.target.value);
    if (value <= priceRange[1]) {
      setPriceRange([value, priceRange[1]]);
    }
  };

  // Event handler for the upper thumb
  const handleMaxChange = (e) => {
    const value = parseInt(e.target.value);
    if (value >= priceRange[0]) {
      setPriceRange([priceRange[0], value]);
    }
  };

  return (
    <div className="price-range">
      <span className="price-value">${priceRange[0]}</span>

      <div className="range-slider">
        {/* Highlighted track between the two thumbs */}
        <div
          className="slider-track"
          style={{
            left: `${minPercent}%`,
            width: `${maxPercent - minPercent}%`
          }}
        />
        {/* Lower thumb */}
        <input
          type="range"
          min={min}
          max={max}
          value={priceRange[0]}
          onChange={handleMinChange}
        />
        {/* Upper thumb */}
        <input
          type="range"
          min={min}
          max={max}
          value={priceRange[1]}
          onChange={handleMaxChange}
        />
      </div>

      <span className="price-value">${priceRange[1]}</span>
    </div>
  );
};

export default RangeSlider;
