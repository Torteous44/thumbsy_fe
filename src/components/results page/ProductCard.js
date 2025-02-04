import React from 'react';
import LikeButton from './LikeButton';
import '../../styles/components/product cards/ProductCard.css';  // You'll need to move relevant styles here

const ProductCard = ({ product, onClick }) => (
  <div className="result-card" onClick={onClick}>
    <div className="result-main">
      <div className="result-image">
        {(!product.image_url || product.image_url === 'https://example.com/default-image.png') ? (
          <div className="image-error">
            <img 
              src="/assets/icons/thumbsy-icon.svg" 
              alt="Error loading content"
              className="error-icon"
            />
            <span>Oops.. something went wrong.</span>
          </div>
        ) : (
          <img src={product.image_url} alt={product.product_name} />
        )}
      </div>
      <div className="result-content">
        <div className="title-row">
          <h2 className="result-title">{product.product_name}</h2>
          <div className="taste-profile-cell" onClick={(e) => e.stopPropagation()}>
            <LikeButton productId={product.id} />
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
);

export default ProductCard; 