const Conversation = require('../models/Conversation');
const ChatMessage = require('../models/ChatMessage');
const Product = require('../models/Product');
const User = require('../models/User');

/**
 * ════════════════════════════════════════════════════════════════════════════════
 * 💬 CHAT CONTROLLER (Customer Support Inquiries & Messages)
 * ════════════════════════════════════════════════════════════════════════════════
 * 
 * 🎓 ARCHITECTURAL PATTERN: Asynchronous Customer Service Bus (REST Fallback)
 * 
 * Matches Spring Boot's ChatRestController contract:
 * 1. POST /api/chat/send                           -> Send customer or admin message
 * 2. GET  /api/chat/conversations                  -> List customer's conversations
 * 3. GET  /api/chat/admin/conversations            -> List all inquiries for admin inbox
 * 4. GET  /api/chat/conversations/:id/messages     -> Message history for thread
 * 5. POST /api/chat/conversations/:id/read         -> Mark unread messages as read
 */

// Helper to format a ChatMessage document into the standard ChatMessageDto
const toChatMessageDto = (msg) => {
  const prod = msg.product;
  return {
    id: msg._id.toString(),
    conversationId: msg.conversation?._id ? msg.conversation._id.toString() : msg.conversation.toString(),
    senderId: msg.sender?._id ? msg.sender._id.toString() : msg.sender.toString(),
    senderName: msg.sender?.name || (msg.senderRole === 'ROLE_ADMIN' ? 'Store Support' : 'Customer'),
    senderRole: msg.senderRole,
    content: msg.content,
    isRead: Boolean(msg.isRead),
    createdAt: msg.createdAt,
    productId: prod ? (prod._id ? prod._id.toString() : prod.toString()) : null,
    productName: prod?.name || null,
    productImageUrl: prod ? (prod.image || prod.imageUrl || null) : null,
    productPrice: prod?.price ? Number(prod.price) : null
  };
};

// Helper to format a Conversation document into the standard ConversationSummaryDto
const toConversationSummaryDto = (conv, lastMsg, unreadCount) => {
  const prod = conv.product;
  const cust = conv.customer;
  return {
    id: conv._id.toString(),
    customerId: cust ? (cust._id ? cust._id.toString() : cust.toString()) : null,
    customerName: cust?.name || 'Customer',
    customerEmail: cust?.email || '',
    productId: prod ? (prod._id ? prod._id.toString() : prod.toString()) : null,
    productName: prod?.name || null,
    productImageUrl: prod ? (prod.image || prod.imageUrl || null) : null,
    productPrice: prod?.price ? Number(prod.price) : null,
    status: conv.status || 'OPEN',
    lastMessage: lastMsg ? lastMsg.content : '',
    lastMessageTime: lastMsg ? lastMsg.createdAt : conv.updatedAt,
    unreadCount: unreadCount || 0,
    createdAt: conv.createdAt,
    updatedAt: conv.updatedAt
  };
};

// Helper to resolve product by ObjectId or SKU itemCode
const resolveProduct = async (productId) => {
  if (!productId) return null;
  const pStr = String(productId);
  if (pStr.match(/^[0-9a-fA-F]{24}$/)) {
    const found = await Product.findById(pStr);
    if (found) return found;
  }
  return await Product.findOne({ itemCode: pStr });
};

