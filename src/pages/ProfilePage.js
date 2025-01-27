import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PriceRangeChart from '../components/PriceRangeChart';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/pages/ProfilePage.css';

const ProfilePage = () => {
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const tokenType = localStorage.getItem('token_type');

        console.log('Token:', token); // Debug log
        console.log('Token Type:', tokenType); // Debug log

        if (!token) {
          console.log('No token found, redirecting...'); // Debug log
          navigate('/');
          return;
        }

        console.log('Fetching profile...'); // Debug log
        const response = await fetch('https://qrbackend-ghtk.onrender.com/search/profile', {
          method: 'GET', // Explicitly specify method
          headers: {
            'Authorization': `${tokenType} ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          }
        });

        console.log('Response status:', response.status); // Debug log

        if (!response.ok) {
          const errorData = await response.text();
          console.error('Error response:', errorData); // Debug log
          throw new Error(`Failed to fetch profile: ${response.status} ${errorData}`);
        }

        const data = await response.json();
        console.log('Profile data:', data); // Debug log
        setProfileData(data);
      } catch (err) {
        console.error('Fetch error:', err); // Debug log
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  if (error) {
    console.log('Rendering error state:', error); // Debug log
    return (
      <div className="profile-container">
        <div className="profile-error">
          <h2>Error loading profile</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/')}>Return to Home</button>
        </div>
      </div>
    );
  }

  if (isLoading || !profileData) {
    return (
      <div className="profile-container">
        <LoadingSpinner />
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-info">
          <h1>{profileData.name || 'User'}</h1>
          <div className="profile-meta">
            <div className="profile-details">
              <p className="email">
                <span className="email-text">{profileData.email}</span>
              </p>
              <p className="joined">Member since {formatDate(profileData.joined_date)}</p>
            </div>
            <button 
              className="logout-button" 
              onClick={() => {
                localStorage.clear();
                navigate('/');
              }}
            >
              Log Out
            </button>
          </div>
        </div>
      </div>

      <div className="profile-content">
        {/* Stats Section */}
        {profileData.stats && (
          <div className="profile-stats">
            <h2 className="section-title">Stats</h2>
            <div className="stat-item">
              <div className="stat-text">
                <span>{profileData.stats.total_likes}</span>
                <span> total likes</span>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-text">
                <span>{profileData.stats.days_member}</span>
                <span> days as member</span>
              </div>
            </div>
          </div>
        )}

        {/* Price Range Chart */}
        {profileData.price_ranges && Object.keys(profileData.price_ranges).length > 0 && (
          <div className="price-ranges-section">
            <h2 className="section-title">Price Range Distribution</h2>
            <PriceRangeChart data={profileData.price_ranges} />
          </div>
        )}

        {/* Recent Likes Section */}
        {profileData.recent_likes?.length > 0 && (
          <div className="likes-section">
            <h2 className="section-title">Recent Likes</h2>
            <div className="likes-grid">
              {profileData.recent_likes.map((item) => (
                <div key={item.id} className="like-item">
                  {item.image_url && (
                    <div className="like-image-container">
                      <img src={item.image_url} alt={item.name} className="like-image" />
                    </div>
                  )}
                  <div className="like-info">
                    <h4 className="like-title">{item.name}</h4>
                    {item.brand && <p className="like-brand">{item.brand}</p>}
                    <p className="like-price">${item.price.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Top Brands Section */}
        {profileData.top_brands?.length > 0 && (
          <div className="brands-section">
            <h2 className="section-title">Top Brands</h2>
            <div className="brands-list">
              {profileData.top_brands.map((brand, index) => (
                <div key={index} className="brand-item">
                  <span className="brand-name">{brand.brand}</span>
                  <span className="brand-count">{brand.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage; 