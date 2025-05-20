const mongoose = require('mongoose');

const SubscriberSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true, // avoid duplicate emails
        lowercase: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['subscribed', 'unsubscribed'],
        default: 'subscribed'
    },
    unsubscribeReason: {
        type: String,
        default: null
    },
    subscribedAt: {
        type: Date,
        default: Date.now
    },
    unsubscribedAt: {
        type: Date,
        default: null
    }
});

module.exports = mongoose.model('Subscriber', SubscriberSchema);
