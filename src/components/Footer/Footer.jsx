import React from 'react';
import './Footer.css';
import linkedinIcon from '../../images/linkedin.jpg';
import githubIcon from '../../images/github.png';

const Footer = () => (
  <footer className="footer">
    <div className="footer-links">
      <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
        <img src={linkedinIcon} alt="LinkedIn" className="footer-icon" />
      </a>
      <a href="https://github.com" target="_blank" rel="noopener noreferrer">
        <img src={githubIcon} alt="GitHub" className="footer-icon" />
      </a>
    </div>
    <p className="footer-text">Email: albertocctrabajo@gmail.com</p>
  </footer>
);

export default Footer;