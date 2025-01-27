import React, { useState, useEffect, useCallback } from 'react';
import '../styles/components/LikeButton.css';

const LikeButton = ({ productId }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const BASE_URL = 'https://qrbackend-ghtk.onrender.com';

  const fetchLikesData = useCallback(async () => {
    try {
      const response = await fetch(`${BASE_URL}/search/products/${productId}/likes`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch likes');
      
      const data = await response.json();
      if (data.product_id === productId) {
        setIsLiked(data.is_liked_by_user === true);
        setLikesCount(data.likes_count);
      }
    } catch (error) {
      console.error('Error fetching likes:', error);
    }
  }, [productId]);

  useEffect(() => {
    setIsLiked(false);
    setLikesCount(0);
    fetchLikesData();
  }, [productId, fetchLikesData]);

  const handleLikeClick = async () => {
    try {
      const method = isLiked ? 'DELETE' : 'POST';
      const response = await fetch(`${BASE_URL}/search/products/${productId}/like`, {
        method,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });

      if (!response.ok) throw new Error('Failed to update like');

      setIsLiked(!isLiked);
      setLikesCount(prevCount => isLiked ? prevCount - 1 : prevCount + 1);
      
      fetchLikesData();
    } catch (error) {
      console.error('Error updating like:', error);
      setIsLiked(isLiked);
      setLikesCount(likesCount);
    }
  };

  return (
    <div className="like-button-container">
      <button 
        className={`like-button ${isLiked ? 'liked' : ''}`} 
        onClick={handleLikeClick}
        aria-label={isLiked ? 'Unlike' : 'Like'}
      >
        <div className="circle-button">
          <img 
            src="/assets/icons/thumbsy-icon.svg" 
            alt="Thumbsy" 
            className="thumbsy-icon"
          />
        </div>
        <span className="likes-count">{likesCount}</span>
      </button>
    </div>
  );
};

export default LikeButton; 