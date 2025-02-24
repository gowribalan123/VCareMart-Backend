import e from 'express';
import {
	addOrderItems,
	getOrderById,
	updateOrderToPay,
	updateOrderToDeliver,
	getMyOrders,
	getAllOrders,
	stripePayment,
} from '../controllers/orderControllers.js';

//import { protectRoute, isAdmin } from '../middleware/authMiddleware.js';

const router = e.Router();

// @desc  create a new order, get all orders
// @route GET /api/orders
// @access PRIVATE && PRIVATE/ADMIN
router.post("/createOrder",addOrderItems)
	router.get("/getAllOrders", getAllOrders);

// @desc  fetch the orders of the user logged in
// @route GET /api/orders/myorders
// @access PRIVATE
router.get("/getMyOrders", getMyOrders);

// @desc  create payment intent for stripe payment
// @route POST /api/orders/stripe-payment
// @access PUBLIC

//router.route('/stripe-payment').post(stripePayment);

// @desc  get an order by id
// @route GET /api/orders/:id
// @access PRIVATE
router.get("getOrderById/:Id", getOrderById);

// @desc  update the order object once paid
// @route PUT /api/orders/:id/pay
// @access PRIVATE
router.route('/:id/pay').put(updateOrderToPay);

// @desc  update the order object once delivered
// @route PUT /api/orders/:id/pay
// @access PRIVATE/ADMIN
router.route('/:id/deliver').put( updateOrderToDeliver);

export  {router as orderRouter};