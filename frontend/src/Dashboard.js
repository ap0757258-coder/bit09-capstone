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
  // =========================================================

  const generateQRCode = async () => {
    try {
      const container = document.getElementById('qr-code-container');

      if (!container || !selectedQR) {
        return;
      }

      container.innerHTML = '';

      const frontendBaseUrl = window.location.origin;

      const verificationUrl =
        `${frontendBaseUrl}/verify/${selectedQR.verificationCode}`;

      setQrLink(verificationUrl);

      const qrApiUrl =
        `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
          verificationUrl
        )}`;

      const img = document.createElement('img');

      img.src = qrApiUrl;
      img.alt = 'QR Code';
      img.style.width = '200px';
      img.style.height = '200px';
      img.style.border = '2px solid #e5e7eb';
      img.style.borderRadius = '12px';

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
          background: 'linear-gradient(135deg, #eef2ff 0%, #f5f3ff 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}
      >
        <div
          style={{
            background: '#ffffff',
            borderRadius: '20px',
            padding: '40px',
            textAlign: 'center',
            boxShadow: '0 15px 40px rgba(30, 41, 59, 0.12)',
            maxWidth: '420px',
            width: '100%'
          }}
        >
          <div style={{ fontSize: '50px', marginBottom: '15px' }}>
            🔒
          </div>

          <h2
            style={{
              color: '#172554',
              margin: '0 0 10px',
              fontSize: '24px'
            }}
          >
            Login Required
          </h2>

          <p
            style={{
              color: '#64748b',
              marginBottom: '25px'
            }}
          >
            Session nahi mila. Pehle login karo.
          </p>

          <button
            onClick={() => {
              window.location.href = '/';
            }}
            style={{
              background: '#4f46e5',
              color: '#ffffff',
              border: 'none',
              padding: '13px 24px',
              borderRadius: '10px',
              fontWeight: '700',
              cursor: 'pointer',
              fontSize: '15px'
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
  // STATUS HELPERS
  // =========================================================

  const getStatusStyle = (status) => {
    if (status === 'approved') {
      return {
        background: '#dcfce7',
        color: '#15803d',
        text: 'APPROVED',
        icon: '✅'
      };
    }

    if (status === 'rejected') {
      return {
        background: '#fee2e2',
        color: '#b91c1c',
        text: 'REJECTED',
        icon: '❌'
      };
    }

    return {
      background: '#fef3c7',
      color: '#b45309',
      text: 'PENDING',
      icon: '⏳'
    };
  };

  // =========================================================
  // DASHBOARD UI
  // =========================================================

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f8fafc',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}
    >

      {/* =====================================================
          GRADIENT HEADER
      ===================================================== */}

      <div
        style={{
          background:
            'linear-gradient(135deg, #312e81 0%, #4f46e5 50%, #7c3aed 100%)',
          color: '#ffffff',
          padding: '42px 20px 55px'
        }}
      >
        <div
          style={{
            maxWidth: '1000px',
            margin: '0 auto'
          }}
        >

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '20px'
            }}
          >

            <div>

              <div
                style={{
                  fontSize: '14px',
                  opacity: '0.85',
                  marginBottom: '8px',
                  fontWeight: '600',
                  letterSpacing: '0.5px'
                }}
              >
                KES SHROFF COLLEGE
              </div>

              <h1
                style={{
                  margin: '0',
                  fontSize: '36px',
                  fontWeight: '800',
                  letterSpacing: '-0.5px'
                }}
              >
                Student Dashboard
              </h1>

              <p
                style={{
                  margin: '10px 0 0',
                  fontSize: '16px',
                  opacity: '0.9'
                }}
              >
                Manage your document requests
              </p>

            </div>

            <button
              onClick={handleLogout}
              style={{
                background: 'rgba(255,255,255,0.15)',
                color: '#ffffff',
                border: '1px solid rgba(255,255,255,0.35)',
                padding: '12px 20px',
                borderRadius: '10px',
                fontWeight: '700',
                cursor: 'pointer',
                fontSize: '14px',
                backdropFilter: 'blur(5px)'
              }}
            >
              Logout
            </button>

          </div>

          {/* STUDENT ID */}

          <div
            style={{
              marginTop: '28px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255,255,255,0.13)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '10px',
              padding: '9px 14px',
              fontSize: '14px'
            }}
          >
            👤 Student ID: <strong>{studentId}</strong>
          </div>

        </div>
      </div>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <div
        style={{
          maxWidth: '1000px',
          margin: '-25px auto 0',
          padding: '0 20px 50px',
          position: 'relative'
        }}
      >

        {/* ===================================================
            TOP ACTION CARD
        =================================================== */}

        <div
          style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '20px 24px',
            boxShadow: '0 8px 25px rgba(15, 23, 42, 0.08)',
            marginBottom: '32px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '20px',
            flexWrap: 'wrap'
          }}
        >

          <div>
            <h2
              style={{
                margin: '0 0 5px',
                color: '#172554',
                fontSize: '20px'
              }}
            >
              My Documents
            </h2>

            <p
              style={{
                margin: '0',
                color: '#64748b',
                fontSize: '14px'
              }}
            >
              Track and manage all your document requests
            </p>
          </div>

          <button
            onClick={() => setShowCreateForm(true)}
            style={{
              background:
                'linear-gradient(135deg, #4f46e5, #7c3aed)',
              color: '#ffffff',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '10px',
              fontWeight: '700',
              cursor: 'pointer',
              fontSize: '14px',
              boxShadow: '0 5px 15px rgba(79,70,229,0.25)'
            }}
          >
            📝 New Request
          </button>

        </div>

        {/* ===================================================
            REQUEST SECTION
        =================================================== */}

        <div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '18px'
            }}
          >

            <h2
              style={{
                margin: '0',
                color: '#172554',
                fontSize: '24px',
                fontWeight: '750'
              }}
            >
              My Requests
            </h2>

            {!loading && requests.length > 0 && (
              <span
                style={{
                  color: '#64748b',
                  fontSize: '14px'
                }}
              >
                {requests.length} request
                {requests.length !== 1 ? 's' : ''}
              </span>
            )}

          </div>

          {/* LOADING */}

          {loading ? (

            <div
              style={{
                background: '#ffffff',
                borderRadius: '16px',
                padding: '45px',
                textAlign: 'center',
                boxShadow: '0 5px 20px rgba(15,23,42,0.06)'
              }}
            >
              <div
                style={{
                  fontSize: '35px',
                  marginBottom: '10px'
                }}
              >
                ⏳
              </div>

              <p
                style={{
                  color: '#64748b',
                  margin: '0'
                }}
              >
                Loading your requests...
              </p>
            </div>

          ) : requests.length === 0 ? (

            /* EMPTY STATE */

            <div
              style={{
                background: '#ffffff',
                borderRadius: '16px',
                padding: '55px 25px',
                textAlign: 'center',
                boxShadow: '0 5px 20px rgba(15,23,42,0.06)'
              }}
            >

              <div
                style={{
                  fontSize: '55px',
                  marginBottom: '15px'
                }}
              >
                📂
              </div>

              <h3
                style={{
                  margin: '0 0 8px',
                  color: '#172554',
                  fontSize: '20px'
                }}
              >
                No requests yet
              </h3>

              <p
                style={{
                  color: '#64748b',
                  margin: '0 0 20px'
                }}
              >
                Create your first document request to get started.
              </p>

              <button
                onClick={() => setShowCreateForm(true)}
                style={{
                  background: '#4f46e5',
                  color: '#ffffff',
                  border: 'none',
                  padding: '11px 20px',
                  borderRadius: '9px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                📝 Create Request
              </button>

            </div>

          ) : (

            /* REQUEST CARDS */

            <div
              style={{
                display: 'grid',
                gap: '18px'
              }}
            >

              {requests.map((req, i) => {

                const status = getStatusStyle(req.status);

                return (
                  <div
                    key={i}
                    style={{
                      background: '#ffffff',
                      borderRadius: '16px',
                      padding: '22px',
                      border: '1px solid #e2e8f0',
                      boxShadow:
                        '0 5px 18px rgba(15,23,42,0.05)'
                    }}
                  >

                    {/* CARD HEADER */}

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        gap: '15px'
                      }}
                    >

                      <div
                        style={{
                          display: 'flex',
                          gap: '13px',
                          alignItems: 'flex-start',
                          minWidth: 0
                        }}
                      >

                        <div
                          style={{
                            width: '48px',
                            height: '48px',
                            minWidth: '48px',
                            borderRadius: '12px',
                            background: '#eef2ff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '25px'
                          }}
                        >
                          {getDocIcon(req.documentType)}
                        </div>

                        <div>

                          <h3
                            style={{
                              margin: '2px 0 6px',
                              color: '#172554',
                              fontSize: '18px',
                              fontWeight: '750'
                            }}
                          >
                            {req.documentType}
                          </h3>

                          <p
                            style={{
                              margin: '0',
                              color: '#64748b',
                              fontSize: '13px'
                            }}
                          >
                            {req.requestId}
                          </p>

                          <p
                            style={{
                              margin: '4px 0 0',
                              color: '#94a3b8',
                              fontSize: '12px'
                            }}
                          >
                            {req.createdDate}
                          </p>

                        </div>

                      </div>

                      {/* STATUS */}

                      <div
                        style={{
                          background: status.background,
                          color: status.color,
                          padding: '7px 11px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '800',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {status.icon} {status.text}
                      </div>

                    </div>

                    {/* PURPOSE */}

                    <div
                      style={{
                        marginTop: '18px',
                        background: '#f8fafc',
                        borderRadius: '10px',
                        padding: '12px 14px'
                      }}
                    >

                      <p
                        style={{
                          margin: '0',
                          color: '#475569',
                          fontSize: '14px'
                        }}
                      >
                        <strong style={{ color: '#334155' }}>
                          Purpose:
                        </strong>{' '}
                        {req.purpose || 'Not specified'}
                      </p>

                    </div>

                    {/* =================================================
                        APPROVED
                    ================================================= */}

                    {req.status === 'approved' && (

                      <div
                        style={{
                          marginTop: '18px',
                          paddingTop: '18px',
                          borderTop: '1px solid #e2e8f0'
                        }}
                      >

                        <div
                          style={{
                            display: 'flex',
                            gap: '9px',
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
                              padding: '10px 15px',
                              borderRadius: '9px',
                              fontWeight: '700',
                              cursor: 'pointer',
                              fontSize: '13px'
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
                                padding: '10px 15px',
                                borderRadius: '9px',
                                fontWeight: '700',
                                cursor: 'pointer',
                                fontSize: '13px'
                              }}
                            >
                              📥 Download Document
                            </button>

                          ) : (

                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                color: '#b45309',
                                background: '#fffbeb',
                                padding: '9px 12px',
                                borderRadius: '9px',
                                fontSize: '13px',
                                fontWeight: '600'
                              }}
                            >
                              ⏳ Document upload hone ka wait karein
                            </div>

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
                              padding: '10px 15px',
                              borderRadius: '9px',
                              fontWeight: '700',
                              cursor: 'pointer',
                              fontSize: '13px'
                            }}
                          >
                            📱 Show QR
                          </button>

                        </div>

                        <p
                          style={{
                            margin: '12px 0 0',
                            color: '#94a3b8',
                            fontSize: '12px'
                          }}
                        >
                          Your certificate contains a QR code for secure verification.
                        </p>

                      </div>

                    )}

                    {/* =================================================
                        REJECTED
                    ================================================= */}

                    {req.status === 'rejected' && (

                      <div
                        style={{
                          marginTop: '18px',
                          paddingTop: '18px',
                          borderTop: '1px solid #e2e8f0'
                        }}
                      >

                        <div
                          style={{
                            background: '#fef2f2',
                            border: '1px solid #fecaca',
                            color: '#b91c1c',
                            padding: '12px 14px',
                            borderRadius: '10px',
                            fontSize: '13px',
                            fontWeight: '600'
                          }}
                        >
                          ❌ This request was rejected.
                        </div>

                      </div>

                    )}

                    {/* =================================================
                        PENDING
                    ================================================= */}

                    {req.status !== 'approved' &&
                      req.status !== 'rejected' && (

                        <div
                          style={{
                            marginTop: '18px',
                            paddingTop: '18px',
                            borderTop: '1px solid #e2e8f0'
                          }}
                        >

                          <div
                            style={{
                              background: '#fffbeb',
                              border: '1px solid #fde68a',
                              color: '#a16207',
                              padding: '12px 14px',
                              borderRadius: '10px',
                              fontSize: '13px',
                              fontWeight: '600'
                            }}
                          >
                            ⏳ Waiting for admin review
                          </div>

                        </div>

                      )}

                  </div>
                );
              })}

            </div>

          )}

        </div>

        {/* =====================================================
            FOOTER
        ===================================================== */}

        <div
          style={{
            textAlign: 'center',
            padding: '35px 0 10px',
            color: '#94a3b8',
            fontSize: '12px'
          }}
        >
          KES SHROFF COLLEGE • Zero Trust Credential Verification System
        </div>

      </div>

      {/* =====================================================
          QR MODAL
      ===================================================== */}

      {showQRModal && selectedQR && (

        <div
          style={{
            position: 'fixed',
            inset: '0',
            background: 'rgba(15, 23, 42, 0.72)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: '9999',
            padding: '20px'
          }}
        >

          <div
            style={{
              background: '#ffffff',
              padding: '25px',
              borderRadius: '20px',
              maxWidth: '480px',
              width: '100%',
              boxShadow: '0 25px 60px rgba(0,0,0,0.25)'
            }}
          >

            {/* MODAL HEADER */}

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '18px'
              }}
            >

              <div>

                <h2
                  style={{
                    margin: '0',
                    color: '#172554',
                    fontSize: '21px'
                  }}
                >
                  Document QR Code
                </h2>

                <p
                  style={{
                    margin: '5px 0 0',
                    color: '#64748b',
                    fontSize: '13px'
                  }}
                >
                  Request ID: {selectedQR.requestId}
                </p>

              </div>

              <button
                onClick={() => setShowQRModal(false)}
                style={{
                  background: '#f1f5f9',
                  color: '#475569',
                  border: 'none',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  fontSize: '22px',
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
                padding: '25px',
                background:
                  'linear-gradient(135deg, #eef2ff, #f5f3ff)',
                borderRadius: '15px'
              }}
            >

              <h3
                style={{
                  margin: '0 0 18px',
                  color: '#312e81',
                  fontSize: '16px'
                }}
              >
                📱 Scan for Verification
              </h3>

              <div
                style={{
                  background: '#ffffff',
                  padding: '16px',
                  borderRadius: '14px',
                  display: 'inline-block',
                  boxShadow: '0 5px 15px rgba(15,23,42,0.08)'
                }}
              >

                <div
                  id="qr-code-container"
                  style={{
                    textAlign: 'center',
                    minHeight: '200px',
                    minWidth: '200px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <p
                    style={{
                      color: '#64748b',
                      fontSize: '13px'
                    }}
                  >
                    Generating QR Code...
                  </p>
                </div>

              </div>

              {/* VERIFICATION CODE */}

              <div
                style={{
                  marginTop: '18px',
                  background: '#ffffff',
                  padding: '12px',
                  borderRadius: '10px'
                }}
              >

                <p
                  style={{
                    margin: '0 0 5px',
                    color: '#64748b',
                    fontSize: '12px'
                  }}
                >
                  Verification Code
                </p>

                <p
                  style={{
                    margin: '0',
                    color: '#172554',
                    fontWeight: '800',
                    wordBreak: 'break-all',
                    fontSize: '14px'
                  }}
                >
                  {selectedQR.verificationCode}
                </p>

              </div>

              {/* QR LINK */}

              {qrLink && (

                <p
                  style={{
                    margin: '12px 0 0',
                    color: '#64748b',
                    fontSize: '10px',
                    wordBreak: 'break-all'
                  }}
                >
                  {qrLink}
                </p>

              )}

              <p
                style={{
                  margin: '15px 0 0',
                  color: '#64748b',
                  fontSize: '12px'
                }}
              >
                Scan with your phone camera to verify authenticity.
              </p>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}
