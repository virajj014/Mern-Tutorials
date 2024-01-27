const express = require('express');
const { createServer } = require('node:http');
const { Server } = require('socket.io');
const cors = require('cors');
const PORT = process.env.PORT || 8000;
const app = express();
const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000'
    }
})


const allowedOrigins = ['http://localhost:3000']; // Add more origins as needed
app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true, // Allow credentials
    })
);

app.get('/', (req, res) => {
    res.json({
        message: "APP IS WORKING"
    })
});

io.on('connection', (socket) => {
    console.log('a user connected', socket.id);


    socket.on('disconnect', () => {
        console.log('user disconnected', socket.id);
    })

    socket.on('sendmessage', (messageObj) => {


        const { groupchatid, message } = messageObj

        console.log('message from ft to bk', groupchatid, message)

        io.to(groupchatid).emit('recieve message', {
            message : message
        })
        
    })



    socket.on("joinroom", (msgobj)=>{
        let room = msgobj.groupchatid
        socket.join(room)
        // console.log(socket.id , "joined room", room)


        const socketsInRoom = io.sockets.adapter.rooms.get(room);
        const socketsInRoomArray = [...socketsInRoom]
        console.log(socketsInRoom)
       

        socketsInRoomArray.forEach((socketId) => {
            io.to(socketId).emit("userjoinedgroup", msgobj);
        })
    })
})


server.listen(PORT, () => {
    console.log('server running at ' + PORT);
});