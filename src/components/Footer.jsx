import React from 'react';
import './Footer.css';

import linkedinIcon from '../images/linkedin.jpg';
import githubIcon from '../images/github.png';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-links">
        <a href="https://www.linkedin.com/in/alberto-calero-castillo-405373257/" target="_blank" rel="noopener noreferrer">
          <img src={linkedinIcon} alt="LinkedIn" className="footer-icon" />
        </a>
        <a href="https://github.com/albertocalerocastillo" target="_blank" rel="noopener noreferrer">
          <img src={githubIcon} alt="GitHub" className="footer-icon" />
        </a>
      </div>
      <p>Email: albertocctrabajo@gmail.com</p>
    </footer>
  );
};

export default Footer;