"use client";
import Image from 'next/image'
import styles from './page.module.css'
import React from 'react'
import { useRouter } from 'next/navigation'
import Button from '@mui/material/Button';
import logo from '@/assets/logo2.png'

export default function Home() {
  //   CHECK LOGIN STATUS

  const router = useRouter()
  const [isLogged, setIsLogged] = React.useState(false)


  const checkLogin = async () => {
      let res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/auth/checklogin', {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
          },
          credentials: 'include'

      })

      let data = await res.json()
      console.log('Home', data)
      if (!data.ok) {
          setIsLogged(false)
          router.push('/login')
      }
      else {
          setIsLogged(true)
      }
  }

  React.useEffect(() => {
      checkLogin()
  }, [])


  return (
    <div className={styles.homediv}>
    <Image src={logo} width={500} height={500} alt=''
        quality={100}
    />
    <Button color="secondary" variant="contained"
        onClick={() => {
            if (isLogged) {
                router.push('/chats')
            }
            else {
                router.push('/login')
            }
        }}
    >Show Chats</Button>
</div>
  )
}
