import { Cart } from "../models/cartModel.js";
import { Product } from "../models/productModel.js";
import { Category } from "../models/categoryModel.js";  
import { SubCategory } from "../models/subcategoryModel.js";  

export const getCart = async (req, res) => {
    try {
        const userId = req.user.id;

        const cart = await Cart.findOne({ userId })
        .populate("products.productId")
        .populate('category') // Populate category
        .populate('seller') // Populate seller
        .populate('subcategory') // Populate category
        

        const categories = await Category.find();
        const subcategories = await SubCategory.find();


        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        res.status(200).json({ data: cart,categories,subcategories, message: "cart fetched successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

export const addProductToCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.body;

        // Find the product to ensure it exists and fetch its price
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "product not found" });
        }

        // Find the user's cart or create a new one if it doesn't exist
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, products: [] });
        }

        // Check if the product is already in the cart
        const productExists = cart.products.some((item) => item.productId.equals(productId));
        if (productExists) {
            return res.status(400).json({ message: "product already in cart" });
        }

        // Add the product to the cart
        cart.products.push({
            productId,
            price: product.price,
        });

        // Recalculate the total price
        cart.calculateTotalPrice();

        await cart.save();

        res.status(200).json({ data: cart, message: "product added to cart" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};


export const removeProductFromCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.body;

        // Find the user's cart
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        // Remove the product from the cart
        cart.products = cart.products.filter((item) => !item.productId.equals(productId));

        // Recalculate the total price
        cart.calculateTotalPrice();

        // Save the cart
        await cart.save();

        res.status(200).json({ data: cart, message: "product removed form cart" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};