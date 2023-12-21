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



const imageUploadFunction = (req, res, next) => {
    upload.single('clientfile')(req, res, (err) => {
        if (err) {
            res.status(500).json('Error uploading file');
        } else {
            next();
        }
    })
};


async function mailer(recieveremail, code) {


    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,

        secure: false, // true for 465, false for other ports
        requireTLS: true,
        auth: {
            user: "virajj014@gmail.com", // generated ethereal user
            pass: "jywh jqbf szgg trnd" // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: 'TEAM HARSHAL JAIN', // sender address
        to: `${recieveremail}`, // list of receivers
        subject: "Signup Verification", // Subject line
        text: `Your Verification Code is ${code}`, // plain text body
        html: `<b>Your Verification Code is ${code}</b>`, // html body
    });

   
    
}

router.get('/', (req, res) => {
    res.send('User routes are working!');
});

router.post('/sendotp', async (req, res) => {
    console.log('sent by client - ', req.body);
    const { email } = req.body;
    if (!email) {
        return responseFunction(res, 400, 'Email is required', null, false);
    }

    try {
        const code = Math.floor(Math.random() * 900000);
        await mailer(email, code);
        const hashedCode = await bcrypt.hash(code.toString(), 10);

        // Delete previous otp from verification collection
        await Verification.findOneAndDelete({ email: email });

        const verification = new Verification({
            email: email,
            code: hashedCode
        });
        await verification.save();
        return responseFunction(res, 200, 'OTP sent successfully', null, true);
    }
    catch (err) {
        console.log(err);
        return responseFunction(res, 500, 'Internal server error', null, false);
    }
});

router.post('/register', imageUploadFunction, async (req, res) => {
    console.log('sent by client - ', req.body);
    const { name, email, password, otp } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email: email });
    if (user) {
        // delete file - req.file.path
        if (req.file && req.file.path) {
            fs.unlink(req.file.path, (err) => {
                if (err) {
                    console.error('Error deleting file:', err);
                } else {
                    console.log('File deleted successfully');
                }
            });
        }



        return responseFunction(res, 400, 'User already exists', null, false);
    }

    let verificationQueue = await Verification.findOne({ email: email });
    if (!verificationQueue) {

        if (req.file && req.file.path) {
            fs.unlink(req.file.path, (err) => {
                if (err) {
                    console.error('Error deleting file:', err);
                } else {
                    console.log('File deleted successfully');
                }
            });
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




    // // Hash password
    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    user = new User({
        name: name,
        email: email,
        password: password,
        profilePic: req.file.path
    });

    // Save user to database
    await user.save();

    // Delete otp from verification collection
    await Verification.deleteOne({ email: email });
    return responseFunction(res, 200, 'User registered successfully', null, true);
});

router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        console.log(user);
        if (!user) {
            return responseFunction(res, 400, 'Invalid credentials', null, false);
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return responseFunction(res, 400, 'Invalid credentials', null, false);
        }

        const authToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '50m' });
        const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET_KEY, { expiresIn: '100m' });

        res.cookie('authToken', authToken, { httpOnly: true });
        res.cookie('refreshToken', refreshToken, { httpOnly: true });
        responseFunction(res, 200, 'Logged in successfully', { authToken, refreshToken }, true);
    }
    catch (err) {
        next(err);
    }
})

router.post('/checklogin', authTokenHandler, async (req, res, next) => {
    res.json({
        ok: true,
        message: 'User authenticated successfully'
    })
})

router.post('/logout', authTokenHandler, async (req, res, next) => {
    res.clearCookie('authToken');
    res.clearCookie('refreshToken');
    res.json({
        ok: true,
        message: 'Logged out successfully'
    })
});

router.get('/getuser', authTokenHandler, async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return responseFunction(res, 400, 'User not found', null, false);
        }
        return responseFunction(res, 200, 'User found', user, true);
    }
    catch (err) {
        next(err);
    }
});

router.post('/updatepassword', async (req, res, next) => {
    console.log('sent by client - ', req.body);
    const { email, newpassword, otp } = req.body;


    // Check if user already exists
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

    // update password
    user.password = newpassword;
    await user.save();

    // Delete otp from verification collection
    await Verification.deleteOne({ email: email });
    return responseFunction(res, 200, 'Password updated successfully', null, true);
});

router.use(errorHandler)
module.exports = router;