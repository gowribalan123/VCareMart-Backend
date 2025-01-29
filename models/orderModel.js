import mongoose, { Schema } from "mongoose";  

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        sessionId: {
            type: String,
            required: true,
        },
        products: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
        ],
        totalPrice: {
            type: Number,
            required: true,
            default: 0,
        },
        orderStatus: { 
            type: String, 
            enum: ["processing", "transit", "out-for-delivery", "delivered"], // Corrected typo
        },
    },
    { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);