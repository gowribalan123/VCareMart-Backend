import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
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
            quantity: {
                type: Number,
                required: true,
                min: 1, // Ensure at least one item is ordered
            },
        },
    ],
}, { timestamps: true }); // Automatically manage createdAt and updatedAt fields

export const Order = mongoose.model("Order", orderSchema);
export default Order;
