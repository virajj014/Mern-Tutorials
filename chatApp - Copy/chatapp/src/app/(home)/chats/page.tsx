"use client"
import React, { use, useEffect } from 'react'
// import { ChatDataType } from '@/types/ChatDataType'
import styles from '@/styles/chatpage.module.css'
import AllChats from '@/components/chat/AllChats'
import CurrentChat from '@/components/chat/CurrentChat'
import NoChat from '@/components/chat/NoChat'
const page = () => {
    const [currentChat, setCurrentChat] = React.useState(null)
    const [currentChatEmail, setCurrentChatEmail] = React.useState(null)
    const [chats, setChats] = React.useState([])
    const [onlineUsers, setOnlineUsers] = React.useState<any>([])
    const [allMessages, setAllMessages] = React.useState<any>([])

   
    function removeDuplicates(arr: Array<any>) {
        return arr.filter((item,
            index) => arr.indexOf(item) === index);
    }

    const [ws, setWs] = React.useState<any>(null)
    useEffect(() => {
        const ws1 = new WebSocket('ws://localhost:8000')
        setWs(ws1)

        ws1.addEventListener('message', (e) => {
            const messageData = JSON.parse(e.data)
            // console.log(messageData.online)

            if ('online' in messageData) {
                let onlineUsers = messageData.online
                let filtered = removeDuplicates(onlineUsers)
                setOnlineUsers(filtered)
            }
            else {
                console.log('MESSAGE FOR RECIPIENT', messageData)

                setAllMessages((prev: any[]) => {
                    let newMessages = [...prev, messageData]
                    return newMessages
                })
            }
        })
    }, [])

    const [selectedChatUser, setSelectedChatUser] = React.useState(null)

    const getSelectedUser = async (email: string) => {
        let data = await fetch(process.env.NEXT_PUBLIC_API_URL + '/user/getUserByEmail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email
            }),
            credentials: 'include'
        })

        let user = await data.json()
        console.log('slerted user', user.data)
        setSelectedChatUser(user.data)
    }

    useEffect(() => {
        // console.log(currentChatEmail)
        if (currentChatEmail) {
            setAllMessages([])
            getSelectedUser(currentChatEmail)
        }

    }, [currentChatEmail])




    return (
        <div className={styles.chatpage}>
            <div className={styles.left}>  <AllChats
                onlineUsers={onlineUsers}
                setCurrentChatEmail={setCurrentChatEmail}
            /></div>
            <div className={styles.right}>
                {
                    currentChatEmail ?
                        <CurrentChat
                            email={currentChatEmail}
                            onlineUsers={onlineUsers}
                            selectedChatUser={selectedChatUser}
                            ws={ws}

                            allMessages={allMessages}
                            setAllMessages={setAllMessages}
                            />
                        :
                        <NoChat />
                }
            </div>
        </div>
    )
}

export default page