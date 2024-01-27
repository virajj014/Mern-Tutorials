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


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public');
    },
    filename: (req, file, cb) => {
        let fileType = file.mimetype.split('/')[1];
        // console.log(req.headers.filename);
        cb(null, `${Date.now()}.${fileType}`);
    }
});
const upload = multer({ storage: storage });
const imageUploadFunction = async (req, res, next) => {
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
            return responseFunction(res, 400, 'File upload failed', null, false);
        }
        next();
    })
}



router.get('/', (req, res) => {
    res.send('User routes are working!');
});

router.get('/getuser', authTokenHandler, async (req, res, next) => {
    const user = await User.findById(req.userId);
    if (!user) {
        return responseFunction(res, 400, 'User not found', null, false);
    }
    return responseFunction(res, 200, 'User found', user, true);
})

router.post('/updateprofilepicture', authTokenHandler, imageUploadFunction, async (req, res) => {
    let userId = req.userId;
    let user = await User.findById(userId);

    if (user) {
        user.profilePic = req.file.path;
        await user.save();
        return responseFunction(res, 200, 'Profile picture updated successfully', null, true);
    }

    return responseFunction(res, 400, 'User not found', null, false);
})

router.post('/updateprofiledata', authTokenHandler, async (req, res) => {
    const {name} = req.body;

    let userId = req.userId;
    let user = await User.findById(userId);

    if(user){
        user.name = name;
        await user.save();
        return responseFunction(res, 200, 'Profile data updated successfully', null, true);
    }

    return responseFunction(res, 400, 'User not found', null, false);
});


router.post('/getuserbyemail', authTokenHandler , async (req,res,next)=>{
    const {email} = req.body;
    if(!email){
        return responseFunction(res, 400, 'Email is required', null, false);
    }
    const user = await User.findOne({email : email}).select('-password');
    if(!user){
        return responseFunction(res, 400, 'User not found', null, false);
    }
    return responseFunction(res, 200, 'User found', user, true);
})


router.post('/searchusers', authTokenHandler, async (req, res, next) => {
    const searchKeyword = req.body.search;
    const keyword = searchKeyword?{
        $or:[
            {name : {$regex : searchKeyword, $options : 'i'}},
            {email : {$regex : searchKeyword, $options : 'i'}}
        ]
    }: {};

    const users = await User.find({
        ...keyword,
        _id: {$ne: req.userId}
    }).limit(5).select('-password');

    if(!users || users.length === 0){
        return responseFunction(res, 400, 'No users found', null, false);
    }

    return responseFunction(res, 200, 'Users found', users, true);
})

router.use(errorHandler)
module.exports = router;