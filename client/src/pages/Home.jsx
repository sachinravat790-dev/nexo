import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import ProductCard from '../components/product/ProductCard';
import Footer from '../components/common/Footer';
import apiClient from '../api/apiClient';
import {
  ArrowRight,
  Sparkles,
  GraduationCap,
  Laptop,
  Headphones,
  BookOpen,
  ShoppingBag,
  Footprints,
  Shirt,
  Watch,
  Smartphone
} from 'lucide-react';

export default function Home() {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const fetchProducts = (query = '', category = 'All') => {
    setLoading(true);
    const params = new URLSearchParams();
    if (query) params.append('search', query);
    if (category && category !== 'All') params.append('category', category);
    params.append('limit', '100'); // Saare 65+ Flipkart products load honge

    apiClient
      .get(`/products?${params.toString()}`)
      .then((res) => {
        if (res.data.success) {
          setProducts(res.data.products);
        }
      })
      .catch((err) => {
        console.error('Fetch products error:', err);
      })
      .finally(() => setLoading(false));
  };

  // Sync with URL query parameter or mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchFromUrl = params.get('search');
    if (searchFromUrl) {
      setSearchQuery(searchFromUrl);
      setSelectedCategory('All');
      fetchProducts(searchFromUrl, 'All');
    } else {
      fetchProducts();
    }
  }, [location.search]);

  const handleSearch = (text) => {
    setSearchQuery(text);
    setSelectedCategory('All');
    fetchProducts(text, 'All');
  };

  const handleCategoryClick = (catName) => {
    setSelectedCategory(catName);
    setSearchQuery('');
    fetchProducts('', catName);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    fetchProducts('', 'All');
  };

  // Flipkart Departments Category Pills
  const categories = [
    { name: 'All', icon: <Sparkles size={15} /> },
    { name: 'Bags & Backpacks', icon: <ShoppingBag size={15} /> },
    { name: 'Footwear & Shoes', icon: <Footprints size={15} /> },
    { name: 'Audio & Wearables', icon: <Headphones size={15} /> },
    { name: 'Fashion & Apparel', icon: <Shirt size={15} /> },
    { name: 'Watches & Wearables', icon: <Watch size={15} /> },
    { name: 'Laptops', icon: <Laptop size={15} /> },
    { name: 'Mobiles & Accessories', icon: <Smartphone size={15} /> },
    { name: 'Study & Stationery', icon: <BookOpen size={15} /> },
  ];

  // Quick Trending Search Tags (Flipkart Style)
  const quickSearches = [
    { label: '🎒 Bags', term: 'bag' },
    { label: '👟 Shoes', term: 'shoes' },
    { label: '🎧 boAt Audio', term: 'boat' },
    { label: '👕 T-Shirts', term: 'tshirt' },
    { label: '⌚ Smartwatches', term: 'watch' },
    { label: '💻 Laptops', term: 'laptop' },
    { label: '📱 Mobiles', term: 'phone' },
    { label: '📚 Notebooks', term: 'stationery' },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', display: 'flex', flexDirection: 'column' }}>
      <Navbar onSearch={handleSearch} />

      <main style={{ maxWidth: '1360px', margin: '0 auto', width: '100%', padding: '24px 20px', flex: 1 }}>

        {/* 1. CLEAN ELEGANT HERO BANNER */}
        <div style={{
          background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)',
          borderRadius: '16px',
          padding: '36px 40px',
          color: '#FFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '24px',
          marginBottom: '26px',
          boxShadow: '0 4px 20px rgba(30, 27, 75, 0.15)'
        }}>
          <div style={{ maxWidth: '640px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              padding: '6px 14px',
              borderRadius: '9999px',
              fontSize: '0.8rem',
              fontWeight: '600',
              marginBottom: '12px'
            }}>
              <GraduationCap size={16} color="#A5B4FC" />
              <span>COLLEGE STUDENT DISCOUNT PROGRAM</span>
            </div>

            <h1 style={{ fontSize: '2.2rem', fontWeight: '800', lineHeight: '1.2', letterSpacing: '-0.5px' }}>
              Shop Smart. Live Better.<br />
              <span style={{ color: '#818CF8' }}>Flipkart Market Prices + Student Savings</span>
            </h1>

            <p style={{ color: '#C7D2FE', fontSize: '0.95rem', marginTop: '10px', lineHeight: '1.6' }}>
              Authentic Indian market prices on Skybags, Asian sneakers, boAt, Allen Solly, HP laptops & Apple gear — with instant extra discounts on Student ID.
            </p>

            <Link
              to="/student-verify"
              style={{
                marginTop: '18px',
                backgroundColor: '#4F46E5',
                color: '#FFF',
                padding: '10px 22px',
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '0.88rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                textDecoration: 'none',
                transition: 'background 0.2s'
              }}
            >
              <span>Verify College ID Now</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Right Hero Graphic Card */}
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '12px',
            padding: '20px 24px',
            width: '290px',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ fontSize: '0.72rem', color: '#A5B4FC', fontWeight: '700', textTransform: 'uppercase' }}>
              Student Privilege
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: '800', margin: '4px 0 8px 0' }}>
              NEXO STUDENT PASS
            </div>
            <div style={{ fontSize: '0.82rem', color: '#E2E8F0', lineHeight: '1.5' }}>
              Get extra 10% to 20% off with coupon <b>STUDENT10</b> or <b>STUDENT500</b> at checkout!
            </div>
          </div>
        </div>

        {/* 2. CATEGORY FILTER PILLS (Flipkart Departments) */}
        <div style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '12px',
          marginBottom: '18px'
        }}>
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => handleCategoryClick(cat.name)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '9999px',
                fontSize: '0.84rem',
                fontWeight: '600',
                whiteSpace: 'nowrap',
                backgroundColor: selectedCategory === cat.name ? '#0F172A' : '#FFFFFF',
                color: selectedCategory === cat.name ? '#FFFFFF' : '#475569',
                border: '1px solid #E2E8F0',
                boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {cat.icon}
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* 3. QUICK TRENDING SEARCH CHIPS */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexWrap: 'wrap',
          marginBottom: '20px',
          padding: '8px 12px',
          backgroundColor: '#F1F5F9',
          borderRadius: '8px'
        }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#475569', textTransform: 'uppercase' }}>
            Trending:
          </span>
          {quickSearches.map((qs) => (
            <button
              key={qs.term}
              onClick={() => handleSearch(qs.term)}
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #CBD5E1',
                borderRadius: '6px',
                padding: '3px 10px',
                fontSize: '0.75rem',
                fontWeight: '600',
                color: '#334155',
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = '#0F172A';
                e.target.style.color = '#0F172A';
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = '#CBD5E1';
                e.target.style.color = '#334155';
              }}
            >
              {qs.label}
            </button>
          ))}
        </div>

        {/* 4. PRODUCTS GRID HEADER */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginBottom: '16px',
          borderBottom: '1px solid #E2E8F0',
          paddingBottom: '10px'
        }}>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#0F172A', margin: 0 }}>
              {searchQuery
                ? `Results for "${searchQuery}"`
                : selectedCategory !== 'All'
                ? `${selectedCategory} Deals`
                : 'Top Verified Deals on NEXO'}
            </h2>
            <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '3px 0 0 0' }}>
              Flipkart India Selling Prices • Exclusive Verified Student Discounts
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {(searchQuery || selectedCategory !== 'All') && (
              <button
                onClick={handleClearSearch}
                style={{
                  background: '#F1F5F9',
                  border: '1px solid #CBD5E1',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: '#475569',
                  cursor: 'pointer'
                }}
              >
                ✕ Clear All
              </button>
            )}
            <span style={{
              fontSize: '0.85rem',
              color: '#059669',
              fontWeight: '800',
              backgroundColor: '#ECFDF5',
              padding: '3px 8px',
              borderRadius: '6px'
            }}>
              {products.length} Products Available
            </span>
          </div>
        </div>

        {/* 5. PRODUCT GRID */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#64748B' }}>
            Loading products...
          </div>
        ) : products.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid #E2E8F0'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🔍</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#0F172A', marginBottom: '6px' }}>
              No products found {searchQuery ? `for "${searchQuery}"` : ''}
            </h3>
            <p style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: '16px' }}>
              Try clicking one of the trending chips above: Bags, Shoes, boAt, T-Shirts, Watches, or Laptops!
            </p>
            <button
              onClick={handleClearSearch}
              style={{
                backgroundColor: '#0F172A',
                color: '#FFF',
                padding: '10px 20px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: '700',
                cursor: 'pointer',
                border: 'none'
              }}
            >
              Clear Search & View All Products
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '20px',
            marginBottom: '40px'
          }}>
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}