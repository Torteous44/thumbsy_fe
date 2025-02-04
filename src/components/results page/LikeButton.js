import React, { useState, useEffect, useCallback } from 'react';
import '../../styles/components/product cards/LikeButton.css';

const LikeButton = ({ productId }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
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
    } catch (error) {
      console.error('Error fetching likes:', error);
    }
  }, [productId]);

  useEffect(() => {
    setIsLiked(false);
    fetchLikesData();
  }, [productId, fetchLikesData]);

  const handleLikeClick = async () => {
    // Optimistically update UI
    const previousLiked = isLiked;
    setIsLiked(!isLiked);

    try {
      const token = localStorage.getItem('access_token');
      if (!token) throw new Error('Authentication required');

      const method = previousLiked ? 'DELETE' : 'POST';
      const response = await fetch(`${BASE_URL}/products/${productId}/like`, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to update like');
      }
    } catch (error) {
      console.error('Error updating like:', error);
      // Revert UI on error
      setIsLiked(previousLiked);
    }
  };

  const getTooltipText = () => {
    if (isLiked) {
      return "Remove from your taste profile";
    }
    return "Add to your taste profile";
  };

  return (
    <div 
      className="like-button-container"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
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
      </div>
      {showTooltip && (
        <div className="like-tooltip">
          {getTooltipText()}
        </div>
      )}
    </div>
  );
};

export default LikeButton; 