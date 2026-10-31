const mongoose = require('mongoose');

/**
 * ════════════════════════════════════════════════════════════════════════════════
 * ✉️ CHAT MESSAGE DOMAIN MODEL (Mongoose Schema)
 * ════════════════════════════════════════════════════════════════════════════════
 * 
 * 🎓 ARCHITECTURAL PATTERN: Message Aggregate Entity
 * 
 * Represents an individual chat bubble within a conversation thread:
 * 1. Ties to a parent Conversation
 * 2. Identifies the sender and role (Customer vs Admin)
 * 3. Optional attached Product (for "Product Card Bubbles" inside chat)
 * 4. Read receipt flag
 */

const chatMessageSchema = new mongoose.Schema(
  {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
      index: true
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    senderRole: {
      type: String,
      enum: ['ROLE_CUSTOMER', 'ROLE_ADMIN'],
      required: true
    },
    content: {
      type: String,
      required: [true, 'Message content cannot be blank'],
      trim: true
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      default: null
    },
    isRead: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);
module.exports = ChatMessage;
