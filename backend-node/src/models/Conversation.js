const mongoose = require('mongoose');

/**
 * ════════════════════════════════════════════════════════════════════════════════
 * 💬 CONVERSATION DOMAIN MODEL (Mongoose Schema)
 * ════════════════════════════════════════════════════════════════════════════════
 * 
 * 🎓 ARCHITECTURAL PATTERN: Aggregate Thread Root
 * 
 * Represents an inquiry conversation thread between a Customer and Store Admin:
 * 1. Tracks customer ownership
 * 2. Optional Product context (embedded inquiry origin)
 * 3. Lifecycle status: OPEN (Active inquiry) / RESOLVED (Closed thread)
 */

const conversationSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      default: null
    },
    status: {
      type: String,
      enum: ['OPEN', 'RESOLVED'],
      default: 'OPEN'
    }
  },
  {
    timestamps: true
  }
);

const Conversation = mongoose.model('Conversation', conversationSchema);
module.exports = Conversation;
