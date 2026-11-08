import { Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer style={{ width: '100%', marginTop: 'auto' }}>
      {/* 1. Amazon "Back to top" Strip */}
      <div
        onClick={scrollToTop}
        style={{
          backgroundColor: '#37475A',
          color: '#FFF',
          textAlign: 'center',
          padding: '15px 0',
          fontSize: '0.82rem',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'background-color 0.2s'
        }}
        onMouseEnter={(e) => (e.target.style.backgroundColor = '#485769')}
        onMouseLeave={(e) => (e.target.style.backgroundColor = '#37475A')}
      >
        Back to top
      </div>

      {/* 2. Main Links Columns Section */}
      <div style={{ backgroundColor: '#232F3E', color: '#DDD', padding: '44px 20px', borderBottom: '1px solid #3A4553' }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '30px'
        }}>
          {/* Column 1 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h4 style={{ color: '#FFF', fontSize: '1rem', fontWeight: '700', marginBottom: '4px' }}>Get to Know Us</h4>
            <span style={{ fontSize: '0.85rem', cursor: 'pointer', color: '#DDD' }}>About NEXO</span>
            <span style={{ fontSize: '0.85rem', cursor: 'pointer', color: '#DDD' }}>Careers</span>
            <span style={{ fontSize: '0.85rem', cursor: 'pointer', color: '#DDD' }}>Press Releases</span>
            <span style={{ fontSize: '0.85rem', cursor: 'pointer', color: '#DDD' }}>NEXO Science & AI</span>
          </div>

          {/* Column 2 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h4 style={{ color: '#FFF', fontSize: '1rem', fontWeight: '700', marginBottom: '4px' }}>Connect with Us</h4>
            <span style={{ fontSize: '0.85rem', cursor: 'pointer', color: '#DDD' }}>Facebook</span>
            <span style={{ fontSize: '0.85rem', cursor: 'pointer', color: '#DDD' }}>Twitter (X)</span>
            <span style={{ fontSize: '0.85rem', cursor: 'pointer', color: '#DDD' }}>Instagram</span>
            <span style={{ fontSize: '0.85rem', cursor: 'pointer', color: '#DDD' }}>YouTube Community</span>
          </div>

          {/* Column 3 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h4 style={{ color: '#FFF', fontSize: '1rem', fontWeight: '700', marginBottom: '4px' }}>Make Money with Us</h4>
            <span style={{ fontSize: '0.85rem', cursor: 'pointer', color: '#DDD' }}>Sell on NEXO</span>
            <span style={{ fontSize: '0.85rem', cursor: 'pointer', color: '#DDD' }}>Protect & Build Your Brand</span>
            <span style={{ fontSize: '0.85rem', cursor: 'pointer', color: '#DDD' }}>Become a Delivery Partner</span>
            <span style={{ fontSize: '0.85rem', cursor: 'pointer', color: '#DDD' }}>College Campus Ambassador</span>
          </div>

          {/* Column 4 - Student Club & Admin Operations */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h4 style={{ color: '#FFF', fontSize: '1rem', fontWeight: '700', marginBottom: '4px' }}>NEXO Operations</h4>
            <Link
              to="/student-verify"
              style={{ fontSize: '0.85rem', cursor: 'pointer', color: '#FF9900', fontWeight: 'bold', textDecoration: 'none' }}
            >
              🎓 Student ID Verification
            </Link>
            <Link
              to="/admin/dashboard"
              style={{ fontSize: '0.85rem', cursor: 'pointer', color: '#38BDF8', fontWeight: '700', textDecoration: 'none' }}
            >
              📊 Admin Operations & Orders Hub
            </Link>
            <Link
              to="/admin/verify-students"
              style={{ fontSize: '0.85rem', cursor: 'pointer', color: '#93C5FD', fontWeight: '600', textDecoration: 'none' }}
            >
              🛡️ Student Verification Queue
            </Link>
            <span style={{ fontSize: '0.85rem', cursor: 'pointer', color: '#DDD' }}>100% Purchase Protection</span>
            <span style={{ fontSize: '0.85rem', cursor: 'pointer', color: '#DDD' }}>24x7 Student Helpdesk</span>
          </div>
        </div>

        {/* Middle Logo & Language Bar */}
        <div style={{
          maxWidth: '1200px',
          margin: '36px auto 0 auto',
          paddingTop: '28px',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '24px',
          flexWrap: 'wrap'
        }}>
          <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#FFF', letterSpacing: '-0.5px' }}>
            nexo<span style={{ color: '#FF9900' }}>.in</span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            border: '1px solid #848688',
            borderRadius: '4px',
            padding: '6px 12px',
            fontSize: '0.8rem',
            color: '#CCC',
            cursor: 'pointer'
          }}>
            <Globe size={14} />
            <span>English - EN</span>
          </div>

          <div style={{
            border: '1px solid #848688',
            borderRadius: '4px',
            padding: '6px 12px',
            fontSize: '0.8rem',
            color: '#CCC',
            cursor: 'pointer'
          }}>
            🇮🇳 India
          </div>
        </div>
      </div>

      {/* 3. Bottom Black Copyright & Legal Strip */}
      <div style={{ backgroundColor: '#131A22', padding: '24px 20px', textAlign: 'center', color: '#999', fontSize: '0.75rem', lineHeight: '1.8' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '8px' }}>
          <span style={{ cursor: 'pointer' }}>Conditions of Use & Sale</span>
          <span style={{ cursor: 'pointer' }}>Privacy Notice</span>
          <Link to="/admin/dashboard" style={{ color: '#38BDF8', textDecoration: 'none' }}>Admin Operations Hub</Link>
          <Link to="/admin/verify-students" style={{ color: '#93C5FD', textDecoration: 'none' }}>Verify Students</Link>
        </div>
        <div>© 2026 NEXO.in, Inc. or its affiliates. All rights reserved. Built for College Students across India.</div>
      </div>
    </footer>
  );
}