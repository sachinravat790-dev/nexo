const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1 },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  studentPrice: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orderItems: [orderItemSchema],
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      collegeName: { type: String, default: '' },
      hostelOrAddress: { type: String, required: true }, // e.g., "Hostel B, Room 214"
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      enum: ['COD', 'UPI'],
      default: 'COD',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid'],
      default: 'pending',
    },
    itemsPrice: {
      type: Number,
      required: true,
    },
    studentSavings: {
      type: Number,
      default: 0,
    },
    couponCode: {
      type: String,
      default: null,
    },
    couponDiscount: {
      type: Number,
      default: 0,
    },
    shippingPrice: {
      type: Number,
      default: 0,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    orderStatus: {
      type: String,
      enum: ['Processing', 'Packed', 'Dispatched', 'Out for Delivery', 'Delivered'],
      default: 'Processing',
    },
    courierPartner: {
      type: String,
      default: 'Delhivery Express',
    },
    trackingNumber: {
      type: String,
      default: () => `DLHVY-${Math.floor(100000 + Math.random() * 900000)}`,
    },
    estimatedDelivery: {
      type: Date,
      default: () => new Date(+new Date() + 3 * 24 * 60 * 60 * 1000), // 3 days campus delivery
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
