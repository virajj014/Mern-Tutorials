import React, { useEffect } from 'react'
import Navbar from '../components/Navbar/Navbar'
import { useLocation, useParams } from 'react-router-dom'

const About = () => {
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



  const params = useParams();

  console.log('params', params);
  return (
    <div>
      <Navbar />
      <h1>This is About page {params.somename}</h1>
    </div>
  )
}

export default About