const express = require('express');
const router = express.Router();
const { getCart, addToCart, updateQuantity, removeFromCart, clearCart } = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

/**
 * ════════════════════════════════════════════════════════════════════════════════
 * 🛣️ SHOPPING CART ROUTES
 * ════════════════════════════════════════════════════════════════════════════════
 * Base URL: /api/cart
 * All cart endpoints require user authentication (protect)
 */

router.use(protect); // Apply JWT protection to all cart routes

router.get('/', getCart);
router.post('/', addToCart);
router.put('/:id', updateQuantity);
router.delete('/:id', removeFromCart);
router.delete('/', clearCart);

module.exports = router;
