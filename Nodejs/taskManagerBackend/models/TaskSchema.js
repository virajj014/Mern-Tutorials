const mongoose = require('mongoose');


const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    status:{
        type: String,
        default: 'pending'
    }
})



module.exports = mongoose.model('Task', taskSchema);