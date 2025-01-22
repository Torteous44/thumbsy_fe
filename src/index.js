import React from 'react';
import ReactDOM from 'react-dom/client'; // React 18 update
import './styles/global.css'; // Import your global CSS
import App from './App';
import reportWebVitals from './reportWebVitals';

// Create a root for React 18
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Use reportWebVitals correctly
reportWebVitals(console.log);
