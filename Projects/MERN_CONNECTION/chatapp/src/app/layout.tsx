import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import ReduxProvider from '@/redux/provider'
import { styled } from '@mui/material'
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MERN AUTH APP',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="maindiv">
        <ReduxProvider>

          <Navbar />
          {children}
          <ToastContainer />

        </ReduxProvider>
      </body>
    </html>
  )
}
