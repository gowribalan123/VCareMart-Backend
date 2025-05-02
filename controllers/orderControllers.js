import { Cart } from "../models/cartModel.js";  
import { User } from "../models/userModel.js";
import { Product } from "../models/productModel.js";
import { sendError, sendSuccess } from '../utils/responseHandlers.js'; 
import Order from '../models/orderModel.js';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import { validationResult } from 'express-validator'; // For validation

const stripe = new Stripe(process.env.Stripe_Private_Api_Key);
dotenv.config();

// Middleware to validate order data
export const validateOrderData = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};
export const createOrder = [validateOrderData, async (req, res) => {
    try {
        const { userId, shippingAddress } = req.body;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required." });
        }

        if (!shippingAddress || shippingAddress.trim() === "") {
            return res.status(400).json({ message: "Shipping address is required." });
        }

        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(400).json({ message: "Cart not found." });
        }

        console.log("Retrieved cart:", cart);

        const items = cart.products.map(product => ({
            productId: product.productId,
            quantity: product.quantity,
            price: product.price,
        }));

        console.log("Mapped items for order:", items);

        // Calculate totalPrice based on items
        const totalPrice = items.reduce((total, item) => total + (item.price * item.quantity), 0);

        const order = new Order({
            userId: userId,
            products: items,
            shippingAddress,
            totalPrice, // Ensure totalPrice is set here
            status: "Pending"
        });

        console.log("Order to be saved:", order);

        const savedOrder = await order.save();
        console.log("Saved Order:", savedOrder);
        
        return sendSuccess(res, 201, savedOrder);
    } catch (error) {
        console.error("Error adding order items:", error);
        return sendError(res, 500, "Server error. Please try again.");
    }
}];









// Fetch Orders for a Specific User
export const getUserOrders = async (req, res) => {
    try {
        const userId = req.user.id; // Get userId from route parameters

        // Fetch orders for the specified user
        const orders = await Order.find({ userId }).populate("products.productId");

        return res.status(200).json({
            status: "success",
            orders
        });
    } catch (error) {
        console.error("Error fetching user orders:", error);
        return res.status(500).json({ status: "error", message: "Server error. Please try again." });
    }
};

// Get all orders with pagination
export const getAllOrders = async (req, res) => {
    try {
        // Pagination settings
        const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
        const limit = parseInt(req.query.limit) || 10; // Default to 10 orders per page
        const skip = (page - 1) * limit;

        // Query with pagination
        const orders = await Order.find()
            .skip(skip)
            .limit(limit)
            .populate("items.productId userId");

        // Get the total number of orders for pagination
        const totalOrders = await Order.countDocuments();

        // Calculate the total pages
        const totalPages = Math.ceil(totalOrders / limit);

        sendSuccess(
            res,
            200,
            "Orders retrieved successfully",
            {
                orders,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalOrders,
                },
            }
        );
    } catch (error) {
        sendError(res, 500, error.message);
    }
};

// Get total orders count
export const getTotalOrder = async (req, res) => {
    try {
        if (req.user.role !== "admin")
            return sendError(res, 403, "Access denied: Admins only");

        const totalOrders = await Order.countDocuments();
        sendSuccess(res, 200, "Total orders count retrieved", { totalOrders });
    } catch (error) {
        sendError(res, 500, `Error fetching order count: ${error.message}`);
    }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
    try {
        if (req.user.role !== "admin")
            return sendError(res, 403, "Access denied: Admins only");

        const order_id = req.params.orderId;
        const { status } = req.body;

        const order = await Order.findById(order_id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        order.status = status;
        order.updatedAt = Date.now();
        await order.save();

        sendSuccess(res, 200, "Order status updated successfully", order);
    } catch (error) {
        sendError(res, 500, error.message);
    }
};

// Create payment intent for Stripe payment
export const stripePayment = async (req, res) => {
    try {
        const { price, email } = req.body;

        const paymentIntent = await stripe.paymentIntents.create({
            amount: price,
            currency: 'inr',
            receipt_email: email,
            payment_method_types: ['card'],
        });

        return sendSuccess(res, 200, { clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error("Error creating Stripe payment intent:", error);
        return sendError(res, 500, "Server error. Please try again.");
    }
};
