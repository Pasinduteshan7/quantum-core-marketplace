const mongoose = require('mongoose');

/**
 * ════════════════════════════════════════════════════════════════════════════════
 * 🛒 CART ITEM DOMAIN MODEL (Mongoose Schema)
 * ════════════════════════════════════════════════════════════════════════════════
 * 
 * 🎓 ARCHITECTURAL PATTERN: Anti-IDOR Ownership Enclosure
 * 
 * Every CartItem is strictly anchored to a `user` ObjectId.
 * This guarantees multi-tenant database isolation at the model level.
 */

const cartItemSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
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
      default: 1,
      min: [1, 'Quantity must be at least 1']
    },
    image: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

// Virtual property for calculated total price
cartItemSchema.virtual('totalPrice').get(function () {
  return this.unitPrice * this.quantity;
});

// Ensure virtuals are included when converting to JSON
cartItemSchema.set('toJSON', { virtuals: true });
cartItemSchema.set('toObject', { virtuals: true });

const CartItem = mongoose.model('CartItem', cartItemSchema);
module.exports = CartItem;
