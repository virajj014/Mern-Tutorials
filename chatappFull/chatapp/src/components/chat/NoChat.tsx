import React from 'react'
import nochat from '@/assets/noChats.png'
import Image from 'next/image'
import styles from '@/styles/currentChat.module.css'

const NoChat = () => {
  return (
    <div className={styles.noChatout}>
        <Image src={nochat} width={500} height={500} alt='' 
             className={styles.nochat}
            />
    </div>
  )
}

export default NoChat