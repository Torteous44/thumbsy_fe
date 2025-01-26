import React from 'react';
import ProductCard from '../components/ProductCard';

const TestPage = () => {
  // Sample product data
  const sampleProduct = {
    title: "JJJJound x Adidas Sambas",
    brand: "JJJJound x Adidas",
    price: "$299",
    images: [
      "/assets/images/image-1.png",
      "/assets/images/image-1.png",
      "/assets/images/image-1.png",
      "/assets/images/image-1.png",
      "/assets/images/image-1.png",
      "/assets/images/image-1.png",
      "/assets/images/image-1.png",

    ],
    features: [
      "Versale to wear with jeans",
      "High quality material",
      "Limited edition"
    ],
    description: "Speaking of Wales Bonner’s Sambas: the British label’s beloved partnership with Adidas is still going strong. But if we had to choose the single best iteration on the Samba this year, that title would have to go to the deceptively luxe spin from JJJJound. Rather than dress the iconic soccer shoe up with any new bells and whistles, the Montreal design studio decided to simply master the basics. "
  };

  return (
    <div style={{ padding: '20px' }}>
      <ProductCard product={sampleProduct} />
    </div>
  );
};

export default TestPage; 