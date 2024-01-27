"use client";
import React, { use, useEffect, useMemo } from "react";
// import { ChatDataType } from '@/types/ChatDataType'
import styles from "@/styles/chatpage.module.css";
import AllChats from "@/components/chat/AllChats";
import CurrentChat from "@/components/chat/CurrentChat";
import NoChat from "@/components/chat/NoChat";
import { useAppSelector } from "@/redux/store";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import io from "socket.io-client";




let apiurl: string = `${process.env.NEXT_PUBLIC_API_URL}`;
let socket: any = null;

const page = () => {
  const auth = useAppSelector((state) => state.authReducer);
  const router = useRouter();

  const [currentChatId, setCurrentChatId] = React.useState(null);
  const [allMessages, setAllMessages] = React.useState<any>([]);
  const [selectedChat, setSelectedChat] = React.useState<any>(null);
  const [contacts, setContacts] = React.useState<any[]>([]);
  const [message, setMessage] = React.useState("");

  

  socket = useMemo(()=> io(apiurl),[])


  useEffect(() => {
    if (!auth.isAuth) {
      return router.push('/login')
    }

  }, [auth])







  const getSelectedChat = async () => {
    let data = await fetch(process.env.NEXT_PUBLIC_API_URL + '/chat/accesschatbyid', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ chatId: currentChatId })
    })

    let chat = await data.json()
    if(chat.ok){

      selectedChat?._id && socket.emit("leaveroom", selectedChat._id);
      setSelectedChat(chat.data)
      socket.emit("joinroom", chat.data._id)
    }
    else{
      toast.error(chat.message)
    }

    
  };
  const getChatMessages = async () => {
    console.log("getChatMessages", currentChatId);
    let res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/chat/fetchmessages/' + currentChatId, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })

    let data = await res.json();

    if (data.ok && data.data.length > 0) {
      console.log('MESSAGES ', data.data)
      setAllMessages(data.data)
    }
    else {
      setAllMessages([])
    }
  };
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
      setMessage("")
      setAllMessages((prev: any[]) => {
        if (Array.isArray(prev)) {
          let newMessages = [...prev, data.data];
          return newMessages;
        }
        else {
          return [data.data];
        }
      })


      socket.emit("stop typing", currentChatId);
      socket.emit("messageSend",data.data)
      fetchContacts()

    }
    else {
      toast.error(data.message)
    }
  };
  const fetchContacts = async () => {

    let res = await fetch(apiurl + '/chat/fetchchats', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })

    let data = await res.json()
    // console.log('FETCH CONTACTS',data)

    if (data.ok) {
      setContacts(data.data)
    }
    else {
      toast.error(data.message)
    }
  };

  React.useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    if (!auth.isAuth) {
      return router.push("/login");
    }
  }, [auth]);


  useEffect(() => {
    if (currentChatId) {
      setAllMessages([])
      getChatMessages()
      getSelectedChat()
    }
  }, [currentChatId])





  useEffect(()=>{
    if (!auth.isAuth) {
      return router.push("/login");
    }


    socket.on('connect',()=>{
      console.log("connected ",socket.id);
    })


    socket.emit("joinownuserid", auth.user._id)

    socket.on("refetchcontacts", () => {
      console.log("REFETCH CONTACTS CALLED");
      fetchContacts();
    })
  },[])

  useEffect(()=>{
    socket.on("messageReceived",(data:any)=>{
      console.log("new message recieved")

      let oldMessages = allMessages;
      let newMessages = [...oldMessages,data]

      setAllMessages(newMessages)
    })
  })


  return (
   auth.user && <div className={styles.chatpage}>
      <div className={styles.left}>
        <AllChats
          setCurrentChatId={setCurrentChatId}
          contacts={contacts}
          setContacts={setContacts}
          fetchContacts={fetchContacts}
        />
      </div>
      <div className={styles.right}>
        {currentChatId ? (
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
        ) : (
          <NoChat />
        )}
      </div>
    </div>
  );
};

export default page;
