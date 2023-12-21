"use client"
import Image from 'next/image'
import styles from './page.module.css'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  //   CHECK LOGIN STATUS

  const router = useRouter()


  const checkLogin = async () => {
    let res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/auth/checklogin', {
      method: 'GET',
      credentials: 'include'
    })

    let data = await res.json()
    if (!data.ok) {
      router.push('/login')
    }
    // else{
    //   router.push('/')
    // }
  }
  React.useEffect(() => {
    checkLogin()
  }, [])


  return (
    <div>
      <h1>Home</h1>
    </div>
  )
}
