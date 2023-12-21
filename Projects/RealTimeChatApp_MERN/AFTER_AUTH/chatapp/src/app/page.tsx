"use client";
import Image from 'next/image'
import styles from './page.module.css'
import React from 'react'
import { useRouter } from 'next/navigation'
import Button from '@mui/material/Button';
import logo from '@/assets/logo2.png'
export default function Home() {

    const router = useRouter()


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
        if (!data.ok) {
            router.push('/login')
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
                onClick={() => router.push('/chats')}
            >Show Chats</Button>
        </div>
    )
}
