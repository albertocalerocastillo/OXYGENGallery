import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Search from './pages/Search';
import Favoritas from './pages/Favoritas'; 
import Header from './components/Header';
import Footer from './components/Footer'; 
import './styles/App.css';
import './styles/global.css';

const App = () => {
  return (
    <Router>
      <Header />

      <Routes>
        <Route path="/" element={<Search />} />
        <Route path="/favoritas" element={<Favoritas />} />
      </Routes>

      <Footer />
    </Router>
  );
};

export default App;