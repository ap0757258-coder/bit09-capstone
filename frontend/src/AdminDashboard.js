import React, { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const NGROK_URL = '';

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await fetch('/api/admin/requests');
      const data = await res.json();
      setRequests(data);
    } catch (e) {
      setError('Error loading requests: ' + e.message);
    }
    setLoading(false);
  };

  const approveRequest = async (requestId) => {
    try {
      const res = await fetch(`/api/admin/approve/${requestId}`, {
        method: 'POST'
      });
      const data = await res.json();
      if (data.status === 'success') {
        alert('✅ Request approved!');
        fetchRequests();
      } else {
        alert('❌ Approval failed: ' + data.message);
      }
    } catch (e) {
      alert('Error: ' + e.message);
    }
  };

  const rejectRequest = async (requestId) => {
    try {
      const res = await fetch(`/api/admin/reject/${requestId}`, {
        method: 'POST'
      });
      const data = await res.json();
      if (data.status === 'success') {
        alert('❌ Request rejected!');
        fetchRequests();
      } else {
        alert('Error: ' + data.message);
      }
    } catch (e) {
      alert('Error: ' + e.message);
    }
  };

  const handleUpload = async (requestId) => {
    const fileInput = document.getElementById('file_' + requestId);
    const file = fileInput.files[0];
    
    if (!file) {
      alert('Please select a file');
      return;
    }
    
    const allowed = /\.(pdf|jpe?g|png|gif|bmp|txt)$/i;
    if (!allowed.test(file.name)) {
      alert('Allowed files: PDF, JPG, PNG, GIF, BMP, TXT. For Word or Excel files, use "Save as PDF" first.');
      return;
    }
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const res = await fetch(`/api/admin/upload/${requestId}`, {
        method: 'POST',
        body: formData
      });
      
      const data = await res.json();
      
      if (data.status === 'success') {
        alert('✅ ' + data.message);
        fileInput.value = '';
        fetchRequests();
      } else {
        alert('❌ ' + data.message);
      }
    } catch (e) {
      alert('Upload failed: ' + e.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('studentId');
    localStorage.removeItem('role');
    localStorage.removeItem('userType');
    window.location.href = '/';
  };

  const getDocIcon = (doc) => {
    const iconMap = {
      'Bonafide Letter': '📄',
      'Academic Transcript': '📋',
      'Marksheet': '📊',
      'Character Certificate': '🎓',
      'Leaving Certificate': '🏫',
      'Completion Certificate': '✅',
      'Internship Certificate': '💼',
      'NOC (No Objection Certificate)': '📝'
    };
    return iconMap[doc] || '📑';
  };

  const getStatusColor = (status) => {
    if (status === 'approved') return { bg: '#d1fae5', text: '#065f46', border: '#6ee7b7' };
    if (status === 'rejected') return { bg: '#fee2e2', text: '#991b1b', border: '#fca5a5' };
    return { bg: '#fef3c7', text: '#92400e', border: '#fcd34d' };
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '1rem', padding: '2rem', marginBottom: '2rem', boxShadow: '0 10px 30px rgba(102, 126, 234, 0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ margin: '0', fontSize: '2.5rem', color: '#ffffff', fontWeight: '700' }}>👨‍💼 Admin Dashboard</h1>
              <p style={{ margin: '0.5rem 0 0 0', color: '#e0e7ff', fontSize: '1rem' }}>Manage all document requests</p>
            </div>
            <button onClick={handleLogout} style={{ background: '#ffffff', color: '#667eea', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', fontWeight: '600', cursor: 'pointer', fontSize: '0.95rem', transition: 'all 0.2s' }}
              onMouseEnter={(e) => (e.target.style.transform = 'translateY(-2px)')}
              onMouseLeave={(e) => (e.target.style.transform = 'translateY(0)')}
            >
              🚪 Logout
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '0.5rem', padding: '1rem', marginBottom: '1.5rem', color: '#991b1b', fontWeight: '500' }}>
            ⚠️ {error}
          </div>
        )}

        {/* Requests List */}
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>📋 All Requests ({requests.length})</h2>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', background: '#ffffff', borderRadius: '1rem', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)' }}>
              <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>🔄 Loading requests...</p>
            </div>
          ) : requests.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', background: '#ffffff', borderRadius: '1rem', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)' }}>
              <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>📭 No requests yet</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {requests.map((req, i) => (
                <div key={i} style={{ background: '#ffffff', borderRadius: '1rem', padding: '1.75rem', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)', border: `2px solid ${getStatusColor(req.status).border}`, transition: 'all 0.3s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-4px)', e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.12)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)', e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)')}
                >
                  {/* Top Section - Document & Status */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                    <div>
                      <h3 style={{ margin: '0', fontSize: '1.25rem', color: '#1f2937', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {getDocIcon(req.documentType)} {req.documentType}
                      </h3>
                      <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem', color: '#6b7280' }}>🔖 {req.requestId} • 📅 {req.createdDate}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <div style={{ background: getStatusColor(req.status).bg, color: getStatusColor(req.status).text, padding: '0.5rem 1rem', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: '700' }}>
                        {req.status === 'approved' && '✅ APPROVED'}
                        {req.status === 'rejected' && '❌ REJECTED'}
                        {req.status === 'pending' && '⏳ PENDING'}
                      </div>
                    </div>
                  </div>

                  {/* Student Info */}
                  <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '0.75rem', marginBottom: '1rem', borderLeft: `4px solid ${getStatusColor(req.status).border}` }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <p style={{ margin: '0', fontSize: '0.875rem', color: '#6b7280', fontWeight: '600' }}>👤 Student Name</p>
                        <p style={{ margin: '0.25rem 0 0 0', fontSize: '1rem', fontWeight: '700', color: '#1f2937' }}>{req.studentName}</p>
                      </div>
                      <div>
                        <p style={{ margin: '0', fontSize: '0.875rem', color: '#6b7280', fontWeight: '600' }}>🎓 Enrollment</p>
                        <p style={{ margin: '0.25rem 0 0 0', fontSize: '1rem', fontWeight: '700', color: '#1f2937', fontFamily: 'monospace' }}>{req.studentId}</p>
                      </div>
                      <div>
                        <p style={{ margin: '0', fontSize: '0.875rem', color: '#6b7280', fontWeight: '600' }}>📚 Department</p>
                        <p style={{ margin: '0.25rem 0 0 0', fontSize: '1rem', fontWeight: '700', color: '#1f2937' }}>{req.studentDepartment}</p>
                      </div>
                      <div>
                        <p style={{ margin: '0', fontSize: '0.875rem', color: '#6b7280', fontWeight: '600' }}>📧 Email</p>
                        <p style={{ margin: '0.25rem 0 0 0', fontSize: '1rem', fontWeight: '700', color: '#1f2937' }}>{req.studentEmail}</p>
                      </div>
                    </div>
                  </div>

                  {/* Purpose Section */}
                  <div style={{ background: '#fef3c7', padding: '1rem', borderRadius: '0.75rem', marginBottom: '1rem', borderLeft: '4px solid #fcd34d' }}>
                    <p style={{ margin: '0', fontSize: '0.875rem', color: '#92400e', fontWeight: '600' }}>📌 Purpose of Request</p>
                    <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.95rem', color: '#111827' }}>{req.purpose}</p>
                  </div>

                  {/* Alumni Badge */}
                  {req.studentStatus === 'alumni' && (
                    <div style={{ background: '#fce7f3', padding: '0.75rem 1rem', borderRadius: '0.375rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid #fbcfe8' }}>
                      <span style={{ fontSize: '1.25rem' }}>🎓</span>
                      <span style={{ color: '#831843', fontWeight: '700', fontSize: '0.875rem' }}>ALUMNI REQUEST - Past Student</span>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {req.status === 'pending' ? (
                      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <button onClick={() => approveRequest(req.requestId)} style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#ffffff', border: 'none', padding: '0.625rem 1.25rem', borderRadius: '0.5rem', fontWeight: '600', cursor: 'pointer', fontSize: '0.875rem', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)' }}
                          onMouseEnter={(e) => (e.target.style.transform = 'translateY(-2px)', e.target.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.4)')}
                          onMouseLeave={(e) => (e.target.style.transform = 'translateY(0)', e.target.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)')}
                        >
                          ✅ Approve
                        </button>
                        <button onClick={() => rejectRequest(req.requestId)} style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', color: '#ffffff', border: 'none', padding: '0.625rem 1.25rem', borderRadius: '0.5rem', fontWeight: '600', cursor: 'pointer', fontSize: '0.875rem', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)' }}
                          onMouseEnter={(e) => (e.target.style.transform = 'translateY(-2px)', e.target.style.boxShadow = '0 6px 16px rgba(239, 68, 68, 0.4)')}
                          onMouseLeave={(e) => (e.target.style.transform = 'translateY(0)', e.target.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)')}
                        >
                          ❌ Reject
                        </button>
                      </div>
                    ) : req.status === 'approved' ? (
                      <div>
                        <div style={{ background: '#d1fae5', border: '2px solid #6ee7b7', padding: '1rem', borderRadius: '0.75rem', marginBottom: '1rem' }}>
                          <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.875rem', fontWeight: '600', color: '#065f46' }}>📤 Upload Document (PDF, JPG, PNG, TXT)</p>
                          <p style={{ margin: '0 0 1rem 0', fontSize: '0.75rem', color: '#047857' }}>Student will download it as a PDF</p>
                          
                          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                            <input
                              type="file"
                              id={'file_' + req.requestId}
                              accept=".pdf,.jpg,.jpeg,.png,.gif,.bmp,.txt"
                              style={{ padding: '0.5rem', border: '1px solid #6ee7b7', borderRadius: '0.5rem', fontSize: '0.875rem', flex: 1, boxSizing: 'border-box' }}
                            />
                            <button
                              onClick={() => handleUpload(req.requestId)}
                              style={{ background: '#10b981', color: '#ffffff', border: 'none', padding: '0.625rem 1.25rem', borderRadius: '0.5rem', fontWeight: '600', cursor: 'pointer', fontSize: '0.875rem', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)' }}
                              onMouseEnter={(e) => (e.target.style.transform = 'translateY(-2px)', e.target.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.4)')}
                              onMouseLeave={(e) => (e.target.style.transform = 'translateY(0)', e.target.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)')}
                            >
                              📤 Upload
                            </button>
                          </div>
                        </div>
                        <button style={{ background: '#d1f5e0', color: '#065f46', border: '1px solid #6ee7b7', padding: '0.625rem 1.25rem', borderRadius: '0.5rem', fontWeight: '600', cursor: 'default', fontSize: '0.875rem', width: '100%' }}>
                          ✅ Approved - Awaiting Upload
                        </button>
                      </div>
                    ) : (
                      <button style={{ background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5', padding: '0.625rem 1.25rem', borderRadius: '0.5rem', fontWeight: '600', cursor: 'default', fontSize: '0.875rem', width: '100%' }}>
                        ❌ Rejected
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}