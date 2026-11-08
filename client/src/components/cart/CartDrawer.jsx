import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

export default function CartDrawer() {
  const navigate = useNavigate();
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    totalItems,
    normalSubtotal,
    studentSubtotal,
    totalSavings
  } = useCart();

  if (!isCartOpen) return null;

  const handleProceedToBuy = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', justifyContent: 'flex-end' }}>
      {/* 1. Backdrop Blur */}
      <div
        onClick={() => setIsCartOpen(false)}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
          transition: 'opacity 0.2s'
        }}
      />

      {/* 2. Slide-out Drawer Panel */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '440px',
        height: '100%',
        backgroundColor: '#FFFFFF',
        boxShadow: '-4px 0 25px rgba(0, 0, 0, 0.15)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 10000,
        animation: 'slideIn 0.3s ease-out'
      }}>
        {/* Drawer Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#F8FAFC'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShoppingBag size={22} color="#0F172A" />
            <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0F172A', margin: 0 }}>
              Shopping Cart ({totalItems})
            </h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#64748B',
              padding: '4px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Student Savings Highlight Banner */}
        {totalSavings > 0 && (
          <div style={{
            backgroundColor: '#F0FDF4',
            borderBottom: '1px solid #BBF7D0',
            padding: '10px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.85rem',
            color: '#166534',
            fontWeight: '600'
          }}>
            <span>🎓 Student Benefit:</span>
            <span>You are saving <strong>₹{totalSavings.toLocaleString('en-IN')}</strong> on this cart!</span>
          </div>
        )}

        {/* Cart Items List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748B' }}>
              <ShoppingBag size={48} color="#CBD5E1" style={{ margin: '0 auto 12px auto' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0F172A', marginBottom: '6px' }}>
                Your cart is empty!
              </h3>
              <p style={{ fontSize: '0.85rem' }}>Add student-exclusive deals and products to get started.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  style={{
                    display: 'flex',
                    gap: '14px',
                    padding: '12px',
                    border: '1px solid #F1F5F9',
                    borderRadius: '10px',
                    backgroundColor: '#FFFFFF',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                  }}
                >
                  {/* Item Image */}
                  <div style={{ width: '70px', height: '70px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img
                      src={item.image}
                      alt={item.title || item.name}
                      style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80';
                      }}
                    />
                  </div>

                  {/* Details */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      {/* 👈 YAHAN HAI CHANGE: item.title || item.name */}
                      <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: '#0F172A', margin: 0, lineHeight: '1.3' }}>
                        {item.title || item.name}
                      </h4>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '4px' }}>
                        <span style={{ fontSize: '0.95rem', fontWeight: '800', color: '#4F46E5' }}>
                          ₹{(item.studentPrice || item.price).toLocaleString('en-IN')}
                        </span>
                        {item.studentPrice && item.studentPrice < item.price && (
                          <span style={{ fontSize: '0.75rem', color: '#94A3B8', textDecoration: 'line-through' }}>
                            ₹{item.price.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quantity Controls & Remove */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        border: '1px solid #CBD5E1',
                        borderRadius: '6px',
                        overflow: 'hidden'
                      }}>
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          style={{ border: 'none', background: '#F8FAFC', padding: '4px 8px', cursor: 'pointer' }}
                        >
                          <Minus size={12} />
                        </button>
                        <span style={{ padding: '0 10px', fontSize: '0.85rem', fontWeight: '700' }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          style={{ border: 'none', background: '#F8FAFC', padding: '4px 8px', cursor: 'pointer' }}
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item._id)}
                        style={{ border: 'none', background: 'none', color: '#EF4444', cursor: 'pointer', padding: '4px' }}
                        title="Remove"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer (Subtotal & Proceed to Buy) */}
        {cartItems.length > 0 && (
          <div style={{
            padding: '20px 24px',
            borderTop: '1px solid #E2E8F0',
            backgroundColor: '#F8FAFC'
          }}>
            {/* Free Shipping Badge */}
            <div style={{
              fontSize: '0.8rem',
              color: '#059669',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              marginBottom: '10px'
            }}>
              <span>🚚 Free Campus Delivery Unlocked</span>
            </div>

            {/* Subtotal */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '16px' }}>
              <span style={{ fontSize: '0.9rem', color: '#64748B', fontWeight: '600' }}>Subtotal:</span>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0F172A' }}>
                  ₹{studentSubtotal.toLocaleString('en-IN')}
                </span>
                {totalSavings > 0 && (
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8', textDecoration: 'line-through' }}>
                    ₹{normalSubtotal.toLocaleString('en-IN')}
                  </div>
                )}
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleProceedToBuy}
              style={{
                width: '100%',
                backgroundColor: '#0F172A',
                color: '#FFF',
                padding: '14px',
                borderRadius: '10px',
                fontWeight: '700',
                fontSize: '0.95rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                border: 'none',
                boxShadow: '0 4px 14px rgba(15, 23, 42, 0.2)',
                transition: 'background 0.2s'
              }}
            >
              <span>Proceed to Buy ({totalItems} items)</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}