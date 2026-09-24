import React, { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [auditLogs, setAuditLogs] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState({});
  const [uploadStatus, setUploadStatus] = useState({});

  const NGROK_URL = 'https://murky-rimmed-legend.ngrok-free.dev';

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/admin/requests');
      const data = await res.json();
      setRequests(data);
    } catch (e) {
      console.log('Error:', e);
    }
    setLoading(false);
  };

  const fetchAuditLogs = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/audit/logs');
      const data = await res.json();
      setAuditLogs(data);
      setShowAuditModal(true);
    } catch (e) {
      console.log('Error:', e);
    }
  };

  const approveRequest = async (requestId) => {
    const comment = prompt('Approval comment (optional):');
    try {
      const res = await fetch(`http://localhost:8080/api/admin/approve/${requestId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment: comment || '' })
      });
      const data = await res.json();
      if (data.status === 'success') {
        alert('✅ Request approved!');
        fetchRequests();
      }
    } catch (e) {
      alert('Error: ' + e.message);
    }
  };

  const rejectRequest = async (requestId) => {
    const comment = prompt('Rejection reason:');
    if (!comment) return;
    
    try {
      const res = await fetch(`http://localhost:8080/api/admin/reject/${requestId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment: comment })
      });
      const data = await res.json();
      if (data.status === 'success') {
        alert('❌ Request rejected!');
        fetchRequests();
      }
    } catch (e) {
      alert('Error: ' + e.message);
    }
  };

  const handleFileSelect = (requestId, file) => {
    setSelectedFiles({
      ...selectedFiles,
      [requestId]: file
    });
  };

  const uploadDocument = async (requestId) => {
    const file = selectedFiles[requestId];
    
    if (!file) {
      alert('Please select a file first!');
      return;
    }

    setUploadStatus({ ...uploadStatus, [requestId]: 'uploading' });

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`${NGROK_URL}/api/admin/upload/${requestId}`, {
        method: 'POST',
        headers: {
          'ngrok-skip-browser-warning': 'true'
        },
        body: formData
      });
      const data = await res.json();
      
      if (data.status === 'success') {
        alert('✅ Document uploaded successfully!');
        setUploadStatus({ ...uploadStatus, [requestId]: 'done' });
        setSelectedFiles({ ...selectedFiles, [requestId]: null });
        fetchRequests();
      } else {
        alert('❌ Upload failed: ' + data.message);
        setUploadStatus({ ...uploadStatus, [requestId]: 'error' });
      }
    } catch (e) {
      alert('Error uploading: ' + e.message);
      setUploadStatus({ ...uploadStatus, [requestId]: 'error' });
    }
  };

  const handleLogout = () => {
    window.location.href = '/';
  };

  const getStatusColor = (status) => {
    if (status === 'approved') return '#16a34a';
    if (status === 'rejected') return '#dc2626';
    return '#ca8a04';
  };

  return (
    <div style={{ minHeight: '100vh', background: '#ffffff', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ borderBottom: '2px solid #e5e7eb', paddingBottom: '2rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: '0', fontSize: '2rem', color: '#111827', fontWeight: '700' }}>Admin Dashboard</h1>
            <p style={{ margin: '0.5rem 0 0 0', color: '#6b7280' }}>Manage student document requests</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={fetchAuditLogs} style={{ background: '#667eea', color: '#ffffff', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '0.375rem', fontWeight: '600', cursor: 'pointer' }}>
              📋 Audit Logs
            </button>
            <button onClick={handleLogout} style={{ background: '#ef4444', color: '#ffffff', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '0.375rem', fontWeight: '600', cursor: 'pointer' }}>
              Logout
            </button>
          </div>
        </div>

        {/* Requests List */}
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '1.5rem' }}>Pending & Approved Requests</h2>

          {loading ? (
            <p style={{ color: '#6b7280' }}>Loading...</p>
          ) : requests.length === 0 ? (
            <p style={{ color: '#6b7280' }}>No requests</p>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {requests.map((req, i) => (
                <div key={i} style={{ border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                    <div>
                      <h3 style={{ margin: '0', fontSize: '1.1rem', color: '#1f2937', fontWeight: '600' }}>📄 {req.documentType}</h3>
                      <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#6b7280' }}>Request: {req.requestId} • {req.createdDate}</p>
                    </div>
                    <div style={{ background: getStatusColor(req.status), color: '#ffffff', padding: '0.375rem 0.75rem', borderRadius: '0.25rem', fontSize: '0.875rem', fontWeight: '600' }}>
                      {req.status.toUpperCase()}
                    </div>
                  </div>

                  {/* Student Details */}
                  <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '0.375rem', marginBottom: '1rem', border: '1px solid #e5e7eb' }}>
                    <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>Student Information</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.875rem' }}>
                      <div>
                        <p style={{ margin: '0', color: '#6b7280' }}>Name:</p>
                        <p style={{ margin: '0.25rem 0 0 0', color: '#111827', fontWeight: '600' }}>{req.studentName}</p>
                      </div>
                      <div>
                        <p style={{ margin: '0', color: '#6b7280' }}>Enrollment:</p>
                        <p style={{ margin: '0.25rem 0 0 0', color: '#111827', fontWeight: '600' }}>{req.studentId}</p>
                      </div>
                      <div>
                        <p style={{ margin: '0', color: '#6b7280' }}>Department:</p>
                        <p style={{ margin: '0.25rem 0 0 0', color: '#111827', fontWeight: '600' }}>{req.studentDept}</p>
                      </div>
                      <div>
                        <p style={{ margin: '0', color: '#6b7280' }}>Purpose:</p>
                        <p style={{ margin: '0.25rem 0 0 0', color: '#111827', fontWeight: '600' }}>{req.purpose}</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                    {req.status === 'pending' && (
                      <>
                        <button onClick={() => approveRequest(req.requestId)} style={{ background: '#16a34a', color: '#ffffff', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.375rem', fontWeight: '600', cursor: 'pointer', fontSize: '0.875rem' }}>
                          ✅ Approve
                        </button>
                        <button onClick={() => rejectRequest(req.requestId)} style={{ background: '#dc2626', color: '#ffffff', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.375rem', fontWeight: '600', cursor: 'pointer', fontSize: '0.875rem' }}>
                          ❌ Reject
                        </button>
                      </>
                    )}
                  </div>

                  {/* Upload Section - Only for Approved Requests */}
                  {req.status === 'approved' && (
                    <div style={{ marginTop: '1rem', padding: '1rem', background: '#f0fdf4', borderRadius: '0.375rem', border: '2px solid #16a34a' }}>
                      <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.875rem', fontWeight: '600', color: '#166534' }}>📁 Upload Document (After Approval)</p>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <input
                          type="file"
                          id={`file-${req.requestId}`}
                          onChange={(e) => handleFileSelect(req.requestId, e.target.files[0])}
                          style={{ flex: 1, fontSize: '0.75rem', padding: '0.5rem' }}
                        />
                        <button
                          onClick={() => uploadDocument(req.requestId)}
                          disabled={uploadStatus[req.requestId] === 'uploading'}
                          style={{ 
                            background: uploadStatus[req.requestId] === 'done' ? '#16a34a' : '#2563eb', 
                            color: '#ffffff', 
                            border: 'none', 
                            padding: '0.5rem 1rem', 
                            borderRadius: '0.375rem', 
                            fontWeight: '600', 
                            cursor: uploadStatus[req.requestId] === 'uploading' ? 'not-allowed' : 'pointer', 
                            fontSize: '0.875rem',
                            whiteSpace: 'nowrap',
                            opacity: uploadStatus[req.requestId] === 'uploading' ? 0.6 : 1
                          }}
                        >
                          {uploadStatus[req.requestId] === 'uploading' ? '⏳ Uploading...' : uploadStatus[req.requestId] === 'done' ? '✅ Uploaded' : '📤 Upload'}
                        </button>
                      </div>
                      <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.7rem', color: '#166534' }}>💡 Upload only after approving - Student can download once uploaded!</p>
                    </div>
                  )}

                  {req.status === 'rejected' && (
                    <div style={{ marginTop: '1rem', padding: '1rem', background: '#fef2f2', borderRadius: '0.375rem', border: '1px solid #dc2626' }}>
                      <p style={{ margin: '0', fontSize: '0.875rem', color: '#991b1b' }}>❌ Request rejected</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Audit Logs Modal */}
        {showAuditModal && (
          <div style={{ position: 'fixed', top: '0', left: '0', right: '0', bottom: '0', background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: '9999' }}>
            <div style={{ background: '#ffffff', padding: '2rem', borderRadius: '0.75rem', maxWidth: '600px', width: '90%', maxHeight: '80vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 style={{ margin: '0', color: '#111827', fontWeight: '600' }}>📋 Audit Logs</h2>
                <button onClick={() => setShowAuditModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
              </div>

              {auditLogs.length === 0 ? (
                <p style={{ color: '#6b7280' }}>No audit logs yet</p>
              ) : (
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {auditLogs.map((log, i) => (
                    <div key={i} style={{ padding: '1rem', background: '#f9fafb', borderRadius: '0.375rem', border: '1px solid #e5e7eb' }}>
                      <p style={{ margin: '0', fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>
                        {log.action.toUpperCase()} - {log.requestId}
                      </p>
                      <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#6b7280' }}>
                        By: {log.adminName} • {log.timestamp}
                      </p>
                      {log.comment && (
                        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem', color: '#4b5563', fontStyle: 'italic' }}>
                          💬 {log.comment}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}