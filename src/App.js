import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import SearchPage from './pages/SearchPage'; // Import SearchPage
import Navbar from './components/Navbar';


const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/search" element={<SearchPage />} /> {/* Add SearchPage route */}
      </Routes>
    </Router>
  );
};

export default App;
