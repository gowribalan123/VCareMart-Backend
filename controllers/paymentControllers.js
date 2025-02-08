import Payment from '../models/paymentModel.js';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.Stripe_Private_Api_Key);

// Create a new payment
export const createPayment = async (req, res) => {
    try {
        const { userId, amount, paymentMethod, transactionId, shippingAddress } = req.body;

        // Create a new payment record
        const newPayment = new Payment({
            userId,
            amount,
            paymentMethod,
            status: 'completed', // You can adjust this based on your logic
            transactionId,
            shippingAddress,
        });

        await newPayment.save();
        res.status(201).json({ success: true, payment: newPayment });
    } catch (error) {
        console.error('Error creating payment:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get payments by user ID
export const getPaymentsByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const payments = await Payment.find({ userId });

        if (!payments.length) {
            return res.status(404).json({ success: false, message: 'No payments found for this user.' });
        }

        res.status(200).json({ success: true, payments });
    } catch (error) {
        console.error('Error fetching payments:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Create a checkout session
export const createCheckoutSession = async (req, res) => {
    try {
        const { products } = req.body;

        const lineItems = products.map((product) => ({
            price_data: {
                currency: 'inr',
                product_data: {
                    name: product?.productId?.name,
                    images: [product?.productId?.image],
                },
                unit_amount: Math.round(product?.productId?.price * 100), // Convert price to cents
            },
            quantity: 1, // Set quantity to 1 for each product
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${process.env.CLIENT_DOMAIN}/user/payment/success`,
            cancel_url: `${process.env.CLIENT_DOMAIN}/user/payment/cancel`,
        });

        res.json({ success: true, sessionId: session.id });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};
