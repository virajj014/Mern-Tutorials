const express = require('express');
const User = require('../models/UserSchema');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


// middleware
const errorMiddleware = require('../middlewares/errorMiddleware');
const authTokenHandler = require('../middlewares/checkAuthToken');


const createResponse = (ok, message, data) => {
    return {
        ok,
        message,
        data
    }
}

router.get('/', (req, res) => {
    res.send('User routes are working!');
});

// REGISTER
router.post('/register', async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            let err = new Error('User already exists!');
            err.statusCode = 400;
            throw err;
        }

        if (password.length < 6) {
            let err = new Error('Password must be at least 6 characters long!');
            err.statusCode = 400;
            throw err;

        }

        const newUser = new User({
            name,
            email,
            password
        })

        await newUser.save();
        return res.status(201).json(
            createResponse(true, 'User created successfully!', newUser)
        )
    }
    catch (err) {
        console.log("INSIDE CATCH");
        next(err);
    }
})
// LOGIN
router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            let err = new Error('Invalid credentials!');
            err.statusCode = 400;
            throw err;
        }

        const isMatch = await bcrypt.compare(password, existingUser.password);

        if (!isMatch) {
            let err = new Error('Invalid credentials!');
            err.statusCode = 400;
            throw err;
        }

        // return res.status(201).json(
        //     createResponse(true, 'User logged In successfully!', existingUser)
        // )


        const authToken = jwt.sign({ userId : existingUser._id}, process.env.JWT_SECRET_KEY,{expiresIn : '10m'});
        const refreshToken = jwt.sign({ userId : existingUser._id}, process.env.JWT_REFRESH_SECRET_KEY,{expiresIn : '30m'});

        res.cookie('authToken',authToken,{httpOnly : true});
        res.cookie('refreshToken',authToken,{httpOnly : true});


        return res.status(201).json(
            createResponse(true, 'User logged In successfully!', {
                authToken,
                refreshToken,
                user : existingUser
            
            })
        )

    }
    catch (err) {
        console.log("INSIDE CATCH");
        next(err);
    }
})


router.get('/checklogin',authTokenHandler, async (req, res, next) => {
    const owner = req.userId;
    res.json(
        createResponse(true, 'User is logged in!', {userId: owner})
    )
})

router.use(errorMiddleware)

module.exports = router;