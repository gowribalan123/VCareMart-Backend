import mongoose from 'mongoose';
 

const orderItemSchema = new mongoose.Schema({


    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true,
    },
    
   
 
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
     { timestamps: true }); // Automatically manage createdAt and updatedAt fields

export const OrderItems= mongoose.model("OrderItems", orderItemSchema);
export default OrderItems;
