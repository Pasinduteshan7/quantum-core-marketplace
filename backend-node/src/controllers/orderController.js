const Order = require('../models/Order');
const CartItem = require('../models/CartItem');
const Product = require('../models/Product');

/**
 * ════════════════════════════════════════════════════════════════════════════════
 * 📦 ORDER CONTROLLER
 * ════════════════════════════════════════════════════════════════════════════════
 * 
 * 🎓 ARCHITECTURAL PATTERN: Transactional Order Lifecycle & Anti-IDOR Enforcement
 */

// Helper: map Order document to frontend Order format
const toOrderDto = (order, includeCustomer = false) => ({
  id: order._id.toString(),
  userId: order.user ? (order.user._id ? order.user._id.toString() : order.user.toString()) : null,
  items: order.items.map(it => ({
    id: it._id ? it._id.toString() : null,
    productId: it.productId,
    itemCode: it.itemCode,
    name: it.name,
    price: it.unitPrice,
    unitPrice: it.unitPrice,
    quantity: it.quantity,
    image: it.image,
    totalPrice: it.totalPrice || (it.unitPrice * it.quantity)
  })),
  shippingAddress: order.shippingAddress,
  paymentMethod: order.paymentMethod,
  totalAmount: order.totalAmount,
  status: order.status,
  createdAt: order.createdAt,
  customerName: includeCustomer && order.user ? order.user.name : undefined,
  customerEmail: includeCustomer && order.user ? order.user.email : undefined
});

// @desc    Place order from cart & freeze item prices
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod, totalAmount, cartItemIds } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No order items provided'
      });
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.address) {
      return res.status(400).json({
        success: false,
        message: 'Complete shipping address is required'
      });
    }

    // 1. Pre-flight stock availability check
    for (const item of items) {
      const pId = item.productId || item.id || item.itemCode;
      let product = null;
      if (String(pId).match(/^[0-9a-fA-F]{24}$/)) {
        product = await Product.findById(pId);
      }
      if (!product && item.itemCode) {
        product = await Product.findOne({ itemCode: item.itemCode });
      }

      if (product) {
        const qtyNeeded = Number(item.quantity || 1);
        if (product.stock < qtyNeeded) {
          return res.status(400).json({
            success: false,
            message: `Insufficient stock for '${product.name}'. Available: ${product.stock}, Requested: ${qtyNeeded}`
          });
        }
      }
    }

    // 2. Freeze item snapshots with calculated total prices
    const frozenItems = items.map(item => ({
      productId: String(item.productId || item.id || item.itemCode),
      itemCode: item.itemCode,
      name: item.name,
      unitPrice: Number(item.unitPrice || item.price),
      quantity: Number(item.quantity || 1),
      image: item.image || '',
      totalPrice: Number(item.unitPrice || item.price) * Number(item.quantity || 1)
    }));

    // Calculate or verify total amount
    const calculatedTotal = frozenItems.reduce((acc, curr) => acc + curr.totalPrice, 0);

    // 3. Atomically decrement product stock
    for (const item of items) {
      const pId = item.productId || item.id || item.itemCode;
      const qtyNeeded = Number(item.quantity || 1);
      if (String(pId).match(/^[0-9a-fA-F]{24}$/)) {
        await Product.updateOne({ _id: pId }, { $inc: { stock: -qtyNeeded } });
      } else if (item.itemCode) {
        await Product.updateOne({ itemCode: item.itemCode }, { $inc: { stock: -qtyNeeded } });
      }
    }

    // 4. Create immutable order record
    const order = await Order.create({
      user: req.user._id,
      items: frozenItems,
      shippingAddress,
      paymentMethod: paymentMethod || 'COD',
      totalAmount: totalAmount || calculatedTotal,
      status: 'PENDING'
    });

    // Clean up cart items for this customer
    if (cartItemIds && cartItemIds.length > 0) {
      await CartItem.deleteMany({ _id: { $in: cartItemIds }, user: req.user._id });
    } else {
      // Clear entire cart if specific IDs weren't passed
      await CartItem.deleteMany({ user: req.user._id });
    }

    res.status(201).json(toOrderDto(order));
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user's order history
// @route   GET /api/orders
// @access  Private
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(orders.map(o => toOrderDto(o)));
  } catch (error) {
    next(error);
  }
};

// @desc    Get order details by ID (Anti-IDOR Protected)
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(404).json({ success: false, message: 'Invalid order ID format' });
    }

    const order = await Order.findById(id).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Anti-IDOR: Check if order belongs to authenticated user OR if user is admin
    const isOwner = order.user._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'ROLE_ADMIN';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: you do not have permission to view this order invoice'
      });
    }

    res.status(200).json(toOrderDto(order, isAdmin));
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders across all customers (Store Owner / Admin)
// @route   GET /api/orders/admin/all
// @access  Private/Admin
const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.status(200).json(orders.map(o => toOrderDto(o, true)));
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.status = status;
    await order.save();

    res.status(200).json(toOrderDto(order));
  } catch (error) {
    next(error);
  }
};

module.exports = { createOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus };
