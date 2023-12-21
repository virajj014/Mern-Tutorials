const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
    text: {
        trim : true,
        type: String
    },
    file: {
        type: String
    }
});

const messageSchema = new mongoose.Schema({
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    content: {
        type: contentSchema,
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
