// models/paymentModel.js
import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
    userId: 
    { type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true 
    },
    amount: 
    { type: Number,
    required: true
 },
    paymentMethod: 
    { type: String, required: true }, // e.g., 'credit_card', 'paypal'
    status:
     { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    transactionId:
     { type: String, required: true },
    createdAt:
     { type: Date, default: Date.now },
     shippingAddress: {
        name: {
            type: String,
            required: true,
        },
        addressLine1: {
            type: String,
            required: true,
        },
        addressLine2: {
            type: String,
            required: false,
        },
        city: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            required: true,
        },
        postalCode: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            required: true,
        },
    },
});

export const Payment = mongoose.model('Payment', paymentSchema);
 
