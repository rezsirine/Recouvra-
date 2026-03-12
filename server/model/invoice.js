const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
    number: {
        type: String,
        required: true,
        unique: true
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    dueDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['unpaid', 'paid', 'overdue', 'pending'],
        default: 'unpaid'
    },
    paidAmount: {
        type: Number,
        default: 0,
        min: 0
    },
    paidAt: {
        type: Date
    },
    description: {
        type: String
    }
}, {
    timestamps: true
});


const invoiceStatusMiddleware = require('../middleware/invoice.middleware');

invoiceStatusMiddleware(invoiceSchema);
module.exports = mongoose.model('Invoice', invoiceSchema);