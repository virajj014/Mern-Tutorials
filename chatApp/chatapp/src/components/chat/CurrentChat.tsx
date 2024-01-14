"use client";
import React, { useEffect, useRef } from 'react'
import nochat from '@/assets/noChats.png'
import noMessage from '@/assets/noMessage.png'
import Image from 'next/image'
import styles from '@/styles/currentChat.module.css'
import { deepOrange, deepPurple } from '@mui/material/colors'
import { Avatar } from '@mui/material'
// import io from 'socket.io-client';
import { useAppSelector } from '@/redux/store';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';


const CurrentChat = (params: any) => {
    const router = useRouter()
    const { selectedChat, allMessages, setAllMessages , message , setMessage,sendMessage, socket } = params
    const auth = useAppSelector((state) => state.authReducer)
    const chatMessagesRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        if (chatMessagesRef.current) {
            chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
        }
    };

    scrollToBottom()

    useEffect(() => {
        // Function to scroll to the bottom of chatMessages div
      
        scrollToBottom();
    }, [allMessages]);

    

    useEffect(() => {
        console.log('all messages', allMessages)
    }, [allMessages])


  
    useEffect(() => {
        if (!auth.isAuth) {
            return router.push('/login')
        }
    }, [auth])


    return (
        <div className={styles.currentChat}>
            {
                selectedChat ?
                    <div className={styles.chatIn}>
                        <div className={styles.chatTop}>
                            {
                                selectedChat.isGroupChat ?
                                    <div className={styles.chatImage}>
                                        <Avatar sx={{ bgcolor: deepOrange[500] }}
                                        >{selectedChat.chatName[0]}</Avatar>
                                    </div>
                                    :
                                    <div className={styles.chatImage}>
                                        <Avatar alt={selectedChat.name} src={
                                            `${process.env.NEXT_PUBLIC_API_URL}/${selectedChat.users[0]._id == auth.user._id
                                                ? selectedChat.users[1].profilePic
                                                : selectedChat.users[0].profilePic
                                            }`
                                        } sx={{ bgcolor: deepPurple[500] }} />
                                    </div>
                            }

                            {
                                selectedChat.isGroupChat ?
                                    <div className={styles.chatNameStatus}>
                                        <div className={styles.chatName}>{selectedChat.chatName}</div>
                                        {/* <div className={checkIfOnline(selectedChatUser._id) ? styles.chatOnline : styles.chatOffline}></div> */}
                                    </div>
                                    :
                                    <div className={styles.chatNameStatus}>
                                        <div className={styles.chatName}>{selectedChat.users[0]._id
                                            == auth.user._id
                                            ? selectedChat.users[1].name : selectedChat.users[0].name}</div>
                                        {/* <div className={checkIfOnline(selectedChatUser._id) ? styles.chatOnline : styles.chatOffline}></div> */}
                                    </div>
                            }
                        </div>

                        <div className={styles.chatMessages}  ref={chatMessagesRef}>
                            {
                                allMessages ?
                                    allMessages.map((message: any, index: number) => {
                                        // console.log(message)

                                        // {
                                        //     "_id": "659526769d96b2cffd1821dc",
                                        //     "sender": {
                                        //         "_id": "658ae76ea6a94e1603ec6599",
                                        //         "name": "Harshal Jain",
                                        //         "email": "virajj014@gmail.com"
                                        //     },
                                        //     "content": "yo yoo honey singh",
                                        //     "chat": {
                                        //         "_id": "659524949d96b2cffd1821c5",
                                        //         "chatName": "sender",
                                        //         "isGroupChat": false,
                                        //         "users": [
                                        //             "658ae76ea6a94e1603ec6599",
                                        //             "658dbd3d618bc22f334fa2be"
                                        //         ],
                                        //         "createdAt": "2024-01-03T09:10:44.811Z",
                                        //         "updatedAt": "2024-01-03T09:18:46.861Z",
                                        //         "__v": 0,
                                        //         "latestMessage": "659526769d96b2cffd1821dc"
                                        //     },
                                        //     "readBy": [],
                                        //     "createdAt": "2024-01-03T09:18:46.606Z",
                                        //     "updatedAt": "2024-01-03T09:18:46.606Z",
                                        //     "__v": 0
                                        // }
                                        return (
                                            <div className={styles.messagerow} key={index}>
                                                {
                                                    message.sender._id === auth.user._id ?
                                                        <div className={styles.messageYou} key={index}>
                                                            <div className={styles.messageText}>{message.content}</div>
                                                            {/* <div className={styles.messageTime}>{message.time}</div> */}
                                                        </div>
                                                        :
                                                        <div className={styles.message} key={index}>
                                                            <div className={styles.messageText}>{message.content}</div>
                                                            {/* <div className={styles.messageTime}>{message.time}</div> */}
                                                        </div>

                                                }
                                            </div>
                                        )
                                    })
                                    :
                                    <div className={styles.noChat}>
                                        <Image src={noMessage} width={500} height={500} alt='' />
                                    </div>
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
        // <div className={styles.currentChat}>
        //     {
        //         selectedChatUser ?
        //             <div className={styles.chatIn}>


        //                 <div className={styles.chatMessages}>
        //                     {
        //                         allMessages.map((message: any, index: number) => {
        //                             console.log(message.senderId, auth.user._id , message.content.text)
        //                             return (

        //                                 <div className={styles.messagerow}>
        //                                     {
        //                                         message.senderId === auth.user._id ?
        //                                             <div className={styles.messageYou} key={index}>
        //                                                 <div className={styles.messageText}>{message.content.text}</div>
        //                                                 {/* <div className={styles.messageTime}>{message.time}</div> */}
        //                                             </div>
        //                                             :
        //                                             <div className={styles.message} key={index}>
        //                                                 <div className={styles.messageText}>{message.content.text}</div>
        //                                                 {/* <div className={styles.messageTime}>{message.time}</div> */}
        //                                             </div>

        //                                     }
        //                                 </div>

        //                             )
        //                         }
        //                         )
        //                     }
        //                 </div>

        //                 <div className={styles.chatBottom}>
        //                     <input type="text" placeholder="Type a message"
        //                         value={message}
        //                         onChange={(e) => setMessage(e.target.value)}
        //                     />
        //                     <div className={styles.send}
        //                         onClick={sendMessage}
        //                     >
        //                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        //                             <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        //                         </svg>
        //                     </div>
        //                 </div>
        //             </div> :
        //             <div className={styles.noChat}>
        //                 <Image src={nochat} width={500} height={500} alt='' />
        //             </div>
        //     }
        // </div>
    )
}

export default CurrentChat