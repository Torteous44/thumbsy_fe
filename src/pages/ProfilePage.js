import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import TasteProfile from '../components/TasteProfile';
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

        if (!token) {
          console.log('No token found, redirecting...');
          navigate('/');
          return;
        }

        const response = await fetch('https://thumbsybackend.onrender.com/api/profile', {
          method: 'GET',
          headers: {
            'Authorization': `${tokenType} ${token}`,
            'Accept': 'application/json',
          }
        });

        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(`Failed to fetch profile: ${response.status} ${errorData}`);
        }

        const data = await response.json();
        setProfileData(data);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  if (error) {
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
          <h1>{profileData.username}</h1>
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
        {/* Taste Profile Section */}
        {profileData?.id && (
          <div className="taste-profile-section">
            <TasteProfile userId={profileData.id} />
          </div>
        )}

        {/* Recent Likes Section */}
        {profileData?.recent_likes?.length > 0 && (
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
      </div>
    </div>
  );
};

export default ProfilePage; 