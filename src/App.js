import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import SearchPage from './pages/SearchPage'; // Import SearchPage
import Navbar from './components/Navbar';
import ProfilePage from './pages/ProfilePage';
import Results from './pages/Results';
import TestPage from './pages/TestPage';

const App = () => {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/search" element={<SearchPage />} /> {/* Add SearchPage route */}
        <Route path="/results" element={<Results />} /> {/* Add Results route */}
        <Route path="/profile" element={<ProfilePage />} /> {/* Add ProfilePage route */}
        <Route path="/test" element={<TestPage />} />
      </Routes>
    </Router>
  );
};

export default App;
