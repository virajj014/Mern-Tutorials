const express = require('express');
const { createServer } = require('node:http');
const { Server } = require('socket.io');
const cors = require('cors');
const PORT = process.env.PORT || 5000;
const app = express();
const server = createServer(app);
const io = new Server(server,{
    cors: {
        origin: 'http://localhost:3000'
    }
});


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
    
    console.log('a user connected' , socket.id);


    socket.on('send message', ({ friendid, message }) => {
        console.log({ friendid, message });
        io.to(friendid).emit('receive message', message );
    })


    socket.on('disconnect', () => {
        console.log('user disconnected ', socket.id);
    });
});

server.listen(8000, () => {
    console.log('server running at http://localhost:8000');
});