import { useState } from 'react';
import { Search, MapPin, ShoppingCart, Menu, GraduationCap, ChevronDown, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';

export default function Navbar({ onSearch }) {
  const { user, logout } = useAuth();
  const { totalItems, setIsCartOpen } = useCart();
  const [searchInput, setSearchInput] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(searchInput);
  };

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

        {/* Amazon-Style Wide Search Bar */}
        <form onSubmit={handleSearchSubmit} style={{ flex: 1, display: 'flex', height: '40px', borderRadius: '4px', overflow: 'hidden' }}>
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
            placeholder="Search NEXO.in for Laptops, boAt Headphones, Bags & Student Deals..."
            value={searchInput}
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
              cursor: 'pointer'
            }}
          >
            <Search size={20} color="#333" />
          </button>
        </form>

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

        {/* Sign In & Account (Dynamic for New & Logged In Users) */}
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
          <span style={{ color: '#FF9900', fontWeight: '700', cursor: 'pointer' }}>⚡ Student Deals</span>
          <span style={{ cursor: 'pointer' }}>College Laptops</span>
          <span style={{ cursor: 'pointer' }}>Audio & Headphones</span>
          <span style={{ cursor: 'pointer' }}>Backpacks & Fashion</span>
          <span style={{ cursor: 'pointer' }}>Books & Notes</span>
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
