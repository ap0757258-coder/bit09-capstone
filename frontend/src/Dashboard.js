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

  const handleLogout = () => {
    window.location.href = '/';
  };

  if (showForm) {
    return <CreateRequest onBack={() => { setShowForm(false); fetchRequests(); }} />;
  }

  const getStatusColor = (status) => {
    if (status === 'approved') return '#16a34a';
    if (status === 'rejected') return '#dc2626';
    return '#ca8a04';
  };

  return (
    <div style={{ minHeight: '100vh', background: '#ffffff', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ borderBottom: '2px solid #e5e7eb', paddingBottom: '2rem', marginBottom: '2rem' }}>
          <h1 style={{ margin: '0', fontSize: '2rem', color: '#111827', fontWeight: '700' }}>Dashboard</h1>
          <p style={{ margin: '0.5rem 0 0 0', color: '#6b7280' }}>Manage your document requests</p>
        </div>

        {/* Requests List */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '1.5rem' }}>Your Requests</h2>

          {loading ? (
            <p style={{ color: '#6b7280' }}>Loading...</p>
          ) : requests.length === 0 ? (
            <p style={{ color: '#6b7280' }}>No requests yet</p>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {requests.map((req, i) => (
                <div key={i} style={{ border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div>
                      <h3 style={{ margin: '0', fontSize: '1.1rem', color: '#1f2937', fontWeight: '600' }}>{getDocIcon(req.documentType)} {req.documentType}</h3>
                      <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#6b7280' }}>{req.requestId} • {req.createdDate}</p>
                    </div>
                    <div style={{ background: getStatusColor(req.status), color: '#ffffff', padding: '0.375rem 0.75rem', borderRadius: '0.25rem', fontSize: '0.875rem', fontWeight: '600' }}>
                      {req.status.toUpperCase()}
                    </div>
                  </div>

                  <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
                    {req.status === 'approved' ? (
                      <button style={{ background: '#16a34a', color: '#ffffff', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.375rem', fontWeight: '600', cursor: 'pointer' }}>
                        Download
                      </button>
                    ) : req.status === 'rejected' ? (
                      <button style={{ background: '#dc2626', color: '#ffffff', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.375rem', fontWeight: '600', cursor: 'pointer' }}>
                        Resubmit
                      </button>
                    ) : (
                      <span style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Pending review</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem', paddingTop: '2rem', borderTop: '1px solid #e5e7eb' }}>
          <button onClick={() => setShowForm(true)} style={{ background: '#1f2937', color: '#ffffff', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '0.375rem', fontWeight: '600', cursor: 'pointer' }}>
            New Request
          </button>
          <button onClick={handleLogout} style={{ background: '#e5e7eb', color: '#1f2937', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '0.375rem', fontWeight: '600', cursor: 'pointer' }}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}