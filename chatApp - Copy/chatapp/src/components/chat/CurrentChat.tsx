"use client";
import React, { useEffect } from 'react'
import nochat from '@/assets/noChats.png'
import Image from 'next/image'
import styles from '@/styles/currentChat.module.css'
import { deepPurple } from '@mui/material/colors'
import { Avatar } from '@mui/material'
// import io from 'socket.io-client';
import { useAppSelector } from '@/redux/store';
import { useRouter } from 'next/navigation';


const CurrentChat = (params: any) => {
    const router = useRouter()
    const { selectedChatUser, onlineUsers, ws, allMessages, setAllMessages } = params


    const checkIfOnline = (userid: string) => {
        let online = onlineUsers.find((id: any) => id === userid)
        if (online) {
            return true
        }
        else {
            return false
        }
    }

    const auth = useAppSelector((state) => state.authReducer)
    console.log(auth)
    const [email, setEmail] = React.useState(params.email)
    const [chat, setChat] = React.useState<any>(null)

    // let socket = io('http://localhost:8000');

    // useEffect(() => {
    //     if (!auth.isAuth) {
    //         return router.push('/login')
    //     }
    //     socket.on('connect', () => {
    //         console.log('ft connected');
    //     });
    //     socket.on('disconnect', () => {
    //         console.log('ft disconnected');
    //     });

    //     // socket.on('chatmessage', (message) => {
    //     //     console.log(message);
    //     // });



    //     return () => {
    //         socket.disconnect();
    //     };
    // }, [auth]);

    // if (chat) {
    //     socket.emit('joinp2p', {chatId : chat._id});
    // }

    // const fetchChat = async () => {
    //     let res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/chat/getMessages', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify({
    //             receiverEmail: decodeURIComponent(email)
    //         }),
    //         credentials: 'include'

    //     })


    //     let data = await res.json()
    //     console.log(data)
    //     setChat(data.data)


    //     // {
    //     //     "message": "Chat found",
    //     //     "data": {
    //     //         "_id": "658ae7f5a6a94e1603ec65b7",
    //     //         "users": [
    //     //             "658ae7dda6a94e1603ec65aa",
    //     //             "658ae76ea6a94e1603ec6599"
    //     //         ],
    //     //         "messages": [
    //     //             {
    //     //                 "_id": "658ae7f5a6a94e1603ec65b9",
    //     //                 "chat": "658ae7f5a6a94e1603ec65b7",
    //     //                 "sender": "658ae7dda6a94e1603ec65aa",
    //     //                 "content": {
    //     //                     "text": "heyy",
    //     //                     "_id": "658ae7f5a6a94e1603ec65ba"
    //     //                 },
    //     //                 "receiver": "658ae76ea6a94e1603ec6599",
    //     //                 "createdAt": "2023-12-26T14:49:25.262Z",
    //     //                 "updatedAt": "2023-12-26T14:49:25.262Z",
    //     //                 "__v": 0
    //     //             }
    //     //         ],
    //     //         "createdAt": "2023-12-26T14:49:25.194Z",
    //     //         "updatedAt": "2023-12-26T14:49:25.327Z",
    //     //         "__v": 1,
    //     //         "latestMessage": "658ae7f5a6a94e1603ec65b9"
    //     //     },
    //     //     "ok": true
    //     // }



    // }

    // React.useEffect(() => {
    //     fetchChat()
    // }, [])

    let apiurl = process.env.NEXT_PUBLIC_API_URL



    const [message, setMessage] = React.useState('')
    const sendMessage = async () => {
        console.log('sending message')
        ws.send(JSON.stringify({
            senderId: auth.user._id,
            receiverId: selectedChatUser._id,
            content: {
                text: message
            },
            chatId: "xyz"
        }))

        setAllMessages([...allMessages, {
            senderId: auth.user._id,
            receiverId: selectedChatUser._id,
            content: {
                text: message
            },
            chatId: "xyz"
        }])
    }
    // const sendMessage = async () => {
    //     let senderId = auth.user._id
    //     let receiverId = chat.receiver._id
    //     let content = {
    //         text: message
    //     }
    //     let chatId = chat._id
    //     socket.emit('p2pchatmessagesend', {
    //         senderId,
    //         receiverId,
    //         content,
    //         chatId
    //     });
    // }


    //  selectedChatUser =
    // {
    //     "online": false,
    //     "_id": "658dbd3d618bc22f334fa2be",
    //     "name": "Harshal Jain",
    //     "email": "harshal.jain.csai.20@ggits.net",
    //     "profilePic": "public\\1703787836983.jpeg",
    //     "contacts": [
    //         {
    //             "contactId": "658ae7dda6a94e1603ec65aa",
    //             "lastMessage": "",
    //             "lastMessageTime": "",
    //             "_id": "658dbd53618bc22f334fa2c8"
    //         },
    //         {
    //             "contactId": "658ae76ea6a94e1603ec6599",
    //             "lastMessage": "",
    //             "lastMessageTime": "",
    //             "_id": "658dbd5c618bc22f334fa2d1"
    //         }
    //     ],
    //     "createdAt": "2023-12-28T18:23:57.151Z",
    //     "updatedAt": "2023-12-28T18:24:28.450Z",
    //     "__v": 2
    // }


    useEffect(() => {
        console.log('all messages', allMessages)
    }, [allMessages])
    return (
        <div className={styles.currentChat}>
            {
                selectedChatUser ?
                    <div className={styles.chatIn}>
                        <div className={styles.chatTop}>
                            <div className={styles.chatImage}>
                                <Avatar alt={selectedChatUser.name}
                                    src={`${apiurl}/${selectedChatUser.profilePic}`}
                                    sx={{ bgcolor: deepPurple[500] }} />
                            </div>
                            <div className={styles.chatNameStatus}>
                                <div className={styles.chatName}>{selectedChatUser.name}</div>
                                <div className={checkIfOnline(selectedChatUser._id) ? styles.chatOnline : styles.chatOffline}></div>
                            </div>
                        </div>

                        <div className={styles.chatMessages}>
                            {
                                allMessages.map((message: any, index: number) => {
                                    console.log(message.senderId, auth.user._id , message.content.text)
                                    return (

                                        <div className={styles.messagerow}>
                                            {
                                                message.senderId === auth.user._id ?
                                                    <div className={styles.messageYou} key={index}>
                                                        <div className={styles.messageText}>{message.content.text}</div>
                                                        {/* <div className={styles.messageTime}>{message.time}</div> */}
                                                    </div>
                                                    :
                                                    <div className={styles.message} key={index}>
                                                        <div className={styles.messageText}>{message.content.text}</div>
                                                        {/* <div className={styles.messageTime}>{message.time}</div> */}
                                                    </div>

                                            }
                                        </div>

                                    )
                                }
                                )
                            }
                        </div>

                        <div className={styles.chatBottom}>
                            <input type="text" placeholder="Type a message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                            <div className={styles.send}
                                onClick={sendMessage}
                            >
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