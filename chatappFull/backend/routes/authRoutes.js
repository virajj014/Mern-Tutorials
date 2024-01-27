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
//zqkm lyyh epus rfyq


async function mailer(recieveremail, code) {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        requireTLS: true,
        auth: {
            user: "virajj014@gmail.com", // generated ethereal user
            pass: "zqkm lyyh epus rfyq" // generated ethereal password
        },
    })

    let info = await transporter.sendMail({
        from: "TEAM HARSHAL JAIN",
        to: recieveremail,
        subject: "OTP for verification",
        text: "Your OTP is " + code,
        html: "<b>Your OTP is " + code + "</b>",
    })

    // console.log("Message sent: %s", info.messageId);
    // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));


}


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
const imageUploadFunction = (req, res, next) => {
    upload.single('clientfile')(req, res, (err) => {
        if (err) {
            return responseFunction(res, 400, 'File upload failed', null, false);
        }
        next();
    })
}

router.get('/test', (req, res) => {
    res.send('User routes are working!');
});


router.post('/sendotp', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return responseFunction(res, 400, 'Email is required', null, false);
    }

    try {
        const code = Math.floor(100000 + Math.random() * 900000);
        await mailer(email, code);
        await Verification.findOneAndDelete({ email: email });
        const newVerification = new Verification({
            email: email,
            code: code,
        })
        await newVerification.save();
        return responseFunction(res, 200, 'OTP sent successfully', null, true);
    }
    catch (err) {
        console.log(err);
        return responseFunction(res, 500, 'Internal server error', null, false);
    }
})


router.post('/register', imageUploadFunction, async (req, res, next) => {
    try {
        const { name, email, password, otp } = req.body;
        // console.log(req.body);

        // console.log(name, email, password, otp ,req.file.path);

        let user = await User.findOne({ email: email });

        if (user) {
            if (req.file && req.file.path) {
                fs.unlink(req.file.path, (err) => {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log('File deleted successfully');
                    }
                })
            }
            return responseFunction(res, 400, 'User already exists', null, false);
        }

        let verificationQueue = await Verification.findOne({ email: email });
        if (!verificationQueue) {
            if (req.file && req.file.path) {
                fs.unlink(req.file.path, (err) => {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log('File deleted successfully');
                    }
                })
            }
            return responseFunction(res, 400, 'Please send otp first', null, false);
        }

        const isMatch = await bcrypt.compare(otp, verificationQueue.code);
        if (!isMatch) {

            if (req.file && req.file.path) {
                fs.unlink(req.file.path, (err) => {
                    if (err) {
                        console.error('Error deleting file:', err);
                    } else {
                        console.log('File deleted successfully');
                    }
                });
            }


            return responseFunction(res, 400, 'Invalid OTP', null, false);
        }

        user = new User({
            name: name,
            email: email,
            password: password,
            profilePic: req.file.path
        });
        await user.save();
        await Verification.deleteOne({ email: email });

        return responseFunction(res, 200, 'registered successfully', null, true);
    }
    catch (err) {
        next(err);
    }
})

router.post('/updatepassword', async (req, res, next) => {
    try {
        const { email, newpassword, otp } = req.body;
        if (!email || !newpassword || !otp) {
            return responseFunction(res, 400, 'All fields are required', null, false);
        }
        const user = await User.findOne({ email });
        if (!user) {
            return responseFunction(res, 400, 'User not found', null, false);
        }

        let verificationQueue = await Verification.findOne({ email: email });
        if (!verificationQueue) {
            return responseFunction(res, 400, 'Please send otp first', null, false);
        }

        const isMatch = await bcrypt.compare(otp, verificationQueue.code);
        if (!isMatch) {
            return responseFunction(res, 400, 'Invalid OTP', null, false);
        }

        user.password = newpassword;
        await user.save();
        await Verification.deleteOne({ email: email });
        return responseFunction(res, 200, 'Password updated successfully', null, true);
    }
    catch (err) {
        next(err);
    }

});


router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return responseFunction(res, 400, 'Invalid credentials', null, false);
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {

            return responseFunction(res, 400, 'Invalid credentials', null, false);
        }

        const authToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '50m' });
        const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET_KEY, { expiresIn: '50m' });

        res.cookie('authToken', authToken, { httpOnly: true });
        res.cookie('refreshToken', refreshToken, { httpOnly: true });
        return responseFunction(res, 200, 'Logged in successfully', {
            authToken: authToken,
            refreshToken: refreshToken
        }, true);
    }
    catch (err) {
        next(err);
    }
})

router.get('/checklogin', authTokenHandler, async (req, res, next) => {
    res.json({
        ok: req.ok,
        message: req.message,
        userId: req.userId
    })
})

router.post('/logout', authTokenHandler, async (req, res, next) => {
    res.clearCookie('authToken');
    res.clearCookie('refreshToken');
    res.json({
        ok: true,
        message: 'Logged out successfully'
    })
})

router.use(errorHandler)
module.exports = router;
