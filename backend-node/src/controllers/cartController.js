const CartItem = require('../models/CartItem');

/**
 * ════════════════════════════════════════════════════════════════════════════════
 * 🛒 CART CONTROLLER
 * ════════════════════════════════════════════════════════════════════════════════
 * 
 * 🎓 ARCHITECTURAL PATTERN: Anti-IDOR Ownership Verification
 * 
 * In Spring Boot CartService, we queried `findByIdAndUser(id, user)`.
 * In Node.js + Mongoose, we enforce `{ _id: id, user: req.user._id }` on every mutation.
 * This guarantees that User A cannot tamper with or delete User B's cart items.
 */

// Helper: map Mongoose doc to DTO shape expected by frontend
const toCartDto = (item) => ({
  id: item._id.toString(),
  productId: item.productId,
  itemCode: item.itemCode,
  name: item.name,
  unitPrice: item.unitPrice,
  quantity: item.quantity,
  image: item.image,
  totalPrice: item.unitPrice * item.quantity
});

// @desc    Get current user's cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res, next) => {
  try {
    const items = await CartItem.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(items.map(toCartDto));
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart (or increment quantity if already exists)
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res, next) => {
  try {
    const { productId, itemCode, name, price, unitPrice, quantity, image } = req.body;
    const finalUnitPrice = Number(unitPrice || price || 0);
    const finalQty = Number(quantity || 1);

    // Check if the item already exists in this user's cart
    let existingItem = await CartItem.findOne({
      user: req.user._id,
      $or: [{ productId: String(productId) }, { itemCode: itemCode }]
    });

    if (existingItem) {
      existingItem.quantity += finalQty;
      await existingItem.save();
    } else {
      await CartItem.create({
        user: req.user._id,
        productId: String(productId || itemCode),
        itemCode: itemCode || String(productId),
        name: name,
        unitPrice: finalUnitPrice,
        quantity: finalQty,
        image: image || ''
      });
    }

    // Return the updated cart
    const items = await CartItem.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(items.map(toCartDto));
  } catch (error) {
    next(error);
  }
};

// @desc    Update quantity of specific cart item
// @route   PUT /api/cart/:id
// @access  Private
const updateQuantity = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const newQty = Number(quantity);

    if (newQty < 1) {
      await CartItem.findOneAndDelete({ _id: id, user: req.user._id });
    } else {
      await CartItem.findOneAndUpdate(
        { _id: id, user: req.user._id },
        { quantity: newQty },
        { new: true }
      );
    }

    const items = await CartItem.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(items.map(toCartDto));
  } catch (error) {
    next(error);
  }
};

// @desc    Remove specific item from cart
// @route   DELETE /api/cart/:id
// @access  Private
const removeFromCart = async (req, res, next) => {
  try {
    const { id } = req.params;
    await CartItem.findOneAndDelete({ _id: id, user: req.user._id });

    const items = await CartItem.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(items.map(toCartDto));
  } catch (error) {
    next(error);
  }
};

// @desc    Clear entire shopping cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = async (req, res, next) => {
  try {
    await CartItem.deleteMany({ user: req.user._id });
    res.status(200).json({ success: true, message: 'Cart cleared successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCart, addToCart, updateQuantity, removeFromCart, clearCart };
