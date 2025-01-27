import React from 'react';
import ReactDOM from 'react-dom/client'; // React 18 update
import './index.css'; // Import your global CSS
import App from './App';

// Create a root for React 18
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
