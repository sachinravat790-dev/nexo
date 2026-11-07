import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import apiClient from '../api/apiClient';
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  ExternalLink,
  ChevronRight,
  GraduationCap,
  ShoppingBag
} from 'lucide-react';

export default function MyOrders() {
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Success banner if just redirected from checkout
  const [showCelebration, setShowCelebration] = useState(
    Boolean(location.state?.newOrderPlaced)
  );

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/orders/my-orders');
      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusStep = (status) => {
    switch (status) {
      case 'Processing':
        return 1;
      case 'Packed':
        return 2;
      case 'Dispatched':
        return 3;
      case 'Out for Delivery':
        return 4;
      case 'Delivered':
        return 5;
      default:
        return 1;
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ maxWidth: '1000px', margin: '30px auto', width: '100%', padding: '0 20px', flex: 1 }}>
        {/* Celebration Banner if order was just placed */}
        {showCelebration && (
          <div style={{
            backgroundColor: '#F0FDF4',
            border: '1px solid #86EFAC',
            borderRadius: '12px',
            padding: '20px 24px',
            marginBottom: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '14px',
            boxShadow: '0 4px 15px rgba(22, 101, 52, 0.08)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <CheckCircle2 size={36} color="#16A34A" />
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#166534', margin: 0 }}>
                  🎉 Order Placed Successfully!
                </h3>
                <p style={{ color: '#15803D', fontSize: '0.88rem', margin: '4px 0 0 0' }}>
                  Your campus delivery has been confirmed and scheduled with Delhivery Express.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowCelebration(false)}
              style={{ background: 'none', border: 'none', color: '#166534', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer' }}
            >
              Dismiss
            </button>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: '900', color: '#0F172A', margin: 0 }}>
              Your Orders ({orders.length})
            </h1>
            <p style={{ color: '#64748B', fontSize: '0.9rem', marginTop: '4px' }}>
              Track past purchases, live campus delivery updates & invoice details.
            </p>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748B' }}>
            Loading your orders...
          </div>
        ) : orders.length === 0 ? (
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            padding: '60px 20px',
            textAlign: 'center',
            boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
          }}>
            <ShoppingBag size={52} color="#CBD5E1" style={{ margin: '0 auto 12px auto' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0F172A', marginBottom: '6px' }}>
              No Orders Found Yet
            </h3>
            <p style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: '20px' }}>
              You haven't placed any orders on NEXO yet. Use your student benefits to grab deals!
            </p>
            <Link
              to="/"
              style={{
                backgroundColor: '#0F172A',
                color: '#FFF',
                padding: '12px 24px',
                borderRadius: '8px',
                fontWeight: '700',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>Start Shopping</span>
              <ChevronRight size={16} />
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {orders.map((order) => {
              const currentStep = getStatusStep(order.orderStatus);

              return (
                <div
                  key={order._id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1px solid #E2E8F0',
                    overflow: 'hidden',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.03)'
                  }}
                >
                  {/* Order Top Bar */}
                  <div style={{
                    backgroundColor: '#F8FAFC',
                    padding: '14px 22px',
                    borderBottom: '1px solid #E2E8F0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px',
                    fontSize: '0.85rem'
                  }}>
                    <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                      <div>
                        <span style={{ color: '#64748B', display: 'block', fontSize: '0.72rem' }}>ORDER PLACED</span>
                        <strong style={{ color: '#0F172A' }}>
                          {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </strong>
                      </div>

                      <div>
                        <span style={{ color: '#64748B', display: 'block', fontSize: '0.72rem' }}>TOTAL PAID</span>
                        <strong style={{ color: '#0F172A' }}>
                          ₹{order.totalPrice.toLocaleString('en-IN')}
                        </strong>
                      </div>

                      <div>
                        <span style={{ color: '#64748B', display: 'block', fontSize: '0.72rem' }}>SHIP TO</span>
                        <strong style={{ color: '#0F172A' }}>
                          {order.shippingAddress?.fullName} ({order.shippingAddress?.collegeName || 'Campus'})
                        </strong>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{ color: '#64748B', display: 'block', fontSize: '0.72rem' }}>ORDER ID</span>
                      <span style={{ fontFamily: 'monospace', fontWeight: '700', color: '#4F46E5' }}>
                        #{order._id.slice(-8).toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div style={{ padding: '22px' }}>
                    {/* Courier Tracking Status Bar */}
                    <div style={{
                      backgroundColor: '#EEF2FF',
                      borderRadius: '12px',
                      padding: '16px 20px',
                      marginBottom: '20px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Truck size={20} color="#4F46E5" />
                          <span style={{ fontWeight: '800', color: '#1E1B4B', fontSize: '0.95rem' }}>
                            Status: {order.orderStatus}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#4338CA', fontWeight: '600' }}>
                          Courier: <strong>{order.courierPartner}</strong> | AWB Tracking:{' '}
                          <span style={{ fontFamily: 'monospace' }}>{order.trackingNumber}</span>
                        </div>
                      </div>

                      {/* 4-Step Visual Progress Bar */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
                        {[
                          { title: 'Order Placed', step: 1 },
                          { title: 'Packed', step: 2 },
                          { title: 'Dispatched', step: 3 },
                          { title: 'Campus Gate Delivery', step: 4 },
                        ].map((item, idx) => {
                          const isComplete = currentStep >= item.step;
                          return (
                            <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2, flex: 1 }}>
                              <div style={{
                                width: '28px',
                                height: '28px',
                                borderRadius: '50%',
                                backgroundColor: isComplete ? '#10B981' : '#CBD5E1',
                                color: '#FFF',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.75rem',
                                fontWeight: '800',
                                marginBottom: '6px'
                              }}>
                                {isComplete ? '✓' : item.step}
                              </div>
                              <span style={{
                                fontSize: '0.75rem',
                                fontWeight: isComplete ? '700' : '500',
                                color: isComplete ? '#0F172A' : '#94A3B8',
                                textAlign: 'center'
                              }}>
                                {item.title}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Ordered Items Preview */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '18px' }}>
                      {order.orderItems?.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                          <img
                            src={item.image}
                            alt={item.name}
                            style={{
                              width: '64px',
                              height: '64px',
                              objectFit: 'contain',
                              borderRadius: '8px',
                              border: '1px solid #E2E8F0',
                              padding: '4px'
                            }}
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80';
                            }}
                          />
                          <div style={{ flex: 1 }}>
                            <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0F172A', margin: 0 }}>
                              {item.name}
                            </h4>
                            <div style={{ fontSize: '0.82rem', color: '#64748B', marginTop: '4px' }}>
                              Quantity: <strong>{item.quantity}</strong> | Price:{' '}
                              <strong style={{ color: '#4F46E5' }}>
                                ₹{item.studentPrice || item.price}
                              </strong>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Student Savings Info Tag */}
                    {(order.studentSavings > 0 || order.couponDiscount > 0) && (
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        backgroundColor: '#DCFCE7',
                        color: '#166534',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontWeight: '700'
                      }}>
                        <GraduationCap size={16} />
                        <span>
                          You saved ₹{((order.studentSavings || 0) + (order.couponDiscount || 0)).toLocaleString('en-IN')} with Student Benefits on this order!
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
