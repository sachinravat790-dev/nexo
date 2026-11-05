import { useState } from 'react';
import { Search, MapPin, ShoppingCart, Menu, GraduationCap, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar({ onSearch }) {
  const { user } = useAuth();
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
        <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', padding: '4px 8px' }}>
          <span style={{ fontSize: '1.6rem', fontWeight: '900', letterSpacing: '-0.5px', color: '#FFF' }}>
            nexo<span style={{ color: '#FF9900' }}>.in</span>
          </span>
        </div>

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
          {/* Category Dropdown */}
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
            onChange={(e) => {
              setSearchInput(e.target.value);
              if (onSearch) onSearch(e.target.value);
            }}
            style={{
              flex: 1,
              padding: '0 12px',
              border: 'none',
              outline: 'none',
              fontSize: '0.95rem'
            }}
          />

          {/* Yellow Search Button */}
          <button type="submit" style={{
            backgroundColor: '#FEBD69',
            width: '45px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#F3A847'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#FEBD69'}
          >
            <Search size={20} color="#131921" />
          </button>
        </form>

        {/* Student Special Program Flag */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 12px',
          border: '1px solid #FF9900',
          borderRadius: '4px',
          cursor: 'pointer',
          background: 'rgba(255, 153, 0, 0.1)'
        }}>
          <GraduationCap size={18} color="#FF9900" />
          <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#FF9900' }}>Student Club</span>
        </div>

        {/* Sign In & Account */}
        <div style={{ display: 'flex', flexDirection: 'column', cursor: 'pointer', padding: '4px 8px', lineHeight: '1.2' }}>
          <span style={{ fontSize: '0.72rem', color: '#CCCCCC' }}>Hello, {user ? user.name.split(' ')[0] : 'Sign in'}</span>
          <span style={{ fontSize: '0.85rem', fontWeight: '700' }}>Account & Lists ▾</span>
        </div>

        {/* Returns & Orders */}
        <div style={{ display: 'flex', flexDirection: 'column', cursor: 'pointer', padding: '4px 8px', lineHeight: '1.2' }}>
          <span style={{ fontSize: '0.72rem', color: '#CCCCCC' }}>Returns</span>
          <span style={{ fontSize: '0.85rem', fontWeight: '700' }}>& Orders</span>
        </div>

        {/* Amazon Yellow Cart */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', padding: '4px 8px' }}>
          <div style={{ position: 'relative' }}>
            <ShoppingCart size={32} color="#FFF" />
            <span style={{
              position: 'absolute',
              top: '-2px',
              left: '12px',
              color: '#FF9900',
              fontWeight: '900',
              fontSize: '0.95rem'
            }}>0</span>
          </div>
          <span style={{ fontSize: '0.85rem', fontWeight: '700', marginTop: '10px' }}>Cart</span>
        </div>
      </div>

      {/* 2. Amazon Sub-Navigation Strip (Deals bar) */}
      <div style={{
        backgroundColor: '#232F3E',
        padding: '8px 18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: '#FFF',
        fontSize: '0.85rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '700', cursor: 'pointer' }}>
            <Menu size={18} />
            <span>All</span>
          </div>
          <span style={{ cursor: 'pointer', color: '#FF9900', fontWeight: 'bold' }}>🎓 Student Exclusive Deals</span>
          <span style={{ cursor: 'pointer' }}>College Laptops</span>
          <span style={{ cursor: 'pointer' }}>Audio & Headphones</span>
          <span style={{ cursor: 'pointer' }}>Backpacks & Fashion</span>
          <span style={{ cursor: 'pointer' }}>Books & Stationery</span>
          <span style={{ cursor: 'pointer' }}>Under ₹499 Deals</span>
        </div>

        {/* Festival Badge */}
        <div style={{ fontWeight: '700', color: '#FF9900', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>🎉 NEXO Mega Student Festival | Live Now &gt;</span>
        </div>
      </div>
    </header>
  );
}