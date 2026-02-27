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

// ✅ MIDDLEWARE CORRIGÉ - sans next() car pas besoin avec async/await
invoiceSchema.pre('save', async function() {
    // Utiliser function() au lieu de () => pour avoir accès à 'this'
    
    // Si totalement payé
    if (this.paidAmount >= this.amount) {
        this.status = 'paid';
        this.paidAt = new Date();
    } 
    // Si en retard et pas payé
    else if (this.dueDate < new Date() && this.status !== 'paid') {
        this.status = 'overdue';
    }
    // Si partiellement payé
    else if (this.paidAmount > 0 && this.paidAmount < this.amount) {
        this.status = 'pending';
    }
    // Si impayé et pas en retard
    else if (this.paidAmount === 0 && this.status !== 'overdue') {
        this.status = 'unpaid';
    }
    
    // Pas besoin de next() avec async/await
});

module.exports = mongoose.model('Invoice', invoiceSchema);