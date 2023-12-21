"use client";
import React from 'react'
import { logIn, logOut } from '@/redux/features/auth-slice'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/redux/store';
const page = () => {

    const dispatch = useDispatch<AppDispatch>()
    const handleLogin = () => {
        console.log("handleLogin")

        let tempUser = {
            name: "HARSHAL JAIN",
            email: "virajj014@gmail.com",
            age: 21
        }

        dispatch(logIn(tempUser))

        alert("Logged In")
    }
    return (
        <div>page
            <button onClick={handleLogin}>Login</button>
            
        </div>
    )
}

export default page