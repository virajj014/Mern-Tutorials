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
import SendIcon from '@mui/icons-material/Send';
import { BeatLoader } from 'react-spinners';
let apiurl = process.env.NEXT_PUBLIC_API_URL

const CurrentChat = (params: any) => {
  const router = useRouter()
  const chatMessagesRef = useRef<HTMLDivElement>(null);
  const { selectedChat, allMessages, setAllMessages, message, setMessage, sendMessage, socket, currentChatId } = params
  const auth = useAppSelector((state) => state.authReducer)
  const [someoneTyping, setSomeoneTyping] = React.useState(false);
  const scrollToBottom = () => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight
    }
  }
  useEffect(() => {
    scrollToBottom()
  }, [])

  // useEffect(() => {
  //   console.log('SELECTED CHAT', selectedChat)
  // }, [selectedChat])

  useEffect(() => {
    scrollToBottom()
  }, [allMessages])

  useEffect(() => {
    if (!auth.isAuth) {
      return router.push('/login')
    }
  }, [auth])


  const handleTyping = () => {
    socket.emit("typing", currentChatId);
  };

  const handleStopTyping = () => {
    // add delay for 5 seconds
    setTimeout(() => {
      socket.emit("stop typing", currentChatId);
    }, 5000);
  };


  useEffect(() => {
    socket.on("typing", (room: any) => {
      // Handle typing indicator for the given chat room
      // You can update the UI to show that someone is typing
      // console.log("Someone is typing in room:", room);
      setSomeoneTyping(true)
      scrollToBottom()

    });

    socket.on("stop typing", (room: any) => {
      // Handle stop typing indicator for the given chat room
      // You can update the UI to hide the typing indicator
      // console.log("Someone stopped typing in room:", room);
      setSomeoneTyping(false)
    });

    // Cleanup event listeners when the component is unmounted
    return () => {
      socket.off("typing");
      socket.off("stop typing");
    };
  }, [currentChatId]);

  useEffect(() => {
    if (!auth.isAuth) {
      return router.push("/login");
    }
  }, [auth]);
  return (
    <div className={styles.currentChat}>
      {
        selectedChat ?
          <div className={styles.chatIn}>
            <div className={styles.chatTop}>
              {
                selectedChat.isGroupChat ?
                  <div className={styles.chatImage}>
                    <Avatar sx={{ bgcolor: deepOrange[500] }} className={styles.avatar}>
                      {selectedChat.chatName[0]}
                    </Avatar>
                  </div>
                  :
                  <div className={styles.chatImage}>
                    <Avatar
                      alt={selectedChat.chatName}
                      src={`${apiurl}/${selectedChat.users[0]._id == auth.user._id
                        ? selectedChat.users[1].profilePic
                        : selectedChat.users[0].profilePic
                        }`}
                      sx={{ bgcolor: deepPurple[500] }}
                    />
                  </div>

              }


              {
                selectedChat.isGroupChat ?
                  <div className={styles.chatNameStatus}>
                    <div className={styles.chatName}>{selectedChat.chatName}</div>
                  </div>
                  :
                  <div className={styles.chatImage}>
                    <div className={styles.chatName}>{selectedChat.users[0]._id
                      == auth.user._id
                      ? selectedChat.users[1].name : selectedChat.users[0].name}</div>
                  </div>

              }
            </div>


            <div className={styles.chatMessages} ref={chatMessagesRef}>
              {
                allMessages && allMessages.length > 0 ?
                  allMessages.map((message: any, index: number) => {
                    return (
                      <div className={styles.messagerow} key={index}>
                        {
                          message.sender._id == auth.user._id ?
                            <div className={styles.messageYou}>
                              <div className={styles.messageText}>{message.content}</div>
                            </div>
                            :
                            <div className={styles.message}>
                              <div className={styles.messageText}>{message.content}</div>
                            </div>
                        }


                      </div>
                    )
                  })
                  :
                  <div className={styles.noChatout}>
                    <Image src={noMessage} width={500} height={500} alt='' />
                  </div>
              }
              {
                someoneTyping &&
                <div className={styles.messagerow} >
                  <div className={styles.message}>
                    <BeatLoader color="#ffffff" />
                  </div>
                </div>
              }
            </div>



            <div className={styles.chatBottom}>
              <input type='text' placeholder='Type a message'
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleTyping}
                onKeyUp={handleStopTyping}
              />

              <div onClick={sendMessage}>
                <SendIcon sx={{ color: deepPurple[500] }} />
              </div>
            </div>
          </div>
          :
          <div className={styles.noChatout}>
            <Image src={nochat} width={500} height={500} alt='' />
          </div>
      }
    </div>
  )
}

export default CurrentChat