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

const AllChats = () => {

    const [search, setSearch] = React.useState<string>('')

    const [chats, setChats] = React.useState<any[]>([])





    const [openNewP2p, setOpenNewP2p] = React.useState(false);
    const handleOpen = () => setOpenNewP2p(true);
    const handleClose = () => setOpenNewP2p(false);
    const [newP2pEmail, setNewP2pEmail] = React.useState<string>('')
    const [newP2pMessage, setNewP2pMessage] = React.useState<string>('')

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


    const semdP2pFirstMessage = () => {
        console.log(newP2pEmail, newP2pMessage)
        fetch(process.env.NEXT_PUBLIC_API_URL + '/chat/createP2PChat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                receiverEmail: newP2pEmail,
                message: newP2pMessage
            })
        }).then(res => res.json()).then(data => {
            console.log(data)
            if (data.ok) {
                fetchChats()
                getP2pGroupChats()
                toast.success('Message Sent')
            }
            else {
                toast.error(data.message)
            }
            handleClose()
        })
    }


    const [openNewGroup, setOpenNewGroup] = React.useState(false);
    const handleOpenGroupModal = () => setOpenNewGroup(true);
    const handleCloseGroupModal = () => setOpenNewGroup(false);
    const [newGroupName, setNewGroupName] = React.useState<string>('')
    const [selelectedUsers, setSelectedUsers] = React.useState<any[]>([])
    const [searchOptions, setSearchOptions] = React.useState<any[]>([])

    const getP2pGroupChats = async () => {
        let res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/chat/getP2pEmails', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
        let data = await res.json()
        console.log(data)

        // extract emails from data

        setSearchOptions(data.data)
    }


    useEffect(() => {
        getP2pGroupChats()
    }, [])


    const createGroup = async () => {
        console.log(newGroupName, selelectedUsers)
        let users = selelectedUsers.map((user) => user._id)
        let groupName = newGroupName

        let res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/chat/createGroup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                groupName,
                users
            })
        })

        let data = await res.json()
        if (data.ok) {
            toast.success('Group Created')
            fetchChats()
            handleCloseGroupModal()
        }
        else {
            toast.error(data.message)
        }


    }



    const [start, setStart] = React.useState<number>(0)
    const [limit, setLimit] = React.useState<number>(10)
    const fetchChats = async () => {
        // [
        //     {
        //         "_id": "6581ed2263be0fe48185327f",
        //         "users": [
        //             "6581ea2b44ff4aa540ba51f2",
        //             "65764ec5ddca926517744c63",
        //             "6581db18e3c4dacab09c2456"
        //         ],
        //         "messages": [],
        //         "Admins": [
        //             "6581db18e3c4dacab09c2456"
        //         ],
        //         "groupName": "My family",
        //         "owner": "6581db18e3c4dacab09c2456",
        //         "createdAt": "2023-12-19T19:21:06.041Z",
        //         "updatedAt": "2023-12-19T19:21:06.041Z",
        //         "__v": 0
        //     },
        //     {
        //         "_id": "6581ea5144ff4aa540ba51fd",
        //         "users": [
        //             {
        //                 "_id": "6581ea2b44ff4aa540ba51f2",
        //                 "name": "Yo yo",
        //                 "email": "harshal.jain.csai.20@ggits.net",
        //                 "profilePic": "public\\1703012906920.png",
        //                 "isVerified": false,
        //                 "createdAt": "2023-12-19T19:08:27.048Z",
        //                 "updatedAt": "2023-12-19T19:08:27.048Z",
        //                 "__v": 0
        //             }
        //         ],
        //         "messages": [
        //             {
        //                 "_id": "6581ea5144ff4aa540ba51ff",
        //                 "createdAt": "2023-12-19T19:09:05.995Z",
        //                 "updatedAt": "2023-12-19T19:09:05.995Z"
        //             }
        //         ],
        //         "createdAt": "2023-12-19T19:09:05.954Z",
        //         "updatedAt": "2023-12-19T19:09:06.037Z",
        //         "__v": 1,
        //         "latestMessage": "6581ea5144ff4aa540ba51ff"
        //     },
        //     {
        //         "_id": "6581dfb104106d1feb82638a",
        //         "users": [
        //             {
        //                 "_id": "65764ec5ddca926517744c63",
        //                 "name": "Viraj Jain",
        //                 "email": "codershub.2430@gmail.com",
        //                 "profilePic": "public\\1702252229666.png",
        //                 "isVerified": false,
        //                 "createdAt": "2023-12-10T23:50:29.800Z",
        //                 "updatedAt": "2023-12-10T23:52:10.204Z",
        //                 "__v": 0
        //             }
        //         ],
        //         "messages": [
        //             {
        //                 "_id": "6581dfb104106d1feb82638c",
        //                 "createdAt": "2023-12-19T18:23:45.575Z",
        //                 "updatedAt": "2023-12-19T18:23:45.575Z"
        //             }
        //         ],
        //         "createdAt": "2023-12-19T18:23:45.533Z",
        //         "updatedAt": "2023-12-19T18:23:45.619Z",
        //         "__v": 1,
        //         "latestMessage": "6581dfb104106d1feb82638c"
        //     }
        // ]


        let res = await fetch(process.env.NEXT_PUBLIC_API_URL + `/chat/getChats?start=${start}&limit=${limit}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
        let data = await res.json()
        console.log(data)
        setChats(data.data.chats)
    }

    React.useEffect(() => {
        fetchChats()
    }, [])
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
                    chats.map((chat, index) => (
                        <div className={styles.chat} key={index}>
                            <Avatar alt={chat.groupName ? chat.groupName : chat.users[0].name} src="" sx={{ bgcolor: deepPurple[500] }} />
                            <div className={styles.chatInfo}>
                                <div className={styles.name}>{chat.groupName?chat.groupName: chat.users[0].name}</div>
                                {
                                    chat.lastMessage &&
                                        <div className={styles.lastMessage}>{chat.lastMessage}</div>
                                }
                            </div>
                            <div className={styles.time}>{chat.updatedAt}</div>
                        </div>
                    ))
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
                        <TextField color="secondary" id="outlined-basic" label="Message" variant="outlined"
                            value={newP2pMessage} onChange={(e) => setNewP2pMessage(e.target.value)}
                        />
                        <Button color="secondary" variant="contained"
                            onClick={() => semdP2pFirstMessage()}
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
                            getOptionLabel={(option) => option.email}
                            defaultValue={[searchOptions[0]]}
                            onChange={(event, value: any) => {
                                console.log(value)
                                setSelectedUsers(value)
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="standard"
                                    color='secondary'
                                    label="Users"
                                    placeholder="Contacts"


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