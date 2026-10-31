const mongoose = require('mongoose');

/**
 * ════════════════════════════════════════════════════════════════════════════════
 * 💳 PAYMENT DOMAIN MODEL (Mongoose Schema)
 * ════════════════════════════════════════════════════════════════════════════════
 * 
 * 🎓 ARCHITECTURAL PATTERN: Financial Audit Trail & Gateway Isolation
 * 
 * Tracks Stripe PaymentIntents and ties them to Orders:
 * 1. Guarantees 1-to-1 association with an Order
 * 2. Caches clientSecret and gateway status (REQUIRES_PAYMENT_METHOD, SUCCEEDED, etc.)
 * 3. Keeps financial gateway details separate from the core Order document
 */

const paymentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
      index: true
    },
    stripePaymentIntentId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true
    },
    clientSecret: {
      type: String,
      trim: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      default: 'usd',
      lowercase: true,
      trim: true
    },
    status: {
      type: String,
      default: 'PENDING',
      enum: [
        'PENDING',
        'REQUIRES_PAYMENT_METHOD',
        'REQUIRES_CONFIRMATION',
        'REQUIRES_ACTION',
        'PROCESSING',
        'SUCCEEDED',
        'CANCELED',
        'FAILED'
      ]
    },
    paymentMethod: {
      type: String,
      default: 'card'
    },
    receiptUrl: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;
