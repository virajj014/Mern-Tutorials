const express = require('express');
const User = require('../models/userModel');
const Verification = require('../models/verificationModel');
const Message = require('../models/messageModel');
const Chat = require('../models/chatModel');
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
    res.send('Chat routes are working!')
})
router.post('/accesschatp2p', authTokenHandler, async (req, res, next) => {
    // ME and friend
    const { recieverEmail } = req.body;

    if (!recieverEmail) {
        return responseFunction(res, 400, 'Please provide reciever email', null, false)
    }

    let reciever = await User.findOne({ email: recieverEmail }).select('-password');
    if (!reciever) {
        return responseFunction(res, 400, 'User not found', null, false)
    }

    let recieverId = reciever._id;
    let userId = req.userId;


    let isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: userId } } },
            { users: { $elemMatch: { $eq: recieverId } } }
        ]
    }).populate('users', '-password').populate('latestMessage');


    isChat = await User.populate(isChat, { path: 'latestMessage.sender', select: 'name email profilePic' });

    // console.log(isChat);
    if (isChat && isChat.length > 0) {
        return responseFunction(res, 200, 'Chat found', isChat, true)
    }


    let chatData = {
        chatName: 'unknown',
        isGroupChat: false,
        users: [userId, recieverId]
    }


    try {
        const createChat = await Chat.create(chatData);
        const FullChat = await Chat.findById(createChat._id).populate('users', '-password').populate('latestMessage');
        return responseFunction(res, 200, 'Chat created', FullChat, true)
    }
    catch (err) {
        next(err)
    }
})
router.post('/accesschatbyid', authTokenHandler, async (req, res, next) => {
    const { chatId } = req.body;

    if (!chatId) {
        return responseFunction(res, 400, 'Please provide chat id', null, false)
    }

    try {
        const chat = await Chat.findById(chatId).populate('users', '-password').populate('latestMessage');


        if (!chat) {
            return responseFunction(res, 400, 'Chat not found', null, false)
        }
        // console.log(chat.users);
        // console.log(req.userId);
        let myId = req.userId.toString();

        if (!chat.users.some(user => user._id.toString() === myId)) {
            return responseFunction(res, 400, 'You are not a member of this chat', null, false)
        }

        return responseFunction(res, 200, 'Chat found', chat, true)
    }
    catch (err) {
        next(err)
    }
})
router.get('/fetchchats', authTokenHandler, async (req, res, next) => {
    const userId = req.userId;
    try {
        let chats = await Chat.find({
            users: { $elemMatch: { $eq: userId } }
        }).populate('users', '-password')
            .populate('groupAdmin', '-password')
            .populate('latestMessage')
            .sort({ updatedAt: -1 });

        chats = await User.populate(chats, { path: 'latestMessage.sender', select: 'name email profilePic' });
        return responseFunction(res, 200, 'Chats found', chats, true)
    }
    catch (err) {
        next(err)
    }
})
router.post('/creategroup', authTokenHandler, async (req, res, next) => {
    if (!req.body.users || !req.body.name) {
        return responseFunction(res, 400, 'Please provide users and group name', null, false)
    }

    var userEmails = req.body.users;
    let users = []
    for (const email of userEmails) {
        let user = await User.findOne({ email: email }).select('-password');
        if (user) {
            users.push(user._id);
        }
    }
    users.push(req.userId);

    if (users.length < 2) {
        return responseFunction(res, 400, 'Please provide atleast 2 users', null, false)
    }

    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            isGroupChat: true,
            users: users,
            groupAdmin: req.userId
        })


        let fullGroupChat = await Chat.findOne({ _id: groupChat._id })
            .populate('users', '-password')
            .populate('groupAdmin', '-password')
            .populate('latestMessage');

        fullGroupChat = await User.populate(fullGroupChat, { path: 'latestMessage.sender', select: 'name email profilePic' });

        return responseFunction(res, 200, 'Group created', fullGroupChat, true)
    }
    catch (err) {
        next(err)
    }

})
router.post('/addmember', authTokenHandler, async (req, res, next) => {
    const { chatId, email } = req.body;


    if (!chatId || !email) {
        return responseFunction(res, 400, 'Please provide chat id and new user email', null, false)
    }


    try {
        let chat = await Chat.findById(chatId);
        if (!chat) {
            return responseFunction(res, 400, 'Chat not found', null, false)
        }

        if (chat.isGroupChat === false) {
            return responseFunction(res, 400, 'This is not a group chat', null, false)
        }

        if (chat.groupAdmin.toString() !== req.userId.toString()) {
            return responseFunction(res, 400, 'You are not admin of this group', null, false)
        }


        let newMember = await User.findOne({ email: email }).select('-password');

        if (!newMember) {
            return responseFunction(res, 400, 'User not found', null, false)
        }

        if (chat.users.includes(newMember._id)) {
            return responseFunction(res, 400, 'User already a member of this group', null, false)
        }

        chat.users.push(newMember._id);
        await chat.save();

        let fullChat = await Chat.findById(chatId)
            .populate('users', '-password')
            .populate('groupAdmin', '-password')
            .populate('latestMessage');

        fullChat = await User.populate(fullChat, { path: 'latestMessage.sender', select: 'name email profilePic' });

        return responseFunction(res, 200, 'Member added', fullChat, true)

    }
    catch (err) {
        next(err)
    }
})
router.post('/removemember', authTokenHandler, async (req, res, next) => {
    const { chatId, email } = req.body;


    if (!chatId || !email) {
        return responseFunction(res, 400, 'Please provide chat id and new user email', null, false)
    }


    try {
        let chat = await Chat.findById(chatId);
        if (!chat) {
            return responseFunction(res, 400, 'Chat not found', null, false)
        }

        if (chat.isGroupChat === false) {
            return responseFunction(res, 400, 'This is not a group chat', null, false)
        }

        if (chat.groupAdmin.toString() !== req.userId.toString()) {
            return responseFunction(res, 400, 'You are not admin of this group', null, false)
        }


        let newMember = await User.findOne({ email: email }).select('-password');

        if (!newMember) {
            return responseFunction(res, 400, 'User not found', null, false)
        }

        if (!chat.users.includes(newMember._id)) {
            return responseFunction(res, 400, 'User is not a member of this group', null, false)
        }

        chat.users = chat.users.filter((id) => id.toString() !== newMember._id.toString());
        await chat.save();

        let fullChat = await Chat.findById(chatId)
            .populate('users', '-password')
            .populate('groupAdmin', '-password')
            .populate('latestMessage');

        fullChat = await User.populate(fullChat, { path: 'latestMessage.sender', select: 'name email profilePic' });

        return responseFunction(res, 200, 'Member removed', fullChat, true)

    }
    catch (err) {
        next(err)
    }
})



// MESSAGE ROUTES
router.get('/fetchmessages/:chatId', authTokenHandler, async (req, res, next) => {
    try {
        const messages = await Message.find({ chat: req.params.chatId })
            .populate('sender', 'name email profilePic')
            .populate('chat')

        return responseFunction(res, 200, 'Messages found', messages, true)
    }
    catch (err) {
        next(err)
    }
})
router.post('/sendmessage', authTokenHandler, async (req, res, next) => {

    const { content, chatId } = req.body;

    if (!content || !chatId) {
        return responseFunction(res, 400, 'Please provide content and chat id', null, false)
    }

    let newMessage = {
        sender: req.userId,
        content: content,
        chat: chatId,
        readBy: [req.userId]
    }

    try {
        let message = await Message.create(newMessage);
        await Chat.findByIdAndUpdate(chatId, { latestMessage: message._id });
        let fullmessage = await Message.findById(message._id).populate('sender', 'name email profilePic').populate('chat');
        fullmessage.chat = await Chat.populate(fullmessage.chat, { path: 'users', select: 'name email profilePic' });


        return responseFunction(res, 200, 'Message sent', fullmessage, true)
    }
    catch (err) {
        next(err);
    }
})





router.use(errorHandler)

module.exports = router;
