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
const errorHandler = require('../Middlewares/errorMiddleware');
const authTokenHandler = require('../Middlewares/checkAuthToken');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public');
    },
    filename: (req, file, cb) => {
        let fileType = file.mimetype.split('/')[1];
        console.log(req.headers.filename);
        cb(null, `${Date.now()}.${fileType}`);
    }
});

const upload = multer({ storage: storage });



const imageUploadFunction =async (req, res, next) => {
    // find user by userId
    // if user exists
    // delete previous profile pic
    // upload new profile pic

    let userId = req.userId;
    let user = await User.findById(userId);
    if (user) {
        if (user.profilePic) {
            fs.unlink(user.profilePic, (err) => {
                if (err) {
                    console.error('Error deleting file:', err);
                } else {
                    console.log('File deleted successfully');
                }
            });
        }
    }

    upload.single('clientfile')(req, res, (err) => {
        if (err) {
            res.status(500).json('Error uploading file');
        } else {
            next();
        }
    })
};



router.get('/', (req, res) => {
    res.send('User routes are working!');
});



router.post('/updateprofilepicture', authTokenHandler, imageUploadFunction, async (req, res) => {
      let userId = req.userId;
    let user = await User.findById(userId);

    if(user){
        user.profilePic = req.file.path;
        await user.save();
        return responseFunction(res, 200, 'Profile picture updated successfully', null, true);
    }
})

router.post('/updateprofiledata', authTokenHandler, async (req, res) => {
    const {name } = req.body;

    let userId = req.userId;
    let user = await User.findById(userId);

    if(user){
        user.name = name;
        await user.save();
        return responseFunction(res, 200, 'Profile data updated successfully', null, true);
    }
})

// search for users except the logged in user by email
router.get('/search/:email', authTokenHandler, async (req, res) => {
    let email = req.params.name;
    let userId = req.userId;
    let users = await User.find({ email: { $regex: email, $options: 'i' }, _id: { $ne: userId } });
    return responseFunction(res, 200, 'Users found', users, true);
})

router.use(errorHandler)
module.exports = router;