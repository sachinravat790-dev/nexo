const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    discountType: {
      type: String,
      enum: ['percentage', 'flat'],
      default: 'flat', // 'flat' ₹ off ya 'percentage' % off
    },
    discountValue: {
      type: Number,
      required: true, // e.g. 500 (₹500 off) ya 10 (10% off)
    },
    minOrderValue: {
      type: Number,
      default: 0, // Minimum cart value required to use coupon
    },
    maxDiscount: {
      type: Number,
      default: null, // Cap for percentage discounts (e.g. max ₹1500)
    },
    isStudentOnly: {
      type: Boolean,
      default: true, // Sirf verified student role wale use kar sakte hain
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(+new Date() + 30 * 24 * 60 * 60 * 1000), // Default 30 days validity
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Coupon', couponSchema);
