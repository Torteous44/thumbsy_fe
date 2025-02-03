import React from 'react';
import '../styles/pages/ContactPage.css';
import Footer from '../components/Footer';

const ContactPage = () => {
  return (
    <div className="contact-page">
      <div className="contact-page-content">
        <h1 className="contact-page-title">Contact</h1>
        <p className="contact-page-text">Get in touch with us at</p>
        <a href="mailto:hello@thumbsy.co" className="contact-page-email">
          hello@thumbsy.co
        </a>
      </div>
      <Footer />
    </div>
  );
};

export default ContactPage; 