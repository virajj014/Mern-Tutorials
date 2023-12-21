import React from 'react'
import nochat from '@/assets/noChats.png'
import Image from 'next/image'
import styles from '@/styles/currentChat.module.css'
import { deepPurple } from '@mui/material/colors'
import { Avatar } from '@mui/material'
const CurrentChat = () => {
    const [chat, setChat] = React.useState<any>(null)

    const fetchChat = async () => {
        let temp = {
            chatName: 'Rahul',
            image: '',
            online: true,
            messages: [
                {
                    message: 'Hello',
                    time: '12:00 PM',
                    sender: 'Rahul',
                    seen: false
                },
                {
                    message: 'Hi',
                    time: '12:00 PM',
                    sender: 'You',
                    seen: true
                },
                {
                    message: 'How are you ?',
                    time: '12:00 PM',
                    sender: 'Rahul',
                    seen: false
                },
                {
                    message: 'I am fine',
                    time: '12:00 PM',
                    sender: 'You',
                    seen: true
                },
                {
                    message: 'How are you ?',
                    time: '12:00 PM',
                    sender: 'Rahul',
                    seen: false
                },
                {
                    message: 'I am fine',
                    time: '12:00 PM',
                    sender: 'You',
                    seen: true
                },
                {
                    message: 'How are you ?',
                    time: '12:00 PM',
                    sender: 'Rahul',
                    seen: false
                },
                {
                    message: 'I am fine',
                    time: '12:00 PM',
                    sender: 'You',
                    seen: true
                },
                {
                    message: 'How are you ?',
                    time: '12:00 PM',
                    sender: 'Rahul',
                    seen: false
                },
                {
                    message: 'I am fine',
                    time: '12:00 PM',
                    sender: 'You',
                    seen: true
                },
                {
                    message: 'How are you ?',
                    time: '12:00 PM',
                    sender: 'Rahul',
                    seen: false
                },
                {
                    message: 'I am fine',
                    time: '12:00 PM',
                    sender: 'You',
                    seen: true
                },
                {
                    message: 'How are you ?',
                    time: '12:00 PM',
                    sender: 'Rahul',
                    seen: false
                },
                {
                    message: 'I am fine',
                    time: '12:00 PM',
                    sender: 'You',
                    seen: true
                },
                {
                    message: 'How are you ?',
                    time: '12:00 PM',
                    sender: 'Rahul',
                    seen: true
                }
            ]
        }

        setChat(temp)
    }

    React.useEffect(() => {
        fetchChat()
    }, [])
    return (
        <div className={styles.currentChat}>
            {
                chat ?
                    <div className={styles.chatIn}>
                        <div className={styles.chatTop}>
                            <div className={styles.chatImage}>
                                <Avatar alt={chat.name} src="/static/images/avatar/2.jpg" sx={{ bgcolor: deepPurple[500] }} />
                            </div>
                            <div className={styles.chatNameStatus}>
                                <div className={styles.chatName}>{chat.chatName}</div>
                                <div className={chat.online ? styles.chatOnline : styles.chatOffline}></div>
                            </div>
                        </div>

                        <div className={styles.chatMessages}>
                            {
                                chat.messages.map((message: any, index: number) => (
                                    <div className={styles.messagerow}>
                                        {
                                            message.sender === 'You' ?
                                                <div className={styles.messageYou} key={index}>
                                                    <div className={styles.messageText}>{message.message}</div>
                                                    <div className={styles.messageTime}>{message.time}</div>
                                                </div>
                                                :
                                                <div className={styles.message} key={index}>
                                                    <div className={styles.messageText}>{message.message}</div>
                                                    <div className={styles.messageTime}>{message.time}</div>
                                                </div>

                                        }
                                    </div>
                                )
                                )
                            }
                        </div>

                        <div className={styles.chatBottom}>
                            <input type="text" placeholder="Type a message" />
                            <div className={styles.send}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </div>
                        </div>
                    </div> :
                    <div className={styles.noChat}>
                        <Image src={nochat} width={500} height={500} alt='' />
                    </div>
            }
        </div>
    )
}

export default CurrentChat