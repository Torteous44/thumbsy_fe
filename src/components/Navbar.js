import React from 'react';
import { Link } from 'react-router-dom';
import routes from '../routes'; // Import centralized routes
import '../styles/components/Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar-logo">
        <Link to={routes.home}>
          <img src="/assets/images/thumbsy-icon.svg" alt="Thumbsy Logo" />
        </Link>
      </div>

      {/* Navigation Links */}
      <ul className="navbar-links">
        <li>
          <Link to={routes.home}>Home</Link>
        </li>
        <li>
          <Link to={routes.search}>Thumbsy</Link>
        </li>
        <li>
          <Link to={routes.about}>About us</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
