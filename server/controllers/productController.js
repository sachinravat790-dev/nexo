const Product = require('../models/Product');
const Category = require('../models/Category');

// Flipkart-Style Synonyms & E-Commerce Keyword Expansion
const SYNONYM_MAP = {
  bag: ['bag', 'backpack', 'pack', 'fashion', 'wildcraft'],
  bags: ['bag', 'backpack', 'pack', 'fashion', 'wildcraft'],
  backpack: ['backpack', 'bag', 'pack', 'wildcraft'],
  backpacks: ['backpack', 'bag', 'pack', 'wildcraft'],
  headphone: ['headphone', 'headphones', 'audio', 'earphone', 'rockerz', 'boat', 'sony'],
  headphones: ['headphone', 'headphones', 'audio', 'earphone', 'rockerz', 'boat', 'sony'],
  earphone: ['earphone', 'earphones', 'headphone', 'audio', 'boat'],
  earphones: ['earphone', 'earphones', 'headphone', 'audio', 'boat'],
  audio: ['audio', 'headphone', 'headphones', 'boat', 'sony'],
  laptop: ['laptop', 'laptops', 'macbook', 'apple', 'computer', 'air'],
  laptops: ['laptop', 'laptops', 'macbook', 'apple', 'computer', 'air'],
  mac: ['macbook', 'apple', 'laptop'],
  macbook: ['macbook', 'apple', 'laptop', 'air'],
  apple: ['apple', 'macbook', 'laptop'],
  watch: ['watch', 'smartwatch', 'noise', 'colorfit', 'pulse'],
  watches: ['watch', 'smartwatch', 'noise', 'colorfit', 'pulse'],
  smartwatch: ['smartwatch', 'watch', 'noise', 'colorfit'],
  notebook: ['notebook', 'classmate', 'pulse', 'spiral', 'book', 'copy', 'notes', 'stationery'],
  notebooks: ['notebook', 'classmate', 'pulse', 'spiral', 'book', 'copy', 'notes', 'stationery'],
  book: ['notebook', 'classmate', 'pulse', 'spiral', 'copy', 'notes', 'stationery'],
  books: ['notebook', 'classmate', 'pulse', 'spiral', 'copy', 'notes', 'stationery'],
  notes: ['notebook', 'classmate', 'pulse', 'spiral', 'notes', 'stationery'],
  copy: ['notebook', 'classmate', 'pulse', 'spiral', 'notes', 'stationery'],
  register: ['notebook', 'classmate', 'pulse', 'spiral', 'notes'],
  stationery: ['stationery', 'notebook', 'classmate', 'book'],
  mouse: ['mouse', 'logitech', 'pebble', 'wireless'],
  bottle: ['bottle', 'flask', 'thermal', 'milton', 'insulated'],
  bottles: ['bottle', 'flask', 'thermal', 'milton', 'insulated'],
  flask: ['flask', 'bottle', 'thermal', 'insulated'],
  boat: ['boat', 'rockerz', 'headphone', 'audio'],
  sony: ['sony', 'headphone', 'audio', 'wh-1000xm5', 'anc'],
  noise: ['noise', 'smartwatch', 'watch', 'pulse'],
  wildcraft: ['wildcraft', 'backpack', 'bag', 'pack'],
  classmate: ['classmate', 'notebook', 'spiral', 'notes'],
  logitech: ['logitech', 'mouse', 'pebble'],
};

// @desc    Get all products with Flipkart-style Smart Search, Category Filter & Pagination
// @route   GET /api/products
exports.getProducts = async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, sort, page = 1, limit = 20 } = req.query;

    let query = {};

    // 1. Category Filter (If user clicked a category pill)
    let explicitCategoryDoc = null;
    if (category && category !== 'All') {
      explicitCategoryDoc = await Category.findOne({
        $or: [
          { name: { $regex: category.trim(), $options: 'i' } },
          { slug: { $regex: category.trim(), $options: 'i' } },
        ],
      });
      if (explicitCategoryDoc) {
        query.category = explicitCategoryDoc._id;
      }
    }

    // 2. Flipkart-Style Smart Search
    if (search && search.trim()) {
      const rawTokens = search.trim().toLowerCase().split(/\s+/);

      // Expand each token using Synonym Dictionary
      const expandedTerms = new Set();
      rawTokens.forEach((tok) => {
        expandedTerms.add(tok);
        if (SYNONYM_MAP[tok]) {
          SYNONYM_MAP[tok].forEach((syn) => expandedTerms.add(syn));
        }
      });

      const termsList = Array.from(expandedTerms);

      // Also check if any term matches a Category Name in database (e.g. "Fashion & Bags", "Audio", "Laptops")
      const catOrConditions = termsList.map((term) => ({
        name: { $regex: term, $options: 'i' },
      }));
      const matchedCategories = await Category.find({ $or: catOrConditions }).select('_id');
      const matchedCatIds = matchedCategories.map((c) => c._id);

      // Build OR condition across Title, Description, Category, Brand, Tags
      const orClauses = [];

      termsList.forEach((term) => {
        orClauses.push({ title: { $regex: term, $options: 'i' } });
        orClauses.push({ description: { $regex: term, $options: 'i' } });
        orClauses.push({ brand: { $regex: term, $options: 'i' } });
        orClauses.push({ tags: { $regex: term, $options: 'i' } });
      });

      if (matchedCatIds.length > 0) {
        orClauses.push({ category: { $in: matchedCatIds } });
      }

      // Merge with existing category query if any
      if (query.category) {
        query = {
          $and: [{ category: query.category }, { $or: orClauses }],
        };
      } else {
        query.$or = orClauses;
      }
    }

    // 3. Price Filter
    if (minPrice || maxPrice) {
      const priceFilter = {};
      if (minPrice) priceFilter.$gte = Number(minPrice);
      if (maxPrice) priceFilter.$lte = Number(maxPrice);

      if (query.$and) {
        query.$and.push({ price: priceFilter });
      } else {
        query.price = priceFilter;
      }
    }

    // 4. Sorting Options
    let sortOption = { createdAt: -1 };
    if (sort === 'price-low') sortOption = { price: 1 };
    if (sort === 'price-high') sortOption = { price: -1 };
    if (sort === 'rating') sortOption = { rating: -1 };
    if (sort === 'popularity') sortOption = { numReviews: -1 };

    // 5. Pagination & Fetch
    const skip = (Number(page) - 1) * Number(limit);
    let totalProducts = await Product.countDocuments(query);
    let products = await Product.find(query)
      .populate('category', 'name slug')
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    // Fallback: If 0 products found on a specific search, return all available products so user isn't stuck with empty screen
    if (products.length === 0 && search) {
      console.log(`ℹ️ No exact matches for "${search}". Checking fallback recommendations.`);
    }

    res.status(200).json({
      success: true,
      count: products.length,
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit) || 1,
      currentPage: Number(page),
      products,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
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
