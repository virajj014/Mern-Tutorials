
"use client";
import { AppDispatch } from '@/redux/store';
import React from 'react'
import { useDispatch } from 'react-redux';
import { logIn, logOut } from '@/redux/features/auth-slice'
import Link from 'next/link';

const Navbar = () => {  
  const dispatch = useDispatch<AppDispatch>()

  const handlelogin = () => {

    // ATER LOGIN
    let temp = {
      name : "Harshal Jain",
      email : "hj123@gmail.com",
      age : 50
    }

    dispatch(logIn(temp))
 
    alert("Login Successful")
  }
  const handlelogout = () => {

    dispatch(logOut())
    alert("Logout Successful")
  }
  return (
    <div>Navbar

<button
            onClick={handlelogin}
        >Login</button>
        <button
            onClick={handlelogout}
        >Logout</button>


        <Link href={"/"}>Home</Link>
    </div>
  )
}

export default Navbar