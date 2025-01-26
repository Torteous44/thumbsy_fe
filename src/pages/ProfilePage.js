import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
    console.log('Rendering loading state'); // Debug log
    return (
      <div className="profile-container">
        <div className="profile-loading">
          <h2>Loading profile...</h2>
        </div>
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
          <p className="email">{profileData.email}</p>
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

      {/* Only render stats if they exist */}
      {profileData.stats && (
        <div className="profile-stats">
          <div className="stat-card">
            <h3>Activity Stats</h3>
            <div className="stat-grid">
              <div className="stat-item">
                <span className="stat-value">{profileData.stats.total_likes}</span>
                <span className="stat-label">Total Likes</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{profileData.stats.days_member}</span>
                <span className="stat-label">Days as Member</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Only render recent likes if they exist */}
      {profileData.recent_likes?.length > 0 && (
        <div className="stat-card">
          <h3>Recent Likes</h3>
          <div className="likes-grid">
            {profileData.recent_likes.map((item) => (
              <div key={item.id} className="like-card">
                {item.image_url && (
                  <img src={item.image_url} alt={item.name} className="like-image" />
                )}
                <div className="like-info">
                  <h4>{item.name}</h4>
                  {item.brand && <p className="brand">{item.brand}</p>}
                  {item.price && <p className="price">${item.price.toFixed(2)}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Only render top brands if they exist */}
      {profileData.top_brands?.length > 0 && (
        <div className="stat-card">
          <h3>Top Brands</h3>
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
  );
};

export default ProfilePage; 