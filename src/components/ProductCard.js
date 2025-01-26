import React from 'react';
import ImageGallery from './ImageGallery';
import BulletPoint from './BulletPoint';
import '../styles/components/ProductCard.css';

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <div className="card">
        <img className="close-icon" src="/assets/icons/CloseButton.svg" alt="Close" />
        <div className="content">
          <div className="header">
            <div className="product-info">
              <div className="product-title">{product.title}</div>
              <div className="brand-name">{product.brand}</div>
            </div>
            <div className="price-section">
              <div className="price-container">
                <div className="price-wrapper">
                  <img className="price-icon" src="/assets/icons/PriceTag.svg" alt="Price" />
                  <div>{product.price}</div>
                </div>
              </div>
            </div>
          </div>
          <ImageGallery images={product.images} />
          <div className="feature-section">
            <div className="bullet-points">
              {product.features.map((feature, index) => (
                <BulletPoint key={index} text={feature} />
              ))}
            </div>
            <div className="description">
              <div className="description-text">{product.description}</div>
              <div className="learn-more">Learn more</div>
            </div>
          </div>
          <div className="comparison-section">
            <div className="comparison-text">Compare with similar items</div>
            <img 
              className="comparison-icon" 
              src="/assets/icons/ChevronRight.svg" 
              alt="Compare"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 