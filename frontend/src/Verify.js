import React, { useState, useEffect } from 'react';

const API_URL =
  process.env.REACT_APP_API_URL || 'https://docverify-asdt.onrender.com';

export default function Verify() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [code, setCode] = useState('');

  useEffect(() => {
    const parts = window.location.pathname.split('/');

    if (parts[2]) {
      const verificationCode = decodeURIComponent(parts[2]);
      setCode(verificationCode);
      verifyDocument(verificationCode);
    }
  }, []);

  const verifyDocument = async (c) => {
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(
        `${API_URL}/api/public/verify/${encodeURIComponent(c)}`
      );

      const data = await res.json();
      setResult(data);
    } catch (e) {
      setResult({
        status: 'error',
        message: 'Verification failed: ' + e.message
      });
    }

    setLoading(false);
  };

  const handleManual = () => {
    const c = manualCode.trim();

    if (!c) return;

    setCode(c);
    verifyDocument(c);
    setManualCode('');
  };

  const isValid =
    result && result.status === 'valid';

  const isInvalid =
    result && result.status === 'invalid';

  const theme = isValid
    ? {
        main: '#059669',
        light: '#ecfdf5',
        border: '#6ee7b7',
        text: '#065f46'
      }
    : isInvalid
    ? {
        main: '#dc2626',
        light: '#fef2f2',
        border: '#fca5a5',
        text: '#991b1b'
      }
    : {
        main: '#d97706',
        light: '#fffbeb',
        border: '#fcd34d',
        text: '#92400e'
      };

  const row = (label, value) => (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: '1rem',
        padding: '0.75rem 0',
        borderBottom: '1px solid #f3f4f6'
      }}
    >
      <span
        style={{
          color: '#6b7280',
          fontSize: '0.875rem'
        }}
      >
        {label}
      </span>

      <span
        style={{
          color: '#111827',
          fontWeight: '600',
          fontSize: '0.95rem',
          textAlign: 'right',
          wordBreak: 'break-word'
        }}
      >
        {value}
      </span>
    </div>
  );

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '1.5rem 1rem',
        boxSizing: 'border-box'
      }}
    >
      <div
        style={{
          maxWidth: '520px',
          margin: '0 auto'
        }}
      >

        <div
          style={{
            textAlign: 'center',
            marginBottom: '1.5rem'
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: '1.75rem',
              color: '#ffffff',
              fontWeight: '700'
            }}
          >
            🎓 DocVerify
          </h1>

          <p
            style={{
              margin: '0.4rem 0 0 0',
              color: '#e0e7ff',
              fontSize: '0.95rem'
            }}
          >
            KES SHROFF COLLEGE • Document Verification
          </p>
        </div>

        <div
          style={{
            background: '#ffffff',
            borderRadius: '1.25rem',
            overflow: 'hidden',
            boxShadow:
              '0 20px 60px rgba(0,0,0,0.3)'
          }}
        >

          {loading && (
            <div
              style={{
                textAlign: 'center',
                padding: '3rem 1rem'
              }}
            >
              <div
                style={{
                  fontSize: '3rem'
                }}
              >
                🔍
              </div>

              <p
                style={{
                  color: '#6b7280',
                  fontWeight: '600'
                }}
              >
                Verifying document...
              </p>
            </div>
          )}

          {!loading && result && (
            <div>

              {/* Status banner */}
              <div
                style={{
                  background: theme.main,
                  padding: '2rem 1.5rem',
                  textAlign: 'center'
                }}
              >
                <div
                  style={{
                    width: '72px',
                    height: '72px',
                    borderRadius: '50%',
                    background: '#ffffff',
                    margin:
                      '0 auto 1rem auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2.25rem',
                    color: theme.main,
                    fontWeight: '700'
                  }}
                >
                  {isValid
                    ? '✓'
                    : isInvalid
                    ? '✕'
                    : '!'}
                </div>

                <h2
                  style={{
                    margin: 0,
                    color: '#ffffff',
                    fontSize: '1.5rem',
                    fontWeight: '700'
                  }}
                >
                  {isValid
                    ? 'Verified Genuine'
                    : isInvalid
                    ? 'Not Verified'
                    : 'Verification Error'}
                </h2>

                <p
                  style={{
                    margin:
                      '0.5rem 0 0 0',
                    color: '#ffffff',
                    opacity: 0.95,
                    fontSize: '0.95rem'
                  }}
                >
                  {result.message}
                </p>
              </div>

              {/* Details */}
              {isValid && (
                <div
                  style={{
                    padding: '1.5rem'
                  }}
                >
                  <h3
                    style={{
                      margin:
                        '0 0 0.5rem 0',
                      fontSize: '1rem',
                      color: '#111827'
                    }}
                  >
                    📋 Document Details
                  </h3>

                  {result.studentName &&
                    row(
                      'Student Name',
                      result.studentName
                    )}

                  {row(
                    'Enrollment No.',
                    result.enrollment
                  )}

                  {row(
                    'Document Type',
                    result.documentType
                  )}

                  {row(
                    'Request ID',
                    result.requestId
                  )}

                  {row(
                    'Request Date',
                    (result.requestDate || '')
                      .substring(0, 10)
                  )}

                  {row(
                    'Issued Document on Record',
                    result.documentOnRecord
                      ? 'Yes ✅'
                      : 'Pending'
                  )}

                  <div
                    style={{
                      background: theme.light,
                      border:
                        `2px solid ${theme.border}`,
                      borderRadius: '0.75rem',
                      padding: '1rem',
                      marginTop: '1.25rem'
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        color: theme.text,
                        fontSize: '0.9rem',
                        fontWeight: '700'
                      }}
                    >
                      🏫 Verified by KES SHROFF COLLEGE
                    </p>

                    <p
                      style={{
                        margin:
                          '0.35rem 0 0 0',
                        color: theme.text,
                        fontSize: '0.8rem'
                      }}
                    >
                      Checked on{' '}
                      {new Date().toLocaleDateString()}{' '}
                      at{' '}
                      {new Date().toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              )}

              {!isValid && (
                <div
                  style={{
                    padding: '1.5rem'
                  }}
                >
                  <div
                    style={{
                      background: theme.light,
                      border:
                        `2px solid ${theme.border}`,
                      borderRadius: '0.75rem',
                      padding: '1rem'
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        color: theme.text,
                        fontSize: '0.9rem'
                      }}
                    >
                      Please contact the college office to confirm this document.
                    </p>
                  </div>
                </div>
              )}

              {code && (
                <div
                  style={{
                    padding:
                      '0 1.5rem 1.5rem 1.5rem'
                  }}
                >
                  <p
                    style={{
                      margin:
                        '0 0 0.35rem 0',
                      color: '#6b7280',
                      fontSize: '0.8rem'
                    }}
                  >
                    Verification Code
                  </p>

                  <p
                    style={{
                      margin: 0,
                      fontFamily: 'monospace',
                      fontSize: '0.85rem',
                      color: '#111827',
                      wordBreak: 'break-all'
                    }}
                  >
                    {code}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Manual entry */}
          {!loading && (
            <div
              style={{
                padding: '1.5rem',
                borderTop: result
                  ? '1px solid #e5e7eb'
                  : 'none'
              }}
            >
              <p
                style={{
                  margin:
                    '0 0 0.75rem 0',
                  color: '#374151',
                  fontWeight: '600',
                  fontSize: '0.95rem'
                }}
              >
                {result
                  ? '🔄 Verify another document'
                  : 'Enter a verification code'}
              </p>

              <div
                style={{
                  display: 'flex',
                  gap: '0.5rem'
                }}
              >
                <input
                  type="text"
                  value={manualCode}
                  onChange={(e) =>
                    setManualCode(
                      e.target.value
                    )
                  }
                  onKeyDown={(e) =>
                    e.key === 'Enter' &&
                    handleManual()
                  }
                  placeholder="e.g., REQ-001-AB12CD34EF"
                  style={{
                    flex: 1,
                    minWidth: 0,
                    padding: '0.75rem',
                    border:
                      '2px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontSize: '0.9rem',
                    fontFamily: 'monospace',
                    boxSizing: 'border-box'
                  }}
                />

                <button
                  onClick={handleManual}
                  style={{
                    background:
                      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: '#ffffff',
                    border: 'none',
                    padding:
                      '0.75rem 1.1rem',
                    borderRadius: '0.5rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Verify
                </button>
              </div>
            </div>
          )}
        </div>

        <p
          style={{
            textAlign: 'center',
            color: '#e0e7ff',
            fontSize: '0.8rem',
            marginTop: '1.25rem'
          }}
        >
          🔒 Secure • ✅ Verified • 📱 Mobile Ready
        </p>
      </div>
    </div>
  );
}
