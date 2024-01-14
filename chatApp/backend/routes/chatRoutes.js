const express = require('express');
const User = require('../models/userModel');
const Chat = require('../models/chatModel');
const Message = require('../models/messageModel');
const Verification = require('../models/verificationModel');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const nodemailer = require('nodemailer');
const responseFunction = require('../utils/responseFunction');
const fs = require('fs');
const errorHandler = require('../middlewares/errorMiddleware');
const authTokenHandler = require('../middlewares/checkAuthToken');




router.get('/', (req, res) => {
    res.send('Chat routes are working!');
});

router.post('/accesschatp2p', authTokenHandler, async (req, res, next) => {
    const { recieverEmail } = req.body;

    if (!recieverEmail ) {
        return responseFunction(res, 400, 'All fields are required', null, false);
    }

    let reciever = await User.findOne({ email: recieverEmail });
    if (!reciever) {
        return responseFunction(res, 400, 'User not found', null, false);
    }

    let recieverId = reciever._id;

    const userId = req.userId;
    if (!recieverId) {
        return responseFunction(res, 400, 'User not found', null, false);
    }

    var isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: userId } } },
            { users: { $elemMatch: { $eq: recieverId } } }
        ]
    }).populate('users', '-password').populate('latestMessage');

    isChat = await User.populate(isChat, { path: 'latestMessage.sender', select: "name pic email" });

    if (isChat.length > 0) {
        return responseFunction(res, 200, 'Chat found', isChat[0], true);
    }

    var chatData = {
        chatName: 'sender',
        isGroupChat: false,
        users: [userId, recieverId]
    }


    try {
        const createChat = await Chat.create(chatData);
        const FullChat = await Chat.findById(createChat._id).populate('users', '-password');
        return responseFunction(res, 200, 'Chat created', FullChat, true);
    }
    catch (err) {
        next(err);
    }

})
router.post('/accesschatbyid', authTokenHandler, async (req, res, next) => {
    const { chatId } = req.body;

    if (!chatId) {
        return responseFunction(res, 400, 'All fields are required', null, false);
    }

    try {
        const chat = await Chat.findById(chatId).populate('users', '-password').populate('latestMessage');
        if (!chat) {
            return responseFunction(res, 400, 'Chat not found', null, false);
        }
        return responseFunction(res, 200, 'Chat found', chat, true);
    }
    catch (err) {
        next(err);
    }
});

router.get('/fetchchats', authTokenHandler, async (req, res, next) => {
    const userId = req.userId;
    try {
        var chats = await Chat.find({ users: { $elemMatch: { $eq: userId } } })
            .populate('users', '-password')
            .populate('groupAdmin', '-password')
            .populate('latestMessage')
            .sort({ updatedAt: -1 });
        chats = await User.populate(chats, { path: 'latestMessage.sender', select: "name pic email" });
        return responseFunction(res, 200, 'Chats fetched', chats, true);
    }
    catch (err) {
        next(err);
    }
});


router.post('/creategroup', authTokenHandler, async (req, res, next) => {
    if (!req.body.users || !req.body.name) {
        return responseFunction(res, 400, 'All fields are required', null, false);
    }
    //  req.body.users = ['codershub.2430@gmail.com', 'harshal.jain.csai.20@ggits.net'];
    var usersEmails = req.body.users;
    var users = [];
    for (const email of usersEmails) {
        let user = await User.findOne({ email: email });
        if (user) {
            users.push(user._id);
        }
    }
    // console.log(usersEmails);
    if (users.length < 2) {
        return responseFunction(res, 400, 'Please select atleast 2 users', null, false);
    }

    users.push(req.userId);

    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.userId,
        });

        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password");

        return responseFunction(res, 200, 'Group created', fullGroupChat, true);
    }
    catch (err) {
        next(err);
    }
});

router.post('/addmember', authTokenHandler, async (req, res, next) => {
    const { chatId, userId } = req.body;

    if (!chatId || !userId) {
        return responseFunction(res, 400, 'All fields are required', null, false);
    }

    try {
        const chat = await Chat.findById(chatId);
        if (!chat) {
            return responseFunction(res, 400, 'Chat not found', null, false);
        }

        if (chat.groupAdmin.toString() !== req.userId.toString()) {
            return responseFunction(res, 400, 'You are not admin of this group', null, false);
        }

        if (chat.users.includes(userId)) {
            return responseFunction(res, 400, 'User already added', null, false);
        }

        chat.users.push(userId);
        await chat.save();
        const fullChat = await Chat.findById(chatId)
            .populate("users", "-password")
            .populate("groupAdmin", "-password");

        return responseFunction(res, 200, 'Member added', fullChat, true);
    }
    catch (err) {
        next(err);

    }
});

router.post('/removemember', authTokenHandler, async (req, res, next) => {
    const { chatId, userId } = req.body;

    if (!chatId || !userId) {
        return responseFunction(res, 400, 'All fields are required', null, false);
    }

    try {
        const chat = await Chat.findById(chatId);
        if (!chat) {
            return responseFunction(res, 400, 'Chat not found', null, false);
        }

        if (chat.groupAdmin.toString() !== req.userId.toString()) {
            return responseFunction(res, 400, 'You are not admin of this group', null, false);
        }

        if (!chat.users.includes(userId)) {
            return responseFunction(res, 400, 'User not found', null, false);
        }

        chat.users = chat.users.filter((id) => id.toString() !== userId.toString());
        await chat.save();
        const fullChat = await Chat.findById(chatId)
            .populate("users", "-password")
            .populate("groupAdmin", "-password");

        return responseFunction(res, 200, 'Member removed', fullChat, true);
    }
    catch (err) {
        next(err);

    }
}
);


// MESSAGE ROUTES

router.get('/fetchmessages/:chatId', authTokenHandler, async (req, res, next) => {
    try {
        const messages = await Message.find({ chat: req.params.chatId })
            .populate("sender", "name pic email")
            .populate("chat")
        return responseFunction(res, 200, 'Messages fetched', messages, true);
    }
    catch (err) {
        next(err);
    }
})
router.post('/sendmessage', authTokenHandler, async (req, res, next) => {
    const { content, chatId } = req.body;

    if (!content || !chatId) {
        console.log("Invalid data passed into request");
        return responseFunction(res, 400, 'Invalid data passed into request', null, false);
    }

    var newMessage = {
        sender: req.userId,
        content: content,
        chat: chatId,
    };

    try {
        var message = await Message.create(newMessage);

        // Use chaining to populate the references in the message
        message = await Message.findById(message._id).populate('sender', 'name pic').populate('chat');

        // Assuming `chat.users` is a valid path, populate users in the chat
        message.chat = await Chat.populate(message.chat, { path: 'users', select: 'name pic email' });

        // Update the latest message in the chat
        await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

        return responseFunction(res, 200, 'Message sent', message, true);
    } catch (err) {
        next(err);
    }
});

router.use(errorHandler)
module.exports = router;