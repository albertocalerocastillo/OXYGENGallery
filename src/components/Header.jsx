import React from 'react';
import './Header.css';
import logo from '../images/camara.png';

const Header = () => (
  <header className="header">
    <div className="header-content">
      <img src={logo} alt="Logo" className="logo" />
      <h1 className="title">OXYGENGallery</h1>
    </div>
  </header>
);

export default Header;