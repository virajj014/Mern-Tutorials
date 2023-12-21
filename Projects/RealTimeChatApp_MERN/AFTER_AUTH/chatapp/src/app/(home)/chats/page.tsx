"use client"
import React from 'react'
import { ChatDataType } from '@/types/ChatDataType'
import styles from '@/styles/chatpage.module.css'
import AllChats from '@/components/chat/AllChats'
import CurrentChat from '@/components/chat/CurrentChat'
const page = () => {
    const [chats, setChats] = React.useState<ChatDataType[]>([])

    // const fetchChats = async () => {
    //     let res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/chats')
    //     let data:ChatDataType[] = await res.json()
    //     // console.log(data)
    //     setChats(data)
    // }

    // React.useEffect(() => {
    //     fetchChats()
    // }, [])
    return (
        <div className={styles.chatpage}>
           <div className={styles.left}>  <AllChats /></div>
              <div className={styles.right}> <CurrentChat /></div>
        </div>
    )
}

export default page