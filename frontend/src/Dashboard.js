import React, { useState, useEffect } from 'react';
import CreateRequest from './CreateRequest';

export default function Dashboard() {
  const [requests, setRequests] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/requests/test123');
      const data = await res.json();
      setRequests(data);
    } catch (e) {
      console.log('Error:', e);
    }
    setLoading(false);
  };

  const getDocIcon = (doc) => {
    if (doc.includes('Bonafide')) return '📄';
    if (doc.includes('Transcript')) return '📋';
    if (doc.includes('Character')) return '🎓';
    if (doc.includes('Marksheet')) return '📊';
    if (doc.includes('Leaving')) return '🏫';
    return '📑';
  };

  const downloadDocument = (requestId, documentType) => {
    const url = `http://localhost:8080/api/download/document/${requestId}/${documentType}`;
    const link = document.createElement('a');
    link.href = url;
    link.download = `${requestId}_${documentType}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLogout = () => {
    window.location.href = '/';
  };

  if (showForm) {
    return <CreateRequest onBack={() => { setShowForm(false); fetchRequests(); }} />;
  }

  const getStatusConfig = (status) => {
    if (status === 'approved') return { bg: '#dcfce7', border: '#16a34a', text: '#15803d', label: '✅ Approved' };
    if (status === 'rejected') return { bg: '#fee2e2', border: '#dc2626', text: '#b91c1c', label: '❌ Rejected' };
    return { bg: '#fef3c7', border: '#d97706', text: '#b45309', label: '⏳ Pending' };
  };

  const pendingCount = requests.filter(r => r.status === 'pending').length;
  const approvedCount = requests.filter(r => r.status === 'approved').length;
  const rejectedCount = requests.filter(r => r.status === 'rejected').length;

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #eef2ff 0%, #f5f3ff 50%, #fdf2f8 100%)', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', borderRadius: '1rem', padding: '2rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 10px 25px rgba(79,70,229,0.25)' }}>
          <div>
            <h1 style={{ margin: '0', fontSize: '2rem', color: '#ffffff', fontWeight: '800' }}>🎓 Student Dashboard</h1>
            <p style={{ margin: '0.5rem 0 0 0', color: '#e0e7ff' }}>Track and manage your document requests</p>
          </div>
          <button onClick={handleLogout} style={{ background: '#ffffff', color: '#4f46e5', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', fontWeight: '700', cursor: 'pointer', boxShadow: '0 2px 6px rgba(0,0,0,0.15)' }}>
            Logout
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '0.75rem', borderTop: '4px solid #d97706', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
            <p style={{ margin: '0', color: '#6b7280', fontSize: '0.875rem', fontWeight: '600' }}>⏳ PENDING</p>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '2.25rem', fontWeight: '800', color: '#d97706' }}>{pendingCount}</p>
          </div>
          <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '0.75rem', borderTop: '4px solid #16a34a', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
            <p style={{ margin: '0', color: '#6b7280', fontSize: '0.875rem', fontWeight: '600' }}>✅ APPROVED</p>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '2.25rem', fontWeight: '800', color: '#16a34a' }}>{approvedCount}</p>
          </div>
          <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '0.75rem', borderTop: '4px solid #dc2626', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
            <p style={{ margin: '0', color: '#6b7280', fontSize: '0.875rem', fontWeight: '600' }}>❌ REJECTED</p>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '2.25rem', fontWeight: '800', color: '#dc2626' }}>{rejectedCount}</p>
          </div>
        </div>

        {/* Requests List */}
        <div style={{ background: '#ffffff', borderRadius: '1rem', padding: '2rem', boxShadow: '0 4px 12px rgba(0,0,0,0.06)', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1f2937', marginBottom: '1.5rem' }}>📑 Your Requests</h2>

          {loading ? (
            <p style={{ color: '#6b7280' }}>Loading...</p>
          ) : requests.length === 0 ? (
            <p style={{ color: '#6b7280' }}>No requests yet — click "New Request" below to get started.</p>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {requests.map((req, i) => {
                const cfg = getStatusConfig(req.status);
                return (
                  <div key={i} style={{ border: `2px solid ${cfg.border}22`, background: `${cfg.bg}55`, borderRadius: '0.75rem', padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '0.75rem' }}>
                      <div>
                        <h3 style={{ margin: '0', fontSize: '1.15rem', color: '#1f2937', fontWeight: '700' }}>{getDocIcon(req.documentType)} {req.documentType}</h3>
                        <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.875rem', color: '#6b7280' }}>Request ID: <strong>{req.requestId}</strong> • {req.createdDate}</p>
                      </div>
                      <div style={{ background: cfg.border, color: '#ffffff', padding: '0.5rem 1rem', borderRadius: '2rem', fontSize: '0.875rem', fontWeight: '700', whiteSpace: 'nowrap' }}>
                        {cfg.label}
                      </div>
                    </div>

                    <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: `1px solid ${cfg.border}33` }}>
                      {req.status === 'approved' ? (
                        <button onClick={() => downloadDocument(req.requestId, req.documentType)} style={{ background: '#16a34a', color: '#ffffff', border: 'none', padding: '0.6rem 1.25rem', borderRadius: '0.5rem', fontWeight: '700', cursor: 'pointer', boxShadow: '0 2px 6px rgba(22,163,74,0.3)' }}>
                          ⬇️ Download Document
                        </button>
                      ) : req.status === 'rejected' ? (
                        <div>
                          <button style={{ background: '#dc2626', color: '#ffffff', border: 'none', padding: '0.6rem 1.25rem', borderRadius: '0.5rem', fontWeight: '700', cursor: 'pointer', boxShadow: '0 2px 6px rgba(220,38,38,0.3)' }}>
                            🔄 Resubmit Request
                          </button>
                          {req.comment && <p style={{ margin: '0.75rem 0 0 0', fontSize: '0.875rem', color: '#991b1b' }}>💬 Admin note: {req.comment}</p>}
                        </div>
                      ) : (
                        <span style={{ color: '#b45309', fontSize: '0.9rem', fontWeight: '600' }}>⏳ Waiting for admin review...</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={() => setShowForm(true)} style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', color: '#ffffff', border: 'none', padding: '1rem 2rem', borderRadius: '0.75rem', fontWeight: '700', cursor: 'pointer', fontSize: '1rem', boxShadow: '0 4px 12px rgba(79,70,229,0.3)' }}>
            ➕ New Request
          </button>
        </div>
      </div>
    </div>
  );
}