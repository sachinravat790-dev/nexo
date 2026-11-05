import { useEffect, useState } from 'react';
import Navbar from '../components/common/Navbar';
import ProductCard from '../components/product/ProductCard';
import Footer from '../components/common/Footer';
import { ArrowRight, Sparkles, GraduationCap, Laptop, Headphones, BookOpen, ShoppingBag } from 'lucide-react';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const fetchProducts = (query = '') => {
    setLoading(true);
    const url = query
      ? `http://localhost:8000/api/products?search=${query}`
      : 'http://localhost:8000/api/products';

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProducts(data.products);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearch = (text) => {
    setSearchQuery(text);
    fetchProducts(text);
  };

  const categories = [
    { name: 'All', icon: <Sparkles size={16} /> },
    { name: 'Laptops', icon: <Laptop size={16} /> },
    { name: 'Audio', icon: <Headphones size={16} /> },
    { name: 'Stationery', icon: <BookOpen size={16} /> },
    { name: 'Fashion & Bags', icon: <ShoppingBag size={16} /> },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', display: 'flex', flexDirection: 'column' }}>
      <Navbar onSearch={handleSearch} />

      <main style={{ maxWidth: '1360px', margin: '0 auto', width: '100%', padding: '24px 20px' }}>

        {/* 1. CLEAN ELEGANT HERO BANNER */}
        <div style={{
          background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)',
          borderRadius: '16px',
          padding: '40px 48px',
          color: '#FFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '24px',
          marginBottom: '32px',
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
              marginBottom: '14px'
            }}>
              <GraduationCap size={16} color="#A5B4FC" />
              <span>COLLEGE STUDENT DISCOUNT PROGRAM</span>
            </div>

            <h1 style={{ fontSize: '2.4rem', fontWeight: '800', lineHeight: '1.2', letterSpacing: '-0.5px' }}>
              Shop Smart. Live Better.<br />
              <span style={{ color: '#818CF8' }}>Save Extra with Verified Student ID</span>
            </h1>

            <p style={{ color: '#C7D2FE', fontSize: '1rem', marginTop: '12px', lineHeight: '1.6' }}>
              Get competitive market prices for everyone, plus exclusive student coupons on laptops, headphones, backpacks & books.
            </p>

            <button style={{
              marginTop: '20px',
              backgroundColor: '#4F46E5',
              color: '#FFF',
              padding: '12px 24px',
              borderRadius: '10px',
              fontWeight: '700',
              fontSize: '0.9rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'background 0.2s'
            }}>
              <span>Verify College ID Now</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Right Hero Graphic Card */}
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '14px',
            padding: '24px',
            width: '300px',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ fontSize: '0.75rem', color: '#A5B4FC', fontWeight: '700', textTransform: 'uppercase' }}>Student Privilege</div>
            <div style={{ fontSize: '1.3rem', fontWeight: '800', margin: '4px 0 12px 0' }}>NEXO PASS</div>
            <div style={{ fontSize: '0.85rem', color: '#E2E8F0', lineHeight: '1.5' }}>
              Instant verification with college ID card. Unlocks flat 15% to 25% off automatically.
            </div>
          </div>
        </div>

        {/* 2. CATEGORY FILTER PILLS (Clean & Simple) */}
        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '16px', marginBottom: '20px' }}>
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: '9999px',
                fontSize: '0.88rem',
                fontWeight: '600',
                backgroundColor: selectedCategory === cat.name ? '#0F172A' : '#FFFFFF',
                color: selectedCategory === cat.name ? '#FFFFFF' : '#475569',
                border: '1px solid #E2E8F0',
                boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                transition: 'all 0.2s'
              }}
            >
              {cat.icon}
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* 3. PRODUCTS GRID HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '18px' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0F172A' }}>
              {searchQuery ? `Search results for "${searchQuery}"` : 'Recommended For College Students'}
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '2px' }}>
              Showing verified deals with dual pricing
            </p>
          </div>
          <span style={{ fontSize: '0.85rem', color: '#4F46E5', fontWeight: '700' }}>
            {products.length} Products Found
          </span>
        </div>

        {/* 4. CLEAN PRODUCT GRID */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#64748B' }}>
            Loading products...
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#64748B' }}>
            No products found matching your search.
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