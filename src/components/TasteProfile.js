import React, { useState, useEffect } from 'react';
import '../styles/components/TasteProfile.css';

const TasteProfile = ({ userId }) => {
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTasteProfile = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const tokenType = localStorage.getItem('token_type');
        
        const response = await fetch(`https://thumbsybackend.onrender.com/api/taste-profile/${userId}`, {
          headers: {
            'Authorization': `${tokenType} ${token}`,
            'Accept': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch taste profile');
        }

        const data = await response.json();
        setProfileData(data);
      } catch (err) {
        console.error('Taste Profile Error:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchTasteProfile();
    }
  }, [userId]);

  // Add a function to format category names
  const formatCategoryName = (category) => {
    const categoryMap = {
      'visual_style': 'Visual Style',
      'color_palette': 'Color Palette',
      'brands': 'Brands',
      'price_sensitivity': 'Price Sensitivity',
      'trend_engagement': 'Trend Engagement',
      'sustainability': 'Sustainability'
    };
    return categoryMap[category] || category;
  };

  if (isLoading) return (
    <div className="taste-profile-skeleton">
      <div className="skeleton-header">
        <div className="skeleton-block skeleton-title"></div>
        <div className="skeleton-block skeleton-subtitle"></div>
        <div className="skeleton-block skeleton-description"></div>
      </div>
      
      <div className="skeleton-categories">
        {[1, 2, 3].map((category) => (
          <div key={category} className="skeleton-category">
            <div className="skeleton-block skeleton-category-title"></div>
            <div className="skeleton-bars">
              {[1, 2, 3, 4].map((bar) => (
                <div key={bar} className="skeleton-block skeleton-bar"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (error) return <div>Error loading taste profile</div>;
  if (!profileData) return null;

  const renderCategory = (categoryName, data) => (
    <div className="taste-category">
      <h3>{formatCategoryName(categoryName)}</h3>
      <div className="preference-bars">
        {Object.entries(data).map(([label, value]) => (
          <div key={label} className="preference-item">
            <span className="preference-value">{value.toFixed(2)}</span>
            <div className="preference-bar-container">
              <div 
                className="preference-bar" 
                style={{ width: `${value * 100}%` }}
              >
                <span className="preference-label">{label}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="taste-profile">
      <h2>Your Taste Profile</h2>
      <p>{profileData.product_count} products liked</p>
      <p className="taste-description">
        Thumbsy figures out your taste as you use it. The more products you like, the better the products recommended will be.
      </p>

      <div className="taste-categories">
        {Object.entries(profileData.profile_data).map(([category, data]) => (
          renderCategory(category, data)
        ))}
      </div>
    </div>
  );
};

export default TasteProfile; 