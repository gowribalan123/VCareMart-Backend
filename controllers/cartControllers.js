import { Cart } from "../models/cartModel.js";
import { Product } from "../models/productModel.js";
import { Category } from "../models/categoryModel.js";  
import { SubCategory } from "../models/subcategoryModel.js";  

export const getCart = async (req, res) => {
    try {
        const userId = req.user.id;

        const cart = await Cart.findOne({ userId })
            .populate("products.productId")
            .populate('category')
            .populate('seller')
            .populate('subcategory');

        const categories = await Category.find();
        const subcategories = await SubCategory.find();

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        res.status(200).json({ data: cart, categories, subcategories, message: "Cart fetched successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", error });
    }
};

export const addProductToCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.body;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, products: [] });
        }

        const productExists = cart.products.some((item) => item.productId.equals(productId));
        if (productExists) {
            return res.status(400).json({ message: "Product already in cart" });
        }

        cart.products.push({
            productId,
            price: product.price,
            quantity: 1 // Assuming default quantity is 1
        });

        // Recalculate the total price
        cart.calculateTotalPrice();
        await cart.save();

        res.status(200).json({ data: cart, message: "Product added to cart" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", error });
    }
};

export const removeProductFromCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.body;

        let cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        cart.products = cart.products.filter((item) => !item.productId.equals(productId));
        cart.calculateTotalPrice();
        await cart.save();

        res.status(200).json({ data: cart, message: "Product removed from cart" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", error });
    }
};


export const updateQuantity = async (req, res) => {
    const { productId, quantity } = req.body;

    try {
        const cart = await Cart.findOne({ 'products.productId': productId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const itemIndex = cart.products.findIndex(item => item.productId.toString() === productId);
        
        if (itemIndex >= 0) {
            cart.products[itemIndex].quantity = quantity; // Update quantity
            cart.calculateTotalPrice(); // Recalculate total price
            await cart.save();
            return res.status(200).json({ message: 'Quantity updated successfully', cart });
        } else {
            return res.status(404).json({ message: 'Item not found in cart' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error', error });
    }
};
export const clearCart = async (req, res) => {
    try {
        const userId = req.user.id;

        // Find the cart for the user
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        // Clear all products from the cart
        cart.products = []; // Empty the products array

        // Optionally, recalculate total price if you have a method for that
        cart.calculateTotalPrice(); // Ensure this method exists in your Cart model

        // Save the updated cart
        await cart.save();

        res.status(200).json({ data: cart, message: "Cart is cleared" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", error });
    }
};
