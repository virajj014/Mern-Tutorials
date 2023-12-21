"use client";
import React from 'react'
import { logIn, logOut } from '@/redux/features/auth-slice'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/redux/store';
const Navbar = () => {

    const dispatch = useDispatch<AppDispatch>()
    const handleLogin = () => {
        console.log("handleLogin")

        let tempUser = {
            name: "HARSHAL JAIN",
            email: "hj123@gmail.com",
            age: 21
        }

        dispatch(logIn(tempUser))

        alert("Logged In")

    }

    const handleLogout = () => {
        console.log("handleLogout")

        dispatch(logOut())

        alert("Logged Out")

    }
    return (
        <div>Navbar

            <button onClick={handleLogout}>Logout</button>
            <button onClick={handleLogin}>Login</button>

        </div>
    )
}

export default Navbar