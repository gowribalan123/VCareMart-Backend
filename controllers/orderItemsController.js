 
import { sendError, sendSuccess } from '../utils/responseHandlers.js'; 
 
import OrderItems from '../models/orderItemModel.js';
 

 


// create order items
export const createOrderItem = async (req, res) => {
    try {
        const { order_id, product_id, quantity, price } = req.body;

        const newOrderItem = new OrderItems({
            order_id,
            product_id,
            quantity,
            price
        });

        await newOrderItem.save();
        sendSuccess(res, 201, 'Order item created successfully', newOrderItem);
    } catch (error) {
        sendError(res, 500, error.message);
    }
};
 