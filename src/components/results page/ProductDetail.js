import React from 'react';
import { motion } from 'framer-motion';
import '../../styles/components/product cards/ProductDetail.css';
import LikeButton from './LikeButton';

const ProductDetail = ({ product, onClose }) => {
  const [activeTab, setActiveTab] = React.useState('specs');
  const [isImageZoomed, setIsImageZoomed] = React.useState(false);

  React.useEffect(() => {
    // Store the current scroll position
    const scrollY = window.scrollY;
    document.documentElement.style.setProperty('--scroll-position', `-${scrollY}px`);
    document.body.classList.add('modal-open');
    
    // Cleanup function
    return () => {
      document.body.classList.remove('modal-open');
      // Restore the scroll position
      window.scrollTo(0, parseInt(scrollY || '0'));
    };
  }, []);

  const handleImageClick = (e) => {
    e.stopPropagation();
    setIsImageZoomed(!isImageZoomed);
  };

  return (
    <motion.div 
      className="product-detail-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      {isImageZoomed && (
        <div className="zoomed-image-overlay" onClick={handleImageClick}>
          <img 
            src={product.image_url} 
            alt={product.product_name} 
            className="zoomed-image"
            onClick={handleImageClick}
            style={{ cursor: 'zoom-out' }}
          />
        </div>
      )}
      <motion.div 
        className="product-detail-content"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="product-header-simple">
          <div className="header-left">
            <p className="best-for">The best for {product.user_persona}</p>
          </div>
          <div className="header-right">
            <LikeButton productId={product.id} className="product-detail-like-button" />
            <button 
              className="close-button" 
              onClick={onClose}
              aria-label="Close details"
            >
              ×
            </button>
          </div>
        </div>

        <div className="product-main-content">
          <div className="product-top-section">
            <div className="product-image-section" onClick={handleImageClick}>
              <img 
                src={product.image_url} 
                alt={product.product_name} 
                style={{ cursor: 'zoom-in' }}
              />
            </div>

            <div className="product-info-simple">
              <h2 className="product-title">{product.product_name}</h2>
              <p className="brand-name-title">{product.brand}</p>
              <p className="main-description">{product.description}</p>
              <button className="buy-button">
                {product.price} 
                <img 
                  src="/assets/icons/DiagonalUpArrow.svg" 
                  alt="Open link" 
                  className="diagonal-arrow"
                />
              </button>
            </div>
          </div>

          <div className="product-details-section">
            <div className="descriptors">
              {product.key_features?.map((item, index) => (
                <div key={index} className="descriptor-item">
                  <span className="adjective">
                    {item.adjectives.charAt(0).toUpperCase() + item.adjectives.slice(1)}
                  </span>
                  <span className="descriptor">{item.feature}</span>
                </div>
              ))}
            </div>

            <div className="why-special">
              <h3>Why it's special</h3>
              <p>{product.competitive_edge}</p>
            </div>
            <div className="why-special">
              <h3>{product.brand}</h3>
              <p>{product.brand_reputation}</p>
            </div>

            <div className="bottom-section">
              <div className="bottom-tabs">
                <button 
                  className={`tab ${activeTab === 'specs' ? 'active' : ''}`}
                  onClick={() => setActiveTab('specs')}
                >
                  Specs
                </button>
                <button 
                  className={`tab ${activeTab === 'reviews' ? 'active' : ''}`}
                  onClick={() => setActiveTab('reviews')}
                >
                  Reviews
                </button>
              </div>
              <div className="tab-content">
                {activeTab === 'specs' && (
                  <>
                    <div>Specifications</div>
                    <div>{product.specifications}</div>
                  </>
                )}
                {activeTab === 'reviews' && (
                  <>
                    <div>Reviews</div>
                    {/* Reviews content */}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProductDetail; 
