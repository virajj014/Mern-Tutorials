import React, { useEffect } from 'react'
import Navbar from '../components/Navbar/Navbar'
import { useLocation } from 'react-router-dom';

const Contact = () => {
  const location = useLocation();
  console.log(location.pathname);

  useEffect(() => {
    if (location.pathname === '/about') {
      alert('You are in About page');
    }
    else if (location.pathname === '/contact') {
      alert('You are in Contact page');

    }
  }, [location]);
  return (
    <div>
      <Navbar />
      <h1>This is Contact page</h1>
    </div>
  )
}

export default Contact