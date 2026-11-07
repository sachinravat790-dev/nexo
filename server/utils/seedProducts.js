const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const Product = require('../models/Product');
const Category = require('../models/Category');

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/nexo_db';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB for seeding...');

    // Clear old data
    await Product.deleteMany();
    await Category.deleteMany();

    // 1. Create Categories
    const categories = await Category.insertMany([
      { name: 'Electronics', slug: 'electronics' },
      { name: 'Audio', slug: 'audio' },
      { name: 'Laptops', slug: 'laptops' },
      { name: 'Stationery', slug: 'stationery' },
      { name: 'Fashion & Bags', slug: 'fashion-bags' },
    ]);

    const [electronics, audio, laptops, stationery, fashion] = categories;

    // 2. Create Realistic Products with Flipkart-style Tags for Smart Search
    const products = [
      {
        title: 'boAt Rockerz 450 Bluetooth On-Ear Headphones',
        description: 'Up to 15 Hours Playback, 40mm Drivers, Padded Ear Cushions, Integrated Controls and Dual Modes.',
        brand: 'boAt',
        tags: ['headphones', 'headphone', 'earphone', 'bluetooth', 'wireless', 'music', 'audio', 'boat', 'rockerz', 'on-ear', 'bass'],
        originalPrice: 3990,
        price: 1499,
        studentPrice: 1199,
        category: audio._id,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
        images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'],
        stock: 25,
        rating: 4.6,
        numReviews: 1240,
        isStudentDeal: true,
      },
      {
        title: 'Apple MacBook Air M2 - 8GB / 256GB SSD (Midnight)',
        description: 'Supercharged by M2 chip. 13.6-inch Liquid Retina Display, 1080p FaceTime HD Camera, All-Day Battery Life. Best laptop for college students and coding.',
        brand: 'Apple',
        tags: ['laptop', 'macbook', 'apple', 'computer', 'coding', 'programming', 'college laptop', 'notebook', 'mac', 'ssd', 'm2'],
        originalPrice: 99900,
        price: 89900,
        studentPrice: 81900,
        category: laptops._id,
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80',
        images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800'],
        stock: 8,
        rating: 4.9,
        numReviews: 340,
        isStudentDeal: true,
      },
      {
        title: 'Wildcraft 35L Water Resistant College Backpack',
        description: 'Multi-compartment ergonomic backpack bag with dedicated 15.6 inch laptop sleeve and rain cover. Perfect college bag for students.',
        brand: 'Wildcraft',
        tags: ['bag', 'backpack', 'college bag', 'laptop bag', 'school bag', 'rucksack', 'travel bag', 'wildcraft', 'bags', 'rain cover'],
        originalPrice: 2499,
        price: 1299,
        studentPrice: 999,
        category: fashion._id,
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80',
        images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800'],
        stock: 50,
        rating: 4.4,
        numReviews: 890,
        isStudentDeal: true,
      },
      {
        title: 'Noise ColorFit Pulse 3 Smartwatch with 1.96" Display',
        description: 'Bluetooth Calling, 100+ Sports Modes, 7 Days Battery, Heart Rate & SpO2 Monitor. Best budget smartwatch for college.',
        brand: 'Noise',
        tags: ['watch', 'smartwatch', 'smart watch', 'fitness', 'tracker', 'bluetooth', 'calling watch', 'noise', 'wearable', 'sports'],
        originalPrice: 4999,
        price: 1599,
        studentPrice: 1299,
        category: electronics._id,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80',
        images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'],
        stock: 30,
        rating: 4.3,
        numReviews: 650,
        isStudentDeal: true,
      },
      {
        title: 'Classmate Pulse Spiral Bound Notebook (Pack of 6)',
        description: 'Single Line, 300 Pages each, Eco-friendly elemental chlorine-free paper for college note-taking and assignments.',
        brand: 'Classmate',
        tags: ['notebook', 'notes', 'register', 'copy', 'diary', 'writing', 'stationery', 'classmate', 'spiral', 'college notes', 'assignment'],
        originalPrice: 650,
        price: 499,
        studentPrice: 399,
        category: stationery._id,
        image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&q=80',
        images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800'],
        stock: 100,
        rating: 4.8,
        numReviews: 210,
        isStudentDeal: true,
      },
      {
        title: 'Logitech Pebble M350 Wireless Silent Mouse',
        description: 'Modern, Slim and Silent Bluetooth mouse with 18-month battery life for laptops and tablets. College essential.',
        brand: 'Logitech',
        tags: ['mouse', 'wireless mouse', 'bluetooth mouse', 'logitech', 'computer', 'accessory', 'silent', 'laptop mouse', 'usb'],
        originalPrice: 2295,
        price: 1495,
        studentPrice: 1195,
        category: electronics._id,
        image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&q=80',
        images: ['https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800'],
        stock: 40,
        rating: 4.7,
        numReviews: 430,
        isStudentDeal: true,
      },
      {
        title: 'Stainless Steel Insulated College Thermal Flask (750ml)',
        description: 'Double walled vacuum insulated bottle, keeps beverages hot for 12 hours and cold for 24 hours. Must-have for hostel life.',
        brand: 'Milton',
        tags: ['bottle', 'flask', 'water bottle', 'thermal', 'insulated', 'hot', 'cold', 'hostel', 'sipper', 'steel bottle', 'milton'],
        originalPrice: 1199,
        price: 699,
        studentPrice: 549,
        category: fashion._id,
        image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&q=80',
        images: ['https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800'],
        stock: 60,
        rating: 4.5,
        numReviews: 310,
        isStudentDeal: true,
      },
      {
        title: 'Sony WH-1000XM5 Wireless Active Noise Cancelling Headphones',
        description: 'Industry-leading noise cancellation with 2 processors, 8 microphones, 30hr battery with quick charge. Premium audio for music and calls.',
        brand: 'Sony',
        tags: ['headphones', 'headphone', 'earphone', 'sony', 'noise cancelling', 'anc', 'wireless', 'premium', 'bluetooth', 'music', 'audio', 'bass'],
        originalPrice: 34990,
        price: 26990,
        studentPrice: 23990,
        category: audio._id,
        image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&q=80',
        images: ['https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800'],
        stock: 12,
        rating: 4.9,
        numReviews: 520,
        isStudentDeal: true,
      },
    ];

    await Product.insertMany(products);
    console.log(`✅ Successfully seeded ${categories.length} Categories and ${products.length} Products with Smart Search Tags!`);
    process.exit();
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
