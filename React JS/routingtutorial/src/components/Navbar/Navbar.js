import React from 'react'
import './Navbar.css'
import { Link } from 'react-router-dom'
const Navbar = () => {
  return (
    <div className='navbar'> 
        <h1>LOGO</h1>

        <ul>
            <li>
                <Link to='/' className='linkstyle'>Home</Link>
            </li>
            <li>
                <Link to='/about' className='linkstyle'>About</Link>
            </li>
            <li>
                <Link to='/contact' className='linkstyle'>Contact</Link>
            </li>
        </ul>
    </div>
  )
}

export default Navbar