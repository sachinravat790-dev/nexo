import { useEffect, useState } from 'react';
import Navbar from '../../components/common/Navbar';
import apiClient from '../../api/apiClient';
import { Check, X, ExternalLink, ShieldCheck, RefreshCw, AlertCircle } from 'lucide-react';

export default function VerifyStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState('');

  const fetchPending = async () => {
    setLoading(true);
    setActionMessage('');
    try {
      const res = await apiClient.get('/student/admin/pending');
      if (res.data.success) {
        setStudents(res.data.students);
      }
    } catch (err) {
      console.error('Failed to fetch pending requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleReview = async (userId, status) => {
    try {
      const res = await apiClient.put(`/student/admin/review/${userId}`, { status });
      if (res.data.success) {
        setActionMessage(`Student successfully ${status === 'approved' ? 'Approved & Issued Student ID' : 'Rejected'}!`);
        fetchPending(); // Refresh list
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed');
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ maxWidth: '1200px', margin: '30px auto', width: '100%', padding: '0 20px' }}>
        {/* Header with Title and Refresh Button */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              backgroundColor: '#EEF2FF',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ShieldCheck size={26} color="#4F46E5" />
            </div>
            <div>
              <h1 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                Admin Student Verification Queue
              </h1>
              <p style={{ color: '#64748B', fontSize: '0.85rem', margin: '2px 0 0 0' }}>
                Review uploaded College ID cards and approve students for exclusive discounts.
              </p>
            </div>
          </div>

          <button
            onClick={fetchPending}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #CBD5E1',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: '600',
              color: '#334155',
              cursor: 'pointer'
            }}
          >
            <RefreshCw size={14} />
            <span>Refresh Queue ({students.length})</span>
          </button>
        </div>

        {/* Action notification message */}
        {actionMessage && (
          <div style={{
            backgroundColor: '#F0FDF4',
            border: '1px solid #86EFAC',
            color: '#166534',
            padding: '12px 18px',
            borderRadius: '10px',
            marginBottom: '20px',
            fontWeight: '600',
            fontSize: '0.9rem'
          }}>
            ✅ {actionMessage}
          </div>
        )}

        {loading ? (
          <div style={{
            backgroundColor: '#FFF',
            padding: '60px 20px',
            borderRadius: '12px',
            textAlign: 'center',
            border: '1px solid #E2E8F0',
            color: '#64748B'
          }}>
            Loading verification requests...
          </div>
        ) : students.length === 0 ? (
          <div style={{
            backgroundColor: '#FFF',
            padding: '60px 20px',
            borderRadius: '12px',
            textAlign: 'center',
            border: '1px solid #E2E8F0',
            color: '#64748B'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🎉</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#0F172A', marginBottom: '6px' }}>
              No Pending Verification Requests
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#64748B' }}>
              All submitted student documents have been verified and processed!
            </p>
          </div>
        ) : (
          <div style={{
            backgroundColor: '#FFF',
            borderRadius: '12px',
            border: '1px solid #E2E8F0',
            overflow: 'hidden',
            boxShadow: '0 4px 15px rgba(0,0,0,0.03)'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569' }}>
                <tr>
                  <th style={{ padding: '14px 18px' }}>Student Name</th>
                  <th style={{ padding: '14px 18px' }}>Email</th>
                  <th style={{ padding: '14px 18px' }}>College Name</th>
                  <th style={{ padding: '14px 18px' }}>ID Document</th>
                  <th style={{ padding: '14px 18px', textAlign: 'center' }}>Review Action</th>
                </tr>
              </thead>
              <tbody>
                {students.map((stu) => (
                  <tr key={stu._id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '14px 18px', fontWeight: '700', color: '#0F172A' }}>
                      {stu.name}
                    </td>
                    <td style={{ padding: '14px 18px', color: '#64748B' }}>
                      {stu.email}
                    </td>
                    <td style={{ padding: '14px 18px', color: '#0F172A', fontWeight: '500' }}>
                      {stu.studentDetails?.collegeName}
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {stu.studentDetails?.documentUrl && (
                          <img
                            src={`http://localhost:8000${stu.studentDetails?.documentUrl}`}
                            alt="ID Thumbnail"
                            style={{
                              width: '40px',
                              height: '40px',
                              objectFit: 'cover',
                              borderRadius: '6px',
                              border: '1px solid #E2E8F0'
                            }}
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        )}
                        <a
                          href={`http://localhost:8000${stu.studentDetails?.documentUrl}`}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            color: '#4F46E5',
                            fontWeight: '600',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            textDecoration: 'none'
                          }}
                        >
                          <span>View Full Photo</span>
                          <ExternalLink size={14} />
                        </a>
                      </div>
                    </td>
                    <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        <button
                          onClick={() => handleReview(stu._id, 'approved')}
                          style={{
                            backgroundColor: '#10B981',
                            color: '#FFF',
                            padding: '8px 14px',
                            borderRadius: '6px',
                            fontWeight: '700',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            fontSize: '0.82rem',
                            cursor: 'pointer',
                            border: 'none',
                            transition: 'background 0.2s'
                          }}
                        >
                          <Check size={15} />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleReview(stu._id, 'rejected')}
                          style={{
                            backgroundColor: '#EF4444',
                            color: '#FFF',
                            padding: '8px 14px',
                            borderRadius: '6px',
                            fontWeight: '700',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            fontSize: '0.82rem',
                            cursor: 'pointer',
                            border: 'none',
                            transition: 'background 0.2s'
                          }}
                        >
                          <X size={15} />
                          <span>Reject</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
