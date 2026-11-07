const Coupon = require('../models/Coupon');

const sampleCoupons = [
  {
    code: 'STUDENT500',
    description: 'Flat ₹500 discount for verified college students on orders above ₹1,999',
    discountType: 'flat',
    discountValue: 500,
    minOrderValue: 1999,
    isStudentOnly: true,
    isActive: true,
  },
  {
    code: 'STUDENT10',
    description: 'Extra 10% discount for verified students (Max ₹1,500)',
    discountType: 'percentage',
    discountValue: 10,
    minOrderValue: 999,
    maxDiscount: 1500,
    isStudentOnly: true,
    isActive: true,
  },
  {
    code: 'NEXO100',
    description: 'Welcome gift: Flat ₹100 off on your first NEXO purchase',
    discountType: 'flat',
    discountValue: 100,
    minOrderValue: 499,
    isStudentOnly: false,
    isActive: true,
  },
  {
    code: 'CAMPUSBOOST',
    description: 'Big Campus Deal: Flat ₹1,000 off on college essentials above ₹9,999',
    discountType: 'flat',
    discountValue: 1000,
    minOrderValue: 9999,
    isStudentOnly: true,
    isActive: true,
  },
];

// Helper: Auto-seed if coupons collection is empty
const ensureCouponsSeeded = async () => {
  try {
    const count = await Coupon.countDocuments();
    if (count === 0) {
      await Coupon.insertMany(sampleCoupons);
      console.log('✅ Auto-seeded initial discount coupons into database');
    }
  } catch (err) {
    console.log('ℹ️ Coupon auto-seed skipped or pending DB connection');
  }
};

// @desc    Apply and Validate a Coupon Code
// @route   POST /api/coupons/apply
exports.applyCoupon = async (req, res) => {
  try {
    await ensureCouponsSeeded();

    const { code, cartTotal } = req.body;

    if (!code) {
      return res.status(400).json({ success: false, message: 'Please provide a coupon code' });
    }

    if (!cartTotal || cartTotal <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid cart total amount' });
    }

    const cleanCode = code.trim().toUpperCase();

    // 1. Database se coupon dhundho
    const coupon = await Coupon.findOne({ code: cleanCode, isActive: true });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Invalid coupon code. Try STUDENT500 or STUDENT10!',
      });
    }

    // 2. Expiry check
    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'This coupon has expired.',
      });
    }

    // 3. Student exclusivity check
    if (coupon.isStudentOnly) {
      const isVerifiedStudent =
        req.user &&
        (req.user.role === 'student' || req.user.studentDetails?.verificationStatus === 'approved');

      if (!isVerifiedStudent) {
        return res.status(403).json({
          success: false,
          message:
            '🎓 This coupon is exclusive to Verified College Students. Please verify your College ID first!',
        });
      }
    }

    // 4. Minimum order value check
    if (cartTotal < coupon.minOrderValue) {
      return res.status(400).json({
        success: false,
        message: `This coupon requires a minimum order value of ₹${coupon.minOrderValue.toLocaleString(
          'en-IN'
        )}.`,
      });
    }

    // 5. Calculate discount amount
    let discountAmount = 0;
    if (coupon.discountType === 'flat') {
      discountAmount = Math.min(coupon.discountValue, cartTotal);
    } else if (coupon.discountType === 'percentage') {
      discountAmount = Math.round((cartTotal * coupon.discountValue) / 100);
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    }

    const finalAmount = Math.max(0, cartTotal - discountAmount);

    res.status(200).json({
      success: true,
      message: `🎉 Coupon '${coupon.code}' applied! You saved ₹${discountAmount.toLocaleString(
        'en-IN'
      )}.`,
      coupon: {
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount,
        finalAmount,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to apply coupon', error: error.message });
  }
};

// @desc    Get All Active Public Coupons
// @route   GET /api/coupons
exports.getAllCoupons = async (req, res) => {
  try {
    await ensureCouponsSeeded();
    const coupons = await Coupon.find({ isActive: true }).select(
      'code description discountType discountValue minOrderValue isStudentOnly expiresAt'
    );
    res.status(200).json({ success: true, count: coupons.length, coupons });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
