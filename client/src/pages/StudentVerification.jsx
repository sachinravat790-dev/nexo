import { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/apiClient';
import { GraduationCap, UploadCloud, CheckCircle2, Clock, LogIn, UserPlus, Lock } from 'lucide-react';

export default function StudentVerification() {
  const { user, login } = useAuth();
  const [collegeName, setCollegeName] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [currentStatus, setCurrentStatus] = useState(user?.studentDetails?.verificationStatus || 'none');
  const [studentCode, setStudentCode] = useState(user?.studentDetails?.studentIdCode || null);

  // Auth Mode: 'login' or 'register' for first-time users
  const [authMode, setAuthMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Sync user status when auth state updates
  useEffect(() => {
    if (user?.studentDetails) {
      setCurrentStatus(user.studentDetails.verificationStatus || 'none');
      setStudentCode(user.studentDetails.studentIdCode || null);
    }
  }, [user]);

  // Handle Quick Auth (Login or Signup)
  const handleQuickAuth = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setStatusMessage('');

    try {
      const endpoint = authMode === 'register' ? '/auth/signup' : '/auth/login';
      const payload = authMode === 'register' ? { name, email, password } : { email, password };

      const res = await apiClient.post(endpoint, payload);
      if (res.data.success) {
        localStorage.setItem('nexo_token', res.data.token);
        login(res.data.user, res.data.token);
        setCurrentStatus(res.data.user?.studentDetails?.verificationStatus || 'none');
        setStudentCode(res.data.user?.studentDetails?.studentIdCode || null);
        setStatusMessage(
          authMode === 'register'
            ? 'Account created successfully! Now please upload your College ID card.'
            : 'Logged in successfully! Now you can upload your ID card.'
        );
      } else {
        setStatusMessage(res.data.message || 'Authentication failed. Please check your details.');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Unable to reach server. Please ensure backend is running.';
      setStatusMessage(msg);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!collegeName || !file) {
      alert('Please enter your college name and select your ID photo!');
      return;
    }

    setLoading(true);
    setStatusMessage('');

    const token = localStorage.getItem('nexo_token');
    if (!token) {
      setStatusMessage('Please login or register first to submit verification.');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('collegeName', collegeName);
    formData.append('document', file);

    try {
      const res = await apiClient.post('/student/verify', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data.success) {
        setCurrentStatus('pending');
        setStatusMessage('Your ID card has been uploaded successfully! Admin will review it shortly.');
      } else {
        setStatusMessage(res.data.message || 'Verification submission failed');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Server error while uploading. Please check connection.';
      setStatusMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ maxWidth: '800px', margin: '40px auto', width: '100%', padding: '0 20px' }}>
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
          padding: '36px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              backgroundColor: '#EEF2FF',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px auto'
            }}>
              <GraduationCap size={32} color="#4F46E5" />
            </div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#0F172A' }}>
              NEXO Student Discount Program
            </h1>
            <p style={{ color: '#64748B', fontSize: '0.95rem', marginTop: '6px' }}>
              Upload your valid College ID card to unlock exclusive student pricing & coupons.
            </p>
          </div>

          {/* AGAR USER LOGIN NAHI HAI TOH PEHLE LOGIN / REGISTER BOX DIKHEGA */}
          {!user ? (
            <div style={{
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '12px',
              padding: '28px',
              textAlign: 'center'
            }}>
              <div style={{ display: 'inline-flex', padding: '10px', background: '#EEF2FF', borderRadius: '50%', color: '#4F46E5', marginBottom: '10px' }}>
                <Lock size={24} />
              </div>

              {/* Mode Toggle Pills (Sign In vs Register) */}
              <div style={{
                display: 'inline-flex',
                backgroundColor: '#E2E8F0',
                borderRadius: '8px',
                padding: '3px',
                marginBottom: '16px'
              }}>
                <button
                  type="button"
                  onClick={() => { setAuthMode('login'); setStatusMessage(''); }}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: authMode === 'login' ? '#0F172A' : 'transparent',
                    color: authMode === 'login' ? '#FFF' : '#475569',
                    fontWeight: '700',
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthMode('register'); setStatusMessage(''); }}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: authMode === 'register' ? '#0F172A' : 'transparent',
                    color: authMode === 'register' ? '#FFF' : '#475569',
                    fontWeight: '700',
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  Create Account (New User)
                </button>
              </div>

              <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0F172A', marginBottom: '6px' }}>
                {authMode === 'register' ? 'Register Your NEXO Account' : 'Please Sign In to Continue'}
              </h2>
              <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '20px' }}>
                {authMode === 'register'
                  ? 'First time here? Create your account first, then upload your College ID card.'
                  : 'Sign in with your email and password to upload your ID and verify your student status.'}
              </p>

              <form onSubmit={handleQuickAuth} style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '400px', margin: '0 auto' }}>
                {authMode === 'register' && (
                  <input
                    type="text"
                    placeholder="Full Name (e.g. Rahul Sharma)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    style={{ padding: '12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem', outline: 'none' }}
                  />
                )}

                <input
                  type="email"
                  placeholder="Email (e.g. sachin@gmail.com)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{ padding: '12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem', outline: 'none' }}
                />
                <input
                  type="password"
                  placeholder="Password (min 6 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ padding: '12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem', outline: 'none' }}
                />

                {statusMessage && (
                  <div style={{
                    fontSize: '0.85rem',
                    color: statusMessage.includes('successfully') ? '#16A34A' : '#DC2626',
                    fontWeight: 'bold'
                  }}>
                    {statusMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={authLoading}
                  style={{
                    backgroundColor: '#0F172A',
                    color: '#FFF',
                    padding: '12px',
                    borderRadius: '8px',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    border: 'none'
                  }}
                >
                  {authMode === 'register' ? <UserPlus size={16} /> : <LogIn size={16} />}
                  <span>
                    {authLoading
                      ? (authMode === 'register' ? 'Creating Account...' : 'Signing in...')
                      : (authMode === 'register' ? 'Create Account & Continue' : 'Sign In & Verify ID')}
                  </span>
                </button>
              </form>

              <div style={{ marginTop: '16px', fontSize: '0.85rem', color: '#64748B' }}>
                {authMode === 'register' ? (
                  <span>
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => { setAuthMode('login'); setStatusMessage(''); }}
                      style={{ background: 'none', border: 'none', color: '#4F46E5', fontWeight: '700', cursor: 'pointer' }}
                    >
                      Sign In
                    </button>
                  </span>
                ) : (
                  <span>
                    First time user?{' '}
                    <button
                      type="button"
                      onClick={() => { setAuthMode('register'); setStatusMessage(''); }}
                      style={{ background: 'none', border: 'none', color: '#4F46E5', fontWeight: '700', cursor: 'pointer' }}
                    >
                      Create your NEXO account
                    </button>
                  </span>
                )}
              </div>
            </div>
          ) : currentStatus === 'approved' ? (
            /* APPROVED VIEW */
            <div style={{ backgroundColor: '#F0FDF4', border: '1px solid #86EFAC', borderRadius: '12px', padding: '24px', textAlign: 'center' }}>
              <CheckCircle2 size={40} color="#15803D" style={{ margin: '0 auto 10px auto' }} />
              <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#166534' }}>You are a Verified Student!</h3>
              <p style={{ color: '#15803D', fontSize: '0.9rem', marginTop: '4px' }}>Your Student ID Code is:</p>
              <div style={{ display: 'inline-block', background: '#166534', color: '#FFF', padding: '8px 18px', borderRadius: '8px', fontWeight: '900', fontSize: '1.2rem', marginTop: '10px', letterSpacing: '1px' }}>
                {studentCode || 'NEXO-STU-VERIFIED'}
              </div>
              <p style={{ color: '#15803D', fontSize: '0.85rem', marginTop: '12px' }}>Student discounts are automatically unlocked on all eligible products.</p>
            </div>
          ) : currentStatus === 'pending' ? (
            /* PENDING VIEW */
            <div style={{ backgroundColor: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '12px', padding: '24px', textAlign: 'center' }}>
              <Clock size={40} color="#D97706" style={{ margin: '0 auto 10px auto' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#B45309' }}>Verification Pending Review</h3>
              <p style={{ color: '#92400E', fontSize: '0.9rem', marginTop: '6px' }}>
                Your College ID has been uploaded. NEXO Admin is currently reviewing your document. Approval usually takes 1-2 hours!
              </p>
            </div>
          ) : (
            /* UPLOAD FORM (Only when Logged In) */
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ background: '#EEF2FF', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', color: '#3730A3', fontWeight: '600' }}>
                Signed in as: <strong>{user.name} ({user.email})</strong>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '700', color: '#1E293B', marginBottom: '8px' }}>
                  College / University Name:
                </label>
                <input
                  type="text"
                  placeholder="e.g. SAGE University Indore"
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.95rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '700', color: '#1E293B', marginBottom: '8px' }}>
                  Upload College ID Card (Photo or PDF):
                </label>
                <div style={{
                  border: '2px dashed #CBD5E1',
                  borderRadius: '12px',
                  padding: '24px',
                  textAlign: 'center',
                  backgroundColor: '#F8FAFC',
                  cursor: 'pointer'
                }}>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                    id="id-upload"
                  />
                  <label htmlFor="id-upload" style={{ cursor: 'pointer' }}>
                    <UploadCloud size={40} color="#6366F1" style={{ margin: '0 auto 8px auto' }} />
                    <div style={{ fontSize: '0.95rem', fontWeight: '600', color: '#4F46E5' }}>Click to select your ID photo</div>
                    <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '4px' }}>PNG, JPG or PDF (Max 5MB)</div>
                  </label>
                </div>
              </div>

              {preview && (
                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#475569' }}>Selected Document Preview:</span>
                  <div style={{ marginTop: '8px', height: '140px' }}>
                    <img src={preview} alt="ID Preview" style={{ maxHeight: '100%', borderRadius: '8px', border: '1px solid #E2E8F0' }} />
                  </div>
                </div>
              )}

              {statusMessage && (
                <div style={{
                  padding: '10px',
                  borderRadius: '8px',
                  backgroundColor: statusMessage.includes('successfully') ? '#F0FDF4' : '#EEF2FF',
                  color: statusMessage.includes('successfully') ? '#166534' : '#3730A3',
                  fontSize: '0.88rem',
                  fontWeight: '600',
                  textAlign: 'center'
                }}>
                  {statusMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  backgroundColor: '#4F46E5',
                  color: '#FFF',
                  padding: '14px',
                  borderRadius: '10px',
                  fontWeight: '700',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  border: 'none',
                  transition: 'background 0.2s'
                }}
              >
                {loading ? 'Uploading ID Card...' : 'Submit for Student Verification'}
              </button>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
