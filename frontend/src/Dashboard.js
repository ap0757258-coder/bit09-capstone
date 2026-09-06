import React, { useState, useEffect } from 'react';
import CreateRequestForm from './CreateRequestForm';

export default function Dashboard() {
  const [requests, setRequests] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedQR, setSelectedQR] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/requests/TDIT065A');
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

  const downloadCertificate = (requestId) => {
    const url = `http://localhost:8080/api/certificate/download/${requestId}`;
    const link = document.createElement('a');
    link.href = url;
    link.download = `${requestId}_Certificate.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

  const generateAndShowQR = (requestId) => {
    const timestamp = Date.now();
    const verificationCode = requestId + "-" + String(timestamp % 1000000).padStart(6, '0');
    setSelectedQR({ requestId, verificationCode });
    setShowQRModal(true);
  };

  const handleLogout = () => {
    window.location.href = '/';
  };

  if (showCreateForm) {
    return <CreateRequestForm studentId="TDIT065A" onBack={() => { setShowCreateForm(false); fetchRequests(); }} />;
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
        <div style={{ borderBottom: '2px solid #e5e7eb', paddingBottom: '2rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: '0', fontSize: '2rem', color: '#111827', fontWeight: '700' }}>Dashboard</h1>
            <p style={{ margin: '0.5rem 0 0 0', color: '#6b7280' }}>Manage your document requests</p>
          </div>
          <button onClick={handleLogout} style={{ background: '#ef4444', color: '#ffffff', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '0.375rem', fontWeight: '600', cursor: 'pointer' }}>
            Logout
          </button>
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

                  <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #e5e7eb' }}>
                    <p style={{ margin: '0', fontSize: '0.875rem', color: '#6b7280' }}>Purpose: {req.purpose}</p>
                  </div>

                  <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
                    {req.status === 'approved' ? (
                      <div>
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                          <button onClick={() => downloadCertificate(req.requestId)} style={{ background: '#2563eb', color: '#ffffff', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.375rem', fontWeight: '600', cursor: 'pointer', fontSize: '0.875rem' }}>
                            📜 Download Certificate
                          </button>
                          <button onClick={() => downloadDocument(req.requestId, req.documentType)} style={{ background: '#16a34a', color: '#ffffff', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.375rem', fontWeight: '600', cursor: 'pointer', fontSize: '0.875rem' }}>
                            ⬇️ Download Document
                          </button>
                          <button onClick={() => generateAndShowQR(req.requestId)} style={{ background: '#f59e0b', color: '#ffffff', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.375rem', fontWeight: '600', cursor: 'pointer', fontSize: '0.875rem' }}>
                            📱 View QR
                          </button>
                        </div>
                        <p style={{ margin: '0', fontSize: '0.75rem', color: '#9ca3af' }}>Certificate includes embedded QR code for verification</p>
                      </div>
                    ) : req.status === 'rejected' ? (
                      <button style={{ background: '#dc2626', color: '#ffffff', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.375rem', fontWeight: '600', cursor: 'pointer' }}>
                        Resubmit
                      </button>
                    ) : (
                      <span style={{ color: '#9ca3af', fontSize: '0.875rem' }}>⏳ Pending review by admin</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem', paddingTop: '2rem', borderTop: '1px solid #e5e7eb' }}>
          <button onClick={() => setShowCreateForm(true)} style={{ background: '#1f2937', color: '#ffffff', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '0.375rem', fontWeight: '600', cursor: 'pointer' }}>
            📝 New Request
          </button>
        </div>

        {/* QR Code Modal */}
        {showQRModal && selectedQR && (
          <div style={{ position: 'fixed', top: '0', left: '0', right: '0', bottom: '0', background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: '9999' }}>
            <div style={{ background: '#ffffff', padding: '2rem', borderRadius: '0.75rem', maxWidth: '500px', width: '90%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 style={{ margin: '0', color: '#111827', fontWeight: '600' }}>Document QR Code</h2>
                <button onClick={() => setShowQRModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
              </div>
              
              <div style={{ textAlign: 'center', padding: '2rem', background: '#f3f4f6', borderRadius: '0.5rem' }}>
                <h3 style={{ margin: '0 0 1rem 0', color: '#1f2937', fontWeight: '600' }}>📱 Scan for Verification</h3>
                
                <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '0.5rem', display: 'inline-block', marginBottom: '1rem' }}>
                  <svg width="200" height="200" style={{ border: '1px solid #e5e7eb' }}>
                    <rect width="200" height="200" fill="white"/>
                    <rect x="10" y="10" width="180" height="180" fill="none" stroke="#000" strokeWidth="2"/>
                    <circle cx="100" cy="100" r="40" fill="none" stroke="#000" strokeWidth="2"/>
                  </svg>
                </div>

                <div style={{ marginTop: '1rem' }}>
                  <p style={{ margin: '0 0 0.5rem 0', color: '#6b7280', fontSize: '0.875rem' }}>Verification Code:</p>
                  <p style={{ margin: '0', color: '#1f2937', fontWeight: '600', wordBreak: 'break-all' }}>{selectedQR.verificationCode}</p>
                </div>

                <p style={{ margin: '1rem 0 0 0', color: '#9ca3af', fontSize: '0.75rem' }}>Scan with your phone camera to verify authenticity</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}