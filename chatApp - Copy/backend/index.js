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
const mediaUploadRoutes = require('./routes/mediaUploadRoutes');
const chatRoutes = require('./routes/chatRoutes');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const ws = require('ws');
const User = require('./models/userModel');


require('./db');
require('./models/userModel')
require('./models/verificationModel')
// require('./models/chatModel')
// require('./models/messageModel')

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



const server = app.listen(PORT, () => {
    console.log('Server started!');
});

const wss = new ws.WebSocketServer({ server })

wss.on('connection', (connection, req) => {

    let cookies = req.headers.cookie
    if (cookies) {
        cookies = cookies.split(';').find(cookie => cookie.startsWith('authToken'))
    }
    if (cookies) {
        const authToken = cookies.split('=')[1]
        jwt.verify(authToken, process.env.JWT_SECRET_KEY, {}, (err, decoded) => {
            if (err) {
                console.log(err)
            } else {

                const userId = decoded.userId
                console.log(userId)
                connection.userId = userId
            }
        })
    }


    // console.log('New connection' + connection.userId)
    // console.log([...wss.clients].map(client => client.userId))
    [...wss.clients].forEach(client => {
        client.send(JSON.stringify(
            {
                online: [...wss.clients].map(client => client.userId),
            }
        ))
    })



    connection.on('message' , (message) => {
        console.log(message)
        const data = JSON.parse(message)
        const {receiverId , content} = data
        // console.log(data)

        // {
        //     senderId: '658ae7dda6a94e1603ec65aa',
        //     receiverId: '658ae76ea6a94e1603ec6599',
        //     content: { text: 'fasfasf' },
        //     chatId: 'xyz'
        //   }

        if(receiverId && content){
            const receiver = [...wss.clients].find(client => client.userId === receiverId)
            if(receiver){
                receiver.send(JSON.stringify({
                    senderId: connection.userId,
                    content
                }))
            }
        }
    })

});