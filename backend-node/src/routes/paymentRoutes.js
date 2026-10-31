const express = require('express');
const router = express.Router();
const {
  createPaymentIntent,
  confirmPayment,
  handleWebhook
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

/**
 * ════════════════════════════════════════════════════════════════════════════════
 * 💳 PAYMENT GATEWAY ROUTES
 * ════════════════════════════════════════════════════════════════════════════════
 * Base URL: /api/payments
 */

// Step 1: Customer requests PaymentIntent for Order
router.post('/create-intent', protect, createPaymentIntent);

// Step 2: Client confirms payment status
router.post('/confirm/:paymentIntentId', protect, confirmPayment);

// Step 3: Webhook notifications directly from Stripe
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

module.exports = router;
