import mongoose, { Schema }  from 'mongoose';

const orderSchema = new mongoose.Schema({  // Corrected: use mongoose.Schema
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
        index: true, // Add index for faster lookups
    },
    sessionId: {
        type: String,
        required: true,
    },
    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
            price: {
                type: Number,
                required: true,
                min: 0, // Ensure price is non-negative
            },
           
        },
    ]
},{ timestamps: true }
);  

export const Order = mongoose.model("Order", orderSchema);
export default Order;