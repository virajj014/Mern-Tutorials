"use client";
import React, { useMemo, useState } from 'react'
import io from "socket.io-client";
import { useEffect } from "react";

let apiurl: string = `${process.env.NEXT_PUBLIC_API_URL}`;
let socket: any = null;


const page = () => {
    const [socketId, setSocketId] = useState("");
    socket = useMemo(() => io(apiurl), []);
    const [friendid, setFriendId] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        socket.on("connect", () => {
            console.log("connected ", socket.id);
            setSocketId(socket.id);
        })

        socket.on("receive message", (data: any) => {
            console.log("received ", data);
        })
    }, [])
    return (
        <div>this is chat page
            <div>socket id: {socketId}</div>
            <input type="text" placeholder="friend id" onChange={(e) => setFriendId(e.target.value)} />
            <input type="text" placeholder="message" onChange={(e) => setMessage(e.target.value)} />

            <button onClick={() => {
                socket.emit("send message", { friendid, message })
            }}>join</button>

        </div>
    )
}

export default page