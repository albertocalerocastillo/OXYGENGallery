import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Search from './pages/Search/Search';
import Favoritas from './pages/Favoritas/Favoritas';
import './styles/global.css';
import './styles/App.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Search />} />
          <Route path="favoritas" element={<Favoritas />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;