const express = require('express');
const router = express.Router();
const {
  sendMessage,
  getCustomerConversations,
  getAdminConversations,
  getConversationMessages,
  markAsRead
} = require('../controllers/chatController');
const { protect, admin } = require('../middleware/authMiddleware');

/**
 * ════════════════════════════════════════════════════════════════════════════════
 * 💬 CHAT & CUSTOMER INQUIRY ROUTES
 * ════════════════════════════════════════════════════════════════════════════════
 * Base URL: /api/chat
 * 
 * All chat endpoints require authentication
 */

// Send message (Customer or Admin)
router.post('/send', protect, sendMessage);

// Customer conversation list
router.get('/conversations', protect, getCustomerConversations);

// Admin-wide inquiries hub inbox
router.get('/admin/conversations', protect, admin, getAdminConversations);

// Message history for specific conversation
router.get('/conversations/:conversationId/messages', protect, getConversationMessages);

// Mark conversation messages as read
router.post('/conversations/:conversationId/read', protect, markAsRead);

module.exports = router;