// @desc    Send a message via REST
// @route   POST /api/chat/send
// @access  Private
const sendMessage = async (req, res, next) => {
  try {
    const { conversationId, productId, content } = req.body;

    if (!content || content.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Message content cannot be blank'
      });
    }

    let conversation = null;

    if (conversationId) {
      // Case A: Reply to existing thread
      const cStr = String(conversationId);
      if (cStr.match(/^[0-9a-fA-F]{24}$/)) {
        conversation = await Conversation.findById(cStr);
      }
      if (!conversation) {
        return res.status(404).json({
          success: false,
          message: `Conversation not found with ID: ${conversationId}`
        });
      }

      // Security: Customer can only post in their own thread
      if (req.user.role === 'ROLE_CUSTOMER' && conversation.customer.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Unauthorized: Cannot send messages to another customer thread'
        });
      }
    } else {
      // Case B: Customer starting a new conversation thread
      if (req.user.role === 'ROLE_ADMIN') {
        return res.status(400).json({
          success: false,
          message: 'Admin cannot start an arbitrary conversation without a conversationId'
        });
      }

      let attachedProd = null;
      if (productId) {
        attachedProd = await resolveProduct(productId);
        // Reuse existing open thread for same product if present
        if (attachedProd) {
          const existing = await Conversation.findOne({
            customer: req.user._id,
            product: attachedProd._id
          });
          if (existing) {
            conversation = existing;
          }
        }
      }

      if (!conversation) {
        conversation = await Conversation.create({
          customer: req.user._id,
          product: attachedProd ? attachedProd._id : null,
          status: 'OPEN'
        });
      }
    }

    // Attach product to message bubble if specified
    let messageProduct = null;
    if (productId) {
      messageProduct = await resolveProduct(productId);
    } else if (conversation.product) {
      messageProduct = await Product.findById(conversation.product);
    }

    // Save message
    const message = await ChatMessage.create({
      conversation: conversation._id,
      sender: req.user._id,
      senderRole: req.user.role || 'ROLE_CUSTOMER',
      content: content.trim(),
      product: messageProduct ? messageProduct._id : null,
      isRead: false
    });

    // Update conversation timestamp and reopen if previously resolved
    conversation.updatedAt = new Date();
    if (conversation.status === 'RESOLVED' && req.user.role === 'ROLE_CUSTOMER') {
      conversation.status = 'OPEN';
    }
    await conversation.save();

    // Populate sender and product for DTO
    await message.populate('sender', 'name role');
    if (message.product) {
      await message.populate('product', 'name price image imageUrl');
    }

    res.status(201).json(toChatMessageDto(message));
  } catch (error) {
    next(error);
  }
};

// @desc    Get current customer's conversation threads
// @route   GET /api/chat/conversations
// @access  Private
const getCustomerConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({ customer: req.user._id })
      .populate('customer', 'name email')
      .populate('product')
      .sort({ updatedAt: -1 });

    const results = [];
    for (const conv of conversations) {
      const lastMsg = await ChatMessage.findOne({ conversation: conv._id }).sort({ createdAt: -1 });
      const unreadCount = await ChatMessage.countDocuments({
        conversation: conv._id,
        isRead: false,
        senderRole: 'ROLE_ADMIN'
      });
      results.push(toConversationSummaryDto(conv, lastMsg, unreadCount));
    }

    res.status(200).json(results);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all conversations across store (Admin inbox)
// @route   GET /api/chat/admin/conversations
// @access  Private/Admin
const getAdminConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find()
      .populate('customer', 'name email')
      .populate('product')
      .sort({ updatedAt: -1 });

    const results = [];
    for (const conv of conversations) {
      const lastMsg = await ChatMessage.findOne({ conversation: conv._id }).sort({ createdAt: -1 });
      const unreadCount = await ChatMessage.countDocuments({
        conversation: conv._id,
        isRead: false,
        senderRole: 'ROLE_CUSTOMER'
      });
      results.push(toConversationSummaryDto(conv, lastMsg, unreadCount));
    }

    res.status(200).json(results);
  } catch (error) {
    next(error);
  }
};

// @desc    Get message history for a conversation thread
// @route   GET /api/chat/conversations/:conversationId/messages
// @access  Private
const getConversationMessages = async (req, res, next) => {
  try {
    const { conversationId } = req.params;

    let conversation = null;
    if (String(conversationId).match(/^[0-9a-fA-F]{24}$/)) {
      conversation = await Conversation.findById(conversationId);
    }

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    // Security: Customer can only view their own thread
    if (req.user.role === 'ROLE_CUSTOMER' && conversation.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: Cannot view another customer message history'
      });
    }

    const messages = await ChatMessage.find({ conversation: conversation._id })
      .populate('sender', 'name role')
      .populate('product', 'name price image imageUrl')
      .sort({ createdAt: 1 });

    res.status(200).json(messages.map(toChatMessageDto));
  } catch (error) {
    next(error);
  }
};

// @desc    Mark messages in a conversation as read
// @route   POST /api/chat/conversations/:conversationId/read
// @access  Private
const markAsRead = async (req, res, next) => {
  try {
    const { conversationId } = req.params;

    let conversation = null;
    if (String(conversationId).match(/^[0-9a-fA-F]{24}$/)) {
      conversation = await Conversation.findById(conversationId);
    }

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    // Mark messages sent by the OPPOSITE role as read
    const targetSenderRole = req.user.role === 'ROLE_ADMIN' ? 'ROLE_CUSTOMER' : 'ROLE_ADMIN';

    await ChatMessage.updateMany(
      { conversation: conversation._id, senderRole: targetSenderRole, isRead: false },
      { $set: { isRead: true } }
    );

    res.status(200).json({ success: true, conversationId });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendMessage,
  getCustomerConversations,
  getAdminConversations,
  getConversationMessages,
  markAsRead
};
