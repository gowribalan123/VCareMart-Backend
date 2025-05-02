import e from 'express';
import {
	createOrder, getUserOrders, getAllOrders, getTotalOrder, updateOrderStatus,
	stripePayment,
} from '../controllers/orderControllers.js';

import {createOrderItem} from '../controllers/orderItemsController.js';
import { userAuth } from "../middlewares/userAuth.js";
 
const router = e.Router();

router.post('/createOrder', userAuth, createOrder);

router.get('/getAllOrders', userAuth, getAllOrders);

router.get('/getTotalOrder/totalOrder',userAuth, getTotalOrder);

router.get("/getUserOrders/:userId", userAuth, getUserOrders);

router.put('/updateOrderStatus/:orderId', userAuth, updateOrderStatus);
// router.post("/order-items", createOrderItem);

export  {router as orderRouter};