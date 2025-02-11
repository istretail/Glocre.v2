const catchAsyncError = require('../middlewares/catchAsyncError');
const Razorpay = require('razorpay');

exports.processPayment = catchAsyncError(async (req, res, next) => {
    const { amount, currency = 'INR' } = req.body;

    const options = {
        amount: amount, // Convert amount to the smallest unit (paise for INR)
        currency,
        receipt: `receipt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
        success: true,
        order
    });
});

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});
