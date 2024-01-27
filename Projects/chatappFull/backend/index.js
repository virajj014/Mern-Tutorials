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
    console.log("a user connected ", socket.id);


    socket.on('joinownuserid', (userId) => {
        socket.join(userId);
        console.log('user joined own room ', userId);
    })

    socket.on("messageSend", (messageObj) => {
        console.log("messageSend");
        let roomId = messageObj.chat._id;
        messageObj.chat.users.forEach(element => {
            console.log("message users ", element);
            socket.to(element._id).emit('refetchcontacts')
        })


        socket.to(roomId).emit("messageReceived", messageObj);


        // GROUP "hey", "suno bhai" -> u1 , u2 , u3
        // u1 -> fetchcontacts
    })


    socket.on('joinroom', (chatId) => {
        socket.join(chatId);
        console.log('user joined room ', chatId);

        const userInThisRoom = io.sockets.adapter.rooms.get(chatId).size;
        console.log('userInThisRoom', userInThisRoom);
    })

    socket.on('leaveroom', (chatId) => {
        socket.leave(chatId);
        console.log('user left room ', chatId);
    })


    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    socket.on('disconnect', () => {
        console.log('user disconnected ', socket.id);
    });

})