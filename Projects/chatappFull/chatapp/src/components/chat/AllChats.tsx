import React, { useEffect } from "react";
import styles from "@/styles/allChats.module.css";
import { Avatar, Button, TextField } from "@mui/material";
import { deepOrange, deepPurple } from "@mui/material/colors";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { ToastContainer, toast } from "react-toastify";
import Chip from "@mui/material/Chip";
import Autocomplete from "@mui/material/Autocomplete";
import Stack from "@mui/material/Stack";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/store";
let apiurl: string = `${process.env.NEXT_PUBLIC_API_URL}`;

const AllChats = (props: any) => {
  const { setCurrentChatId, fetchContacts, contacts } = props;
  const [chats, setChats] = React.useState<any[]>([]);
  useEffect(() => {
    console.log(contacts);
    setChats(contacts);
  }, [contacts]);

  const auth = useAppSelector((state) => state.authReducer);
  const [search, setSearch] = React.useState<string>("");

  return (
    <div className={styles.allChats}>
      <div className={styles.search}>
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>
      </div>

      <div className={styles.chats}>
        {chats.map((contact, index) => {
          return (
            <div className={styles.chat} key={index}>
              {contact.isGroupChat ? (
                <div className={styles.avatar}>
                  <Avatar sx={{ bgcolor: deepOrange[500] }}>
                    {contact.chatName[0]}
                  </Avatar>
                </div>
              ) : (
                <div className={styles.avatar}>
                  <Avatar
                    alt={contact.chatName}
                    src={`${apiurl}/${
                      contact.users[0]._id == auth.user._id
                        ? contact.users[1].profilePic
                        : contact.users[0].profilePic
                    }`}
                    sx={{ bgcolor: deepPurple[500] }}
                  />
                </div>
              )}

              {contact.isGroupChat ? (
                <div className={styles.chatInfo}>
                  <div className={styles.name}>{contact.chatName}</div>
                  {contact.latestMessage && (
                    <div className={styles.lastMessage}>
                      <span>{contact.latestMessage.sender.name}</span>:
                      <span>{contact.latestMessage.content}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className={styles.chatInfo}>
                  <div className={styles.name}>
                    {contact.users[0]._id == auth.user._id
                      ? contact.users[1].name
                      : contact.users[0].name}

                    {contact.latestMessage && (
                      <div className={styles.lastMessage}>
                        <span>
                          {contact.latestMessage.sender._id == auth.user._id
                            ? "You : "
                            : ""}
                        </span>
                        <span>{contact.latestMessage.content}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
        
      </div>

      <div className={styles.buttondiv}>
        <Button color="secondary" variant="contained" onClick={() => {}}>
         + Chat
        </Button>
       
        <Button color="secondary" variant="contained" onClick={() => {}}>
          + Group
        </Button>
      </div>
    </div>
  );
};

export default AllChats;
