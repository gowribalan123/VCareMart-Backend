import e from "express";
import { userAuth } from "../middlewares/userAuth.js";
import Stripe from "stripe";
import { Order } from "../models/orderModel.js";
import {Payment} from '../models/paymentModel.js';
const router = e.Router();

const stripe = new Stripe(process.env.Stripe_Private_Api_Key);
const client_domain = process.env.CLIENT_DOMAIN;

router.post("/create-checkout-session", userAuth, async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { products } = req.body;

        const lineItems = products.map((product) => ({
            price_data: {
                currency: "inr",
                product_data: {
                    name: product?.productId?.name,
                    images: [product?.productId?.image],
                },
                unit_amount: Math.round(product?.productId?.price * 100),
            },
            quantity: 1,
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: `${client_domain}/user/payment/success`,
            cancel_url: `${client_domain}/user/payment/cancel`,
        });

        const newOrder = new Order({ userId, sessionId: session?.id });
        await newOrder.save()

        res.json({ success: true, sessionId: session.id });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
});

router.get("/session-status", async (req, res) => {
    try {
        const sessionId = req.query.session_id;
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        console.log("session=====", session);

        res.send({
            status: session?.status,
            customer_email: session?.customer_details?.email,
            session_data: session,
        });
    } catch (error) {
        res.status(error?.statusCode || 500).json(error.message || "internal server error");
    }
});

// Create a new payment
router.post("/createPayment", userAuth, async (req, res) => {
    try {
        const { userId, amount, paymentMethod, transactionId, shippingAddress } = req.body;

        // Create a new payment record
        const newPayment = new Payment({
            userId,
            amount,
            paymentMethod,
            status: 'completed', // Adjust based on your logic
            transactionId,
            shippingAddress,
        });

        await newPayment.save();
        res.status(201).json({ success: true, payment: newPayment });
    } catch (error) {
        console.error('Error creating payment:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

export { router as paymentRouter };