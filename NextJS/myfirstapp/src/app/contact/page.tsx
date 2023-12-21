"use client"
import React from 'react'
import { useRouter } from 'next/navigation'

const page = () => {
const router = useRouter();
  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log('submitted')

    router.back()
  }
  return (
    <div>this is contact page

      <button
        onClick={handleSubmit}
      >Submit</button>
    </div>
  )
}

export default page

