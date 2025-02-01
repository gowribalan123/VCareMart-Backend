import mongoose from "mongoose";  

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId, // Preferably use ObjectId if applicable
            ref: 'User',
            required: true
        },
       
        shippingAddress: {
            street: { type: String, required: true },
            city: { type: String, required: true },
            state: { type: String, required: true },
            zip: { type: String, required: true },
            country: {
                type: String,
                enum: ['India', 'USA', 'UK'], // Expanded for future use
                default: 'India'
            },
            

        },
        sessionId: {
            type: String,
          //  required: true,
        },
        totalPrice: {
            type: Number,
          //  required: true,
            min: 0 // Ensures total price cannot be negative
        },
        products: [{
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, required: true, min: 1 }, // Quantity must be at least 1
            price_at_purchase: { type: Number, required: true, min: 0 }, // Price must be non-negative
        }],
        status: {
            type: String,
            enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'],
            default: 'Pending'
        },
        orderStatus: { 
            type: String, 
            enum: ["processing", "transit", "out-for-delivery", "delivered"],
           // required: true // Making it required
        },
    },
    { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);