import React, { useState, useEffect } from 'react';

export default function Verify() {
  const [verificationCode, verificationCodeSet] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [manualCode, setManualCode] = useState('');

  useEffect(() => {
    const pathArray = window.location.pathname.split('/');

    if (pathArray[2]) {
      const code = pathArray[2];
      verificationCodeSet(code);
      verifyDocument(code);
    }
  }, []);

  const verifyDocument = async (code) => {
    setLoading(true);

    try {
      // IMPORTANT:
      // Use relative API URL so the request goes through
      // the same public ngrok address as the frontend.
      const res = await fetch(`/api/verify/${code}`);

      const data = await res.json();

      setResult(data);
      setShowResult(true);

    } catch (e) {
      setResult({
        status: 'error',
        message: 'Verification failed: ' + e.message,
        requestId: ''
      });

      setShowResult(true);
    }

    setLoading(false);
  };

  const handleVerifyAgain = () => {
    const code =
      manualCode ||
      document.getElementById('codeInput')?.value;

    if (code) {
      verificationCodeSet(code);
      verifyDocument(code);
      setManualCode('');
    }
  };

  const getStatusIcon = (status) => {
    if (status === 'valid') return '✅';
    if (status === 'invalid') return '❌';
    return '⚠️';
  };

  const getStatusColor = (status) => {
    if (status === 'valid') {
      return {
        bg: '#d1fae5',
        text: '#065f46',
        border: '#6ee7b7',
        light: '#ecfdf5'
      };
    }

    if (status === 'invalid') {
      return {
        bg: '#fee2e2',
        text: '#991b1b',
        border: '#fca5a5',
        light: '#fef2f2'
      };
    }

    return {
      bg: '#fef3c7',
      text: '#92400e',
      border: '#fcd34d',
      light: '#fffbeb'
    };
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '2rem 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div style={{ maxWidth: '700px', width: '100%' }}>

        {/* Header */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: '2.5rem'
          }}
        >
          <h1
            style={{
              margin: '0',
              fontSize: '2.5rem',
              color: '#ffffff',
              fontWeight: '700'
            }}
          >
            🔐 DocVerify
          </h1>

          <p
            style={{
              margin: '0.5rem 0 0 0',
              color: '#e0e7ff',
              fontSize: '1rem'
            }}
          >
            KES SHROFF COLLEGE - Document Verification
          </p>
        </div>

        {/* Main Card */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '1.25rem',
            padding: '2.5rem',
            boxShadow:
              '0 20px 60px rgba(0, 0, 0, 0.3)',
            marginBottom: '2rem'
          }}
        >

          {/* Loading */}
          {loading ? (
            <div
              style={{
                textAlign: 'center',
                padding: '3rem 1rem'
              }}
            >
              <div
                style={{
                  fontSize: '3.5rem',
                  marginBottom: '1rem',
                  animation: 'spin 1s linear infinite'
                }}
              >
                🔍
              </div>

              <p
                style={{
                  color: '#6b7280',
                  fontSize: '1.1rem',
                  fontWeight: '600'
                }}
              >
                Verifying document...
              </p>

              <div
                style={{
                  marginTop: '1.5rem',
                  height: '4px',
                  background: '#e5e7eb',
                  borderRadius: '2px',
                  overflow: 'hidden'
                }}
              >
                <div
                  style={{
                    height: '100%',
                    background:
                      'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                    animation:
                      'pulse 1.5s ease-in-out infinite',
                    width: '50%'
                  }}
                />
              </div>

              <style>{`
                @keyframes spin {
                  from { transform: rotate(0deg); }
                  to { transform: rotate(360deg); }
                }

                @keyframes pulse {
                  0%, 100% { opacity: 1; }
                  50% { opacity: 0.5; }
                }
              `}</style>
            </div>

          ) : showResult ? (

            <div>

              {/* Status */}
              <div
                style={{
                  background:
                    getStatusColor(result.status).light,
                  borderLeft:
                    `5px solid ${getStatusColor(result.status).border}`,
                  padding: '1.75rem',
                  borderRadius: '0.75rem',
                  marginBottom: '2rem'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    marginBottom: '1rem'
                  }}
                >
                  <span style={{ fontSize: '3rem' }}>
                    {getStatusIcon(result.status)}
                  </span>

                  <div>
                    <h2
                      style={{
                        margin: '0',
                        fontSize: '1.75rem',
                        color:
                          getStatusColor(result.status).text,
                        fontWeight: '700'
                      }}
                    >
                      {result.status === 'valid'
                        ? '✅ Document Verified'
                        : result.status === 'invalid'
                        ? '❌ Document Invalid'
                        : '⚠️ Verification Error'}
                    </h2>

                    <p
                      style={{
                        margin: '0.5rem 0 0 0',
                        fontSize: '1rem',
                        color:
                          getStatusColor(result.status).text
                      }}
                    >
                      {result.message}
                    </p>
                  </div>
                </div>
              </div>

              {/* Document Details */}
              {result.requestId && (
                <>
                  <h3
                    style={{
                      margin: '0 0 1.5rem 0',
                      fontSize: '1.25rem',
                      color: '#111827',
                      fontWeight: '700'
                    }}
                  >
                    📋 Document Information
                  </h3>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        '1fr 1fr',
                      gap: '1.5rem',
                      marginBottom: '2rem'
                    }}
                  >

                    <div
                      style={{
                        background: '#f9fafb',
                        padding: '1.25rem',
                        borderRadius: '0.75rem',
                        border:
                          '1px solid #e5e7eb'
                      }}
                    >
                      <p
                        style={{
                          margin: '0',
                          fontSize: '0.875rem',
                          color: '#6b7280',
                          fontWeight: '600'
                        }}
                      >
                        🔖 Request ID
                      </p>

                      <p
                        style={{
                          margin: '0.5rem 0 0 0',
                          fontSize: '1.1rem',
                          color: '#111827',
                          fontWeight: '700',
                          fontFamily: 'monospace'
                        }}
                      >
                        {result.requestId}
                      </p>
                    </div>

                    <div
                      style={{
                        background: '#f9fafb',
                        padding: '1.25rem',
                        borderRadius: '0.75rem',
                        border:
                          '1px solid #e5e7eb'
                      }}
                    >
                      <p
                        style={{
                          margin: '0',
                          fontSize: '0.875rem',
                          color: '#6b7280',
                          fontWeight: '600'
                        }}
                      >
                        📅 Verification Date
                      </p>

                      <p
                        style={{
                          margin: '0.5rem 0 0 0',
                          fontSize: '1.1rem',
                          color: '#111827',
                          fontWeight: '700'
                        }}
                      >
                        {new Date().toLocaleDateString()}
                      </p>
                    </div>

                  </div>

                  {/* Verification Details */}
                  <div
                    style={{
                      background:
                        getStatusColor(result.status).light,
                      border:
                        `2px solid ${getStatusColor(result.status).border}`,
                      padding: '1.5rem',
                      borderRadius: '0.75rem',
                      marginBottom: '2rem'
                    }}
                  >
                    <h4
                      style={{
                        margin: '0 0 1rem 0',
                        fontSize: '1rem',
                        color:
                          getStatusColor(result.status).text,
                        fontWeight: '700'
                      }}
                    >
                      Verification Details:
                    </h4>

                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem'
                      }}
                    >

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem'
                        }}
                      >
                        <span style={{ fontSize: '1.25rem' }}>
                          🏫
                        </span>

                        <div>
                          <p
                            style={{
                              margin: '0',
                              fontSize: '0.875rem',
                              color:
                                getStatusColor(result.status).text
                            }}
                          >
                            Verified by
                          </p>

                          <p
                            style={{
                              margin: '0.25rem 0 0 0',
                              fontSize: '1rem',
                              fontWeight: '700',
                              color:
                                getStatusColor(result.status).text
                            }}
                          >
                            KES SHROFF COLLEGE
                          </p>
                        </div>
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem'
                        }}
                      >
                        <span style={{ fontSize: '1.25rem' }}>
                          🔒
                        </span>

                        <div>
                          <p
                            style={{
                              margin: '0',
                              fontSize: '0.875rem',
                              color:
                                getStatusColor(result.status).text
                            }}
                          >
                            Security Status
                          </p>

                          <p
                            style={{
                              margin: '0.25rem 0 0 0',
                              fontSize: '1rem',
                              fontWeight: '700',
                              color:
                                getStatusColor(result.status).text
                            }}
                          >
                            Secure & Authenticated
                          </p>
                        </div>
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem'
                        }}
                      >
                        <span style={{ fontSize: '1.25rem' }}>
                          ⏱️
                        </span>

                        <div>
                          <p
                            style={{
                              margin: '0',
                              fontSize: '0.875rem',
                              color:
                                getStatusColor(result.status).text
                            }}
                          >
                            Verification Time
                          </p>

                          <p
                            style={{
                              margin: '0.25rem 0 0 0',
                              fontSize: '1rem',
                              fontWeight: '700',
                              color:
                                getStatusColor(result.status).text
                            }}
                          >
                            {new Date().toLocaleTimeString()}
                          </p>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Verification Code */}
                  <div
                    style={{
                      background: '#fef3c7',
                      border: '2px solid #fcd34d',
                      padding: '1.5rem',
                      borderRadius: '0.75rem',
                      marginBottom: '2rem'
                    }}
                  >
                    <p
                      style={{
                        margin: '0 0 0.75rem 0',
                        fontSize: '0.875rem',
                        color: '#92400e',
                        fontWeight: '600'
                      }}
                    >
                      🔐 Verification Code
                    </p>

                    <p
                      style={{
                        margin: '0',
                        fontSize: '0.95rem',
                        color: '#111827',
                        fontWeight: '700',
                        fontFamily: 'monospace',
                        wordBreak: 'break-all'
                      }}
                    >
                      {verificationCode ||
                        window.location.pathname.split(
                          '/verify/'
                        )[1] ||
                        'Verification code'}
                    </p>
                  </div>
                </>
              )}

              {/* Verify Another */}
              <div
                style={{
                  marginTop: '2rem',
                  paddingTop: '2rem',
                  borderTop: '1px solid #e5e7eb'
                }}
              >
                <h3
                  style={{
                    margin: '0 0 1rem 0',
                    fontSize: '1rem',
                    color: '#111827',
                    fontWeight: '700'
                  }}
                >
                  🔄 Verify Another Document
                </h3>

                <div
                  style={{
                    display: 'flex',
                    gap: '0.5rem'
                  }}
                >
                  <input
                    type="text"
                    id="codeInput"
                    placeholder="Enter verification code"
                    value={manualCode}
                    onChange={(e) =>
                      setManualCode(e.target.value)
                    }
                    onKeyDown={(e) =>
                      e.key === 'Enter' &&
                      handleVerifyAgain()
                    }
                    style={{
                      flex: 1,
                      padding: '0.75rem 1rem',
                      border:
                        '2px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      fontSize: '0.95rem',
                      fontFamily: 'monospace',
                      boxSizing: 'border-box'
                    }}
                  />

                  <button
                    onClick={handleVerifyAgain}
                    style={{
                      background:
                        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: '#ffffff',
                      border: 'none',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '0.5rem',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    ✓ Verify
                  </button>
                </div>
              </div>

            </div>

          ) : (

            <div
              style={{
                textAlign: 'center',
                padding: '2rem 1rem'
              }}
            >
              <div
                style={{
                  fontSize: '3.5rem',
                  marginBottom: '1rem'
                }}
              >
                📄
              </div>

              <p
                style={{
                  color: '#6b7280',
                  fontSize: '1.1rem',
                  marginBottom: '1.5rem',
                  fontWeight: '600'
                }}
              >
                Enter a verification code to check
                document authenticity
              </p>

              <div
                style={{
                  display: 'flex',
                  gap: '0.5rem'
                }}
              >
                <input
                  type="text"
                  id="codeInput"
                  placeholder="Enter verification code"
                  value={manualCode}
                  onChange={(e) =>
                    setManualCode(e.target.value)
                  }
                  onKeyDown={(e) =>
                    e.key === 'Enter' &&
                    handleVerifyAgain()
                  }
                  style={{
                    flex: 1,
                    padding: '0.75rem 1rem',
                    border:
                      '2px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontSize: '0.95rem',
                    fontFamily: 'monospace',
                    boxSizing: 'border-box'
                  }}
                />

                <button
                  onClick={handleVerifyAgain}
                  style={{
                    background:
                      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: '#ffffff',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '0.5rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  ✓ Verify
                </button>
              </div>
            </div>

          )}

        </div>

        {/* Footer */}
        <div
          style={{
            textAlign: 'center',
            color: '#e0e7ff',
            fontSize: '0.875rem'
          }}
        >
          <p style={{ margin: '0' }}>
            🔒 Secure • ✅ Verified • 📱 Mobile Ready
          </p>
        </div>

      </div>
    </div>
  );
}