import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Navbar from './components/Navbar';
import ProfilePage from './pages/ProfilePage';
import Results from './pages/Results';


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
            <Route path="/search" element={<Results />} /> {/* Add SearchPage route */}
            <Route path="/profile" element={<ProfilePage />} /> {/* Add ProfilePage route */}
          </Routes>
        </Router>
      </ModalProvider>
    </AuthProvider>
  );
};

export default App;
