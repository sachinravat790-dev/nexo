import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function CartDrawer() {
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

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', justifyContent: 'flex-end' }}>
      {/* 1. Backdrop Blur (Peeche ka screen dhundhla karega) */}
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
        boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.15)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 10000
      }}>
        {/* Header */}
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
            <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0F172A' }}>
              Your Cart ({totalItems})
            </h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            style={{
              padding: '6px',
              borderRadius: '8px',
              backgroundColor: '#FFF',
              border: '1px solid #CBD5E1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#64748B'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Cart Items List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748B' }}>
              <ShoppingBag size={48} color="#CBD5E1" style={{ margin: '0 auto 16px auto' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1E293B', marginBottom: '6px' }}>
                Your cart is empty
              </h3>
              <p style={{ fontSize: '0.85rem' }}>Add some college essentials to unlock student pricing!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  style={{
                    display: 'flex',
                    gap: '14px',
                    padding: '14px',
                    border: '1px solid #E2E8F0',
                    borderRadius: '12px',
                    backgroundColor: '#FFF'
                  }}
                >
                  {/* Thumbnail */}
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    style={{ width: '70px', height: '70px', objectFit: 'contain', borderRadius: '6px' }}
                  />

                  {/* Details */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <h4 style={{
                        fontSize: '0.88rem',
                        fontWeight: '600',
                        color: '#0F172A',
                        lineHeight: '1.3',
                        display: '-webkit-box',
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {item.title}
                      </h4>
                      <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0F172A', marginTop: '4px' }}>
                        ₹{(item.studentPrice * item.quantity).toLocaleString('en-IN')}
                        <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: '500', marginLeft: '6px', textDecoration: 'line-through' }}>
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    {/* Quantity Controls & Delete */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        backgroundColor: '#F1F5F9',
                        padding: '4px 8px',
                        borderRadius: '6px'
                      }}>
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          style={{ background: 'none', display: 'flex', alignItems: 'center', color: '#334155' }}
                        >
                          <Minus size={14} />
                        </button>
                        <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#0F172A', minWidth: '16px', textAlign: 'center' }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          style={{ background: 'none', display: 'flex', alignItems: 'center', color: '#334155' }}
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item._id)}
                        style={{ background: 'none', color: '#EF4444', display: 'flex', alignItems: 'center' }}
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

        {/* Footer / Summary (Agar Cart mein items hain) */}
        {cartItems.length > 0 && (
          <div style={{ padding: '20px', borderTop: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
            {/* Student Savings Banner */}
            {totalSavings > 0 && (
              <div style={{
                backgroundColor: '#ECFDF5',
                border: '1px solid #A7F3D0',
                color: '#065F46',
                padding: '8px 12px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: '700',
                textAlign: 'center',
                marginBottom: '14px'
              }}>
                🎉 You are saving ₹{totalSavings.toLocaleString('en-IN')} with Student Price!
              </div>
            )}

            {/* Subtotal */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '16px' }}>
              <span style={{ fontSize: '0.9rem', color: '#64748B', fontWeight: '600' }}>Subtotal:</span>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0F172A' }}>
                  ₹{studentSubtotal.toLocaleString('en-IN')}
                </span>
                <div style={{ fontSize: '0.75rem', color: '#94A3B8', textDecoration: 'line-through' }}>
                  ₹{normalSubtotal.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => alert('Proceeding to Checkout! (Day 7 me full payment gateway connect hoga)')}
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
                boxShadow: '0 4px 14px rgba(15, 23, 42, 0.2)'
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