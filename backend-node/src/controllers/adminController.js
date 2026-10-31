const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

/**
 * ════════════════════════════════════════════════════════════════════════════════
 * 🛡️ ADMIN CONTROLLER (Store Management Back-Office)
 * ════════════════════════════════════════════════════════════════════════════════
 * 
 * 🎓 ARCHITECTURAL PATTERN: Role-Based Administration API
 * 
 * Matches Spring Boot's AdminController contract:
 * 1. Store dashboard statistics computation (Revenue, Orders, Products, Users)
 * 2. Unfiltered product catalog CRUD
 * 3. Store-wide order fulfillment and status transitions
 * 4. User profile inspection (without credential leakage)
 */

// Helper to convert Mongoose Product document into standard Frontend Product DTO
const toProductDto = (p) => {
  let specsStr = '';
  if (typeof p.specs === 'string') {
    specsStr = p.specs;
  } else if (p.specs && typeof p.specs === 'object') {
    if (p.specs instanceof Map) {
      specsStr = Array.from(p.specs.entries()).map(([k, v]) => `${k}: ${v}`).join(', ');
    } else if (p.specs.details) {
      specsStr = p.specs.details;
    } else {
      specsStr = Object.entries(p.specs).map(([k, v]) => `${k}: ${v}`).join(', ');
    }
  }

  const primaryImage = p.image || p.imageUrl || '/images/images.jpg';

  return {
    id: p._id.toString(),
    itemCode: p.itemCode,
    name: p.name,
    brand: p.brand,
    category: p.category,
    subCategory: p.subCategory || '',
    price: p.price,
    originalPrice: p.originalPrice || p.price,
    discount: p.discount || '',
    specs: specsStr,
    image: primaryImage,
    imageUrl: primaryImage,
    description: p.description || '',
    stock: p.stock ?? 0,
    badge: p.badge || '',
    rating: p.rating || 0,
    reviewsCount: p.reviewsCount || 0,
    reviewCount: p.reviewsCount || 0,
    isFeatured: Boolean(p.isFeatured),
    images: p.images && p.images.length > 0 ? p.images : [primaryImage]
  };
};

// Helper to convert Mongoose Order document into Frontend Order DTO with customer enrichment
const toOrderDto = (order) => ({
  id: order._id.toString(),
  userId: order.user ? (order.user._id ? order.user._id.toString() : order.user.toString()) : null,
  customerName: order.user?.name || order.shippingAddress?.fullName || 'Customer',
  customerEmail: order.user?.email || 'N/A',
  items: order.items.map((it) => ({
    productId: it.productId,
    itemCode: it.itemCode,
    name: it.name,
    price: it.unitPrice,
    unitPrice: it.unitPrice,
    quantity: it.quantity,
    image: it.image || '',
    totalPrice: it.totalPrice || (it.unitPrice * it.quantity)
  })),
  shippingAddress: order.shippingAddress,
  paymentMethod: order.paymentMethod,
  totalAmount: order.totalAmount,
  status: order.status,
  createdAt: order.createdAt
});

// ════════════════════════════════════════════════════════════════════════════════
// 📊 DASHBOARD STATISTICS
// ════════════════════════════════════════════════════════════════════════════════

// @desc    Get store dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getStats = async (req, res, next) => {
  try {
    const allOrders = await Order.find();

    // Calculate total revenue from non-cancelled orders
    const totalRevenue = allOrders
      .filter((o) => o.status !== 'CANCELLED')
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    const pendingOrders = allOrders.filter((o) => o.status === 'PENDING').length;
    const totalOrders = allOrders.length;
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments();

    res.status(200).json({
      totalRevenue,
      totalOrders,
      pendingOrders,
      totalProducts,
      totalUsers
    });
  } catch (error) {
    next(error);
  }
};

// ════════════════════════════════════════════════════════════════════════════════
// 💻 PRODUCT MANAGEMENT (Full Catalog CRUD)
// ════════════════════════════════════════════════════════════════════════════════

