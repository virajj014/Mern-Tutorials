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
import { useAppSelector } from '@/redux/store';

// I am sending setCurrentChatEmail as props
const AllChats = (props: any) => {
    const { setCurrentChatId , fetchContacts , contacts } = props
    const [chats , setChats] = React.useState<any[]>([])
    useEffect(() => {
        setChats(contacts)
    }, [contacts])
    const auth = useAppSelector((state) => state.authReducer)
    


    const router = useRouter()

    const [search, setSearch] = React.useState<string>('')
 
    

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
        fetch(process.env.NEXT_PUBLIC_API_URL + '/chat/accesschatp2p', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                recieverEmail: newP2pEmail
            })
        }).then(res => res.json()).then(data => {
            console.log('Add contact', data)
            if (data.message == "Chat found") {
                toast.success('Chat already exists')
                // fetchContacts()
            }
            else if (data.message == "Chat created") {
                toast.success('Chat created')
                // fetchContacts()
            }
            else {
                toast.error(data.message)
            }
            handleClose()
        })
    }






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


    const [openNewGroup, setOpenNewGroup] = React.useState(false);
    const handleOpenGroupModal = () => setOpenNewGroup(true);
    const handleCloseGroupModal = () => setOpenNewGroup(false);
    const [newGroupName, setNewGroupName] = React.useState<string>('')
    const [selelectedUsers, setSelectedUsers] = React.useState<any[]>([])
    const [searchOptions, setSearchOptions] = React.useState<any[]>([])


    const getSearchOptions = async (typedvalue: string) => {
        console.log(typedvalue)

        let res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/user/searchusers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ search: typedvalue })
        })

        let data = await res.json()
        // console.log(data)

        if (data.ok) {
            let newOptions = data.data.map((user: any) => user.email)
            console.log(newOptions)
            setSearchOptions(newOptions)
        }
    }

    // useEffect(() => {
    //     console.log(selelectedUsers)
    // }, [selelectedUsers])
    const createGroup = async () => {
        // console.log(newGroupName, selelectedUsers)
        let res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/chat/creategroup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ name: newGroupName, users: selelectedUsers })
        })

        let data = await res.json()

        if (data.ok) {
            toast.success('Group created')
            handleCloseGroupModal()
        }
        else {
            toast.error(data.message)
        }

    }



    const handleSearch = (e: any) => {}
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
                    chats.map((contact, index) => {

                        return (
                            <div className={styles.chat} key={index}
                                onClick={() => {
                                    console.log(contact)
                                    setCurrentChatId(contact._id)

                                }}
                            >

                                {
                                    contact.isGroupChat ?
                                        <div className={styles.avatar}>
                                            <Avatar sx={{ bgcolor: deepOrange[500] }}
                                            >{contact.chatName[0]}</Avatar>
                                        </div>
                                        :
                                        <div className={styles.avatar}>
                                            <Avatar alt={contact.name} src={
                                                `${process.env.NEXT_PUBLIC_API_URL}/${contact.users[0]._id == auth.user._id
                                                    ? contact.users[1].profilePic
                                                    : contact.users[0].profilePic
                                                }`
                                            } sx={{ bgcolor: deepPurple[500] }} />
                                        </div>
                                }

                                {
                                    contact.isGroupChat ?
                                        <div className={styles.chatInfo}>
                                            <div className={styles.name}>{contact.chatName}</div>

                                            {
                                                contact.latestMessage &&
                                                <div className={styles.lastMessage}>

                                                    <span>{contact.latestMessage.sender.name}</span>
                                                    : <span>{contact.latestMessage.content}</span>
                                                    </div>
                                            }
                                        </div>
                                        :
                                        <div className={styles.chatInfo}>
                                            <div className={styles.name}>{contact.users[0]._id
                                                == auth.user._id
                                                ? contact.users[1].name : contact.users[0].name}</div>

                                            {
                                                contact.latestMessage &&
                                                <div className={styles.lastMessage}>{contact.latestMessage.content}</div>
                                            }
                                        </div>
                                }
                            </div>
                        )
                    })
                }
           
            </div>
            

            <div className={styles.buttondiv}>
                <button onClick={
                    () => handleOpen()
                }>+ Chat</button>
                <button
                    onClick={() => handleOpenGroupModal()}
                >+ Group</button>
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

            <Modal
                open={openNewGroup}
                onClose={handleCloseGroupModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <div className={styles.newP2pModal}>
                        <TextField color="secondary" id="outlined-basic" label="Group Name" variant="outlined"
                            value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)}
                        />
                        <Autocomplete
                            multiple
                            id="tags-standard"
                            options={searchOptions}
                            getOptionLabel={(option) => option}
                            // defaultValue={[searchOptions[0]]}
                            onChange={(event, value: any) => {
                                // console.log(value)
                                setSelectedUsers(value)
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="standard"
                                    color='secondary'
                                    label="Users"
                                    placeholder="Contacts"
                                    onChange={(e) => {
                                        getSearchOptions(e.target.value)
                                    }}
                                />
                            )}
                        />
                        <Button color="secondary" variant="contained"
                            onClick={() => createGroup()}
                        >Create</Button>
                    </div>
                </Box>
            </Modal>
        </div>
    )
}

export default AllChats