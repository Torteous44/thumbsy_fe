import React, { useState, useEffect, useCallback } from 'react';
import '../styles/components/LikeButton.css';

const ThumbUpIcon = ({ filled }) => (
  <svg 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor" 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
  </svg>
);

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
        <span className="thumb-icon">
          <ThumbUpIcon filled={isLiked} />
        </span>
        <span className="likes-count">{likesCount}</span>
      </button>
    </div>
  );
};

export default LikeButton; 