"use client";
import React, { use, useEffect } from "react";
// import { ChatDataType } from '@/types/ChatDataType'
import styles from "@/styles/chatpage.module.css";
import AllChats from "@/components/chat/AllChats";
import CurrentChat from "@/components/chat/CurrentChat";
import NoChat from "@/components/chat/NoChat";
import io from "socket.io-client";
import { useAppSelector } from "@/redux/store";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

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

  const getSelectedChat = async () => {};
  const getChatMessages = async () => {};
  const sendMessage = async () => {};
  const fetchContacts = async () => {

    let res = await fetch(apiurl + '/chat/fetchchats',{
      method:'GET',
      headers:{
        'Content-Type':'application/json'
      },
      credentials:'include'
    })

    let data = await res.json()
    // console.log('FETCH CONTACTS',data)

    if(data.ok){
      setContacts(data.data)
    }
    else{
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

  return (
    <div className={styles.chatpage}>
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
            // currentChatId={currentChatId}
            // selectedChat={selectedChat}
            // allMessages={allMessages}
            // setAllMessages={setAllMessages}
            // message={message}
            // setMessage={setMessage}
            // sendMessage={sendMessage}
            // socket={socket}
          />
        ) : (
          <NoChat />
        )}
      </div>
    </div>
  );
};

export default page;
