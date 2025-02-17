import mongoose, { Schema } from "mongoose";

const cartSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    products: [
        {
            productId: {
                type:  mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
            price: {
                type: Number,
               required: true,
            },
           
           
        }
    ],
   
    totalPrice: {
        type: Number,
        required: true,
        default: 0,
    },
    
    seller: { type: mongoose.Types.ObjectId, ref: "Seller" },
    category: { type: mongoose.Types.ObjectId, ref: "Category"},
    
    subcategory: { type: mongoose.Types.ObjectId, ref: "subCategory"},
});


      
cartSchema.methods.calculateTotalPrice = function () {
    this.totalPrice = this.products.reduce((total, product) => total + (product.price), 0);
};  
 
export const Cart = mongoose.model("Cart", cartSchema);