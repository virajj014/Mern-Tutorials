"use client";
import React from 'react'
import logo from '@/assets/logo.png'
import Image from 'next/image'
import styles from '@/styles/navbar.module.css'
import { Avatar, Button } from '@mui/material'
import { useRouter } from 'next/navigation'
import { logIn, logOut } from '@/redux/features/auth-slice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { useAppSelector } from '@/redux/store'


const Navbar = () => {
  const dispatch = useDispatch<AppDispatch>()
  const auth = useAppSelector((state) => state.authReducer)


  const router = useRouter()
  let apiurl = process.env.NEXT_PUBLIC_API_URL

  const checkLogin = async () => {
    let res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/auth/checklogin', {
      method: 'GET',
      credentials: 'include'
    })

    let data = await res.json()
    if (!data.ok) {
      // dispatch(logOut())
    }
    else {
      getUserData()
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
      dispatch(logIn(data.data))

    }
    else {
      // dispatch(logOut())
   
    }

  }



  const handleLogout = async () => {
    let res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/auth/logout', {
      method: 'POST',
      credentials: 'include'
    })

    let data = await res.json()
    if (data.ok) {
      dispatch(logOut())
      router.push('/login')
    }
  }
  return (
    <div className={styles.nav}>
      <div className={styles.left}>
        <Image src={logo} alt="logo" width={50} height={50} />

      </div>
      <div className={styles.right}>
        {
          auth.user &&
          <Avatar src={`${apiurl}/${auth.user.profilePic}`} />
        }
        {
          auth.isAuth ?
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