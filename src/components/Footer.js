import React from 'react';
import '../styles/components/Footer.css';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="site-footer-wrapper">
        <div className="site-footer-left">
          <span className="site-footer-copyright">© 2025 Thumbsy</span>
          <span className="site-footer-separator">•</span>
          <nav className="site-footer-nav">
            <a 
              href="mailto:mattporteous44@gmail.com" 
              className="site-footer-contact"
            >
              Contact
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 
