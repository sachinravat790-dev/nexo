const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
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

const seedCoupons = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error('❌ MONGO_URI missing in server/.env');
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB for seeding coupons');

    // Purane coupons remove karo aur naye daalo
    await Coupon.deleteMany({});
    console.log('🗑️ Existing coupons cleared');

    await Coupon.insertMany(sampleCoupons);
    console.log(`✅ Successfully seeded ${sampleCoupons.length} coupons!`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding coupons:', error.message);
    process.exit(1);
  }
};

seedCoupons();
