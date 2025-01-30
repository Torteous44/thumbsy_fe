import React, { useState, useEffect, useCallback } from 'react';
import '../../styles/components/LikeButton.css';

const LikeButton = ({ productId }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const BASE_URL = 'https://thumbsybackend.onrender.com/api';

  const fetchLikesData = useCallback(async () => {
    try {
      const token = localStorage.getItem('access_token');
      
      const response = await fetch(`${BASE_URL}/products/${productId}/likes`, {
        headers: token ? {
          'Authorization': `Bearer ${token}`
        } : {}
      });
      
      if (!response.ok) throw new Error('Failed to fetch likes');
      
      const data = await response.json();
      setIsLiked(data.is_liked_by_user === true);
      setLikesCount(data.likes_count);
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
      const token = localStorage.getItem('access_token');
      if (!token) throw new Error('Authentication required');

      const method = isLiked ? 'DELETE' : 'POST';
      const response = await fetch(`${BASE_URL}/products/${productId}/like`, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to update like');

      // Update local state
      setIsLiked(!isLiked);
      setLikesCount(prevCount => isLiked ? prevCount - 1 : prevCount + 1);
      
    } catch (error) {
      console.error('Error updating like:', error);
      // Revert state on error
      setIsLiked(isLiked);
      setLikesCount(likesCount);
    }
  };

  return (
    <div className="like-button-container">
      <div 
        className={`like-action ${isLiked ? 'liked' : ''}`} 
        onClick={handleLikeClick}
        role="button"
        tabIndex={0}
        aria-label={isLiked ? 'Unlike' : 'Like'}
      >
        <img 
          src="/assets/icons/thumbsy-icon.svg" 
          alt="Thumbsy" 
          className="thumbsy-icon"
        />
        <span className="likes-count">{likesCount}</span>
      </div>
    </div>
  );
};

export default LikeButton; 