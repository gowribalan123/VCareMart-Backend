import mongoose from 'mongoose';
import { sendSuccess, sendError } from "../utils/responseHandlers.js";
import { User } from '../models/userModel.js';  
import { Product } from '../models/productModel.js'; // Ensure you are importing Product if needed

// Add product to wishlist
export const addToWishlist = async (req, res) => {
    const productId = req.body.productId; // Get product ID from request body
    const userId = req.user.id; // Get user ID from authenticated request

    console.log(productId); // Log product ID for debugging

    // Input validation
    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
        return sendError(res, 400, "Invalid product ID."); // Send error if product ID is invalid
    }

    try {
        const user = await User.findById(userId); // Find user by ID
        if (!user) return sendError(res, 404, "User not found."); // Send error if user not found

        user.wishlist = user.wishlist || []; // Ensure wishlist is initialized

        const alreadyAdded = user.wishlist.includes(productId); // Check if product is already in wishlist

        if (alreadyAdded) {
            user.wishlist = user.wishlist.filter((id) => id !== productId); // Remove product from wishlist
            await user.save(); // Save updated user document
            sendSuccess(res, 200, "Product removed from wishlist.", user.wishlist); // Send success response
        } else {
            user.wishlist.push(productId); // Add product to wishlist
            await user.save(); // Save updated user document
            sendSuccess(res, 200, "Product added to wishlist.", user.wishlist); // Send success response
        }
    } catch (error) {
        sendError(res, 500, `Failed to update wishlist. Error: ${error.message}`); // Handle errors
    }
};


// Remove product from wishlist
export const removeFromWishlist = async (req, res) => {
    const { productId } = req.body;
    const userId = req.user.id;

    // Input validation
    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
        return sendError(res, 400, "Invalid product ID.");
    }

    try {
        const user = await User.findById(userId);
        if (!user) return sendError(res, 404, "User not found.");

        user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
        await user.save();

        sendSuccess(res, 200, "Product removed from wishlist.", user.wishlist);
    } catch (error) {
        sendError(res, 500, `Failed to remove from wishlist. Error: ${error.message}`);
    }
};

// Get user wishlist
export const getWishlist = async (req, res) => {
    const userId = req.user.id;

    try {
        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return sendError(res, 400, "Invalid user ID format.");
        }

        // Fetch user with wishlist populated
        const user = await User.findById(userId).populate("wishlist");

        if (!user) return sendError(res, 404, "User not found.");

        // Send the response with the populated wishlist
        sendSuccess(res, 200, "Wishlist retrieved successfully", user.wishlist);
    } catch (error) {
        sendError(res, 500, `Failed to fetch wishlist. Error: ${error.message}`);
    }
};
 

export const getProductsInWishlist = async (req, res) => {
    // Validate ObjectId
    const userId = req.user.id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return sendError(res, 400, "Invalid user ID format.");
    }

    const wishlistId = req.params.wishlistId; // Assuming wishlistId is a string in the URL

    try {
        // Fetch user with wishlist populated
        const user = await User.findById(userId).populate("wishlist");

        // Check if user exists
        if (!user) {
            return sendError(res, 404, "User not found.");
        }

        // Filter products by wishlistId
        const filteredProducts = user.wishlist.filter(product => product.wishlistId === wishlistId);
        
        if (filteredProducts.length > 0) {
            res.status(200).json({
                success: true,
                data: filteredProducts,
                message: 'Products fetched successfully.'
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'No products found for this wishlist ID.'
            });
        }
    } catch (error) {
        console.error(error);
        sendError(res, 500, "Internal server error.");
    }
}
