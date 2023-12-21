const mongoose = require('mongoose');

const p2pChatSchema = new mongoose.Schema({

    users: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    latestMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    },
    messages: [
        {
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Message'
            },
            createdAt: {
                type: Date,
                default: Date.now
            },
            updatedAt: {
                type: Date,
                default: Date.now
            }
        }
    ]

}, {
    timestamps: true
});

module.exports = mongoose.model('p2pChat', p2pChatSchema);

