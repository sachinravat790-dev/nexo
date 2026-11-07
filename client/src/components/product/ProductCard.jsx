import { Star, ShoppingCart } from 'lucide-react';
import { useCart } from '../../context/CartContext'; // 👈 Cart Context import kiya

export default function ProductCard({ product }) {
  const { addToCart } = useCart(); // 👈 Add to Cart function nikaala

  const discountPercent = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '12px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: 'pointer',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        transition: 'all 0.2s ease',
        position: 'relative'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.08)';
        e.currentTarget.style.borderColor = '#CBD5E1';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)';
        e.currentTarget.style.borderColor = '#E2E8F0';
      }}
    >
      {/* Student Deal Badge */}
      {product.isStudentDeal && (
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          background: '#EEF2FF',
          color: '#4F46E5',
          border: '1px solid #C7D2FE',
          fontSize: '0.7rem',
          fontWeight: '700',
          padding: '3px 8px',
          borderRadius: '6px',
          letterSpacing: '0.3px'
        }}>
          🎓 STUDENT DEAL
        </div>
      )}

      {/* Product Image */}
      <div style={{
        width: '100%',
        height: '190px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        margin: '8px 0 14px 0'
      }}>
        <img
          src={product.image || product.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80'}
          alt={product.title}
          style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
        />
      </div>

      {/* Content */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {/* Rating */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '3px',
            backgroundColor: '#059669',
            color: '#FFF',
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: '0.72rem',
            fontWeight: '700'
          }}>
            <span>{product.rating}</span>
            <Star size={10} fill="#FFF" />
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748B' }}>({product.numReviews} ratings)</span>
        </div>

        {/* Title */}
        <h3 style={{
          fontSize: '0.92rem',
          fontWeight: '600',
          color: '#0F172A',
          lineHeight: '1.4',
          height: '40px',
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical'
        }}>
          {product.title}
        </h3>

        {/* Pricing */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
          <span style={{ fontSize: '1.35rem', fontWeight: '800', color: '#0F172A' }}>
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          <span style={{ fontSize: '0.85rem', color: '#94A3B8', textDecoration: 'line-through' }}>
            ₹{product.originalPrice.toLocaleString('en-IN')}
          </span>
          <span style={{ fontSize: '0.8rem', color: '#059669', fontWeight: '700' }}>
            {discountPercent}% off
          </span>
        </div>

        {/* Clean Student Price Strip */}
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
          <span style={{ fontSize: '0.75rem', color: '#166534', fontWeight: '600' }}>
            With Student ID:
          </span>
          <span style={{ fontSize: '0.95rem', color: '#15803D', fontWeight: '800' }}>
            ₹{product.studentPrice.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* 🛒 Add to Cart Button (Live Click Action) */}
      <button
        onClick={() => addToCart(product)}
        style={{
          marginTop: '14px',
          width: '100%',
          backgroundColor: '#0F172A',
          color: '#FFF',
          borderRadius: '8px',
          padding: '10px',
          fontSize: '0.85rem',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          transition: 'background 0.2s'
        }}
        onMouseEnter={(e) => (e.target.style.backgroundColor = '#1E293B')}
        onMouseLeave={(e) => (e.target.style.backgroundColor = '#0F172A')}
      >
        <ShoppingCart size={15} />
        <span>Add to Cart</span>
      </button>
    </div>
  );
}