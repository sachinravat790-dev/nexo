import { useEffect, useState } from 'react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import apiClient from '../../api/apiClient';
import { Link } from 'react-router-dom';
import {
  Package,
  Truck,
  IndianRupee,
  GraduationCap,
  RefreshCw,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  MapPin
} from 'lucide-react';

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0, totalStudentSavings: 0 });
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ordersRes, statsRes] = await Promise.all([
        apiClient.get('/orders/all'),
        apiClient.get('/orders/admin/stats')
      ]);

      if (ordersRes.data.success) {
        setOrders(ordersRes.data.orders);
      }
      if (statsRes.data.success) {
        setStats(statsRes.data.stats);
      }
    } catch (err) {
      console.error('Failed to load admin dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const res = await apiClient.put(`/orders/${orderId}/status`, { orderStatus: newStatus });
      if (res.data.success) {
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, orderStatus: newStatus } : o))
        );
      }
    } catch (err) {
      alert('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = filterStatus === 'All'
    ? orders
    : orders.filter((o) => o.orderStatus === filterStatus);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ maxWidth: '1280px', margin: '30px auto', width: '100%', padding: '0 20px', flex: 1 }}>
        {/* Dashboard Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={28} color="#4F46E5" />
              <h1 style={{ fontSize: '1.8rem', fontWeight: '900', color: '#0F172A', margin: 0 }}>
                NEXO Admin Operations Hub
              </h1>
            </div>
            <p style={{ color: '#64748B', fontSize: '0.9rem', marginTop: '4px' }}>
              Real-time platform sales analytics & live Delhivery courier dispatch control.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <Link
              to="/admin/verify-students"
              style={{
                backgroundColor: '#EEF2FF',
                color: '#4F46E5',
                border: '1px solid #C7D2FE',
                padding: '10px 16px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: '700',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <GraduationCap size={16} />
              <span>Verify Students Queue</span>
            </Link>

            <button
              onClick={fetchData}
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #CBD5E1',
                padding: '10px 16px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <RefreshCw size={14} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* 1. TOP ANALYTICS METRIC CARDS */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '18px',
          marginBottom: '32px'
        }}>
          {/* Card 1: Revenue */}
          <div style={{ backgroundColor: '#FFF', borderRadius: '14px', padding: '20px', border: '1px solid #E2E8F0', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#64748B' }}>TOTAL REVENUE</span>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IndianRupee size={18} color="#166534" />
              </div>
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#0F172A', marginTop: '10px' }}>
              ₹{stats.totalRevenue.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#16A34A', marginTop: '4px', fontWeight: '600' }}>
              Live collected orders value
            </div>
          </div>

          {/* Card 2: Orders Placed */}
          <div style={{ backgroundColor: '#FFF', borderRadius: '14px', padding: '20px', border: '1px solid #E2E8F0', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#64748B' }}>ORDERS PLACED</span>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Package size={18} color="#4F46E5" />
              </div>
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#0F172A', marginTop: '10px' }}>
              {stats.totalOrders}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#4F46E5', marginTop: '4px', fontWeight: '600' }}>
              Across all Indian campuses
            </div>
          </div>

          {/* Card 3: Student Savings Given */}
          <div style={{ backgroundColor: '#FFF', borderRadius: '14px', padding: '20px', border: '1px solid #E2E8F0', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#64748B' }}>STUDENT SAVINGS GIVEN</span>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <GraduationCap size={18} color="#D97706" />
              </div>
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#0F172A', marginTop: '10px' }}>
              ₹{stats.totalStudentSavings.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#D97706', marginTop: '4px', fontWeight: '600' }}>
              Saved by verified students
            </div>
          </div>

          {/* Card 4: Delhivery Courier */}
          <div style={{ backgroundColor: '#FFF', borderRadius: '14px', padding: '20px', border: '1px solid #E2E8F0', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#64748B' }}>DELIVERY PARTNER</span>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Truck size={18} color="#0F172A" />
              </div>
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: '900', color: '#0F172A', marginTop: '12px' }}>
              Delhivery Express
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '4px' }}>
              3-Day Campus Surface Courier
            </div>
          </div>
        </div>

        {/* 2. ORDER MANAGEMENT TABLE */}
        <div style={{ backgroundColor: '#FFF', borderRadius: '16px', border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
          {/* Table Controls Bar */}
          <div style={{
            padding: '16px 22px',
            backgroundColor: '#F8FAFC',
            borderBottom: '1px solid #E2E8F0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0F172A', margin: 0 }}>
              Live Customer Orders ({filteredOrders.length})
            </h2>

            {/* Filter Pills */}
            <div style={{ display: 'flex', gap: '6px', overflowX: 'auto' }}>
              {['All', 'Processing', 'Packed', 'Dispatched', 'Delivered'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.78rem',
                    fontWeight: '700',
                    backgroundColor: filterStatus === status ? '#0F172A' : '#FFF',
                    color: filterStatus === status ? '#FFF' : '#475569',
                    cursor: 'pointer'
                  }}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#64748B' }}>
              Loading platform orders...
            </div>
          ) : filteredOrders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748B' }}>
              No orders found matching the filter!
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead style={{ backgroundColor: '#F1F5F9', borderBottom: '1px solid #E2E8F0', color: '#475569' }}>
                  <tr>
                    <th style={{ padding: '12px 16px' }}>Order ID</th>
                    <th style={{ padding: '12px 16px' }}>Student & Campus Address</th>
                    <th style={{ padding: '12px 16px' }}>Items</th>
                    <th style={{ padding: '12px 16px' }}>Amount Paid</th>
                    <th style={{ padding: '12px 16px' }}>Delhivery AWB</th>
                    <th style={{ padding: '12px 16px', textAlign: 'center' }}>Live Status Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order._id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      {/* Order ID */}
                      <td style={{ padding: '14px 16px', fontFamily: 'monospace', fontWeight: '700', color: '#4F46E5' }}>
                        #{order._id.slice(-6).toUpperCase()}
                      </td>

                      {/* Student & Address */}
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: '700', color: '#0F172A' }}>
                          {order.shippingAddress?.fullName}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                          📞 {order.shippingAddress?.phone}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#475569', marginTop: '2px' }}>
                          📍 {order.shippingAddress?.collegeName ? `${order.shippingAddress?.collegeName}, ` : ''}
                          {order.shippingAddress?.hostelOrAddress}, {order.shippingAddress?.city}
                        </div>
                      </td>

                      {/* Items */}
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: '600', color: '#0F172A' }}>
                          {order.orderItems?.length || 1} {order.orderItems?.length === 1 ? 'Product' : 'Products'}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#64748B', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {order.orderItems?.[0]?.name}
                        </div>
                      </td>

                      {/* Amount Paid & Method */}
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: '800', color: '#0F172A', fontSize: '0.95rem' }}>
                          ₹{order.totalPrice?.toLocaleString('en-IN')}
                        </div>
                        <span style={{
                          display: 'inline-block',
                          fontSize: '0.7rem',
                          fontWeight: '700',
                          backgroundColor: order.paymentMethod === 'UPI' ? '#DCFCE7' : '#FEF3C7',
                          color: order.paymentMethod === 'UPI' ? '#166534' : '#B45309',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          marginTop: '2px'
                        }}>
                          {order.paymentMethod || 'COD'}
                        </span>
                      </td>

                      {/* Delhivery AWB */}
                      <td style={{ padding: '14px 16px', fontFamily: 'monospace', fontSize: '0.8rem', color: '#334155' }}>
                        {order.trackingNumber}
                      </td>

                      {/* Live Status Action Selector */}
                      <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                        <select
                          value={order.orderStatus}
                          disabled={updatingId === order._id}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          style={{
                            padding: '6px 10px',
                            borderRadius: '6px',
                            border: '1px solid #CBD5E1',
                            fontWeight: '700',
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                            outline: 'none',
                            backgroundColor:
                              order.orderStatus === 'Delivered'
                                ? '#DCFCE7'
                                : order.orderStatus === 'Dispatched'
                                ? '#DBEAFE'
                                : order.orderStatus === 'Packed'
                                ? '#FEF3C7'
                                : '#F1F5F9',
                            color:
                              order.orderStatus === 'Delivered'
                                ? '#166534'
                                : order.orderStatus === 'Dispatched'
                                ? '#1E40AF'
                                : order.orderStatus === 'Packed'
                                ? '#92400E'
                                : '#334155'
                          }}
                        >
                          <option value="Processing">🟡 Processing</option>
                          <option value="Packed">📦 Packed</option>
                          <option value="Dispatched">🚚 Dispatched (Delhivery)</option>
                          <option value="Delivered">✅ Delivered to Campus</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}