const connection = require("./index");
const mongoose = require("mongoose");

const recoveryActionSchema = new mongoose.Schema({
    invoice: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Invoice',
        required: true
    },
    agent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['call', 'email', 'meeting'],
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    outcome: {
        type: String,
        enum: ['pending', 'successful', 'failed', 'rescheduled'],
        default: 'pending'
    },
    nextAction: {
        type: Date
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("RecoveryAction", recoveryActionSchema);