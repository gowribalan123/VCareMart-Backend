import mongoose, { Schema } from "mongoose";

const cartSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    products: [
        {
            productId: {
                type: Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
            price: {
                type: Number,
                required: true,
            },
            quantity: {  
                type: Number,  
                default: 1, // Default to 1 if not specified  
                min: 1 // Ensure that quantity must be at least 1  
            }  
           
        }
    ],
   
    totalPrice: {
        type: Number,
        required: true,
        default: 0,
    },
});


cartSchema.methods.calculateTotalPrice = function () {
    this.totalPrice = this.products.reduce((total, product) => total + (product.price * product.quantity), 0);
};  
 
export const Cart = mongoose.model("Cart", cartSchema);