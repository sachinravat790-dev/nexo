const Order = require('../models/Order');
const mongoose = require('mongoose');

// In-Memory Orders store for local resilience
const memoryOrders = [];

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

    const orderData = {
      _id: `ord_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod: paymentMethod || 'COD',
      paymentStatus: paymentMethod === 'UPI' ? 'paid' : 'pending',
      itemsPrice,
      studentSavings,
      couponCode: couponCode || null,
      couponDiscount: verifiedCouponDiscount,
      shippingPrice: 0,
      totalPrice,
      orderStatus: 'Processing',
      courierPartner: 'Delhivery Surface Express',
      trackingNumber,
      estimatedDelivery: new Date(+new Date() + 3 * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
    };

    if (mongoose.connection.readyState === 1) {
      try {
        const order = await Order.create(orderData);
        memoryOrders.unshift(order);
        return res.status(201).json({
          success: true,
          message: '🎉 Order placed successfully! Tracking details generated.',
          order,
        });
      } catch (dbErr) {
        console.log('MongoDB order create failed, saving to local memoryOrders');
      }
    }

    // Fallback to memory
    memoryOrders.unshift(orderData);

    res.status(201).json({
      success: true,
      message: '🎉 Order placed successfully! Tracking details generated.',
      order: orderData,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to place order', error: error.message });
  }
};

// @desc    Get Logged-in User's Orders
// @route   GET /api/orders/my-orders
exports.getMyOrders = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        if (orders && orders.length > 0) {
          return res.status(200).json({
            success: true,
            count: orders.length,
            orders,
          });
        }
      } catch (dbErr) {
        // Fallback below
      }
    }

    // Filter from memoryOrders
    const userOrders = memoryOrders.filter(
      (o) => o.user && o.user.toString() === req.user._id.toString()
    );

    res.status(200).json({
      success: true,
      count: userOrders.length,
      orders: userOrders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch orders', error: error.message });
  }
};

// @desc    Get Single Order by ID
// @route   GET /api/orders/:id
exports.getOrderById = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      try {
        const order = await Order.findById(req.params.id).populate('user', 'name email');
        if (order) return res.status(200).json({ success: true, order });
      } catch (dbErr) {}
    }

    const memOrder = memoryOrders.find((o) => o._id.toString() === req.params.id.toString());
    if (memOrder) return res.status(200).json({ success: true, order: memOrder });

    res.status(404).json({ success: false, message: 'Order not found' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Update Order Status (Admin)
// @route   PUT /api/orders/:id/status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;
    if (mongoose.connection.readyState === 1) {
      try {
        const order = await Order.findByIdAndUpdate(
          req.params.id,
          { orderStatus },
          { new: true }
        );
        if (order) return res.status(200).json({ success: true, message: 'Order status updated', order });
      } catch (dbErr) {}
    }

    const memOrder = memoryOrders.find((o) => o._id.toString() === req.params.id.toString());
    if (memOrder) {
      memOrder.orderStatus = orderStatus;
      return res.status(200).json({ success: true, message: 'Order status updated', order: memOrder });
    }

    res.status(404).json({ success: false, message: 'Order not found' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get All Orders across Platform (Admin Only)
// @route   GET /api/orders/all
exports.getAllOrders = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      try {
        const dbOrders = await Order.find().sort({ createdAt: -1 });
        if (dbOrders && dbOrders.length > 0) {
          return res.status(200).json({ success: true, count: dbOrders.length, orders: dbOrders });
        }
      } catch (dbErr) {
        // Fallback to memory
      }
    }

    res.status(200).json({
      success: true,
      count: memoryOrders.length,
      orders: memoryOrders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch all orders', error: error.message });
  }
};

// @desc    Get Admin Dashboard Analytics Stats
// @route   GET /api/orders/admin/stats
exports.getAdminStats = async (req, res) => {
  try {
    let allOrders = memoryOrders;

    if (mongoose.connection.readyState === 1) {
      try {
        const dbOrders = await Order.find();
        if (dbOrders && dbOrders.length > 0) {
          allOrders = dbOrders;
        }
      } catch (err) {}
    }

    const totalOrders = allOrders.length;
    const totalRevenue = allOrders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
    const totalStudentSavings = allOrders.reduce(
      (sum, o) => sum + ((o.studentSavings || 0) + (o.couponDiscount || 0)),
      0
    );

    res.status(200).json({
      success: true,
      stats: {
        totalOrders,
        totalRevenue,
        totalStudentSavings,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to load stats', error: error.message });
  }
};