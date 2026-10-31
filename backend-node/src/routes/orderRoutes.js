const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

/**
 * ════════════════════════════════════════════════════════════════════════════════
 * 🛣️ ORDER ROUTES
 * ════════════════════════════════════════════════════════════════════════════════
 * Base URL: /api/orders
 */

router.use(protect); // All order actions require authentication

router.post('/', createOrder);
router.get('/', getMyOrders);
router.get('/admin/all', admin, getAllOrders);
router.get('/:id', getOrderById);
router.put('/:id/status', admin, updateOrderStatus);

module.exports = router;
