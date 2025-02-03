import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import SearchPage from './pages/SearchPage'; // Import SearchPage
import Navbar from './components/Navbar';
import ProfilePage from './pages/ProfilePage';
import Results from './pages/Results';
import ContactPage from './pages/ContactPage'; // Add this import

import { AuthProvider } from './contexts/AuthContext';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />

        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/search" element={<SearchPage />} /> {/* Add SearchPage route */}
          <Route path="/results" element={<Results />} /> {/* Add Results route */}
          <Route path="/profile" element={<ProfilePage />} /> {/* Add ProfilePage route */}
          <Route path="/contact" element={<ContactPage />} /> {/* Add ContactPage route */}
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
