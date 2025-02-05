import React from 'react';
import LikeButton from './LikeButton';
import '../../styles/components/product cards/ProductCard.css';

const ProductCard = ({ product, onClick }) => (
  <div className="result-card" onClick={onClick}>
    <div className="result-main">
      <div className="result-image">
        <img 
          src={product.image_url} 
          alt={product.product_name}
          onError={(e) => {
            e.target.parentElement.innerHTML = `
              <div class="image-error">
                <img 
                  src="/assets/icons/thumbsy-icon.svg" 
                  alt="Error loading content"
                  class="error-icon"
                />
              </div>
            `;
          }}
        />
      </div>
      <div className="result-content">
        <div className="title-row">
          <div className="product-header">
            <h2 className="result-title">{product.product_name}</h2>
            <div className="result-brand">{product.brand}</div>
          </div>
          <div className="like-button-wrapper" onClick={(e) => e.stopPropagation()}>
            <LikeButton productId={product.id} />
          </div>
        </div>
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