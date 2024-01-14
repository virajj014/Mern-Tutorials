const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {required:true , type:String},
    email: {required:true , type:String},
    password: {required:true , type:String},
    profilePic:{
        type: String
    },
    isVerified: {type: Boolean, default: false},
},{timestamps: true});


userSchema.pre('save', async function(next) {
    // Hash the password before saving the user model
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 10);
    }
    next();
});

module.exports = mongoose.model('User', userSchema);