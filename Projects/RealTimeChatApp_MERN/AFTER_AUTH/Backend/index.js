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
require('./models/p2pChatModel')
require('./models/groupChatModel')
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
    res.send('This app works!!');
});

app.get('/chats', (req, res) => {
    console.log('chats', chats);
    res.json(chats);
})

app.get('/chats/:id', (req, res) => {
    let id = req.params.id

    let chat = chats.find(chat => chat._id == id)

    res.send(chat)
})
app.listen(PORT, () => {
    console.log('Server started!');
});