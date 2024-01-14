"use client"
import React, { use, useEffect } from 'react'
// import { ChatDataType } from '@/types/ChatDataType'
import styles from '@/styles/chatpage.module.css'
import AllChats from '@/components/chat/AllChats'
import CurrentChat from '@/components/chat/CurrentChat'
import NoChat from '@/components/chat/NoChat'
import io from 'socket.io-client'
import { useAppSelector } from '@/redux/store'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'


let apiurl: string = `${process.env.NEXT_PUBLIC_API_URL}`;

let socket: any = null


const page = () => {
    const auth = useAppSelector((state) => state.authReducer)
    const router = useRouter()

    const [currentChatId, setCurrentChatId] = React.useState(null)
    const [chats, setChats] = React.useState([])
    const [onlineUsers, setOnlineUsers] = React.useState<any>([])
    const [allMessages, setAllMessages] = React.useState<any>([])
    const [socketConnected, setSocketConnected] = React.useState(false)
    const [selectedChat, setSelectedChat] = React.useState<any>(null)


    useEffect(() => {
        if (!auth.isAuth) {
            return router.push('/login')
        }

    }, [auth])





    useEffect(() => {
        socket = io(apiurl)
        if (auth.isAuth) {
            socket.emit("setup", auth.user)
        }
        socket.on("connected", () => {
            console.log('user connected')
            setSocketConnected(true)
        })
    }, [])

    useEffect(() => {
        socket.on('message recieved', (newMessage: any) => {
            console.log('new message recieved ft', newMessage.chat._id, selectedChat)
            if (selectedChat && selectedChat._id == newMessage.chat._id) {
                let msgs = [...allMessages, newMessage]
                //    filter out duplicate messages
                let uniqueMsgs = msgs.filter((msg, index) => {
                    let _ids = msgs.map((m) => m._id)
                    return _ids.indexOf(msg._id) == index
                })
                setAllMessages(uniqueMsgs)
            }
            else {
                console.log('message not for this chat')
            }

            fetchContacts()
        })
    })








    const getSelectedChat = async () => {
        let data = await fetch(process.env.NEXT_PUBLIC_API_URL + '/chat/accesschatbyid', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chatId: currentChatId
            }),
            credentials: 'include'
        })

        let chat = await data.json()
        console.log('selected chat', chat.data)
        setSelectedChat(chat.data)
        socket.emit('join chat', chat.data._id);

    }

    const getChatMessages = async () => {
        let res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/chat/fetchmessages/' + currentChatId, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })

        let data = await res.json()

        if (data.ok && data.data.length > 0) {
            console.log('MESSAGES', data.data)
            setAllMessages(data.data)
        }
        else {
            setAllMessages(null)
        }
    }


    const initializeSocket = () => {
        if (apiurl == undefined || auth.isAuth == false) {
            return
        }
        socket = io(apiurl)
        socket.emit("setup", auth.user)
        socket.on("connected", () => {
            console.log('user connected')
            setSocketConnected(true)
        })
    }



    useEffect(() => {
        // console.log(currentChatEmail)
        if (currentChatId) {
            setAllMessages([])
            getChatMessages()
            getSelectedChat()
        }

    }, [currentChatId])




    const [message, setMessage] = React.useState('')
    const sendMessage = async () => {




        let res = await fetch(apiurl + '/chat/sendmessage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chatId: currentChatId,
                content: message
            }),
            credentials: 'include'
        })

        let data = await res.json()

        if (data.ok) {
            setMessage('')
            setAllMessages((prev: any[]) => {
                if (Array.isArray(prev)) {
                    let newMessages = [...prev, data.data];
                    return newMessages;
                } else {
                    // If prev is not an array, consider it as an empty array and add data.data to it
                    return [data.data];
                }
            })
            // initializeSocket()
            socket.emit('new message', data.data)
            fetchContacts()
        }
        else {
            toast.error(data.message)
        }

    }


    const [contacts, setContacts] = React.useState<any[]>([])

    const fetchContacts = async () => {
        let res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/chat/fetchchats', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
        })
        let data = await res.json()
        console.log('fetchContacts', data)

      
        if (data.ok) {
            setContacts(data.data)
        }
    }

    React.useEffect(() => {
        fetchContacts()
    }, [])


    return (
        <div className={styles.chatpage}>
            <div className={styles.left}>  <AllChats
                setCurrentChatId={setCurrentChatId}
                contacts={contacts}
                setContacts={setContacts}
                fetchContacts={fetchContacts}
            /></div>
            <div className={styles.right}>
                {
                    currentChatId ?
                        <CurrentChat
                            currentChatId={currentChatId}
                            selectedChat={selectedChat}
                            allMessages={allMessages}
                            setAllMessages={setAllMessages}
                            message={message}
                            setMessage={setMessage}
                            sendMessage={sendMessage}
                            socket={socket}
                        />
                        :
                        <NoChat />
                }
            </div>
        </div>
    )
}

export default page