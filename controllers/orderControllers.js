import { Cart } from "../models/cartModel.js";  
import { Product } from "../models/productModel.js";  
import { sendError, sendSuccess } from '../utils/responseHandlers.js'; 
import mongoose from 'mongoose';
import Order from '../models/orderModel.js';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import { validationResult } from 'express-validator'; // For validation

const stripe = new Stripe(process.env.Stripe_Private_Api_Key);
dotenv.config();

// Middleware to validate order data
const validateOrderData = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// @desc  create a new order
// @route POST /api/orders
// @access PRIVATE
export const addOrderItems = [validateOrderData, async (req, res) => {
    try {
        const {
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            shippingPrice,
            taxPrice,
            totalPrice,
        } = req.body;

        // Validate required fields
        if (!orderItems || orderItems.length === 0) {
            return sendError(res, 400, "No order items found.");
        }

        // Create a new order instance
        const order = new Order({
            userId: req.user._id, // Uncomment if user ID is available
            sessionId: req.session.id,
            products: orderItems.map(item => ({
                productId: item.productId,
                price: item.price,
                quantity: item.quantity,
            })),
            shippingAddress,
            paymentMethod,
            itemsPrice,
            shippingPrice,
            taxPrice,
            totalPrice,
        });

        // Save the order to the database
        const savedOrder = await order.save();
        return sendSuccess(res, 201, savedOrder);
    } catch (error) {
        console.error("Error adding order items:", error);
        return sendError(res, 500, "Server error. Please try again.");
    }
}];

// @desc  get an order by id
// @route GET /api/orders/:id
// @access PRIVATE
export const getOrderById = async (req, res) => {
    try {
        const reqOrder = await Order.findById(req.params.id).populate('user', 'name email');
        if (reqOrder) {
            return sendSuccess(res, 200, reqOrder);
        } else {
            return sendError(res, 404, 'Order not found');
        }
    } catch (error) {
        console.error("Error fetching order:", error);
        return sendError(res, 500, "Server error. Please try again.");
    }
};

// @desc  update the order object once paid
// @route PUT /api/orders/:id/pay
// @access PRIVATE
export const updateOrderToPay = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            const { paymentMode } = req.body;
            order.isPaid = true;
            order.paidAt = Date.now();

            // Update payment result based on the payment mode
            order.paymentResult = {
                type: paymentMode,
                id: req.body.id,
                status: req.body.status,
                email_address: paymentMode === 'paypal' ? req.body.payer.email_address : req.body.receipt_email,
            };

            const updatedOrder = await order.save();
            return sendSuccess(res, 200, updatedOrder);
        } else {
            return sendError(res, 404, 'Order not found');
        }
    } catch (error) {
        console.error("Error updating order payment:", error);
        return sendError(res, 500, "Server error. Please try again.");
    }
};

// @desc  update the order object once delivered
// @route PUT /api/orders/:id/deliver
// @access PRIVATE/ADMIN
export const updateOrderToDeliver = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            order.isDelivered = true;
            order.deliveredAt = Date.now();
            const updatedOrder = await order.save();
            return sendSuccess(res, 200, updatedOrder);
        } else {
            return sendError(res, 404, 'Order not found');
        }
    } catch (error) {
        console.error("Error updating order delivery:", error);
        return sendError(res, 500, "Server error. Please try again.");
    }
};

// @desc  fetch the orders of the user logged in
// @route GET /api/orders/myorders
// @access PRIVATE
export const getMyOrders = async (req, res) => {
    try {
        const allOrders = await Order.find({ userId: req.user._id }).sort('-createdAt');
        return sendSuccess(res, 200, allOrders);
    } catch (error) {
        console.error("Error fetching user orders:", error);
        return sendError(res, 500, "Server error. Please try again.");
    }
};

// @desc  fetch all orders
// @route GET /api/orders
// @access PRIVATE/ADMIN
export const getAllOrders = async (req, res) => {
    try {
        const page = Number(req.query.pageNumber) || 1;
        const pageSize = 20;

        const count = await Order.countDocuments({});
        const orders = await Order.find({})
            .limit(pageSize)
            .skip(pageSize * (page - 1))
            .populate('user', 'id name')
            .sort('-createdAt');

        return sendSuccess(res, 200, {
            orders,
            page,
            pages: Math.ceil(count / pageSize),
            total: count,
        });
    } catch (error) {
        console.error("Error fetching all orders:", error);
        return sendError(res, 500, "Server error. Please try again.");
    }
};

// @desc  create payment intent for stripe payment
// @route POST /api/orders/stripe-payment
// @access PUBLIC
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
