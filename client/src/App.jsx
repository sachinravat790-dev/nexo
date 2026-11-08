import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import CartDrawer from './components/cart/CartDrawer';
import Home from './pages/Home';
import Auth from './pages/Auth';
import StudentVerification from './pages/StudentVerification';
import VerifyStudents from './pages/admin/VerifyStudents';
import AdminDashboard from './pages/admin/AdminDashboard';
import Checkout from './pages/Checkout';
import MyOrders from './pages/MyOrders';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* 1. Main Home Storefront */}
            <Route path="/" element={<Home />} />

            {/* 2. Authentication (Login / Register) */}
            <Route path="/login" element={<Auth />} />
            <Route path="/signup" element={<Auth />} />

            {/* 3. Student Verification Form */}
            <Route path="/student-verify" element={<StudentVerification />} />

            {/* 4. Campus Checkout (Day 7) */}
            <Route path="/checkout" element={<Checkout />} />

            {/* 5. Order Tracking & History (Day 7) */}
            <Route path="/orders" element={<MyOrders />} />

            {/* 6. Admin Portals (Day 6 & Day 8) */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/verify-students" element={<VerifyStudents />} />
          </Routes>
          <CartDrawer />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;