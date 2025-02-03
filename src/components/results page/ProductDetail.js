import React from 'react';
import { motion } from 'framer-motion';
import '../../styles/components/ProductDetail.css';
import LikeButton from './LikeButton';

const ProductDetail = ({ product, onClose }) => {
  return (
    <motion.div 
      className="product-detail-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className="product-detail-content"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="product-header">
          <div className="title-price">
            {product.product_name}
            <span className="price-tag">{product.price}</span>
          </div>
          <div className="header-actions">
            <div className="like-button-cell">
              <LikeButton productId={product.id} />
            </div>
            <button className="close-button" onClick={onClose}>×</button>
          </div>
        </div>

        <div className="product-content">
          <div className="product-image-container">
            {(!product.image_url || product.image_url === 'https://example.com/default-image.png') ? (
              <div className="image-error-container">
                <div className="image-error">
                  <img 
                    src="/assets/icons/thumbsy-icon.svg" 
                    alt="Error loading content"
                    className="error-icon"
                  />
                  <span>Oops.. something went wrong.</span>
                </div>
              </div>
            ) : (
              <img src={product.image_url} alt={product.product_name} />
            )}
            <div className="key-features">
              {product.key_features?.map((feature, index) => (
                <span key={index} className="feature-item">&nbsp;{feature}</span>
              ))}
            </div>
          </div>

          <div className="product-info">
            <p className="description">{product.description}</p>
            
            <div className="info-grid">
              <div className="info-section">
                <h3>Perfect For</h3>
                <p>{product.user_persona}</p>
              </div>

              <div className="info-section">
                <h3>Why It's Special</h3>
                <p>{product.competitive_edge}</p>
              </div>

              <div className="info-section">
                <h3>Brand</h3>
                <p>{product.brand_reputation}</p>
              </div>
            </div>

            {product.awards && (
              <div className="awards-section">
                {product.awards.map((award, index) => (
                  <div key={index} className="award-tag">
                    🏆 {award}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProductDetail; 
