const express = require('express');
const router = express.Router();
const {
  getStats,
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllOrders,
  updateOrderStatus,
  getAllUsers
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

/**
 * ════════════════════════════════════════════════════════════════════════════════
 * 🛡️ ADMIN BACK-OFFICE ROUTES
 * ════════════════════════════════════════════════════════════════════════════════
 * Base URL: /api/admin
 * 
 * All routes in this file require:
 * 1. Valid JWT authentication token (protect)
 * 2. ROLE_ADMIN privilege check (admin)
 * 
 * Matches Spring Boot's SecurityConfig:
 *   .requestMatchers("/api/admin/**").hasRole("ADMIN")
 */

// Apply protection and admin authorization across all /api/admin routes
router.use(protect);
router.use(admin);

// Store Dashboard Statistics
router.get('/stats', getStats);

// Unfiltered Catalog Management
router.get('/products', getAllProducts);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

// Store Fulfillment & Orders
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);

// User Accounts Inspection
router.get('/users', getAllUsers);

module.exports = router;
