import React, { useState, useEffect } from 'react';

const API = 'http://localhost:8080';

export default function StudentDashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const studentId = localStorage.getItem('studentId');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await fetch(`${API}/api/documents/student/${studentId}`);
      const data = await res.json();
      setRequests(Array.isArray(data) ? data.reverse() : []);
    } catch (e) {
      setError('Error loading requests: ' + e.message);
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('studentId');
    localStorage.removeItem('role');
    localStorage.removeItem('userType');
    window.location.href = '/';
  };

  const getStatusColor = (status) => {
    if (status === 'approved') return { bg: '#d1fae5', text: '#065f46', border: '#6ee7b7' };
    if (status === 'rejected') return { bg: '#fee2e2', text: '#991b1b', border: '#fca5a5' };
    return { bg: '#fef3c7', text: '#92400e', border: '#fcd34d' };
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '1rem', padding: '2rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '2rem', color: '#fff', fontWeight: '700' }}>🎓 My Documents</h1>
            <p style={{ margin: '0.5rem 0 0 0', color: '#e0e7ff' }}>ID: {studentId}</p>
          </div>
          <button onClick={handleLogout} style={{ background: '#fff', color: '#667eea', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', fontWeight: '600', cursor: 'pointer' }}>
            🚪 Logout
          </button>
        </div>

        {error && (
          <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '0.5rem', padding: '1rem', marginBottom: '1.5rem', color: '#991b1b' }}>
            ⚠️ {error}
          </div>
        )}

        <h2 style={{ fontSize: '1.4rem', color: '#1f2937', marginBottom: '1rem' }}>📋 My Requests ({requests.length})</h2>

        {loading ? (
          <p style={{ textAlign: 'center', color: '#6b7280' }}>🔄 Loading...</p>
        ) : requests.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', background: '#fff', borderRadius: '1rem' }}>
            <p style={{ color: '#6b7280' }}>📭 No requests yet</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1.25rem' }}>
            {requests.map((req) => {
              const c = getStatusColor(req.status);
              return (
                <div key={req.requestId} style={{ background: '#fff', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', border: `2px solid ${c.border}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#1f2937' }}>📄 {req.documentType}</h3>
                      <p style={{ margin: '0.4rem 0 0 0', fontSize: '0.85rem', color: '#6b7280' }}>🔖 {req.requestId} • 📅 {req.createdDate}</p>
                    </div>
                    <span style={{ background: c.bg, color: c.text, padding: '0.4rem 0.9rem', borderRadius: '0.375rem', fontSize: '0.8rem', fontWeight: '700' }}>
                      {req.status === 'approved' && '✅ APPROVED'}
                      {req.status === 'rejected' && '❌ REJECTED'}
                      {req.status === 'pending' && '⏳ PENDING'}
                    </span>
                  </div>

                  <p style={{ margin: '0 0 1rem 0', fontSize: '0.95rem', color: '#374151' }}>📌 {req.purpose}</p>

                  {req.status === 'approved' && req.fileName && (
                    <a
                      href={`${API}/api/documents/download/${req.requestId}`}
                      style={{ display: 'inline-block', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#fff', padding: '0.625rem 1.25rem', borderRadius: '0.5rem', fontWeight: '600', fontSize: '0.9rem', textDecoration: 'none' }}
                    >
                      📥 Download Document
                    </a>
                  )}

                  {req.status === 'approved' && !req.fileName && (
                    <p style={{ margin: 0, color: '#92400e', fontSize: '0.875rem' }}>⏳ Approved. Document upload hone ka wait karein.</p>
                  )}

                  {req.status === 'rejected' && (
                    <p style={{ margin: 0, color: '#991b1b', fontSize: '0.875rem' }}>Ye request reject ho gayi.</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}