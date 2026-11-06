import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/apiClient';
import { LogIn, UserPlus, ShieldCheck } from 'lucide-react';

export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Agar user /signup par aaya hai toh default register mode rakho
  const [isRegister, setIsRegister] = useState(location.pathname === '/signup');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const endpoint = isRegister ? '/auth/signup' : '/auth/login';
      const payload = isRegister ? { name, email, password } : { email, password };

      const res = await apiClient.post(endpoint, payload);

      if (res.data.success) {
        localStorage.setItem('nexo_token', res.data.token);
        login(res.data.user, res.data.token);

        // Redirect user to where they wanted to go, or student verification
        navigate('/student-verify');
      } else {
        setErrorMessage(res.data.message || 'Authentication failed');
      }
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || 'Server error. Please ensure backend is running.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F8FAFC',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      {/* Brand Header */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <div style={{ fontSize: '2.2rem', fontWeight: '900', color: '#0F172A', letterSpacing: '-0.5px' }}>
            nexo<span style={{ color: '#FF9900' }}>.in</span>
          </div>
        </Link>
        <p style={{ color: '#64748B', fontSize: '0.9rem', marginTop: '4px' }}>
          Shop Smart. Live Better.
        </p>
      </div>

      {/* Main Card */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid #E2E8F0',
        padding: '36px',
        width: '100%',
        maxWidth: '440px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
      }}>
        {/* Toggle Mode Pills */}
        <div style={{
          display: 'flex',
          backgroundColor: '#F1F5F9',
          borderRadius: '10px',
          padding: '4px',
          marginBottom: '24px'
        }}>
          <button
            type="button"
            onClick={() => { setIsRegister(false); setErrorMessage(''); }}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: !isRegister ? '#FFFFFF' : 'transparent',
              color: !isRegister ? '#0F172A' : '#64748B',
              fontWeight: '700',
              fontSize: '0.9rem',
              cursor: 'pointer',
              boxShadow: !isRegister ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsRegister(true); setErrorMessage(''); }}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: isRegister ? '#FFFFFF' : 'transparent',
              color: isRegister ? '#0F172A' : '#64748B',
              fontWeight: '700',
              fontSize: '0.9rem',
              cursor: 'pointer',
              boxShadow: isRegister ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            Create Account
          </button>
        </div>

        <h1 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0F172A', marginBottom: '8px' }}>
          {isRegister ? 'Create your NEXO account' : 'Sign in to your account'}
        </h1>
        <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '20px' }}>
          {isRegister
            ? 'Sign up to unlock exclusive student deals, track orders & faster checkout.'
            : 'Enter your email and password to access your student discounts and orders.'}
        </p>

        {errorMessage && (
          <div style={{
            backgroundColor: '#FEF2F2',
            border: '1px solid #FCA5A5',
            color: '#B91C1C',
            padding: '10px 14px',
            borderRadius: '8px',
            fontSize: '0.85rem',
            marginBottom: '18px',
            fontWeight: '600'
          }}>
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {isRegister && (
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                Your Name
              </label>
              <input
                type="text"
                placeholder="First and last name (e.g. Rahul Sharma)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.92rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
              Email Address
            </label>
            <input
              type="email"
              placeholder="e.g. sachin@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                fontSize: '0.92rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
              Password
            </label>
            <input
              type="password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                fontSize: '0.92rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: '#0F172A',
              color: '#FFF',
              padding: '13px',
              borderRadius: '8px',
              fontWeight: '700',
              fontSize: '0.95rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer',
              border: 'none',
              marginTop: '6px',
              transition: 'background 0.2s'
            }}
          >
            {isRegister ? <UserPlus size={18} /> : <LogIn size={18} />}
            <span>
              {loading
                ? (isRegister ? 'Creating Account...' : 'Signing in...')
                : (isRegister ? 'Create NEXO Account' : 'Sign In')}
            </span>
          </button>
        </form>

        <div style={{
          marginTop: '24px',
          paddingTop: '20px',
          borderTop: '1px solid #F1F5F9',
          textAlign: 'center',
          fontSize: '0.85rem',
          color: '#64748B'
        }}>
          {isRegister ? (
            <span>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => { setIsRegister(false); setErrorMessage(''); }}
                style={{ background: 'none', border: 'none', color: '#4F46E5', fontWeight: '700', cursor: 'pointer' }}
              >
                Sign In
              </button>
            </span>
          ) : (
            <span>
              New to NEXO?{' '}
              <button
                type="button"
                onClick={() => { setIsRegister(true); setErrorMessage(''); }}
                style={{ background: 'none', border: 'none', color: '#4F46E5', fontWeight: '700', cursor: 'pointer' }}
              >
                Create an account
              </button>
            </span>
          )}
        </div>
      </div>

      {/* Trust Badge */}
      <div style={{
        marginTop: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        color: '#64748B',
        fontSize: '0.8rem'
      }}>
        <ShieldCheck size={16} color="#10B981" />
        <span>Bank-grade 256-bit encrypted secure authorization</span>
      </div>
    </div>
  );
}

