import e from "express";  

import { createOrder, getAllOrders, getOrderById, updateOrderStatus, deleteOrder , myOrders} from "./../controllers/orderControllers.js";

// import { createOrderItem } from "./../controllers/orderItemsControllers.js";
const router = e.Router();


router.post('/', createOrder);

router.post('/', myOrders); 

router.get('/', getAllOrders);

router.get('/viewOrderDetails/:orderId', getOrderById);

router.put('/updateOrderStatus/:orderId', updateOrderStatus);

router.delete('/deleteOrder/:orderId', deleteOrder);

// orderRouter.post("/order-items", createOrderItem);

export { router as orderRouter };
