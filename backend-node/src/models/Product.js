const mongoose = require('mongoose');

/**
 * ════════════════════════════════════════════════════════════════════════════════
 * 💻 PRODUCT DOMAIN MODEL (Mongoose Schema)
 * ════════════════════════════════════════════════════════════════════════════════
 * 
 * 🎓 ARCHITECTURAL ADVANTAGE: Native BSON vs ORM Impedance Mismatch
 * 
 * In Spring Boot (PostgreSQL), storing arbitrary hardware specs (GPU, RAM, VRAM,
 * Refresh Rate) and an array of image URLs required either:
 * - A secondary relational table with foreign keys, or
 * - A proprietary PostgreSQL JSONB column with custom Hibernate converters.
 * 
 * In MongoDB, JSON is the first-class citizen (BSON). Complex hardware specs
 * and arrays of strings store natively without schema friction.
 */

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true
    },
    itemCode: {
      type: String,
      required: [true, 'Item code / SKU is required'],
      unique: true,
      trim: true,
      index: true
    },
    brand: {
      type: String,
      required: [true, 'Brand is required'],
      trim: true,
      index: true // Indexed for fast faceted filtering on /laptops and /computers
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      index: true // Indexed for fast category lookups
    },
    subCategory: {
      type: String,
      default: '',
      trim: true
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative']
    },
    originalPrice: {
      type: Number,
      default: 0
    },
    discount: {
      type: String,
      default: ''
    },
    badge: {
      type: String,
      default: ''
    },
    stock: {
      type: Number,
      required: [true, 'Stock inventory is required'],
      default: 0,
      min: [0, 'Stock cannot be negative']
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    reviewsCount: {
      type: Number,
      default: 0
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    image: {
      type: String,
      default: ''
    },
    imageUrl: {
      type: String,
      default: ''
    },
    images: {
      type: [String],
      default: []
    },
    description: {
      type: String,
      default: ''
    },
    specs: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: true
  }
);

// Pre-validation: ensure image and imageUrl are synchronized
productSchema.pre('validate', function (next) {
  if (!this.imageUrl && this.image) {
    this.imageUrl = this.image;
  }
  if (!this.image && this.imageUrl) {
    this.image = this.imageUrl;
  }
  if (!this.imageUrl && !this.image) {
    this.imageUrl = '/images/images.jpg';
    this.image = '/images/images.jpg';
  }
  next();
});

// Compound text index for full-text search across name, brand, category, and description
productSchema.index({ name: 'text', brand: 'text', description: 'text' });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
