"use client";

import Image from 'next/image'
import styles from './page.module.css'
import { useAppSelector } from '@/redux/store';

export default function Home() {

  const auth = useAppSelector((state) => state.authReducer)
  console.log(auth)
  return (
    <main className={styles.main}>
      {auth.isAuth ?
        <div>
          {JSON.stringify(auth.user)}
        </div>
        :
        <div>
          Please Login
        </div>
      }
    </main>
  )
}
