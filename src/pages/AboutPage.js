import React from 'react';
import { FaPalette, FaRobot, FaSearch } from 'react-icons/fa';
import '../styles/pages/AboutPage.css';

const AboutPage = () => {
  const features = [
    {
      icon: <FaRobot className="feature-icon" />,
      title: "AI-Powered Discovery",
      description: "Advanced algorithms that learn your preferences to deliver personalized recommendations."
    },
    {
      icon: <FaPalette className="feature-icon" />,
      title: "Design-Focused",
      description: "Curated selection of products that prioritize superior design and craftsmanship."
    },
    {
      icon: <FaSearch className="feature-icon" />,
      title: "Efficient Shopping",
      description: "Thoughtfully structured categories and robust filtering options for seamless discovery."
    }
  ];

  return (
    <div className="about-page">
      <div className="container">
        <div className="content-grid">
          <div className="content-left">
            <h1>About Thumbsy</h1>
            <div className="mission">
              <p>A thoughtfully designed platform for discovering products that align with your personal style.</p>
            </div>
            <div className="description">
              <p>At Thumbsy, we understand that finding the right products online can be overwhelming. Our platform simplifies this process by learning what matters to you, presenting items that match your taste, and organizing them in a way that makes sense.</p>
              <p>We focus on quality over quantity, emphasizing products with exceptional design and craftsmanship. Through clear presentation and intuitive navigation, Thumbsy helps you discover items you'll genuinely appreciate.</p>
            </div>
          </div>

          <div className="content-right">
            <div className="features">
              {features.map((feature, index) => (
                <div key={index} className="feature-card">
                  <div className="feature-header">
                    {feature.icon}
                    <h3>{feature.title}</h3>
                  </div>
                  <div className="feature-content">
                    <p>{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage; 