"use client"
import React, { useMemo, useState } from 'react'
import io from 'socket.io-client'
import { useEffect } from "react";

let apiurl: string = `${process.env.NEXT_PUBLIC_API_URL}`
let socket: any = null;

const page = () => {
    const [socketId, setSocketId] = useState<string>("")


    socket = useMemo(() => io(apiurl), [])


    useEffect(() => {
        socket.on("connect", () => {
            console.log("ft connected ", socket.id);
            setSocketId(socket.id)
        })


        socket.on("recieve message", (msgObj: any) => {
            console.log("recieved ", msgObj)
        })


        socket.on("joinroomsuccess", (ids: any) => {
            console.log("joined people ", ids)
        })

        socket.on("userjoinedgroup", (msg: any) => {
            console.log("user joined ", msg)
        })

        // return ()=>{
        //     socket.disconnect();
        // }
    }, [])


    const [groupchatid, setGroupChatId] = useState("");
    const [message, setMessage] = useState("");

    return (
        <div>

            chat page
            <div>socket id: {socketId}</div>
            <input type="text" placeholder="groupchat id" onChange={(e) => setGroupChatId(e.target.value)} />
            <button
                onClick={() => {
                    socket.emit("joinroom", { groupchatid })
                }}
            >Join Chat</button>



            <hr />


            <input type="text" placeholder="message" onChange={(e) => setMessage(e.target.value)} />

            <button
                onClick={() => {
                    socket.emit("sendmessage", { groupchatid, message })
                }}
            >Send Message</button>
        </div>
    )
}

export default page