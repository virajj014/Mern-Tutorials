const express = require('express');
const User = require('../models/userModel');
const GroupChat = require('../models/groupChatModel');
const P2PChat = require('../models/p2pChatModel');
const Message = require('../models/messageModel');
const Verification = require('../models/verificationModel');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const nodemailer = require('nodemailer');
const responseFunction = require('../utils/responseFunction');
const fs = require('fs');
const errorHandler = require('../Middlewares/errorMiddleware');
const authTokenHandler = require('../Middlewares/checkAuthToken');
const socketIo = require('socket.io');
const http = require('http');

const server = http.createServer(router);
const io = socketIo(server);

io.on('connection', (socket) => {
    console.log('New connection');
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

router.get('/', (req, res) => {
    res.send('Chat Routes');
});


// search for users name or groups by name which user has talked to
router.get('/search', authTokenHandler, async (req, res) => {
    try {
        let userId = req.userId;
        let query = req.query.query;
        let groups = await GroupChat.find({ groupName: { $regex: query, $options: 'i' } });

        // check if the user is a member of the group
        groups = groups.filter(group => group.users.includes(userId));

        let users = await User.find({ name: { $regex: query, $options: 'i' } });
        users = users.filter(user => user._id != userId);

        let p2pChats = await P2PChat.find({ users: userId }).sort({ updatedAt: -1 });

        //check if the users are in the p2p chats or not
        users = users.filter(user => {
            let chat = p2pChats.find(chat => chat.users.includes(user._id));
            if (chat) {
                return true;
            }
            return false;
        });

        res.status(200).json(responseFunction('success', 'Search results', { groups: groups, users: users }));
    }
    catch (error) {
        res.status(500).json(responseFunction('error', 'Something went wrong'));
    }
});

// create a chat between two users
router.post('/createP2PChat', authTokenHandler, async (req, res) => {
    try {
        let userId = req.userId;
        let message = req.body.message;
        let receiverEmail = req.body.receiverEmail;

        let receiver = await User.findOne({ email: receiverEmail });
        console.log(receiver);
        if (!receiver) {
            console.log('User not found');
            return responseFunction(res, 404, 'User not found', null, false);
        }

        let receiverId = receiver._id;
        let chat = await P2PChat.findOne({ users: { $all: [userId, receiverId] } });

        if (chat) {
            console.log('Chat already exists');
            return responseFunction(res, 200, 'Chat already exists', chat, false);
        }

        if (!chat) {
            console.log('Chat does not exist');
            let newChat = await P2PChat.create({ users: [userId, receiverId] });
            let messageObj = {
                chat: newChat._id,
                sender: userId,
                receiver: receiverId,
                content: {
                    text: message
                }
            }

            let newMessage = await Message.create(messageObj);
            console.log('Message created successfully', newMessage);
            newChat.messages.push({
                _id: newMessage._id,
                createdAt: newMessage.createdAt,
                updatedAt: newMessage.updatedAt,
            });
            newChat.latestMessage = newMessage._id;
            await newChat.save();

            console.log('Chat created successfully');
            return responseFunction(res, 200, 'Chat created successfully', newChat, true);


        }
    }
    catch (error) { }
});



// send a message to a user
router.post('/messagePtoP', authTokenHandler, async (req, res) => {
    try {
        let senderId = req.userId;
        let receiverId = req.body.receiverId;
        let content = req.body.content;
        let chatId = req.body.chatId;

        let sender = await User.findById(senderId);
        let receiver = await User.findById(receiverId);

        if (!sender || !receiver) {
            res.status(404).json(responseFunction('error', 'User not found'));
        }

        let chatExists = false;
        let chat;
        if (chatId) {
            chat = await P2PChat.findById(chatId);
            if (chat) {
                chatExists = true;
            }
        }

        if (!chatExists) {
            res.status(404).json(responseFunction('error', 'Chat not found'));
        }

        if (chatExists) {
            if (!chat.users.includes(senderId) || !chat.users.includes(receiverId)) {
                res.status(401).json(responseFunction('error', 'You are not authorized to perform this action'));
            }

            if (chat.users.includes(senderId) && chat.users.includes(receiverId)) {
                let messageObj = {
                    chat: chatId,
                    sender: senderId,
                    content: content
                }

                let message = await Message.create(messageObj);
                chat.messages.push({
                    _id: message._id,
                    createdAt: message.createdAt,
                    updatedAt: message.updatedAt,
                });
                chat.latestMessage = message._id;
                await chat.save();

                res.status(200).json(responseFunction('success', 'Message sent successfully', message));

            }
        }
    }
    catch (error) {
        res.status(500).json(responseFunction('error', 'Something went wrong'));
    }
});


// // get top 10 chats of the user (p2p and group)

router.get('/getChats', authTokenHandler, async (req, res) => {
    try {
        let userId = req.userId;
        let start = req.query.start || 0;
        let limit = req.query.limit || 10;

        console.log(start, limit);

        let p2pChats = await P2PChat.find({ users: userId }).sort({ updatedAt: -1 }).skip(Number(start)).limit(Number(limit));
        let groupChats = await GroupChat.find({ users: userId }).sort({ updatedAt: -1 }).skip(Number(start)).limit(Number(limit));

        // for each p2p chat populate the users

        for (let i = 0; i < p2pChats.length; i++) {
            // exclude the password field
            p2pChats[i] = await P2PChat.findById(p2pChats[i]._id).populate('users', '-password');

            // exlude the logged in user
            p2pChats[i].users = p2pChats[i].users.filter(user => user._id != userId);

        }
        let chats = [...p2pChats, ...groupChats];
        chats = chats.sort((a, b) => b.updatedAt - a.updatedAt);
        return responseFunction(res, 200, 'Chats fetched successfully', {
            chats: chats,
            start: start,
            limit: limit
        }, true);


    }
    catch (error) {
        console.log(error);
        return responseFunction(res, 500, 'Something went wrong', null, false);
    }
});



router.get('/getP2pEmails', authTokenHandler, async (req, res) => {
    try {
        let userId = req.userId;
        let p2pChats = await P2PChat.find({ users: userId }).sort({ updatedAt: -1 });
        let emails = [];
        for (let i = 0; i < p2pChats.length; i++) {
            let chat = p2pChats[i];
            let users = chat.users;
            let user = users.find(user => user != userId);
            let email = await User.findById(user).select('email');
            emails.push(email);
        }
        return responseFunction(res, 200, 'Emails fetched successfully', emails, true);
    }
    catch (error) {
        return responseFunction(res, 500, 'Something went wrong', null, false);
    }
})

// // get messages of a chat
router.get('/getP2pMessages', authTokenHandler, async (req, res) => {
    try {
        let chatId = req.query.chatId;
        let start = req.query.start || 0;
        let limit = req.query.limit || 10;

        let chat = await P2PChat.findById(chatId).populate('messages');

        if (!chat) {
            res.status(404).json(responseFunction('error', 'Chat not found'));
        }

        if (chat) {
            let messages = chat.messages;
            if (messages.length === 0) {
                res.status(200).json(responseFunction('success', 'No messages found', messages));
            }

            // populate the messages
            messages = await Message.find({ _id: { $in: messages } }).sort({ createdAt: -1 }).skip(Number(start)).limit(Number(limit)).populate('sender');

            res.status(200).json(responseFunction('success', 'Messages fetched successfully', {
                messages: messages,
                chat: chat,
                limit: limit,
                start: start
            }));
        }
    }
    catch (error) {
        res.status(500).json(responseFunction('error', 'Something went wrong'));
    }
});






// router.get('/isGroupChat', authTokenHandler, async (req, res) => {
//     try{
//         let chatId = req.query.chatId;

//         let isGroupChat = GroupChat.findById(chatId);

//         if(isGroupChat){
//             res.status(200).json(responseFunction('success', 'Chat is a group chat', true));
//         }
//         else{
//             res.status(200).json(responseFunction('success', 'Chat is not a group chat', false));
//         }
//     }
//     catch(error){
//         res.status(500).json(responseFunction('error', 'Something went wrong'));
//     }
// });





// create a group
router.post('/createGroup', authTokenHandler, async (req, res) => {
    try {
        let userId = req.userId;
        let groupName = req.body.groupName;
        let users = req.body.users;

        let group = await GroupChat.create({ groupName: groupName, users: [...users, userId], owner: userId, Admins: [userId] });

        responseFunction(res, 200, 'Group created successfully', group, true);

    } catch (error) {
        responseFunction(res, 500, 'Something went wrong', null, false);
    }
});

// // add users to group

// router.post('/addUsersToGroup', authTokenHandler, async (req, res) => {
//     try {
//         let userId = req.userId;
//         let groupId = req.body.groupId;
//         let users = req.body.users;

//         let isOwner = await GroupChat.findOne({ _id: groupId, owner: userId });
//         let isAdmin = await GroupChat.findOne({ _id: groupId, Admins: userId });

//         if (!isOwner && !isAdmin) {
//             res.status(401).json(responseFunction('error', 'You are not authorized to perform this action'));
//         }

//         if (isOwner || isAdmin) {
//             let group = await GroupChat.findById(groupId);
//             let usersToAdd = [];
//             for (let i = 0; i < users.length; i++) {
//                 let user = await User.findById(users[i]);
//                 if (user) {
//                     usersToAdd.push(user._id);
//                 }
//             }

//             group.users = [...group.users, ...usersToAdd];
//             await group.save();
//             res.status(200).json(responseFunction('success', 'Users added successfully', group));
//         }
//     }
//     catch (error) {
//         res.status(500).json(responseFunction('error', 'Something went wrong'));
//     }
// });

// // remove users from group
// router.post('/removeUsersFromGroup', authTokenHandler, async (req, res) => {
//     try {
//         let userId = req.userId;
//         let groupId = req.body.groupId;
//         let users = req.body.users;

//         let isOwner = await GroupChat.findOne({ _id: groupId, owner: userId });
//         let isAdmin = await GroupChat.findOne({ _id: groupId, Admins: userId });

//         if (!isOwner && !isAdmin) {
//             res.status(401).json(responseFunction('error', 'You are not authorized to perform this action'));
//         }

//         if (isOwner) {
//             let group = await GroupChat.findById(groupId);
//             // owner can remove any user from the group
//             // if the removed user is an admin then remove him from the admin list

//             let usersToRemove = [];
//             for (let i = 0; i < users.length; i++) {
//                 let user = await User.findById(users[i]);
//                 if (user) {
//                     usersToRemove.push(user._id);
//                 }
//             }

//             group.users = group.users.filter(user => !usersToRemove.includes(user));
//             group.Admins = group.Admins.filter(user => !usersToRemove.includes(user));
//             // add the owner to the admin list if he is not already there
//             if (!group.Admins.includes(group.owner)) {
//                 group.Admins.push(group.owner);
//             }
//             await group.save();

//         }
//         if (!isOwner && isAdmin) {
//             // admin can remove only those users who are not admins

//             let usersToRemove = [];
//             for (let i = 0; i < users.length; i++) {
//                 let user = await User.findById(users[i]);
//                 if (user) {
//                     usersToRemove.push(user._id);
//                 }
//             }

//             let groupAdmins = GroupChat.Admins;
//             // filter out the users who are admins
//             usersToRemove = usersToRemove.filter(user => !groupAdmins.includes(user));
//             group.users = group.users.filter(user => !usersToRemove.includes(user));
//             await group.save();
//         }
//     }
//     catch (error) {
//         res.status(500).json(responseFunction('error', 'Something went wrong'));
//     }
// });

// router.post('/messageGroup', authTokenHandler, async (req, res) => {
//     try {
//         let senderId = req.userId;
//         let groupId = req.body.groupId;
//         let content = req.body.content;

//         let sender = await User.findById(senderId);
//         let group = await GroupChat.findById(groupId);

//         if (!sender || !group) {
//             res.status(404).json(responseFunction('error', 'User or group not found'));
//         }

//         // check if the sender is a member of the group
//         if (!group.users.includes(senderId)) {
//             res.status(401).json(responseFunction('error', 'You are not authorized to perform this action'));
//         }

//         let messageObj = {
//             chat: groupId,
//             sender: senderId,
//             content: content
//         }

//         let message = await Message.create(messageObj);
//         group.messages.push(message._id);
//         group.latestMessage = message._id;
//         await group.save();

//         res.status(200).json(responseFunction('success', 'Message sent successfully', message));

//     } catch (error) {
//         res.status(500).json(responseFunction('error', 'Something went wrong'));
//     }
// });



router.use(errorHandler)
module.exports = router;