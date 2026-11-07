import { useState, useRef, useEffect } from 'react';
import { Search, MapPin, ShoppingCart, Menu, GraduationCap, ChevronDown, LogOut, ArrowUpRight, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';

const POPULAR_SEARCHES = [
  { label: 'MacBook Air M2', query: 'mac' },
  { label: 'College Backpack Bags', query: 'bag' },
  { label: 'boAt Rockerz Headphones', query: 'headphone' },
  { label: 'Sony WH-1000XM5 ANC', query: 'sony' },
  { label: 'Puma & Nike College Shoes', query: 'shoes' },
  { label: 'Noise Smartwatch', query: 'watch' },
  { label: 'Classmate Notebooks & Notes', query: 'notes' },
  { label: 'Milton Insulated Thermal Flask', query: 'bottle' },
  { label: 'Apple iPhone 15', query: 'iphone' },
  { label: 'Logitech Wireless Mouse', query: 'mouse' },
  { label: 'College Fleece Hoodie', query: 'hoodie' },
];

export default function Navbar({ onSearch }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { totalItems, setIsCartOpen } = useCart();
  const [searchInput, setSearchInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const searchContainerRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setIsFocused(false);
    if (!searchInput.trim()) return;

    if (onSearch) {
      onSearch(searchInput.trim());
    } else {
      navigate(`/?search=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  const handleSelectSuggestion = (query) => {
    setSearchInput(query);
    setIsFocused(false);
    if (onSearch) {
      onSearch(query);
    } else {
      navigate(`/?search=${encodeURIComponent(query)}`);
    }
  };

  // Filter suggestions based on input
  const filteredSuggestions = searchInput.trim()
    ? POPULAR_SEARCHES.filter((s) =>
        s.label.toLowerCase().includes(searchInput.toLowerCase()) ||
        s.query.toLowerCase().includes(searchInput.toLowerCase())
      )
    : POPULAR_SEARCHES.slice(0, 6);

  return (
    <header style={{ width: '100%', position: 'sticky', top: 0, zIndex: 100 }}>
      {/* 1. Main Amazon Top Navy Bar */}
      <div style={{
        backgroundColor: '#131921',
        padding: '10px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        color: '#FFF'
      }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', padding: '4px 8px' }}>
          <span style={{ fontSize: '1.6rem', fontWeight: '900', letterSpacing: '-0.5px', color: '#FFF' }}>
            nexo<span style={{ color: '#FF9900' }}>.in</span>
          </span>
        </Link>

        {/* Deliver To Location */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', padding: '4px 8px' }}>
          <MapPin size={18} color="#CCCCCC" />
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.2' }}>
            <span style={{ fontSize: '0.72rem', color: '#CCCCCC' }}>Deliver to College</span>
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#FFF' }}>Hostel / Campus</span>
          </div>
        </div>

        {/* Amazon-Style Wide Search Bar with Live Suggestion Dropdown */}
        <div ref={searchContainerRef} style={{ flex: 1, position: 'relative' }}>
          <form
            onSubmit={handleSearchSubmit}
            style={{
              display: 'flex',
              height: '40px',
              borderRadius: '6px',
              overflow: 'hidden',
              boxShadow: isFocused ? '0 0 0 3px #FF9900' : 'none',
              transition: 'box-shadow 0.2s'
            }}
          >
            <div style={{
              backgroundColor: '#E6E6E6',
              color: '#333',
              fontSize: '0.75rem',
              padding: '0 10px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              borderRight: '1px solid #CCC',
              cursor: 'pointer'
            }}>
              <span>All</span>
              <ChevronDown size={14} />
            </div>

            <input
              type="text"
              placeholder="Search NEXO for Laptops, boAt, Bags, Shoes, iPhone, Watch..."
              value={searchInput}
              onFocus={() => setIsFocused(true)}
              onChange={(e) => setSearchInput(e.target.value)}
              style={{
                flex: 1,
                padding: '0 14px',
                border: 'none',
                outline: 'none',
                fontSize: '0.95rem'
              }}
            />

            <button
              type="submit"
              style={{
                backgroundColor: '#FEBD69',
                border: 'none',
                width: '45px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
            >
              <Search size={20} color="#333" />
            </button>
          </form>

          {/* Flipkart / Amazon Live Auto-Suggest Dropdown */}
          {isFocused && (
            <div style={{
              position: 'absolute',
              top: '44px',
              left: 0,
              right: 0,
              backgroundColor: '#FFFFFF',
              borderRadius: '8px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
              border: '1px solid #E2E8F0',
              overflow: 'hidden',
              zIndex: 1000,
              animation: 'fadeIn 0.15s ease-out'
            }}>
              <div style={{
                padding: '8px 14px',
                backgroundColor: '#F8FAFC',
                borderBottom: '1px solid #F1F5F9',
                fontSize: '0.75rem',
                fontWeight: '700',
                color: '#64748B',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <Sparkles size={13} color="#FF9900" />
                <span>POPULAR CAMPUS SEARCHES</span>
              </div>

              <div style={{ padding: '6px 0' }}>
                {filteredSuggestions.length > 0 ? (
                  filteredSuggestions.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleSelectSuggestion(item.query)}
                      style={{
                        padding: '10px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        color: '#0F172A',
                        transition: 'background 0.15s'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F1F5F9')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Search size={15} color="#94A3B8" />
                        <span style={{ fontWeight: '600' }}>{item.label}</span>
                      </div>
                      <ArrowUpRight size={14} color="#CBD5E1" />
                    </div>
                  ))
                ) : (
                  <div
                    onClick={() => handleSelectSuggestion(searchInput)}
                    style={{
                      padding: '12px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      color: '#4F46E5',
                      fontWeight: '700'
                    }}
                  >
                    <Search size={16} />
                    <span>Search for "{searchInput}" across entire store...</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Student Club Action Button */}
        <Link
          to="/student-verify"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: '6px',
            border: '1px solid #FF9900',
            textDecoration: 'none',
            background: 'rgba(255, 153, 0, 0.1)',
            cursor: 'pointer'
          }}
        >
          <GraduationCap size={18} color="#FF9900" />
          <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#FF9900' }}>Student Club</span>
        </Link>

        {/* Sign In & Account */}
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Link
              to="/student-verify"
              style={{ display: 'flex', flexDirection: 'column', cursor: 'pointer', padding: '4px 6px', lineHeight: '1.2', color: '#FFF', textDecoration: 'none' }}
            >
              <span style={{ fontSize: '0.72rem', color: '#CCCCCC' }}>Hello, {user.name.split(' ')[0]}</span>
              <span style={{ fontSize: '0.85rem', fontWeight: '700' }}>Account ▾</span>
            </Link>
            <button
              onClick={logout}
              style={{
                backgroundColor: 'transparent',
                border: '1px solid #475569',
                color: '#CBD5E1',
                borderRadius: '4px',
                padding: '3px 8px',
                fontSize: '0.72rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
              title="Sign Out"
            >
              <LogOut size={12} />
              <span>Sign Out</span>
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            style={{ display: 'flex', flexDirection: 'column', cursor: 'pointer', padding: '4px 8px', lineHeight: '1.2', color: '#FFF', textDecoration: 'none' }}
          >
            <span style={{ fontSize: '0.72rem', color: '#CCCCCC' }}>Hello, Sign in</span>
            <span style={{ fontSize: '0.85rem', fontWeight: '700' }}>Account & Lists ▾</span>
          </Link>
        )}

        {/* Returns & Orders */}
        <Link
          to="/orders"
          style={{ display: 'flex', flexDirection: 'column', cursor: 'pointer', padding: '4px 8px', lineHeight: '1.2', color: '#FFF', textDecoration: 'none' }}
        >
          <span style={{ fontSize: '0.72rem', color: '#CCCCCC' }}>Returns</span>
          <span style={{ fontSize: '0.85rem', fontWeight: '700' }}>& Orders</span>
        </Link>

        {/* Live Cart Icon */}
        <div
          onClick={() => setIsCartOpen(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', padding: '4px 8px' }}
        >
          <div style={{ position: 'relative' }}>
            <ShoppingCart size={32} color="#FFF" />
            <span style={{
              position: 'absolute',
              top: '-2px',
              left: '12px',
              color: '#FF9900',
              fontWeight: '900',
              fontSize: '0.95rem'
            }}>
              {totalItems}
            </span>
          </div>
          <span style={{ fontSize: '0.85rem', fontWeight: '700', marginTop: '10px' }}>Cart</span>
        </div>
      </div>

      {/* 2. Sub-Navigation Strip */}
      <div style={{
        backgroundColor: '#232F3E',
        padding: '8px 18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: '#FFF',
        fontSize: '0.85rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '700', cursor: 'pointer' }}>
            <Menu size={18} />
            <span>All</span>
          </div>
          <span
            onClick={() => handleSelectSuggestion('student')}
            style={{ color: '#FF9900', fontWeight: '700', cursor: 'pointer' }}
          >
            ⚡ Student Deals
          </span>
          <span onClick={() => handleSelectSuggestion('laptop')} style={{ cursor: 'pointer' }}>College Laptops</span>
          <span onClick={() => handleSelectSuggestion('headphone')} style={{ cursor: 'pointer' }}>Audio & Headphones</span>
          <span onClick={() => handleSelectSuggestion('bag')} style={{ cursor: 'pointer' }}>Backpacks & Bags</span>
          <span onClick={() => handleSelectSuggestion('notes')} style={{ cursor: 'pointer' }}>Books & Notes</span>
        </div>

        {/* Student Banner Link */}
        <Link
          to="/student-verify"
          style={{
            fontSize: '0.8rem',
            color: '#FFD814',
            fontWeight: '700',
            cursor: 'pointer',
            textDecoration: 'none'
          }}
        >
          🎉 NEXO Student Festival | Verify College ID &gt;
        </Link>
      </div>
    </header>
  );
}
