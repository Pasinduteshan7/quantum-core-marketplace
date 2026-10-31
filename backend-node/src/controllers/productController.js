const Product = require('../models/Product');

/**
 * ════════════════════════════════════════════════════════════════════════════════
 * 💻 PRODUCT CONTROLLER
 * ════════════════════════════════════════════════════════════════════════════════
 * 
 * 🎓 ARCHITECTURAL PATTERN: Dynamic Query Builder (Specification Pattern)
 * 
 * In Spring Boot, dynamic multi-field filtering is implemented using JPA Specifications
 * or QueryDSL predicates.
 * In Node.js + Mongoose, we construct a flexible MongoDB query object dynamically.
 */

// @desc    Fetch all products with faceted filtering, search, and sorting
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const { category, brand, search, minPrice, maxPrice, sort } = req.query;

    // 1. Build Dynamic MongoDB Filter
    const query = {};

    // Category filter (case-insensitive regex)
    if (category && category.toLowerCase() !== 'all') {
      query.category = { $regex: new RegExp(category, 'i') };
    }

    // Brand filter (case-insensitive regex)
    if (brand && brand.toLowerCase() !== 'all') {
      query.brand = { $regex: new RegExp(brand, 'i') };
    }

    // Price range filters
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Full-Text Search across name, brand, or itemCode
    if (search && search.trim() !== '') {
      const searchRegex = { $regex: new RegExp(search.trim(), 'i') };
      query.$or = [
        { name: searchRegex },
        { brand: searchRegex },
        { itemCode: searchRegex },
        { description: searchRegex }
      ];
    }

    // 2. Build Sort Order
    let sortOption = { createdAt: -1 }; // Default: newest first
    if (sort === 'price_asc') sortOption = { price: 1 };
    if (sort === 'price_desc') sortOption = { price: -1 };
    if (sort === 'rating') sortOption = { rating: -1 };

    // 3. Execute Query with Mongoose
    const products = await Product.find(query).sort(sortOption);
    const total = await Product.countDocuments(query);

    // Return format matches frontend expectations
    res.status(200).json({
      products: products.map((p) => {
        const primaryImage = p.image || p.imageUrl || '/images/images.jpg';
        let specsStr = '';
        if (typeof p.specs === 'string') {
          specsStr = p.specs;
        } else if (p.specs && typeof p.specs === 'object') {
          specsStr = p.specs.details || Object.entries(p.specs).map(([k, v]) => `${k}: ${v}`).join(', ');
        }

        return {
          id: p._id.toString(),
          name: p.name,
          itemCode: p.itemCode,
          brand: p.brand,
          category: p.category,
          subCategory: p.subCategory || '',
          price: p.price,
          originalPrice: p.originalPrice || p.price,
          discount: p.discount || '',
          stock: p.stock ?? 0,
          rating: p.rating || 0,
          reviewsCount: p.reviewsCount || 0,
          reviewCount: p.reviewsCount || 0,
          isFeatured: Boolean(p.isFeatured),
          image: primaryImage,
          imageUrl: primaryImage,
          images: p.images && p.images.length > 0 ? p.images : [primaryImage],
          description: p.description || '',
          specs: specsStr,
          badge: p.badge || ''
        };
      }),
      total
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Fetch single product by ID or SKU itemCode
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    let product = null;

    // Check if valid MongoDB ObjectId (24 hex characters)
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(id);
    }

    // Fallback: If not found by ObjectId, search by SKU itemCode (e.g. "MSI-THIN-15")
    if (!product) {
      product = await Product.findOne({ itemCode: id });
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const primaryImage = product.image || product.imageUrl || '/images/images.jpg';
    let specsStr = '';
    if (typeof product.specs === 'string') {
      specsStr = product.specs;
    } else if (product.specs && typeof product.specs === 'object') {
      specsStr = product.specs.details || Object.entries(product.specs).map(([k, v]) => `${k}: ${v}`).join(', ');
    }

    res.status(200).json({
      id: product._id.toString(),
      name: product.name,
      itemCode: product.itemCode,
      brand: product.brand,
      category: product.category,
      subCategory: product.subCategory || '',
      price: product.price,
      originalPrice: product.originalPrice || product.price,
      discount: product.discount || '',
      stock: product.stock ?? 0,
      rating: product.rating || 0,
      reviewsCount: product.reviewsCount || 0,
      reviewCount: product.reviewsCount || 0,
      isFeatured: Boolean(product.isFeatured),
      image: primaryImage,
      imageUrl: primaryImage,
      images: product.images && product.images.length > 0 ? product.images : [primaryImage],
      description: product.description || '',
      specs: specsStr,
      badge: product.badge || ''
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
  try {
    const finalImage = req.body.image || req.body.imageUrl || '/images/images.jpg';
    const product = await Product.create({
      ...req.body,
      image: finalImage,
      imageUrl: finalImage,
      images: req.body.images && req.body.images.length > 0 ? req.body.images : [finalImage],
      specs: typeof req.body.specs === 'string' ? { details: req.body.specs } : (req.body.specs || {})
    });
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

// @desc    Update an existing product
// @route   PUT /api/products/:id
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
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    Object.assign(product, req.body);
    if (req.body.image || req.body.imageUrl) {
      const finalImage = req.body.image || req.body.imageUrl;
      product.image = finalImage;
      product.imageUrl = finalImage;
    }
    if (typeof req.body.specs === 'string') {
      product.specs = { details: req.body.specs };
    }

    await product.save();
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
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
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await product.deleteOne();
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
