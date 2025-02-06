import React, { useState, useEffect } from 'react';
import GradientOverlay from './GradientOverlay';
import '../../styles/components/ScrollingProductGrid.css';

// Move images array outside component
const images = [
  { src: "/assets/images/image-16.webp", alt: "Product 1" },
  { src: "/assets/images/image-1.png", alt: "Product 2" },
  { src: "/assets/images/image-2.png", alt: "Product 3" },
  { src: "/assets/images/image-3.png", alt: "Product 4" },
  { src: "/assets/images/image-4.png", alt: "Product 5" },
  { src: "/assets/images/image-5.png", alt: "Product 6" },
  { src: "/assets/images/image-6.png", alt: "Product 7" },
  { src: "/assets/images/image-7.png", alt: "Product 8" },
  { src: "/assets/images/image-8.png", alt: "Product 9" },
  { src: "/assets/images/image-9.png", alt: "Product 10" },
  { src: "/assets/images/image-10.png", alt: "Product 11" },
  { src: "/assets/images/image-11.avif", alt: "Product 12" },
];

const ScrollingProductGrid = () => {
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [hasError, setHasError] = useState(false);
  
  const tripleImages = [...images, ...images, ...images];
  const imageHeight = 162;
  const numberOfRows = 3;
  const gradientHeight = imageHeight * numberOfRows;

  useEffect(() => {
    const preloadImages = () => {
      images.forEach((img, index) => {
        const image = new Image();
        
        // Add loading priority to first visible images
        if (index < numberOfRows * 4) {
          image.loading = 'eager';
        } else {
          image.loading = 'lazy';
        }

        image.onload = () => {
          setImagesLoaded(prev => prev + 1);
        };

        image.onerror = () => {
          console.error(`Failed to load image: ${img.src}`);
          setHasError(true);
        };

        image.src = img.src;
      });
    };

    preloadImages();
  }, []);

  // Component to render a row of images with optimizations
  const ImageRow = ({ rowIndex }) => (
    <div className="image-grid">
      {tripleImages.map((img, index) => (
        <img 
          key={`row${rowIndex}-${index}`} 
          src={img.src}
          alt={img.alt}
          loading={index < 4 ? 'eager' : 'lazy'}
          aria-hidden="true" // Hide from screen readers since we're not showing alt text
        />
      ))}
    </div>
  );

  // Show loading state until at least the first viewport of images is loaded
  if (imagesLoaded < numberOfRows * 4) {
    return (
      <div 
        className="image-grid-placeholder" 
        style={{ height: `${gradientHeight}px` }}
        aria-label="Loading images..." 
      />
    );
  }

  // Show error state if images failed to load
  if (hasError) {
    return (
      <div 
        className="image-grid-error" 
        style={{ height: `${gradientHeight}px` }}
        aria-label="Error loading images" 
      />
    );
  }

  return (
    <div className="scroll-container">
      <ImageRow rowIndex={1} />
      <ImageRow rowIndex={2} />
      <ImageRow rowIndex={3} />
      <GradientOverlay height={`${gradientHeight}px`} />
    </div>
  );
};

export default ScrollingProductGrid; 