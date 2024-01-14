import React from 'react'
import nochat from '@/assets/noChats.png'
import Image from 'next/image'
import styles from '@/styles/currentChat.module.css'
import { deepPurple } from '@mui/material/colors'
import { Avatar } from '@mui/material'
import { useRouter } from 'next/router';
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