const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const chats = require('./chats.json');
const app = express();
const bodyParser = require('body-parser');
dotenv.config();
const PORT = process.env.PORT || 5000;
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const mediaUploadRoutes = require('./routes/mediaUploadRoutes');

const cookieParser = require('cookie-parser');


require('./db');
require('./models/userModel')
require('./models/verificationModel')
require('./models/chatModel')
require('./models/messageModel')

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

app.use(bodyParser.json());
app.use(cookieParser());
app.use('/public', express.static('public'));
app.use('/auth', authRoutes)
app.use('/user', userRoutes);
app.use('/media', mediaUploadRoutes);
app.use('/chat', chatRoutes);


app.get('/', (req, res) => {
    res.send('API is running....');
});



const server = app.listen(
    PORT,
    console.log(`Server running on PORT ${PORT}...`)
);

const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: 'http://localhost:3000'
    }
});

io.on("connection", (socket) => {
    console.log('a user connected' , socket.id);

    socket.on('send message', (messageObj) => {
        const {chatId , message} = messageObj;
        io.to(chatId).emit('receive message', message );
    })

    socket.on('disconnect', () => {
        console.log('user disconnected ', socket.id);
    });

    socket.on('joinownuserid', (userId) => {
        socket.join(userId);
        console.log('user joined own room ', userId);
    })


    socket.on('joinroom', (chatId) => {
        socket.join(chatId);
        console.log('user joined room ', chatId);


        // tell me how many users are in this room
        const userInThisRoom = io.sockets.adapter.rooms.get(chatId).size;
        console.log('userInThisRoom', userInThisRoom);
    })


    socket.on('leaveroom', (chatId) => {
        socket.leave(chatId);
        console.log('user left room ', chatId);
    })

    socket.on("messageSend", (messageObj)=>{
        
        console.log('messageSend');
        let roomId = messageObj.chat._id;
        messageObj.chat.users.forEach(element => {
             console.log("message users", element._id);
             socket.to(element._id).emit('refetchcontacts')
        });
        socket.to(roomId).emit("messageReceived", messageObj);
    })


    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    // socket.on("setup", (userData) => {
    //     console.log("USER CONNECTED", userData._id);
    //     socket.join(userData._id);
    //     socket.emit("connected");
    // })

    // socket.on("join chat", (room) => {
    //     socket.join(room);
    //     console.log("User Joined Room: " + room);
    // })


    // socket.on("typing", (room) => socket.in(room).emit("typing"));
    // socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
    // socket.on("new message", (newMessageRecieved) => {
    //     var chat = newMessageRecieved.chat;
    //     if (!chat.users) return console.log("chat.users not defined");
    //     chat.users.forEach((user) => {
    //         if (user._id == newMessageRecieved.sender._id) return;

    //         socket.in(user._id).emit("message recieved", newMessageRecieved);
    //     });
    // })

    // socket.off("setup", () => {
    //     console.log("USER DISCONNECTED");
    //     socket.leave(userData._id);
    // });
})