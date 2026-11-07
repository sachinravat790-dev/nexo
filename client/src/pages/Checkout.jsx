import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/apiClient';
import {
  MapPin,
  CreditCard,
  Truck,
  ShieldCheck,
  Tag,
  CheckCircle2,
  GraduationCap,
  ArrowRight,
  AlertCircle
} from 'lucide-react';

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, totalItems, normalSubtotal, studentSubtotal, totalSavings, clearCart } = useCart();
  const { user } = useAuth();

  // Shipping Address Form State
  const [fullName, setFullName] = useState(user?.name || '');
  const [phone, setPhone] = useState('');
  const [collegeName, setCollegeName] = useState(user?.studentDetails?.collegeName || '');
  const [hostelOrAddress, setHostelOrAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState('COD');

  // Coupon State
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');

  // Order Placement State
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState('');

  // Pre-fill user data when user auth loads
  useEffect(() => {
    if (user) {
      if (!fullName) setFullName(user.name);
      if (!collegeName && user.studentDetails?.collegeName) {
        setCollegeName(user.studentDetails.collegeName);
      }
    }
  }, [user]);

  // Handle Apply Coupon
  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    setCouponLoading(true);
    setCouponError('');

    try {
      const res = await apiClient.post('/coupons/apply', {
        code: couponInput.trim(),
        cartTotal: studentSubtotal,
      });

      if (res.data.success) {
        setAppliedCoupon(res.data.coupon);
        setCouponInput('');
      }
    } catch (err) {
      setCouponError(
        err.response?.data?.message || 'Invalid coupon code. Try STUDENT500 or STUDENT10!'
      );
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError('');
  };

  // Pricing calculations
  const couponDiscount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const finalPayable = Math.max(0, studentSubtotal - couponDiscount);
  const totalCombinedSavings = totalSavings + couponDiscount;

  // Handle Order Placement
  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!user) {
      alert('Please sign in or register to place your order.');
      navigate('/login');
      return;
    }

    if (!fullName || !phone || !hostelOrAddress || !city || !pincode) {
      setOrderError('Please fill in all mandatory delivery address fields!');
      window.scrollTo({ top: 150, behavior: 'smooth' });
      return;
    }

    setPlacingOrder(true);
    setOrderError('');

    const formattedItems = cartItems.map((item) => ({
      product: item._id,
      name: item.name,
      quantity: item.quantity,
      image: item.image,
      price: item.price,
      studentPrice: item.studentPrice || item.price,
    }));

    const orderPayload = {
      orderItems: formattedItems,
      shippingAddress: {
        fullName,
        phone,
        collegeName,
        hostelOrAddress,
        city,
        state: state || 'Madhya Pradesh',
        pincode,
      },
      paymentMethod,
      couponCode: appliedCoupon?.code || null,
      couponDiscount,
    };

    try {
      const res = await apiClient.post('/orders', orderPayload);

      if (res.data.success) {
        clearCart(); // Cart khali karo
        navigate('/orders', { state: { newOrderPlaced: true, orderId: res.data.order._id } });
      } else {
        setOrderError(res.data.message || 'Failed to place order.');
      }
    } catch (err) {
      setOrderError(err.response?.data?.message || 'Server error while placing order.');
    } finally {
      setPlacingOrder(false);
    }
  };

  // If Cart is Empty
  if (cartItems.length === 0) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <main style={{ maxWidth: '600px', margin: '80px auto', textAlign: 'center', padding: '0 20px', flex: 1 }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            padding: '40px 24px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.04)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🛍️</div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0F172A', marginBottom: '8px' }}>
              Your Cart is Empty!
            </h2>
            <p style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: '24px' }}>
              Looks like you haven't added any products to checkout yet. Explore our campus deals!
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
              <span>Explore Products</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ maxWidth: '1200px', margin: '30px auto', width: '100%', padding: '0 20px', flex: 1 }}>
        {/* Breadcrumb Header */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '900', color: '#0F172A', margin: 0 }}>
            Checkout ({totalItems} {totalItems === 1 ? 'item' : 'items'})
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.9rem', marginTop: '4px' }}>
            Fast campus delivery to your college hostel or gate via Delhivery Express.
          </p>
        </div>

        {orderError && (
          <div style={{
            backgroundColor: '#FEF2F2',
            border: '1px solid #FCA5A5',
            color: '#B91C1C',
            padding: '12px 18px',
            borderRadius: '10px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: '600'
          }}>
            <AlertCircle size={20} />
            <span>{orderError}</span>
          </div>
        )}

        {/* 2-Column Checkout Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px', alignItems: 'start' }}>
          {/* Left Column: Form Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* 1. Campus Shipping Address */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '14px',
              border: '1px solid #E2E8F0',
              padding: '24px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MapPin size={18} color="#4F46E5" />
                </div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                  1. Campus Delivery Address
                </h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sachin Kumar"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>
                    Mobile Number (For Delivery OTP) *
                  </label>
                  <input
                    type="tel"
                    placeholder="10-digit mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>
                    College / University Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. SAGE University Indore"
                    value={collegeName}
                    onChange={(e) => setCollegeName(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>
                    Hostel Name & Room No. / Flat / Street *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Boys Hostel 2, Room 304 (or Campus Gate 1)"
                    value={hostelOrAddress}
                    onChange={(e) => setHostelOrAddress(e.target.value)}
                    required
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>
                    City *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Indore"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>
                    Pincode *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 452020"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    required
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
              </div>
            </div>

            {/* 2. Payment Method */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '14px',
              border: '1px solid #E2E8F0',
              padding: '24px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CreditCard size={18} color="#4F46E5" />
                </div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                  2. Payment Method
                </h2>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* Cash on Delivery */}
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '14px 18px',
                  border: `2px solid ${paymentMethod === 'COD' ? '#4F46E5' : '#E2E8F0'}`,
                  borderRadius: '10px',
                  cursor: 'pointer',
                  backgroundColor: paymentMethod === 'COD' ? '#EEF2FF' : '#FFFFFF',
                  transition: 'all 0.2s'
                }}>
                  <input
                    type="radio"
                    name="payment"
                    value="COD"
                    checked={paymentMethod === 'COD'}
                    onChange={() => setPaymentMethod('COD')}
                    style={{ accentColor: '#4F46E5' }}
                  />
                  <div>
                    <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0F172A' }}>
                      Cash on Delivery (COD) / Pay on Campus
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '2px' }}>
                      Pay via cash or UPI scanner when courier partner hands over your package at campus.
                    </div>
                  </div>
                </label>

                {/* Instant UPI Simulation */}
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '14px 18px',
                  border: `2px solid ${paymentMethod === 'UPI' ? '#4F46E5' : '#E2E8F0'}`,
                  borderRadius: '10px',
                  cursor: 'pointer',
                  backgroundColor: paymentMethod === 'UPI' ? '#EEF2FF' : '#FFFFFF',
                  transition: 'all 0.2s'
                }}>
                  <input
                    type="radio"
                    name="payment"
                    value="UPI"
                    checked={paymentMethod === 'UPI'}
                    onChange={() => setPaymentMethod('UPI')}
                    style={{ accentColor: '#4F46E5' }}
                  />
                  <div>
                    <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#0F172A' }}>
                      ⚡ Instant UPI / QR Payment Simulation
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '2px' }}>
                      Google Pay, PhonePe, Paytm or any BHIM UPI app.
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* 3. Items Review */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '14px',
              border: '1px solid #E2E8F0',
              padding: '24px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
            }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0F172A', marginBottom: '16px' }}>
                3. Review Ordered Items ({totalItems})
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {cartItems.map((item) => (
                  <div key={item._id} style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ width: '50px', height: '50px', objectFit: 'contain', borderRadius: '6px', border: '1px solid #E2E8F0' }}
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80'; }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#0F172A', lineHeight: '1.3' }}>
                        {item.name}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '2px' }}>
                        Qty: <strong>{item.quantity}</strong> | Price:{' '}
                        <strong style={{ color: '#4F46E5' }}>
                          ₹{(item.studentPrice || item.price).toLocaleString('en-IN')}
                        </strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Place Order */}
          <div style={{ position: 'sticky', top: '90px' }}>
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #E2E8F0',
              padding: '26px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
            }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0F172A', marginBottom: '18px' }}>
                Order Summary
              </h2>

              {/* Student Verified Indicator */}
              <div style={{
                backgroundColor: '#F0FDF4',
                border: '1px solid #BBF7D0',
                borderRadius: '8px',
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '18px'
              }}>
                <GraduationCap size={18} color="#166534" />
                <span style={{ fontSize: '0.82rem', color: '#166534', fontWeight: '700' }}>
                  Student Pricing Applied on Eligible Items
                </span>
              </div>

              {/* Coupon Code Section */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                  Have a Coupon or Student Voucher?
                </label>

                {appliedCoupon ? (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: '#F1F5F9',
                    border: '1px dashed #4F46E5',
                    padding: '8px 12px',
                    borderRadius: '8px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Tag size={16} color="#4F46E5" />
                      <span style={{ fontWeight: '800', fontSize: '0.9rem', color: '#4F46E5' }}>
                        {appliedCoupon.code}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: '#16A34A', fontWeight: '700' }}>
                        (-₹{appliedCoupon.discountAmount.toLocaleString('en-IN')})
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      style={{ background: 'none', border: 'none', color: '#EF4444', fontSize: '0.78rem', fontWeight: '700', cursor: 'pointer' }}
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      placeholder="e.g. STUDENT500 or STUDENT10"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      style={{
                        flex: 1,
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '1px solid #CBD5E1',
                        fontSize: '0.85rem',
                        outline: 'none',
                        textTransform: 'uppercase'
                      }}
                    />
                    <button
                      type="submit"
                      disabled={couponLoading}
                      style={{
                        backgroundColor: '#0F172A',
                        color: '#FFF',
                        padding: '10px 16px',
                        borderRadius: '8px',
                        fontWeight: '700',
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        border: 'none'
                      }}
                    >
                      {couponLoading ? '...' : 'Apply'}
                    </button>
                  </form>
                )}

                {couponError && (
                  <div style={{ fontSize: '0.78rem', color: '#DC2626', fontWeight: '600', marginTop: '6px' }}>
                    {couponError}
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', borderBottom: '1px solid #F1F5F9', paddingBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B' }}>
                  <span>Items MRP Total:</span>
                  <span>₹{normalSubtotal.toLocaleString('en-IN')}</span>
                </div>

                {totalSavings > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16A34A', fontWeight: '600' }}>
                    <span>🎓 Student Price Savings:</span>
                    <span>-₹{totalSavings.toLocaleString('en-IN')}</span>
                  </div>
                )}

                {appliedCoupon && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16A34A', fontWeight: '600' }}>
                    <span>🏷️ Coupon Discount ({appliedCoupon.code}):</span>
                    <span>-₹{appliedCoupon.discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B' }}>
                  <span>Campus Delivery (Delhivery):</span>
                  <span style={{ color: '#059669', fontWeight: '700' }}>FREE</span>
                </div>
              </div>

              {/* Total Payable */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', margin: '18px 0' }}>
                <span style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0F172A' }}>
                  Order Total:
                </span>
                <span style={{ fontSize: '1.6rem', fontWeight: '900', color: '#0F172A' }}>
                  ₹{finalPayable.toLocaleString('en-IN')}
                </span>
              </div>

              {totalCombinedSavings > 0 && (
                <div style={{
                  textAlign: 'center',
                  color: '#166534',
                  backgroundColor: '#DCFCE7',
                  borderRadius: '6px',
                  padding: '6px',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  marginBottom: '16px'
                }}>
                  🎉 Total Savings on this order: ₹{totalCombinedSavings.toLocaleString('en-IN')}!
                </div>
              )}

              {/* Submit Order Button */}
              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={placingOrder}
                style={{
                  width: '100%',
                  backgroundColor: '#FF9900',
                  color: '#111827',
                  padding: '14px',
                  borderRadius: '10px',
                  fontWeight: '800',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(255, 153, 0, 0.35)',
                  transition: 'background 0.2s'
                }}
              >
                <span>{placingOrder ? 'Processing Order...' : `Place Your Order (₹${finalPayable.toLocaleString('en-IN')})`}</span>
                <ArrowRight size={18} />
              </button>

              {/* Security & Logistics Trust Note */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '18px', paddingTop: '16px', borderTop: '1px solid #F1F5F9' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748B', fontSize: '0.78rem' }}>
                  <ShieldCheck size={16} color="#10B981" />
                  <span>100% Purchase Protection & Guaranteed Authentic</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748B', fontSize: '0.78rem' }}>
                  <Truck size={16} color="#4F46E5" />
                  <span>Fulfilled via Delhivery Surface Express to Campus Gate</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
