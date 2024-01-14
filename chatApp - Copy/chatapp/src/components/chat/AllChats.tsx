import React, { useEffect } from 'react'
import styles from '@/styles/allChats.module.css'
import { Avatar, Button, TextField } from '@mui/material'
import { deepOrange, deepPurple } from '@mui/material/colors'
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { ToastContainer, toast } from 'react-toastify';
import Chip from '@mui/material/Chip';
import Autocomplete from '@mui/material/Autocomplete';
import Stack from '@mui/material/Stack';
import { useRouter } from 'next/navigation';

// I am sending setCurrentChatEmail as props
const AllChats = (props: any) => {
    const { setCurrentChatEmail, onlineUsers } = props

    const router = useRouter()

    const [search, setSearch] = React.useState<string>('')

    const [contacts, setContacts] = React.useState<any[]>([])

    const [openNewP2p, setOpenNewP2p] = React.useState(false);
    const handleOpen = () => setOpenNewP2p(true);
    const handleClose = () => setOpenNewP2p(false);
    const [newP2pEmail, setNewP2pEmail] = React.useState<string>('')
    // const [newP2pMessage, setNewP2pMessage] = React.useState<string>('')

    const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        // border: '1px solid #000',
        boxShadow: 24,
        p: 4,
    };


    const createContact = () => {
        // console.log(newP2pEmail, newP2pMessage)
        fetch(process.env.NEXT_PUBLIC_API_URL + '/chat/addContact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                contactEmail: newP2pEmail
            })
        }).then(res => res.json()).then(data => {
            console.log('Add contact', data)
            if (data.ok) {
                toast.success('Contact Added')
                fetchContacts()
            }
            else {
                toast.error(data.message)
            }
            handleClose()
        })
    }




    const fetchContacts = async () => {
        let res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/chat/getContacts', {
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


    // React.useEffect(() => {
    //     console.log(onlineUsers, 'online users ')
    //     let newContacts = contacts.map(contact => {
    //         if (onlineUsers.includes(contact._id)) {
    //             contact.online = true
    //         }
    //         else {
    //             contact.online = false
    //         }
    //         return contact
    //     })

    //     console.log(newContacts, 'new contacts')
    //     }, [onlineUsers])

    return (
        <div className={styles.allChats}>
            <div className={styles.search}>
                <input type="text" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
            </div>

            <div className={styles.chats}>
                {
                    contacts.map((contact, index) => {

                        if(onlineUsers.includes(contact._id)) {
                            contact.online = true
                        }

                        return (
                            <div className={styles.chat} key={index}
                                onClick={() => {
                                    setCurrentChatEmail(contact.email)
                                }}
                            >
                                <Avatar alt={contact.name} src={
                                    `${process.env.NEXT_PUBLIC_API_URL}/${contact.profilePic}`

                                } sx={{ bgcolor: deepPurple[500] }} />
                                <div className={styles.chatInfo}>
                                    <div className={styles.name}>{contact.name}  {contact.online ? ' - online' : ''}</div>
                                    {
                                        contact.lastMessage &&
                                        <div className={styles.lastMessage}>{contact.lastMessage}</div>
                                    }
                                </div>
                                <div className={styles.time}>{
                                    contact.lastMessageTime && new Date(contact.lastMessageTime).toLocaleDateString()
                                }</div>
                            </div>
                        )
                    })
                }
            </div>

            <div className={styles.buttondiv}>
                <button onClick={
                    () => handleOpen()
                }>+ Add Contact</button>
            </div>


            <Modal
                open={openNewP2p}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                {/* <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Text in a modal
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
                    </Typography>
                </Box> */}
                <Box sx={style}>
                    <div className={styles.newP2pModal}>
                        <TextField color="secondary" id="outlined-basic" label="Email" variant="outlined"
                            value={newP2pEmail} onChange={(e) => setNewP2pEmail(e.target.value)}
                        />

                        <Button color="secondary" variant="contained"
                            onClick={() => createContact()}
                        >Send</Button>
                    </div>
                </Box>
            </Modal>


        </div>
    )
}

export default AllChats