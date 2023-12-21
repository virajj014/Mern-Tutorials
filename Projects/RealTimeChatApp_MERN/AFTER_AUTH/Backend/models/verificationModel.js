const mongoose = require('mongoose');

const verificationSchema = new mongoose.Schema({
    email: {required:true , type:String},
    code: {required:true , type:String},
},{timestamps: true});

module.exports = mongoose.model('Verification', verificationSchema);