// @desc    Get all products without pagination/filtering for Admin table
// @route   GET /api/admin/products
// @access  Private/Admin
const getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(products.map(toProductDto));
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new product in the catalog
// @route   POST /api/admin/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
  try {
    const {
      itemCode,
      name,
      brand,
      category,
      subCategory,
      price,
      originalPrice,
      discount,
      specs,
      image,
      imageUrl,
      description,
      stock,
      badge
    } = req.body;

    if (!itemCode || !name || !brand || !category || price === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Please provide itemCode, name, brand, category, and price'
      });
    }

    const existing = await Product.findOne({ itemCode: itemCode.trim() });
    if (existing) {
      return res.status(400).json({
        success: false,
        error: `A product with item code '${itemCode}' already exists`
      });
    }

    const finalImage = image || imageUrl || '/images/images.jpg';

    const product = await Product.create({
      itemCode: itemCode.trim(),
      name: name.trim(),
      brand: brand.trim(),
      category: category.trim(),
      subCategory: subCategory ? subCategory.trim() : '',
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : Number(price),
      discount: discount || '',
      specs: typeof specs === 'string' ? { details: specs } : (specs || {}),
      image: finalImage,
      imageUrl: finalImage,
      images: [finalImage],
      description: description || '',
      stock: Number(stock !== undefined ? stock : 10),
      badge: badge || ''
    });

    res.status(201).json(toProductDto(product));
  } catch (error) {
    next(error);
  }
};

// @desc    Update an existing product
// @route   PUT /api/admin/products/:id
// @access  Private/Admin
const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    let product = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(id);
    }
    if (!product) {
      product = await Product.findOne({ itemCode: id });
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    const {
      name,
      brand,
      category,
      subCategory,
      price,
      originalPrice,
      discount,
      specs,
      image,
      imageUrl,
      description,
      stock,
      badge,
      isFeatured,
      rating,
      reviewsCount
    } = req.body;

    if (name !== undefined) product.name = name;
    if (brand !== undefined) product.brand = brand;
    if (category !== undefined) product.category = category;
    if (subCategory !== undefined) product.subCategory = subCategory;
    if (price !== undefined) product.price = Number(price);
    if (originalPrice !== undefined) product.originalPrice = Number(originalPrice);
    if (discount !== undefined) product.discount = discount;
    if (description !== undefined) product.description = description;
    if (stock !== undefined) product.stock = Number(stock);
    if (badge !== undefined) product.badge = badge;
    if (isFeatured !== undefined) product.isFeatured = Boolean(isFeatured);
    if (rating !== undefined) product.rating = Number(rating);
    if (reviewsCount !== undefined) product.reviewsCount = Number(reviewsCount);

    if (image || imageUrl) {
      const finalImage = image || imageUrl;
      product.image = finalImage;
      product.imageUrl = finalImage;
      if (!product.images || product.images.length === 0) {
        product.images = [finalImage];
      }
    }

    if (specs !== undefined) {
      product.specs = typeof specs === 'string' ? { details: specs } : specs;
    }

    await product.save();

    res.status(200).json(toProductDto(product));
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product from the catalog
// @route   DELETE /api/admin/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    let product = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(id);
    }
    if (!product) {
      product = await Product.findOne({ itemCode: id });
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    await product.deleteOne();
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

// ════════════════════════════════════════════════════════════════════════════════
// 📦 ORDER MANAGEMENT (Fulfillment & Status Transitions)
// ════════════════════════════════════════════════════════════════════════════════

// @desc    Get all orders across all customers (newest first)
// @route   GET /api/admin/orders
// @access  Private/Admin
const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(orders.map(toOrderDto));
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/admin/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(404).json({
        success: false,
        error: 'Invalid order ID format'
      });
    }

    const order = await Order.findById(id).populate('user', 'name email');
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    order.status = status;
    await order.save();

    res.status(200).json(toOrderDto(order));
  } catch (error) {
    next(error);
  }
};

// ════════════════════════════════════════════════════════════════════════════════
// 👥 USER MANAGEMENT
// ════════════════════════════════════════════════════════════════════════════════

// @desc    Get all registered users (excluding password hashes)
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    res.status(200).json(
      users.map((u) => ({
        id: u._id.toString(),
        name: u.name,
        email: u.email,
        role: u.role,
        createdAt: u.createdAt
      }))
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStats,
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllOrders,
  updateOrderStatus,
  getAllUsers
};
