// src/components/Footer.js

import React, { useEffect, useState } from 'react';
import styles from './Footer.module.css';

const Footer = () => {
  const [isAtBottom, setIsAtBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      if (scrollTop + windowHeight >= documentHeight - 10) {
        setIsAtBottom(true); // Show footer when at the bottom
      } else {
        setIsAtBottom(false); // Hide footer when not at the bottom
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Cleanup on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <footer className={`${styles.footer} ${isAtBottom ? styles.show : ''}`}>
      <p>All copyrights are reserved by Nauman</p>
    </footer>
  );
};

export default Footer;
