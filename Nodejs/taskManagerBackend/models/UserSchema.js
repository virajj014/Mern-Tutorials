const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
})

// hj123 -> fagghsfhdgadgad

userSchema.pre('save'  , async function (next){
    const user = this;

    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }

    next();
})

module.exports = mongoose.model('User', userSchema);