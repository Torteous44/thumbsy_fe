// RangeSlider.js
import React from 'react';
import '../../styles/components/RangeSlider.css';

const RangeSlider = ({ min, max, value, onChange, formatLabel, step }) => {
  const handleMinChange = (e) => {
    const newMin = Math.min(Number(e.target.value), value.max - step * 2);
    onChange({ ...value, min: newMin });
  };

  const handleMaxChange = (e) => {
    const newMax = Math.max(Number(e.target.value), value.min + step * 2);
    onChange({ ...value, max: newMax });
  };

  // Calculate the position of the track highlight
  const getTrackStyle = () => {
    const percent1 = ((value.min - min) / (max - min)) * 100;
    const percent2 = ((value.max - min) / (max - min)) * 100;
    return {
      left: `${percent1}%`,
      width: `${percent2 - percent1}%`
    };
  };

  return (
    <div className="price-range">
      <span>{formatLabel(value.min)}</span>
      <div className="range-slider">
        <div className="slider-track" style={getTrackStyle()}></div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value.min}
          onChange={handleMinChange}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value.max}
          onChange={handleMaxChange}
        />
      </div>
      <span>{formatLabel(value.max)}</span>
    </div>
  );
};

export default RangeSlider;
