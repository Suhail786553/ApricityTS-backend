const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const router = express.Router();

const razorpay = new Razorpay({
  key_id: 'rzp_live_1ImGsiMoqvxOF3', // Replace with your Razorpay Key ID
  key_secret: 'EOB8AnVGx9XemkROc2QJv9M7' // Replace with your Razorpay Secret Key
});

// Route to create an order
router.post('/create-order', async (req, res) => {
  const { amount, currency } = req.body;
  
  // Validate amount
  if (!amount || isNaN(amount) || amount <= 0) {
    return res.status(400).json({ error: 'Invalid amount' });
  }

  try {
    const order = await razorpay.orders.create({
      amount: amount * 100, // amount in the smallest currency unit (e.g., paise)
      currency: currency || 'INR',
      receipt: `receipt_order_${Date.now()}`
    });
    res.json(order);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Route to verify payment
router.post('/verify-payment', (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const generated_signature = crypto
    .createHmac('sha256', razorpay.key_secret)
    .update(razorpay_order_id + '|' + razorpay_payment_id)
    .digest('hex');

  if (generated_signature === razorpay_signature) {
    res.send({ status: 'Payment verified successfully!' });
  } else {
    res.status(400).send({ status: 'Payment verification failed!' });
  }
});

module.exports = router;
