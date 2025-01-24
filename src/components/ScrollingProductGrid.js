import React from 'react';
import GradientOverlay from './GradientOverlay';
import '../styles/components/ScrollingProductGrid.css';

const ScrollingProductGrid = () => {
  // Array of image objects with updated paths
  const images = [
    { src: "assets/images/image.png", alt: "Product 1" },
    { src: "assets/images/image-1.png", alt: "Product 2" },
    { src: "assets/images/image-2.png", alt: "Product 3" },
    { src: "assets/images/image-3.png", alt: "Product 4" },
    { src: "assets/images/image-4.png", alt: "Product 5" },
    { src: "assets/images/image-5.png", alt: "Product 6" },
    { src: "assets/images/image-6.png", alt: "Product 7" },
    { src: "assets/images/image-7.png", alt: "Product 8" },
    { src: "assets/images/image-8.png", alt: "Product 9" },
    { src: "assets/images/image-9.png", alt: "Product 10" },
    { src: "assets/images/image-10.png", alt: "Product 11" },
    { src: "assets/images/image-11.png", alt: "Product 12" },
  ];

  // Create a triple-length array for seamless looping
  const tripleImages = [...images, ...images, ...images];

  const imageHeight = 162; // Updated from 180 to 162 (180 * 0.9)
  const numberOfRows = 3; // Number of rows in the grid
  const gradientHeight = imageHeight * numberOfRows; // Total height for the gradient

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
      <GradientOverlay height={`${gradientHeight}px`} />
    </div>
  );
};

export default ScrollingProductGrid; 