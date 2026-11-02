import { useEffect, useState } from 'react';

function App() {
  const [status, setStatus] = useState('Connecting to NEXO Backend...');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
 fetch('http://127.0.0.1:8000/api/health')

      .then((res) => {
        if (!res.ok) throw new Error(`HTTP Status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setStatus(data.message);
        setIsSuccess(true);
      })
      .catch((err) => {
        setStatus(`Connection Error: ${err.message}`);
        setIsSuccess(false);
      });
  }, []);

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', textAlign: 'center', padding: '60px' }}>
      <h1 style={{ color: '#4F46E5', fontSize: '3rem', margin: '0' }}>NEXO</h1>
      <p style={{ color: '#6B7280', fontSize: '1.25rem', marginTop: '8px' }}>
        Shop Smart. Live Better.
      </p>

      <div style={{
        marginTop: '40px',
        padding: '20px 30px',
        background: '#F3F4F6',
        borderRadius: '12px',
        display: 'inline-block',
        border: '1px solid #E5E7EB'
      }}>
        <div style={{ fontSize: '0.9rem', color: '#4B5563', marginBottom: '8px' }}>
          Server Health Status:
        </div>
        <strong style={{
          color: isSuccess ? '#059669' : '#DC2626',
          fontSize: '1.2rem'
        }}>
          {status}
        </strong>
      </div>
    </div>
  );
}

export default App;
