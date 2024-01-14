const express = require('express');
const User = require('../models/userModel');
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


// ADD FRIEND TO CONTACTS LIST in User model\
router.post('/addContact', authTokenHandler, async (req, res) => {
    let contactEmail = req.body.contactEmail;
    let userId = req.userId;


    // {
    //     userdata,
    //     contacts : [
    //         {
    //             contactId, lastMessage, lastMessageTime
    //         }
    //     ]
    // }

    try {
        let contactUser = await User.findOne({ email: contactEmail });
        if (!contactUser) {
            return res.status(404).json({ message: 'No user found with this email', ok: false });
        }
        let user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'No user found with this id', ok: false });
        }
        let contactId = contactUser._id;

        let contactExists = user.contacts.find(contact => contact.contactId.toString() === contactId.toString());
        if (contactExists) {
            return res.status(400).json({ message: 'Contact already exists', ok: false });
        }

        user.contacts.push({ contactId: contactId, lastMessage: '', lastMessageTime: '' });
        await user.save();
        return responseFunction(res, 200, 'Contact added successfully', null, true);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error', ok: false });
    }
})

// GET CONTACTS LIST
router.get('/getContacts', authTokenHandler, async (req, res) => {
    const userId = req.userId;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found', ok: false });
        }
        let contacts = user.contacts;
        let contactsList = [];

        for (let i = 0; i < contacts.length; i++) {
            let contact = await User.findById(contacts[i].contactId);
            let contactData = {
                _id: contact._id,
                name: contact.name,
                email: contact.email,
                profilePic: contact.profilePic,
                lastMessage: contacts[i].lastMessage,
                lastMessageTime: contacts[i].lastMessageTime
            }
            contactsList.push(contactData);
        }

     

        return responseFunction(res, 200, 'Contacts fetched successfully', contactsList , true);

    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error', ok: false });
    }
});

router.use(errorHandler)
module.exports = router;