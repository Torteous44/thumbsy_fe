import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import SearchPage from './pages/SearchPage'; // Import SearchPage
import Navbar from './components/Navbar';
import ProfilePage from './pages/ProfilePage';
import Results from './pages/Results';

import AboutPage from './pages/AboutPage'; // Add this import

import { AuthProvider } from './contexts/AuthContext';
import { ModalProvider } from './contexts/ModalContext';

const App = () => {
  return (
    <AuthProvider>
      <ModalProvider>
        <Router>
          <Navbar />

          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/search" element={<SearchPage />} /> {/* Add SearchPage route */}
            <Route path="/results" element={<Results />} /> {/* Add Results route */}
            <Route path="/profile" element={<ProfilePage />} /> {/* Add ProfilePage route */}
            <Route path="/about" element={<AboutPage />} /> {/* Add AboutPage route */}
          </Routes>
        </Router>
      </ModalProvider>
    </AuthProvider>
  );
};

export default App;
