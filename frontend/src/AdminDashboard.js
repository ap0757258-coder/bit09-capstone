import React, { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReq, setSelectedReq] = useState(null);
  const [comment, setComment] = useState('');
  const [showAuditLogs, setShowAuditLogs] = useState(false);
  const [auditLogs, setAuditLogs] = useState([]);

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
    } catch (e) {
      console.log('Error:', e);
    }
  };

  const handleViewAuditLogs = () => {
    fetchAuditLogs();
    setShowAuditLogs(true);
  };

  const handleApprove = async (requestId) => {
    console.log('Approving:', requestId);
    try {
      const res1 = await fetch(`http://localhost:8080/api/admin/approve/${requestId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment: comment })
      });
      console.log('Approve response:', res1.status);
      
      const res2 = await fetch('http://localhost:8080/api/audit/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          requestId: requestId, 
          adminName: 'admin', 
          action: 'approved', 
          comment: comment 
        })
      });
      console.log('Audit log response:', res2.status);
      
      alert('Request Approved Successfully!');
      setSelectedReq(null);
      setComment('');
      fetchRequests();
    } catch (e) {
      console.log('Error:', e);
      alert('Error: ' + e.message);
    }
  };

  const handleReject = async (requestId) => {
    console.log('Rejecting:', requestId);
    try {
      const res1 = await fetch(`http://localhost:8080/api/admin/reject/${requestId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment: comment })
      });
      console.log('Reject response:', res1.status);
      
      const res2 = await fetch('http://localhost:8080/api/audit/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          requestId: requestId, 
          adminName: 'admin', 
          action: 'rejected', 
          comment: comment 
        })
      });
      console.log('Audit log response:', res2.status);
      
      alert('Request Rejected Successfully!');
      setSelectedReq(null);
      setComment('');
      fetchRequests();
    } catch (e) {
      console.log('Error:', e);
      alert('Error: ' + e.message);
    }
  };

  const handleLogout = () => {
    window.location.href = '/';
  };

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const approvedCount = requests.filter(r => r.status === 'approved').length;
  const rejectedCount = requests.filter(r => r.status === 'rejected').length;

  return (
    <div style={{ minHeight: '100vh', background: '#ffffff', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ borderBottom: '2px solid #e5e7eb', paddingBottom: '2rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: '0', fontSize: '2rem', color: '#111827', fontWeight: '700' }}>Admin Dashboard</h1>
            <p style={{ margin: '0.5rem 0 0 0', color: '#6b7280' }}>Manage document requests</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={handleViewAuditLogs} style={{ background: '#1f2937', color: '#ffffff', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '0.375rem', fontWeight: '600', cursor: 'pointer' }}>
              📋 Audit Logs
            </button>
            <button onClick={handleLogout} style={{ background: '#ef4444', color: '#ffffff', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '0.375rem', fontWeight: '600', cursor: 'pointer' }}>
              Logout
            </button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ background: '#f3f4f6', padding: '1.5rem', borderRadius: '0.5rem', borderLeft: '4px solid #ca8a04' }}>
            <p style={{ margin: '0', color: '#6b7280', fontSize: '0.875rem' }}>Pending</p>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '2rem', fontWeight: 'bold', color: '#ca8a04' }}>{pendingRequests.length}</p>
          </div>
          <div style={{ background: '#f3f4f6', padding: '1.5rem', borderRadius: '0.5rem', borderLeft: '4px solid #16a34a' }}>
            <p style={{ margin: '0', color: '#6b7280', fontSize: '0.875rem' }}>Approved</p>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '2rem', fontWeight: 'bold', color: '#16a34a' }}>{approvedCount}</p>
          </div>
          <div style={{ background: '#f3f4f6', padding: '1.5rem', borderRadius: '0.5rem', borderLeft: '4px solid #dc2626' }}>
            <p style={{ margin: '0', color: '#6b7280', fontSize: '0.875rem' }}>Rejected</p>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '2rem', fontWeight: 'bold', color: '#dc2626' }}>{rejectedCount}</p>
          </div>
        </div>

        {/* Requests List */}
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '1.5rem' }}>Pending Requests ({pendingRequests.length})</h2>

          {loading ? (
            <p style={{ color: '#6b7280' }}>Loading...</p>
          ) : pendingRequests.length === 0 ? (
            <p style={{ color: '#6b7280' }}>No pending requests</p>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {pendingRequests.map((req, i) => (
                <div key={i} style={{ border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '1.5rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <h3 style={{ margin: '0', fontSize: '1.1rem', color: '#1f2937', fontWeight: '600' }}>{req.documentType}</h3>
                      <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#6b7280' }}>Student: {req.studentName} ({req.studentId})</p>
                      <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#6b7280' }}>Request: {req.requestId} • {req.createdDate}</p>
                      <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem', color: '#4b5563', fontStyle: 'italic' }}>Purpose: {req.purpose}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ background: '#ca8a04', color: '#ffffff', padding: '0.375rem 0.75rem', borderRadius: '0.25rem', fontSize: '0.875rem', fontWeight: '600', display: 'inline-block' }}>
                        PENDING
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
                    <button onClick={() => setSelectedReq(req)} style={{ background: '#16a34a', color: '#ffffff', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.375rem', fontWeight: '600', cursor: 'pointer', flex: 1 }}>
                      Approve
                    </button>
                    <button onClick={() => setSelectedReq(req)} style={{ background: '#dc2626', color: '#ffffff', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.375rem', fontWeight: '600', cursor: 'pointer', flex: 1 }}>
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal for Approval/Rejection */}
        {selectedReq && (
          <div style={{ position: 'fixed', top: '0', left: '0', right: '0', bottom: '0', background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: '9999' }}>
            <div style={{ background: '#ffffff', padding: '2.5rem', borderRadius: '0.75rem', maxWidth: '600px', width: '90%', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
              <h2 style={{ margin: '0 0 1.5rem 0', color: '#111827', fontWeight: '600', fontSize: '1.5rem' }}>Approve/Reject Request</h2>
              
              <div style={{ background: '#f3f4f6', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem' }}>
                <p style={{ margin: '0', color: '#1f2937', fontWeight: '600' }}><strong>Request ID:</strong> {selectedReq.requestId}</p>
                <p style={{ margin: '0.5rem 0 0 0', color: '#1f2937' }}><strong>Student:</strong> {selectedReq.studentName} ({selectedReq.studentId})</p>
                <p style={{ margin: '0.5rem 0 0 0', color: '#1f2937' }}><strong>Document:</strong> {selectedReq.documentType}</p>
                <p style={{ margin: '0.5rem 0 0 0', color: '#6b7280' }}><strong>Purpose:</strong> {selectedReq.purpose}</p>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>Comments (Optional)</label>
                <textarea 
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add your comments here..."
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', minHeight: '120px', boxSizing: 'border-box', fontFamily: 'inherit', fontSize: '1rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <button 
                  onClick={() => handleApprove(selectedReq.requestId)}
                  style={{ background: '#16a34a', color: '#ffffff', border: 'none', padding: '0.75rem 1rem', borderRadius: '0.5rem', fontWeight: '600', cursor: 'pointer', fontSize: '1rem' }}
                >
                  ✅ Approve
                </button>
                <button 
                  onClick={() => handleReject(selectedReq.requestId)}
                  style={{ background: '#dc2626', color: '#ffffff', border: 'none', padding: '0.75rem 1rem', borderRadius: '0.5rem', fontWeight: '600', cursor: 'pointer', fontSize: '1rem' }}
                >
                  ❌ Reject
                </button>
                <button 
                  onClick={() => { setSelectedReq(null); setComment(''); }}
                  style={{ background: '#e5e7eb', color: '#1f2937', border: 'none', padding: '0.75rem 1rem', borderRadius: '0.5rem', fontWeight: '600', cursor: 'pointer', fontSize: '1rem' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Audit Logs Modal */}
        {showAuditLogs && (
          <div style={{ position: 'fixed', top: '0', left: '0', right: '0', bottom: '0', background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: '9999' }}>
            <div style={{ background: '#ffffff', padding: '2.5rem', borderRadius: '0.75rem', maxWidth: '800px', width: '90%', maxHeight: '80vh', overflowY: 'auto', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ margin: '0', color: '#111827', fontWeight: '600', fontSize: '1.5rem' }}>📋 Audit Logs</h2>
                <button onClick={() => setShowAuditLogs(false)} style={{ background: 'none', border: 'none', fontSize: '2rem', cursor: 'pointer', color: '#6b7280' }}>×</button>
              </div>
              
              {auditLogs.length === 0 ? (
                <p style={{ color: '#6b7280', textAlign: 'center' }}>No audit logs yet</p>
              ) : (
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {auditLogs.map((log, i) => (
                    <div key={i} style={{ border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '1.25rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
                        <div>
                          <strong style={{ color: '#1f2937', fontSize: '1.1rem' }}>{log.requestId}</strong>
                          <span style={{ color: log.action === 'approved' ? '#16a34a' : '#dc2626', marginLeft: '1rem', fontWeight: '600', fontSize: '0.875rem' }}>
                            {log.action.toUpperCase()}
                          </span>
                        </div>
                        <span style={{ color: '#9ca3af', fontSize: '0.875rem' }}>{log.timestamp}</span>
                      </div>
                      <p style={{ margin: '0', color: '#6b7280', fontSize: '0.875rem' }}>By: <strong>{log.adminName}</strong></p>
                      {log.comment && <p style={{ margin: '0.5rem 0 0 0', color: '#4b5563', fontSize: '0.875rem' }}>💬 {log.comment}</p>}
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