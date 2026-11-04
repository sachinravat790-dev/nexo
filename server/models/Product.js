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
    images: [
      {
        type: String,
        required: true,
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
      default: true, // Kya ispar student discount applicable hai?
    },
  },
  { timestamps: true }
);

// Search Indexing (Taaki title aur description me fast search ho sake)
productSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);