import React from 'react';
import '../styles/components/ScrollingProductGrid.css';

const ScrollingProductGrid = () => {
  // Array of image objects with updated paths
  const images = [
    { src: "/images/image.png", alt: "Product 1" },
    { src: "/images/image-1.png", alt: "Product 2" },
    { src: "/images/image-2.png", alt: "Product 3" },
    { src: "/images/image-3.png", alt: "Product 4" },
    { src: "/images/image-4.png", alt: "Product 5" },
    { src: "/images/image-5.png", alt: "Product 6" },
    { src: "/images/image-6.png", alt: "Product 7" },
    { src: "/images/image-7.png", alt: "Product 8" },
    { src: "/images/image-8.png", alt: "Product 9" },
    { src: "/images/image-9.png", alt: "Product 10" },
    { src: "/images/image-10.png", alt: "Product 11" },
    { src: "/images/image-11.png", alt: "Product 12" },
  ];

  // Create a triple-length array for seamless looping
  const tripleImages = [...images, ...images, ...images];

  // Component to render a row of images
  const ImageRow = ({ rowIndex }) => (
    <div className="image-grid">
      {tripleImages.map((img, index) => (
        <img key={`row${rowIndex}-${index}`} src={img.src} alt={img.alt} />
      ))}
    </div>
  );

  return (
    <div className="scroll-container">
      {/* Render three rows of images */}
      <ImageRow rowIndex={1} />
      <ImageRow rowIndex={2} />
      <ImageRow rowIndex={3} />
    </div>
  );
};

export default ScrollingProductGrid; 