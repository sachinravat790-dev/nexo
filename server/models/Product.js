const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Product title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
    },
    brand: {
      type: String,
      default: '',
    },
    // Search Tags (Flipkart-style related keywords for smart search)
    tags: [
      {
        type: String,
        lowercase: true,
      },
    ],
    // Pricing
    originalPrice: {
      type: Number, // MRP (Jo kata hua dikhega: e.g. ₹2,999)
      required: true,
    },
    price: {
      type: Number, // Normal Customer Price: e.g. ₹1,499
      required: true,
    },
    studentPrice: {
      type: Number, // Exclusive Verified Student Price: e.g. ₹1,199
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
    },
    images: [
      {
        type: String,
      },
    ],
    stock: {
      type: Number,
      default: 10,
    },
    rating: {
      type: Number,
      default: 4.5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    isStudentDeal: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Fast text search index on title, description, brand & tags
productSchema.index({ title: 'text', description: 'text', brand: 'text' });

module.exports = mongoose.model('Product', productSchema);
