"use client";
import React from 'react'
import logo from '@/assets/logo.png'

import Image from 'next/image'
import styles from '@/styles/navbar.module.css'
import { Avatar, Button } from '@mui/material'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'
const Navbar = () => {
    const [isloggedin, setIsloggedin] = React.useState<boolean | null>(null)
    const [user, setUser] = React.useState<any>(null)
    const checkLogin = async () => {
        let res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/auth/checklogin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'

        })

        let data = await res.json()
        console.log(data)
        if (data.ok) {
            setIsloggedin(true)
        }
        else {
            setIsloggedin(false)
        }
    }
    const pathname = usePathname()
    React.useEffect(() => {
        checkLogin()
    }, [pathname])


    const router = useRouter()

    const handleLogout = async () => {
        let res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/auth/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'

        })

        let data = await res.json()
        console.log(data)
        if (data.ok) {
            setIsloggedin(false)
            router.push('/login')
        }
        else {
            setIsloggedin(true)
        }
    }


    let apiurl = process.env.NEXT_PUBLIC_API_URL
    const getUserData = async () => {
        let res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/auth/getuser', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'

        })

        let data = await res.json()
        console.log(data)
        if (data.ok) {
            setUser(data.data)
        }
        else {
            setUser(null)
            router.push('/login')
        }
    }


    React.useEffect(() => {
        getUserData()
    }, [isloggedin])




    
    return (
        <div className={styles.nav}>
            <div className={styles.left}>
                <Image src={logo} alt="logo" width={50} height={50} />
            </div>
            <div className={styles.right}>
                {
                    user &&
                    <Avatar src={`${apiurl}/${user.profilePic}`} />
                }
                {
                    isloggedin == true &&
                    <Button variant="contained" color="secondary"
                        onClick={handleLogout}
                    >Logout</Button>
                }
                {
                    isloggedin == false &&
                    
                    <Button variant="contained" color="secondary" href="/login">Login</Button>
                }
            </div>

        </div>
    )
}

export default Navbar