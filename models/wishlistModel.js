import mongoose, { Schema } from "mongoose";

// Define the schema for wishlist items
const wishlistSchema = new Schema({
    productId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Product", // Reference to the Product model
        required: true 
    },
 

//{ _id: false }); // Disable automatic id generation for nested schema

// Define the schema for the wishlist
 
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", // Reference to the User model
        required: true 
    },
   // items: [wishlistItemSchema], // Array of wishlist items
}, { timestamps: true }); // Automatically add createdAt and updatedAt fields

// Create the Wishlist model
export const Wishlist = mongoose.model("Wishlist", wishlistSchema);
