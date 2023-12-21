"use client";
import React from 'react'
import logo from '@/assets/logo.png'
import Image from 'next/image'
import styles from '@/styles/navbar.module.css'
import { Avatar, Button } from '@mui/material'
import { useRouter } from 'next/navigation'

const Navbar = () => {
  const [isloggedin, setIsloggedin] = React.useState<boolean | null>(null)
  const [user, setUser] = React.useState<any>(null)
  const router = useRouter()
  let apiurl = process.env.NEXT_PUBLIC_API_URL

  const checkLogin = async () => {
    let res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/auth/checklogin', {
      method: 'GET',
      credentials: 'include'
    })

    let data = await res.json()
    if (!data.ok) {
      setIsloggedin(false)
    }
    else {
      setIsloggedin(true)
    }
  }
  React.useEffect(() => {
    checkLogin()
  }, [])


  const getUserData = async () => {
    let res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/user/getuser', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    })
    let data = await res.json()
    if (data.ok) {
      console.log(data.data)
      setUser(data.data)

    }
    else {
      setUser(null)
    }

  }

  React.useEffect(() => {
    getUserData()
  }, [isloggedin])


  const handleLogout = async () => {
    let res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/auth/logout', {
      method: 'POST',
      credentials: 'include'
    })

    let data = await res.json()
    if (data.ok) {
      setIsloggedin(false)
      window.location.reload()
    }
    else {
      setIsloggedin(true)
    }
  }
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
          isloggedin ?
            <Button variant="contained" color="secondary"
              onClick={handleLogout}
            >Logout</Button>
            :
            <Button variant="contained" color="secondary"
              onClick={() => router.push('/login')}
            >Login</Button>
        }
      </div>
    </div>
  )
}

export default Navbar