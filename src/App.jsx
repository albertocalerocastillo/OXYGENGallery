import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Search from './pages/Search';
import Favoritas from './pages/Favoritas'; 
import Header from './components/Header';
import Footer from './components/Footer'; 
import './App.css';

const App = () => {
  return (
    <Router>
      <Header />

      <div className="toggle-buttons">
        <Link to="/" className="button-link">
          <button>Global</button>
        </Link>
        <Link to="/favoritas" className="button-link">
          <button>Favoritas</button>
        </Link>
      </div>

      <Routes>
        <Route path="/" element={<Search />} />
        <Route path="/favoritas" element={<Favoritas />} />
      </Routes>

      <Footer />
    </Router>
  );
};

export default App;