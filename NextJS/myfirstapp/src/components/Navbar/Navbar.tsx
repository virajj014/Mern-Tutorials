"use client"
import React from 'react'
import styles from '@/styles/navbar.module.css'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
const Navbar = () => {

  const isActive = usePathname();
  console.log(isActive)
  return (
    <div>
      <ul className={styles.nav}>
        <li className={isActive == '/'? styles.active : ''}>
          <Link href="/">
            Home
          </Link>
        </li>
        <li className={isActive == '/contact'? styles.active : ''}>
          <Link href="/contact">
            Contact
          </Link>
        </li>
        <li className={isActive == '/about'? styles.active : ''}>
          <Link href="/about">
            About
          </Link>
        </li>
      </ul>
    </div>
  )
}

export default Navbar