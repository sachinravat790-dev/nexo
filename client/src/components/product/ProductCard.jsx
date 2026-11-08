import { useState } from 'react';
import { Star, ShoppingCart, Check, Zap } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  // Flipkart style real discount percentage
  const discountPercent = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  // Student extra saving
  const studentSavings = product.price - product.studentPrice;

  const handleAdd = () => {
    addToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1200); // 1.2s baad reset
  };

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '10px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: 'pointer',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        transition: 'all 0.2s ease',
        position: 'relative',
        height: '100%'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 10px 24px rgba(0,0,0,0.08)';
        e.currentTarget.style.borderColor = '#CBD5E1';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)';
        e.currentTarget.style.borderColor = '#E2E8F0';
      }}
    >
      {/* 🏷️ Top Badges: Student Deal & Assured */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'absolute',
        top: '12px',
        left: '12px',
        right: '12px',
        zIndex: 2
      }}>
        {product.isStudentDeal ? (
          <span style={{
            background: '#EEF2FF',
            color: '#4F46E5',
            border: '1px solid #C7D2FE',
            fontSize: '0.68rem',
            fontWeight: '700',
            padding: '2px 7px',
            borderRadius: '4px',
            letterSpacing: '0.3px'
          }}>
            🎓 STUDENT DEAL
          </span>
        ) : <span />}

        {/* Flipkart Assured style badge */}
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '2px',
          background: '#EFF6FF',
          color: '#2563EB',
          fontSize: '0.68rem',
          fontWeight: '800',
          padding: '2px 6px',
          borderRadius: '4px',
          fontStyle: 'italic'
        }}>
          <Zap size={10} fill="#2563EB" />
          Assured
        </span>
      </div>

      {/* 🖼️ Product Image (Clean Center Aligned) */}
      <div style={{
        width: '100%',
        height: '190px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        margin: '22px 0 12px 0'
      }}>
        <img
          src={product.image || product.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80'}
          alt={product.title}
          style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
        />
      </div>

      {/* 📝 Content Area */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        
        {/* Brand Name */}
        {product.brand && (
          <span style={{
            fontSize: '0.72rem',
            fontWeight: '700',
            color: '#64748B',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            {product.brand}
          </span>
        )}

        {/* Product Title (2 lines max) */}
        <h3 style={{
          fontSize: '0.92rem',
          fontWeight: '600',
          color: '#0F172A',
          lineHeight: '1.35',
          height: '38px',
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          margin: 0
        }}>
          {product.title}
        </h3>

        {/* Rating & Reviews (Flipkart Green Pill) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '3px',
            backgroundColor: '#388E3C', // Flipkart signature green rating
            color: '#FFF',
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: '0.72rem',
            fontWeight: '700'
          }}>
            <span>{product.rating}</span>
            <Star size={10} fill="#FFF" />
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
            ({product.numReviews?.toLocaleString('en-IN')})
          </span>
        </div>

        {/* 💰 Flipkart Price Presentation */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
          {/* Real Selling Price */}
          <span style={{ fontSize: '1.35rem', fontWeight: '800', color: '#0F172A' }}>
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          {/* Strikethrough MRP */}
          <span style={{ fontSize: '0.85rem', color: '#878787', textDecoration: 'line-through' }}>
            ₹{product.originalPrice.toLocaleString('en-IN')}
          </span>
          {/* Flipkart Green Discount Tag */}
          <span style={{ fontSize: '0.82rem', color: '#388E3C', fontWeight: '700' }}>
            {discountPercent}% off
          </span>
        </div>

        {/* Free Delivery Tag */}
        <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: '600' }}>
          Free Delivery by Tomorrow
        </div>

        {/* 🎓 Exclusive Student Price Strip */}
        <div style={{
          backgroundColor: '#F0FDF4',
          border: '1px solid #BBF7D0',
          borderRadius: '6px',
          padding: '6px 10px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '6px'
        }}>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#166534', fontWeight: '700' }}>
              With Student ID / Coupon:
            </div>
            {studentSavings > 0 && (
              <div style={{ fontSize: '0.65rem', color: '#15803D' }}>
                (Save extra ₹{studentSavings.toLocaleString('en-IN')})
              </div>
            )}
          </div>
          <span style={{ fontSize: '1.05rem', color: '#15803D', fontWeight: '900' }}>
            ₹{product.studentPrice.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* 🛒 Add to Cart Button (Instant Tactile Feedback) */}
      <button
        onClick={handleAdd}
        style={{
          marginTop: '12px',
          width: '100%',
          backgroundColor: isAdded ? '#16A34A' : '#0F172A',
          color: '#FFF',
          borderRadius: '8px',
          padding: '10px',
          fontSize: '0.85rem',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          border: 'none',
          cursor: 'pointer',
          transition: 'all 0.2s'
        }}
      >
        {isAdded ? (
          <>
            <Check size={16} />
            <span>Added to Cart!</span>
          </>
        ) : (
          <>
            <ShoppingCart size={15} />
            <span>Add to Cart</span>
          </>
        )}
      </button>
    </div>
  );
}