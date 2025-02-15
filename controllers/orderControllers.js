import { Cart } from "../models/cartModel.js";  
 
import { Product } from "../models/productModel.js";  
import { sendError, sendSuccess } from '../utils/responseHandlers.js'; 
import mongoose from 'mongoose';
import Order from '../models/orderModel.js';
import Stripe from 'stripe';
import dotenv from 'dotenv';

//import asyncHandler from 'express-async-handler';


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
dotenv.config();

// @desc  create a new order
// @route GET /api/orders
// @access PRIVATE
export const addOrderItems = async (req, res) => {
	const {
		orderItems,
		shippingAddress,
		paymentMethod,
		itemsPrice,
		shippingPrice,
		taxPrice,
		totalPrice,
	} = req.body;

	if (orderItems && !orderItems.length) {
		res.status(401);
		throw new Error('No order items');
	} else {
		const order = new Order({
			user: req.user._id,
			orderItems,
			shippingAddress,
			paymentMethod,
			itemsPrice,
			shippingPrice,
			taxPrice,
			totalPrice,
		});
		const createdOrder = await order.save();
		res.status(201).json(createdOrder);
	}
};

// @desc  get an order by id
// @route GET /api/orders/:id
// @access PRIVATE
export const getOrderById =  async (req, res) => {
	const reqOrder = await Order.findById(req.params.id).populate(
		'user',
		'name email'
	);
	if (reqOrder) {
		res.status(201).json(reqOrder);
	} else {
		res.status(401);
		throw new Error('Order not found');
	}
};

// @desc  update the order object once paid
// @route PUT /api/orders/:id/pay
// @access PRIVATE
export const updateOrderToPay =  async (req, res) => {
	const order = await Order.findById(req.params.id);
	if (order) {
		const { paymentMode } = req.body;
		order.isPaid = true;
		order.paidAt = Date.now();
		// update the payment result based on which mode of payment was chosen
		if (paymentMode === 'paypal') {
			order.paymentResult = {
				type: 'paypal',
				id: req.body.id,
				status: req.body.status,
				update_time: req.body.update_time,
				email_address: req.body.payer.email_address,
			};
		} else if (paymentMode === 'stripe') {
			order.paymentResult = {
				type: 'stripe',
				id: req.body.id,
				status: req.body.status,
				email_address: req.body.receipt_email,
			};
		}

		const updatedOrder = await order.save();
		res.status(201).json(updatedOrder);
	} else {
		res.status(401);
		throw new Error('Order not found');
	}
};

// @desc  update the order object once delivered
// @route PUT /api/orders/:id/pay
// @access PRIVATE/ADMIN
export const updateOrderToDeliver =  async (req, res) => {
	const order = await Order.findById(req.params.id);
	if (order) {
		order.isDelivered = true;
		order.deliveredAt = Date.now();

		const updatedOrder = await order.save();
		res.status(201).json(updatedOrder);
	} else {
		res.status(401);
		throw new Error('Order not found');
	}
};

// @desc  fetch the orders of the user logged in
// @route GET /api/orders/myorders
// @access PRIVATE
export const getMyOrders =  async (req, res) => {
	// sort orders in descending order of the date they were created at, hence negetive sign
	const allOrders = await Order.find({ user: req.user._id }).sort(
		'-createdAt'
	);
	res.json(allOrders);
};

// @desc  fetch all orders
// @route GET /api/orders
// @access PRIVATE/ADMIN
export const getAllOrders = async (req, res) => {
	const page = Number(req.query.pageNumber) || 1; // the current page number in the pagination
	const pageSize = 20; // total number of entries on a single page

	const count = await Order.countDocuments({}); // total number of documents available

	// find all orders that need to be sent for the current page, by skipping the documents included in the previous pages
	// and limiting the number of documents included in this request
	// sort this in desc order that the document was created at
	const orders = await Order.find({})
		.limit(pageSize)
		.skip(pageSize * (page - 1))
		.populate('user', 'id name')
		.sort('-createdAt');

	// send the list of orders, current page number, total number of pages available
	res.json({
		orders,
		page,
		pages: Math.ceil(count / pageSize),
		total: count,
	});
};

// @desc  create payment intent for stripe payment
// @route POST /api/orders/stripe-payment
// @access PUBLIC
export const stripePayment = async (req, res) => {
	const { price, email } = req.body;

	// Need to create a payment intent according to stripe docs
	// https://stripe.com/docs/api/payment_intents
	const paymentIntent = await stripe.paymentIntents.create({
		amount: price,
		currency: 'inr',
		receipt_email: email,
		payment_method_types: ['card'],
	});

	// send this payment intent to the client side
	res.send({
		clientSecret: paymentIntent.client_secret,
	});

	// another way to include payments, is to create a new charge for a new customer, each time
	// similar to Hitesh's video on accepting stripe payments
	// But uses out dated stripe technique, so excluded for the current implementation

	// const { order, token } = req.body;
	// const idempotencyKey = nanoid();
	// return stripe.customers
	// 	.create({
	// 		email: token.email,
	// 		source: token.id,
	// 	})
	// 	.then((customer) => {
	// 		stripe.charges.create(
	// 			{
	// 				amount: order.totalPrice * 100,
	// 				currency: 'inr',
	// 				customer: customer.id,
	// 				receipt_email: token.email,
	// 				// description: product.name,
	// 			},
	// 			{ idempotencyKey }
	// 		);
	// 	})
	// 	.then((result) => res.status(200).json(result))
	// 	.catch((err) => console.log(err));
};

