 
import { Cart } from "../models/cartModel.js";  
import { Order } from "../models/orderModel.js"; 
//import { Product } from "../models/productModel.js";  
import { sendError, sendSuccess } from '../utils/responseHandlers.js'; 
import mongoose from 'mongoose';



// Create order
const createOrder = async (req, res) => {
    try {
        const { userId, shippingAddress } = req.body;

        console.log(userId, shippingAddress);

        // Ensure userId and shippingAddress are provided
        if (!userId) {
            return sendError(res, 400, "userId (for logged-in users) is required.");
        }
        if (!shippingAddress) {
            return sendError(res, 400, "Shipping address is required.");
        }

        // Fetch the cart based on userId and populate product details
        const cart = await Cart.findOne({ userId }) 

        // Check if cart exists
        if (!cart) {
            return sendError(res, 404, "Cart not found.");
        }

        // Check if products exist in the cart
        if (!cart.products || cart.products.length === 0) {
            return sendError(res, 400, "Cart is empty. Cannot create an order.");
        }

        // Prepare the items for the order and calculate total price
        const orderItems = cart.products.map(item => ({
            productId: item.productId._id,
            quantity: item.quantity,
            price_at_purchase: item.productId.price
        }));
        console.log(orderItems)
        const totalPrice = orderItems.reduce((total, item) => total + (item.price_at_purchase * item.quantity), 0);

        // Create the order
        const newOrder = new Order({
            userId,
            shippingAddress,
           
            items: orderItems,
        });

        // Save the order to the database
        await newOrder.save();

        // Clear the cart after successful order creation
        cart.products = [];
        cart.totalPrice = 0; // Ensure this field is defined in your Cart schema
        await cart.save();

        // Send success response with order details
        sendSuccess(res, 201, 'Order created successfully and cart cleared.', newOrder);
    } catch (error) {
        console.error(`Error creating order: ${error.message}`);
        sendError(res, 500, `Error creating order: ${error.message}`);
    }
};


// My order
const myOrders = async (req, res) => {
    try {
        const { userId, shippingAddress } = req.body;

        console.log(userId, shippingAddress);

        // Ensure userId and shippingAddress are provided
        if (!userId) {
            return sendError(res, 400, "userId (for logged-in users) is required.");
        }
        if (!shippingAddress) {
            return sendError(res, 400, "Shipping address is required.");
        }

        // Fetch the cart based on userId and populate product details
        const cart = await Cart.findOne({ userId }) 

        // Check if cart exists
        if (!cart) {
            return sendError(res, 404, "Cart not found.");
        }

        // Check if products exist in the cart
        if (!cart.products || cart.products.length === 0) {
            return sendError(res, 400, "Cart is empty. Cannot create an order.");
        }

        // Prepare the items for the order and calculate total price
        const orderItems = cart.products.map(item => ({
            productId: item.productId._id,
            quantity: item.quantity,
            price_at_purchase: item.productId.price
        }));
        console.log(orderItems)
        const totalPrice = orderItems.reduce((total, item) => total + (item.price_at_purchase * item.quantity), 0);

        // Create the order
        const newOrder = new Order({
            userId,
            shippingAddress,
           
            items: orderItems,
        });

        // Save the order to the database
        await newOrder.save();

        // Clear the cart after successful order creation
        cart.products = [];
        cart.totalPrice = 0; // Ensure this field is defined in your Cart schema
        await cart.save();

        // Send success response with order details
        sendSuccess(res, 201, 'Order created successfully and cart cleared.', newOrder);
    } catch (error) {
        console.error(`Error creating order: ${error.message}`);
        sendError(res, 500, `Error creating order: ${error.message}`);
    }
};

// Get all orders
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find(); // Changed Orders to Order

        // For each order, check if the user_id is a valid ObjectId (registered user) or a guest
        const ordersWithUserDetails = await Promise.all(
            orders.map(async (order) => {
                // If the user_id is a valid ObjectId, populate user details
                if (mongoose.Types.ObjectId.isValid(order.user_id)) {
                    // Populate user details (only for registered users)
                    const populatedOrder = await order.populate('user_id', 'name email');
                    return populatedOrder;
                } else {
                    // For guest users, return the order without user details
                    return order;
                }
            })
        );

        sendSuccess(res, 200, 'Orders retrieved successfully', ordersWithUserDetails);
    } catch (error) {
        sendError(res, 500, error.message);
    }
};

// Get order by ID
const getOrderById = async (req, res) => {
    try {
        const id = req.params.orderId;
        // Find the order by ID
        const order = await Order.findById(id); // Changed Orders to Order
        if (!order) return sendError(res, 404, 'Order not found');

        // Check if the user_id is a valid ObjectId
        if (mongoose.Types.ObjectId.isValid(order.user_id)) {
            // Populate user details for registered users
            await order.populate('user_id', 'name email');
        }

        // Get the total count of orders
        const totalOrders = await Order.countDocuments(); // Changed Orders to Order

        sendSuccess(res, 200, 'Order retrieved successfully', {
            totalOrders,
            order,
        });
    } catch (error) {
        sendError(res, 500, error.message);
    }
};

// Update order status
const updateOrderStatus = async (req, res) => {
    try {
        const id = req.params.orderId;
        const { status } = req.body;

        // Validate `status` against allowed values
        const allowedStatuses = ['Pending', 'Shipped', 'Delivered', 'Cancelled'];
        if (!allowedStatuses.includes(status)) {
            return sendError(res, 400, `Invalid status. Allowed values: ${allowedStatuses.join(', ')}`);
        }

        const order = await Order.findByIdAndUpdate(
            id,
            { status, updatedAt: Date.now() },
            { new: true }
        ); // Changed Orders to Order

        if (!order) return sendError(res, 404, 'Order not found');
        sendSuccess(res, 200, 'Order status updated successfully', order);
    } catch (error) {
        sendError(res, 500, error.message);
    }
};

// Delete an order
const deleteOrder = async (req, res) => {
    try {
        const id = req.params.orderId;
        const order = await Order.findByIdAndDelete(id); // Changed Orders to Order
        if (!order) return sendError(res, 404, 'Order not found');
        sendSuccess(res, 200, 'Order deleted successfully');
    } catch (error) {
        sendError(res, 500, error.message);
    }
};

export { createOrder, getAllOrders, getOrderById, updateOrderStatus, deleteOrder,myOrders }; // Use ES6 export syntax
