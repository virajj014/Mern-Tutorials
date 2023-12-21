"use client";
import Image from 'next/image'
import styles from './page.module.css'
import { useAppSelector } from '@/redux/store'
export default function Home() {
  const auth = useAppSelector((state) => state.authReducer)


  return (
    <main className={styles.main}>
     {auth.isAuth ? <h1 className={styles.title}>Welcome {auth.user?.name}</h1> : <h1 className={styles.title}>Welcome Guest</h1>}
    </main>
  )
}
