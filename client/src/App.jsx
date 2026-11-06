import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import CartDrawer from './components/cart/CartDrawer';
import Home from './pages/Home';
import Auth from './pages/Auth';
import StudentVerification from './pages/StudentVerification';
import VerifyStudents from './pages/admin/VerifyStudents';

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

            {/* 4. Admin Verification Queue Portal */}
            <Route path="/admin/verify-students" element={<VerifyStudents />} />
          </Routes>
          <CartDrawer />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
