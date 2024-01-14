const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const verificationSchema = new mongoose.Schema({
    email: {required:true , type:String},
    code: {required:true , type:String},
},{timestamps: true});

verificationSchema.pre('save', async function(next){
    const verification = this;
    if(verification.isModified('code')){
        verification.code = await bcrypt.hash(verification.code, 10);
    }
    next();
})
module.exports = mongoose.model('Verification', verificationSchema);
