import React from 'react';
import '../styles/components/ProductCard.css';

const ProductCard = () => {
  const product = {
    tagline: "The best for everyday wear",
    image: "assets/images/image-1.png",
    title: "JJJound x Adidas Samba",
    subtitle: "JJJound x Adidas",
    description: "Speaking of Wales Bonner's Sambas: the British label's beloved partnership with Adidas is still going strong. But if we had to choose the single best iteration on the Samba this year, that title would have to go to the deceptively luxe spin from JJJJound.",
    price: "$299",
    source: "StockX"
  };

  return (
    <div className="product-card">
      <div className="tagline-section">
        <p className="tagline">{product.tagline}</p>
        <hr className="divider" />
      </div>
      <div className="content-wrapper">
        <img 
          src={product.image} 
          alt={product.title} 
          className="product-image"
        />
        <div className="product-content">
          <div className="header-description">
            <div className="heading">
              <h2 className="product-title">{product.title}</h2>
              <h3 className="product-subtitle">{product.subtitle}</h3>
            </div>
            <p className="product-description">{product.description}</p>
          </div>
          <button className="price-button">
            {product.price} from {product.source}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;