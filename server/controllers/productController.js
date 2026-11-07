const Product = require('../models/Product');
const Category = require('../models/Category');

// @desc    Get all products with Flipkart-style Smart Search, Category Filter, Price Range & Pagination
// @route   GET /api/products
exports.getProducts = async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, sort, page = 1, limit = 20 } = req.query;

    // 1. Build Query Object
    let query = {};

    // Flipkart-Style Smart Search (Title + Description + Tags dono me dhundho)
    if (search) {
      const searchTerms = search.trim().split(/\s+/); // "laptop bag" → ["laptop", "bag"]

      // Har word ke liye alag regex banao aur OR se match karo
      const orConditions = searchTerms.flatMap((term) => [
        { title: { $regex: term, $options: 'i' } },
        { description: { $regex: term, $options: 'i' } },
        { tags: { $regex: term, $options: 'i' } },
        { brand: { $regex: term, $options: 'i' } },
      ]);

      query.$or = orConditions;
    }

    // Filter by Category (by name or ObjectId)
    if (category && category !== 'All') {
      // Pehle category name se ObjectId dhundho
      const catDoc = await Category.findOne({
        $or: [
          { name: { $regex: category, $options: 'i' } },
          { slug: { $regex: category, $options: 'i' } },
        ],
      });

      if (catDoc) {
        query.category = catDoc._id;
      }
    }

    // Filter by Price Range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // 2. Sorting (Price low-to-high, high-to-low, newest, rating)
    let sortOption = { createdAt: -1 }; // Default: Newest first
    if (sort === 'price-low') sortOption = { price: 1 };
    if (sort === 'price-high') sortOption = { price: -1 };
    if (sort === 'rating') sortOption = { rating: -1 };
    if (sort === 'popularity') sortOption = { numReviews: -1 };

    // 3. Pagination
    const skip = (Number(page) - 1) * Number(limit);
    const totalProducts = await Product.countDocuments(query);

    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      count: products.length,
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: Number(page),
      products,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch products', error: error.message });
  }
};

// @desc    Get single product details by ID
// @route   GET /api/products/:id
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name');
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Invalid Product ID', error: error.message });
  }
};

// @desc    Create new product (Admin Only)
// @route   POST /api/products
exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, message: 'Product created successfully', product });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Failed to create product', error: error.message });
  }
};
