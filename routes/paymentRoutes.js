import e from "express";
import { userAuth } from "../middlewares/userAuth.js";
import Stripe from "stripe";
import { Order } from "../models/orderModel.js";
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
                    name: product?.productId?.title,
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

export { router as paymentRouter };