const Order = require('../models/Order');

// @desc    Create New Order (Checkout)
// @route   POST /api/orders
exports.createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      couponCode,
      couponDiscount,
    } = req.body;

    // 1. Validation
    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ success: false, message: 'Your cart is empty. No items to order.' });
    }

    if (
      !shippingAddress ||
      !shippingAddress.fullName ||
      !shippingAddress.phone ||
      !shippingAddress.hostelOrAddress ||
      !shippingAddress.city ||
      !shippingAddress.pincode
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please complete all required shipping address fields (Name, Phone, Hostel/Address, City, Pincode).',
      });
    }

    // 2. Check if student role is verified for student pricing
    const isStudent =
      req.user &&
      (req.user.role === 'student' || req.user.studentDetails?.verificationStatus === 'approved');

    // 3. Price Calculation
    let itemsPrice = 0;
    let studentPriceTotal = 0;

    orderItems.forEach((item) => {
      itemsPrice += Number(item.price) * Number(item.quantity);
      studentPriceTotal += Number(item.studentPrice || item.price) * Number(item.quantity);
    });

    const activeBasePrice = isStudent ? studentPriceTotal : itemsPrice;
    const studentSavings = isStudent ? Math.max(0, itemsPrice - studentPriceTotal) : 0;
    const verifiedCouponDiscount = Number(couponDiscount) || 0;
    const totalPrice = Math.max(0, activeBasePrice - verifiedCouponDiscount);

    // 4. Create and Save Order
    const trackingNumber = `DLHVY-2026-${Math.floor(100000 + Math.random() * 900000)}`;

    const order = await Order.create({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod: paymentMethod || 'COD',
      paymentStatus: paymentMethod === 'UPI' ? 'paid' : 'pending',
      itemsPrice,
      studentSavings,
      couponCode: couponCode || null,
      couponDiscount: verifiedCouponDiscount,
      shippingPrice: 0, // 100% Free delivery for college students
      totalPrice,
      orderStatus: 'Processing',
      courierPartner: 'Delhivery Surface Express',
      trackingNumber,
      estimatedDelivery: new Date(+new Date() + 3 * 24 * 60 * 60 * 1000), // 3 days
    });

    res.status(201).json({
      success: true,
      message: '🎉 Order placed successfully! Tracking details generated.',
      order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to place order', error: error.message });
  }
};

// @desc    Get Logged-in User's Orders
// @route   GET /api/orders/my-orders
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch orders', error: error.message });
  }
};

// @desc    Get Single Order by ID
// @route   GET /api/orders/:id
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Only allow owner or admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Update Order Status (Admin)
// @route   PUT /api/orders/:id/status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.status(200).json({ success: true, message: 'Order status updated', order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
