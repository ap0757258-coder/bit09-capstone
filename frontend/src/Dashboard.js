import React, { useState, useEffect } from 'react';
import CreateRequestForm from './CreateRequestForm';

// =========================================================
// PRODUCTION BACKEND
// =========================================================
const API_URL =
  process.env.REACT_APP_API_URL || 'https://docverify-asdt.onrender.com';

export default function Dashboard() {
  const [requests, setRequests] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedQR, setSelectedQR] = useState(null);
  const [qrLink, setQrLink] = useState('');

  // Login ke baad jo student ID save hui hai
  const studentId = localStorage.getItem('studentId');

  // =========================================================
  // FETCH STUDENT REQUESTS
  // =========================================================

  useEffect(() => {
    if (!studentId) {
      setLoading(false);
      return;
    }

    fetchRequests();
  }, [studentId]);

  // =========================================================
  // QR GENERATION
  // =========================================================

  useEffect(() => {
    if (showQRModal && selectedQR) {
      generateQRCode();
    }
  }, [showQRModal, selectedQR]);

  const fetchRequests = async () => {
    try {
      const res = await fetch(
        `${API_URL}/api/documents/student/${studentId}`
      );

      if (!res.ok) {
        throw new Error('Failed to fetch requests');
      }

      const data = await res.json();

      setRequests(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Error fetching requests:', e);
      setRequests([]);
    }

    setLoading(false);
  };

  // =========================================================
  // DOCUMENT ICON
  // =========================================================

  const getDocIcon = (doc = '') => {
    if (doc.includes('Bonafide')) return '📄';
    if (doc.includes('Transcript')) return '📋';
    if (doc.includes('Character')) return '🎓';
    if (doc.includes('Marksheet')) return '📊';
    if (doc.includes('Leaving')) return '🏫';
    if (doc.includes('Migration')) return '✈️';
    if (doc.includes('Degree')) return '🎖️';
    if (doc.includes('Provisional')) return '📝';
    if (doc.includes('Objection')) return '✔️';
    if (doc.includes('Fee')) return '💰';
    if (doc.includes('Gap')) return '⏳';
    if (doc.includes('Attendance')) return '📅';

    return '📑';
  };

  // =========================================================
  // QR CODE GENERATION
  //
  // QR FRONTEND URL PAR POINT KAREGA
  // Example:
  // https://your-frontend.onrender.com/verify/REQ-001-XXXXXXXXXX
  //
  // Verification page us code ko backend par verify karega.
  // =========================================================

  const generateQRCode = async () => {
    try {
      const container = document.getElementById('qr-code-container');

      if (!container || !selectedQR) {
        return;
      }

      container.innerHTML = '';

      // Current deployed frontend URL
      const frontendBaseUrl = window.location.origin;

      const verificationUrl =
        `${frontendBaseUrl}/verify/${selectedQR.verificationCode}`;

      setQrLink(verificationUrl);

      // QR Server API
      const qrApiUrl =
        `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
          verificationUrl
        )}`;

      const img = document.createElement('img');

      img.src = qrApiUrl;
      img.alt = 'QR Code';
      img.style.width = '200px';
      img.style.height = '200px';
      img.style.border = '2px solid #000';

      container.innerHTML = '';
      container.appendChild(img);

    } catch (e) {
      console.error('QR Code Error:', e);

      const container =
        document.getElementById('qr-code-container');

      if (container) {
        container.innerHTML =
          '<p style="color: #dc2626;">QR Code generation failed</p>';
      }
    }
  };

  // =========================================================
  // DOWNLOAD CERTIFICATE
  // =========================================================

  const downloadCertificate = (requestId) => {
    const url =
      `${API_URL}/api/certificate/download/${requestId}`;

    const link = document.createElement('a');

    link.href = url;
    link.download = `${requestId}_Certificate.pdf`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // =========================================================
  // DOWNLOAD ADMIN UPLOADED DOCUMENT
  // =========================================================

  const downloadDocument = (requestId) => {
    const url =
      `${API_URL}/api/documents/download/${requestId}?studentId=${encodeURIComponent(
        studentId
      )}`;

    const link = document.createElement('a');

    link.href = url;
    link.download = `${requestId}.pdf`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // =========================================================
  // GET VERIFICATION CODE FROM BACKEND
  // =========================================================

  const generateAndShowQR = async (requestId) => {
    try {
      const res = await fetch(
        `${API_URL}/api/certificate/code/${requestId}?studentId=${encodeURIComponent(
          studentId
        )}`
      );

      if (!res.ok) {
        alert(
          'QR code nahi ban paya. Request approved honi chahiye.'
        );
        return;
      }

      const data = await res.json();

      setQrLink('');

      setSelectedQR({
        requestId,
        verificationCode: data.verificationCode
      });

      setShowQRModal(true);

    } catch (e) {
      console.error('QR error:', e);
      alert('QR error: ' + e.message);
    }
  };

  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = () => {
    localStorage.removeItem('studentId');
    localStorage.removeItem('role');
    localStorage.removeItem('userType');

    window.location.href = '/';
  };

  // =========================================================
  // LOGIN REQUIRED
  // =========================================================

  if (!studentId) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#ffffff'
        }}
      >
        <div style={{ textAlign: 'center' }}>

          <h2 style={{ color: '#111827' }}>
            🔒 Login required
          </h2>

          <p style={{ color: '#6b7280' }}>
            Session nahi mila. Pehle login karo.
          </p>

          <button
            onClick={() => {
              window.location.href = '/';
            }}
            style={{
              background: '#1f2937',
              color: '#ffffff',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.375rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Go to Login
          </button>

        </div>
      </div>
    );
  }

  // =========================================================
  // CREATE REQUEST PAGE
  // =========================================================

  if (showCreateForm) {
    return (
      <CreateRequestForm
        studentId={studentId}
        onBack={() => {
          setShowCreateForm(false);
          fetchRequests();
        }}
      />
    );
  }

  // =========================================================
  // STATUS COLOR
  // =========================================================

  const getStatusColor = (status) => {
    if (status === 'approved') return '#16a34a';
    if (status === 'rejected') return '#dc2626';

    return '#ca8a04';
  };

  // =========================================================
  // DASHBOARD UI
  // =========================================================

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#ffffff',
        padding: '2rem 1rem'
      }}
    >
      <div
        style={{
          maxWidth: '1000px',
          margin: '0 auto'
        }}
      >

        {/* HEADER */}

        <div
          style={{
            borderBottom: '2px solid #e5e7eb',
            paddingBottom: '2rem',
            marginBottom: '2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >

          <div>

            <h1
              style={{
                margin: '0',
                fontSize: '2rem',
                color: '#111827',
                fontWeight: '700'
              }}
            >
              Dashboard
            </h1>

            <p
              style={{
                margin: '0.5rem 0 0 0',
                color: '#6b7280'
              }}
            >
              Manage your document requests • {studentId}
            </p>

          </div>

          <button
            onClick={handleLogout}
            style={{
              background: '#ef4444',
              color: '#ffffff',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.375rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>

        </div>

        {/* REQUESTS */}

        <div style={{ marginBottom: '2rem' }}>

          <h2
            style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '1.5rem'
            }}
          >
            Your Requests
          </h2>

          {loading ? (

            <p style={{ color: '#6b7280' }}>
              Loading...
            </p>

          ) : requests.length === 0 ? (

            <p style={{ color: '#6b7280' }}>
              No requests yet
            </p>

          ) : (

            <div
              style={{
                display: 'grid',
                gap: '1rem'
              }}
            >

              {requests.map((req, i) => (

                <div
                  key={i}
                  style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    padding: '1.5rem'
                  }}
                >

                  {/* REQUEST HEADER */}

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'start'
                    }}
                  >

                    <div>

                      <h3
                        style={{
                          margin: '0',
                          fontSize: '1.1rem',
                          color: '#1f2937',
                          fontWeight: '600'
                        }}
                      >
                        {getDocIcon(req.documentType)}{' '}
                        {req.documentType}
                      </h3>

                      <p
                        style={{
                          margin: '0.25rem 0 0 0',
                          fontSize: '0.875rem',
                          color: '#6b7280'
                        }}
                      >
                        {req.requestId} • {req.createdDate}
                      </p>

                    </div>

                    <div
                      style={{
                        background: getStatusColor(req.status),
                        color: '#ffffff',
                        padding: '0.375rem 0.75rem',
                        borderRadius: '0.25rem',
                        fontSize: '0.875rem',
                        fontWeight: '600'
                      }}
                    >
                      {(req.status || 'pending').toUpperCase()}
                    </div>

                  </div>

                  {/* PURPOSE */}

                  <div
                    style={{
                      marginTop: '0.75rem',
                      paddingTop: '0.75rem',
                      borderTop: '1px solid #e5e7eb'
                    }}
                  >

                    <p
                      style={{
                        margin: '0',
                        fontSize: '0.875rem',
                        color: '#6b7280'
                      }}
                    >
                      Purpose: {req.purpose}
                    </p>

                  </div>

                  {/* ACTIONS */}

                  <div
                    style={{
                      marginTop: '1rem',
                      paddingTop: '1rem',
                      borderTop: '1px solid #e5e7eb'
                    }}
                  >

                    {req.status === 'approved' ? (

                      <div>

                        <div
                          style={{
                            display: 'flex',
                            gap: '0.5rem',
                            marginBottom: '0.5rem',
                            flexWrap: 'wrap'
                          }}
                        >

                          {/* CERTIFICATE */}

                          <button
                            onClick={() =>
                              downloadCertificate(req.requestId)
                            }
                            style={{
                              background: '#2563eb',
                              color: '#ffffff',
                              border: 'none',
                              padding: '0.5rem 1rem',
                              borderRadius: '0.375rem',
                              fontWeight: '600',
                              cursor: 'pointer',
                              fontSize: '0.875rem'
                            }}
                          >
                            📜 Download Certificate
                          </button>

                          {/* DOCUMENT */}

                          {req.fileName ? (

                            <button
                              onClick={() =>
                                downloadDocument(req.requestId)
                              }
                              style={{
                                background: '#16a34a',
                                color: '#ffffff',
                                border: 'none',
                                padding: '0.5rem 1rem',
                                borderRadius: '0.375rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                fontSize: '0.875rem'
                              }}
                            >
                              ⬇️ Download Document
                            </button>

                          ) : (

                            <span
                              style={{
                                color: '#92400e',
                                fontSize: '0.875rem',
                                alignSelf: 'center'
                              }}
                            >
                              ⏳ Document upload hone ka wait karein
                            </span>

                          )}

                          {/* QR */}

                          <button
                            onClick={() =>
                              generateAndShowQR(req.requestId)
                            }
                            style={{
                              background: '#f59e0b',
                              color: '#ffffff',
                              border: 'none',
                              padding: '0.5rem 1rem',
                              borderRadius: '0.375rem',
                              fontWeight: '600',
                              cursor: 'pointer',
                              fontSize: '0.875rem'
                            }}
                          >
                            📱 View QR
                          </button>

                        </div>

                        <p
                          style={{
                            margin: '0',
                            fontSize: '0.75rem',
                            color: '#9ca3af'
                          }}
                        >
                          Certificate includes QR code for verification
                        </p>

                      </div>

                    ) : req.status === 'rejected' ? (

                      <button
                        style={{
                          background: '#dc2626',
                          color: '#ffffff',
                          border: 'none',
                          padding: '0.5rem 1rem',
                          borderRadius: '0.375rem',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}
                      >
                        Resubmit
                      </button>

                    ) : (

                      <span
                        style={{
                          color: '#9ca3af',
                          fontSize: '0.875rem'
                        }}
                      >
                        ⏳ Pending review by admin
                      </span>

                    )}

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

        {/* NEW REQUEST */}

        <div
          style={{
            display: 'flex',
            gap: '1rem',
            paddingTop: '2rem',
            borderTop: '1px solid #e5e7eb'
          }}
        >

          <button
            onClick={() => setShowCreateForm(true)}
            style={{
              background: '#1f2937',
              color: '#ffffff',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.375rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            📝 New Request
          </button>

        </div>

        {/* =====================================================
            QR MODAL
        ===================================================== */}

        {showQRModal && selectedQR && (

          <div
            style={{
              position: 'fixed',
              top: '0',
              left: '0',
              right: '0',
              bottom: '0',
              background: 'rgba(0,0,0,0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: '9999'
            }}
          >

            <div
              style={{
                background: '#ffffff',
                padding: '2rem',
                borderRadius: '0.75rem',
                maxWidth: '500px',
                width: '90%'
              }}
            >

              {/* MODAL HEADER */}

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1rem'
                }}
              >

                <h2
                  style={{
                    margin: '0',
                    color: '#111827',
                    fontWeight: '600'
                  }}
                >
                  Document QR Code
                </h2>

                <button
                  onClick={() => setShowQRModal(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '1.5rem',
                    cursor: 'pointer'
                  }}
                >
                  ×
                </button>

              </div>

              {/* QR AREA */}

              <div
                style={{
                  textAlign: 'center',
                  padding: '2rem',
                  background: '#f3f4f6',
                  borderRadius: '0.5rem'
                }}
              >

                <h3
                  style={{
                    margin: '0 0 1rem 0',
                    color: '#1f2937',
                    fontWeight: '600'
                  }}
                >
                  📱 Scan for Verification
                </h3>

                <div
                  style={{
                    background: '#ffffff',
                    padding: '1.5rem',
                    borderRadius: '0.5rem',
                    display: 'inline-block',
                    marginBottom: '1rem'
                  }}
                >

                  <div
                    id="qr-code-container"
                    style={{
                      textAlign: 'center',
                      minHeight: '200px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <p style={{ color: '#6b7280' }}>
                      Generating QR Code...
                    </p>
                  </div>

                </div>

                {/* VERIFICATION CODE */}

                <div style={{ marginTop: '1rem' }}>

                  <p
                    style={{
                      margin: '0 0 0.5rem 0',
                      color: '#6b7280',
                      fontSize: '0.875rem'
                    }}
                  >
                    Verification Code:
                  </p>

                  <p
                    style={{
                      margin: '0',
                      color: '#1f2937',
                      fontWeight: '600',
                      wordBreak: 'break-all',
                      fontSize: '0.95rem'
                    }}
                  >
                    {selectedQR.verificationCode}
                  </p>

                </div>

                {/* QR LINK */}

                {qrLink && (

                  <p
                    style={{
                      margin: '1rem 0 0 0',
                      color: '#6b7280',
                      fontSize: '0.7rem',
                      wordBreak: 'break-all'
                    }}
                  >
                    Link: {qrLink}
                  </p>

                )}

                <p
                  style={{
                    margin: '1rem 0 0 0',
                    color: '#9ca3af',
                    fontSize: '0.75rem'
                  }}
                >
                  Scan with your phone camera to verify authenticity
                </p>

              </div>

            </div>

          </div>

        )}

      </div>
    </div>
  );
}
