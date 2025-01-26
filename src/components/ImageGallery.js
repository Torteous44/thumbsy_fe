import React from 'react';
import '../styles/components/ProductCard.css';

const ImageGallery = ({ images }) => {
  return (
    <div className="image-gallery">
      {images.map((image, index) => (
        <img
          key={index}
          src={image}
          alt={`Product ${index + 1}`}
          className="gallery-image"
          draggable="false"
        />
      ))}
    </div>
  );
};

export default ImageGallery; 