import React from 'react';
import LikeButton from './LikeButton';
import ProductDetail from './ProductDetail';
import '../../styles/components/product cards/ProductCard.css';

const ProductCard = ({ product }) => {
  const [isDetailOpen, setIsDetailOpen] = React.useState(false);

  const handleCardClick = (e) => {
    // Prevent opening detail if clicking like button
    if (e.target.closest('.like-button-wrapper')) {
      return;
    }
    setIsDetailOpen(true);
  };

  return (
    <>
      <div className="result-card" onClick={handleCardClick}>
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
            <div className="like-button-wrapper">
              <LikeButton productId={product.id} />
            </div>
            
            <div className="title-row">
              <h3 className="result-title">{product.product_name}</h3>
            </div>
            <p className="result-brand">{product.brand}</p>
            <p className="result-description">{product.description}</p>
            
            <div className="result-price-container">
              <span className="result-price">{product.price}</span>
            </div>
            
            <button className="learn-more">
              Learn more
            </button>
          </div>
        </div>
      </div>

      {isDetailOpen && (
        <ProductDetail 
          product={product} 
          onClose={() => setIsDetailOpen(false)} 
        />
      )}
    </>
  );
};

export default ProductCard; 