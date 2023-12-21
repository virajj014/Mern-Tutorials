"use client";
import { logIn, logOut } from '@/redux/features/auth-slice'
import { AppDispatch } from '@/redux/store'
import React from 'react'
import { useDispatch } from 'react-redux'

const page = () => {
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
    <div>
        login page
        <button
            onClick={handlelogin}
        >Login</button>
        <button
            onClick={handlelogout}
        >Logout</button>
    </div>
  )
}

export default page