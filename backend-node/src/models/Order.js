const mongoose = require('mongoose');

/**
 * ════════════════════════════════════════════════════════════════════════════════
 * 📦 ORDER DOMAIN MODEL (Mongoose Schema)
 * ════════════════════════════════════════════════════════════════════════════════
 * 
 * 🎓 ARCHITECTURAL PATTERN: Immutable Snapshot & Aggregate Root
 * 
 * In e-commerce, Order Items must NEVER reference living Product prices directly.
 * If an MSI laptop is purchased today for LKR 350,000, and next month the store owner
 * updates the price to LKR 400,000, the past invoice MUST NOT MUTATE.
 * 
 * In MongoDB, we embed an immutable array of item snapshots directly inside the Order
 * document. This eliminates SQL joins and guarantees historic financial immutability.
 */

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true
  },
  itemCode: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  unitPrice: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  image: {
    type: String,
    default: ''
  },
  totalPrice: {
    type: Number,
    required: true
  }
});

const shippingAddressSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  postalCode: { type: String, required: true },
  phone: { type: String, required: true }
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    items: [orderItemSchema],
    shippingAddress: shippingAddressSchema,
    paymentMethod: {
      type: String,
      enum: ['COD', 'CARD', 'BANK_TRANSFER'],
      default: 'COD'
    },
    totalAmount: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
      default: 'PENDING'
    }
  },
  {
    timestamps: true
  }
);

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
