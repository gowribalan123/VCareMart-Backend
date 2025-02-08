import express from 'express';
import { userAuth } from '../middlewares/userAuth.js';
import { createPayment, getPaymentsByUser } from '../controllers/paymentController.js';
import Stripe from 'stripe';

const router = express.Router();
const stripe = new Stripe(process.env.Stripe_Private_Api_Key);
const client_domain = process.env.CLIENT_DOMAIN;

// Route to create a new payment
router.post('/', createPayment);

// Route to get payments by user ID
router.get('/:userId', getPaymentsByUser);

// Route to create a checkout session
router.post('/create-checkout-session', userAuth, async (req, res) => {
    try {
        const { products } = req.body;

        const lineItems = products.map((product) => ({
            price_data: {
                currency: 'inr',
                product_data: {
                    name: product?.productId?.name,
                    images: [product?.productId?.image],
                },
                unit_amount: Math.round(product?.productId?.price * 100),
            },
            quantity: 1,
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${client_domain}/user/payment/success`,
            cancel_url: `${client_domain}/user/payment/cancel`,
        });

        res.json({ success: true, sessionId: session.id });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(error.status || 500).json({ error: error.message || 'Internal server error' });
    }
});

// Route to get session status
router.get('/session-status', async (req, res) => {
    try {
        const sessionId = req.query.session_id;
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        res.json({
            status: session?.status,
            customer_email: session?.customer_details?.email,
            session_data: session,
        });
    } catch (error) {
        console.error('Error retrieving session status:', error);
        res.status(error.statusCode || 500).json({ error: error.message || 'Internal server error' });
    }
});

export { router as paymentRouter };
