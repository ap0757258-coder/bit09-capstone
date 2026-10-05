import React, { useState } from 'react';

const API_URL =
  process.env.REACT_APP_API_URL || 'https://docverify-asdt.onrender.com';

export default function Login() {
  const [tab, setTab] = useState('student'); // 'student' or 'alumni'

  // Current Student Form
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Alumni Form
  const [alumniName, setAlumniName] = useState('');
  const [alumniEnrollment, setAlumniEnrollment] = useState('');
  const [alumniYear, setAlumniYear] = useState('');
  const [alumniDepartment, setAlumniDepartment] = useState('');
  const [alumniEmail, setAlumniEmail] = useState('');
  const [alumniPassword, setAlumniPassword] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleStudentLogin = async () => {
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          u: username,
          p: password
        })
      });

      const data = await res.json();

      if (data.status === 'success') {
        localStorage.setItem('studentId', username);
        localStorage.setItem('role', data.role);
        localStorage.setItem('userType', 'student');

        if (data.role === 'admin') {
          window.location.href = '/admin';
        } else {
          window.location.href = '/dashboard';
        }
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (e) {
      setError('Connection error: ' + e.message);
    }

    setLoading(false);
  };

  const handleAlumniLogin = async () => {
    if (
      !alumniName ||
      !alumniEnrollment ||
      !alumniYear ||
      !alumniDepartment ||
      !alumniEmail ||
      !alumniPassword
    ) {
      setError('Please fill all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          u: alumniEnrollment,
          p: alumniPassword,
          name: alumniName,
          email: alumniEmail,
          department: alumniDepartment,
          graduationYear: alumniYear
        })
      });

      const data = await res.json();

      if (data.status === 'success') {
        localStorage.setItem('studentId', alumniEnrollment);
        localStorage.setItem('role', 'student');
        localStorage.setItem('userType', 'alumni');
        localStorage.setItem('alumniName', alumniName);
        localStorage.setItem('graduationYear', alumniYear);

        window.location.href = '/dashboard';
      } else {
        setError(data.message || 'Alumni login failed');
      }
    } catch (e) {
      setError('Connection error: ' + e.message);
    }

    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (tab === 'student') {
        handleStudentLogin();
      } else {
        handleAlumniLogin();
      }
    }
  };

  const handleDemoStudent = () => {
    setUsername('TDIT065A');
    setPassword('TDIT065A');
  };

  const handleDemoAlumni = () => {
    setAlumniName('KRISHNA CHETAN SOLANKI');
    setAlumniEnrollment('TDMMC0050');
    setAlumniYear('2024');
    setAlumniDepartment('B.A MMC');
    setAlumniEmail('krishna@kesproject.edu');
    setAlumniPassword('TDMMC0050');
  };

  const handleDemoAdmin = () => {
    setUsername('admin');
    setPassword('admin123');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
    >
      <div style={{ maxWidth: '500px', width: '100%' }}>

        {/* Logo Section */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: '3rem'
          }}
        >
          <div
            style={{
              fontSize: '3.5rem',
              marginBottom: '1rem'
            }}
          >
            🎓
          </div>

          <h1
            style={{
              margin: '0',
              fontSize: '2rem',
              color: '#ffffff',
              fontWeight: '700',
              letterSpacing: '-0.5px'
            }}
          >
            DocVerify
          </h1>

          <p
            style={{
              margin: '0.5rem 0 0 0',
              color: '#e0e7ff',
              fontSize: '1rem'
            }}
          >
            KES SHROFF COLLEGE
          </p>

          <p
            style={{
              margin: '0.25rem 0 0 0',
              color: '#c7d2fe',
              fontSize: '0.875rem'
            }}
          >
            Secure Document Verification Platform
          </p>
        </div>

        {/* Login Card */}
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

          {/* Tabs */}
          <div
            style={{
              display: 'flex',
              gap: '1rem',
              marginBottom: '2rem',
              borderBottom: '2px solid #f3f4f6'
            }}
          >
            <button
              onClick={() => {
                setTab('student');
                setError('');
              }}
              style={{
                paddingBottom: '1rem',
                borderBottom:
                  tab === 'student'
                    ? '3px solid #667eea'
                    : 'none',
                flex: 1,
                textAlign: 'center',
                background: 'none',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <p
                style={{
                  margin: '0',
                  color:
                    tab === 'student'
                      ? '#667eea'
                      : '#9ca3af',
                  fontWeight: '600',
                  fontSize: '0.95rem'
                }}
              >
                👨‍🎓 Current Student
              </p>
            </button>

            <button
              onClick={() => {
                setTab('alumni');
                setError('');
              }}
              style={{
                paddingBottom: '1rem',
                borderBottom:
                  tab === 'alumni'
                    ? '3px solid #667eea'
                    : 'none',
                flex: 1,
                textAlign: 'center',
                background: 'none',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <p
                style={{
                  margin: '0',
                  color:
                    tab === 'alumni'
                      ? '#667eea'
                      : '#9ca3af',
                  fontWeight: '600',
                  fontSize: '0.95rem'
                }}
              >
                🎓 Alumni
              </p>
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div
              style={{
                background: '#fee2e2',
                border: '1px solid #fca5a5',
                borderRadius: '0.5rem',
                padding: '1rem',
                marginBottom: '1.5rem',
                display: 'flex',
                gap: '0.75rem',
                alignItems: 'flex-start'
              }}
            >
              <span style={{ fontSize: '1.25rem' }}>
                ⚠️
              </span>

              <div>
                <p
                  style={{
                    margin: '0',
                    color: '#991b1b',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}
                >
                  {error}
                </p>
              </div>
            </div>
          )}

          {/* CURRENT STUDENT TAB */}
          {tab === 'student' && (
            <div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label
                  style={{
                    display: 'block',
                    color: '#374151',
                    fontWeight: '600',
                    marginBottom: '0.5rem',
                    fontSize: '0.875rem'
                  }}
                >
                  Enrollment Number
                </label>

                <input
                  type="text"
                  value={username}
                  onChange={(e) =>
                    setUsername(e.target.value)
                  }
                  onKeyPress={handleKeyPress}
                  placeholder="e.g., TDIT065A"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s',
                    outline: 'none'
                  }}
                  onFocus={(e) =>
                    e.target.style.borderColor =
                      '#667eea'
                  }
                  onBlur={(e) =>
                    e.target.style.borderColor =
                      '#e5e7eb'
                  }
                />
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <label
                  style={{
                    display: 'block',
                    color: '#374151',
                    fontWeight: '600',
                    marginBottom: '0.5rem',
                    fontSize: '0.875rem'
                  }}
                >
                  Password
                </label>

                <input
                  type="password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  onKeyPress={handleKeyPress}
                  placeholder="Enter password"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s',
                    outline: 'none'
                  }}
                  onFocus={(e) =>
                    e.target.style.borderColor =
                      '#667eea'
                  }
                  onBlur={(e) =>
                    e.target.style.borderColor =
                      '#e5e7eb'
                  }
                />
              </div>

              <button
                onClick={handleStudentLogin}
                disabled={loading}
                style={{
                  width: '100%',
                  background: loading
                    ? '#9ca3af'
                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '0.875rem 1rem',
                  borderRadius: '0.5rem',
                  fontWeight: '600',
                  cursor: loading
                    ? 'not-allowed'
                    : 'pointer',
                  fontSize: '1rem',
                  transition: 'transform 0.2s',
                  transform: loading
                    ? 'scale(0.98)'
                    : 'scale(1)'
                }}
                onMouseEnter={(e) =>
                  !loading &&
                  (e.target.style.transform =
                    'scale(1.02)')
                }
                onMouseLeave={(e) =>
                  !loading &&
                  (e.target.style.transform =
                    'scale(1)')
                }
              >
                {loading
                  ? '🔄 Logging in...'
                  : '✓ Sign In'}
              </button>

              <div
                style={{
                  marginTop: '1.5rem',
                  paddingTop: '1.5rem',
                  borderTop:
                    '1px solid #f3f4f6'
                }}
              >
                <p
                  style={{
                    margin:
                      '0 0 1rem 0',
                    color: '#6b7280',
                    fontSize: '0.875rem',
                    textAlign: 'center'
                  }}
                >
                  Demo Accounts:
                </p>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns:
                      '1fr 1fr',
                    gap: '0.75rem'
                  }}
                >
                  <button
                    onClick={handleDemoStudent}
                    style={{
                      background: '#f3f4f6',
                      border:
                        '1px solid #d1d5db',
                      color: '#374151',
                      padding:
                        '0.5rem 1rem',
                      borderRadius:
                        '0.375rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      transition:
                        'all 0.2s'
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.background =
                        '#e5e7eb')
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.background =
                        '#f3f4f6')
                    }
                  >
                    👨‍🎓 Demo Student
                  </button>

                  <button
                    onClick={handleDemoAdmin}
                    style={{
                      background: '#f3f4f6',
                      border:
                        '1px solid #d1d5db',
                      color: '#374151',
                      padding:
                        '0.5rem 1rem',
                      borderRadius:
                        '0.375rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      transition:
                        'all 0.2s'
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.background =
                        '#e5e7eb')
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.background =
                        '#f3f4f6')
                    }
                  >
                    👨‍💼 Admin
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ALUMNI TAB */}
          {tab === 'alumni' && (
            <div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label
                  style={{
                    display: 'block',
                    color: '#374151',
                    fontWeight: '600',
                    marginBottom: '0.5rem',
                    fontSize: '0.875rem'
                  }}
                >
                  Full Name
                </label>

                <input
                  type="text"
                  value={alumniName}
                  onChange={(e) =>
                    setAlumniName(e.target.value)
                  }
                  onKeyPress={handleKeyPress}
                  placeholder="Your full name"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                    outline: 'none'
                  }}
                  onFocus={(e) =>
                    e.target.style.borderColor =
                      '#667eea'
                  }
                  onBlur={(e) =>
                    e.target.style.borderColor =
                      '#e5e7eb'
                  }
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label
                  style={{
                    display: 'block',
                    color: '#374151',
                    fontWeight: '600',
                    marginBottom: '0.5rem',
                    fontSize: '0.875rem'
                  }}
                >
                  Old Enrollment Number
                </label>

                <input
                  type="text"
                  value={alumniEnrollment}
                  onChange={(e) =>
                    setAlumniEnrollment(
                      e.target.value
                    )
                  }
                  onKeyPress={handleKeyPress}
                  placeholder="e.g., TDMMC0050"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                    outline: 'none'
                  }}
                  onFocus={(e) =>
                    e.target.style.borderColor =
                      '#667eea'
                  }
                  onBlur={(e) =>
                    e.target.style.borderColor =
                      '#e5e7eb'
                  }
                />
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    '1fr 1fr',
                  gap: '1rem',
                  marginBottom: '1.5rem'
                }}
              >
                <div>
                  <label
                    style={{
                      display: 'block',
                      color: '#374151',
                      fontWeight: '600',
                      marginBottom: '0.5rem',
                      fontSize: '0.875rem'
                    }}
                  >
                    Graduation Year
                  </label>

                  <input
                    type="text"
                    value={alumniYear}
                    onChange={(e) =>
                      setAlumniYear(
                        e.target.value
                      )
                    }
                    onKeyPress={handleKeyPress}
                    placeholder="e.g., 2024"
                    style={{
                      width: '100%',
                      padding:
                        '0.75rem 1rem',
                      border:
                        '2px solid #e5e7eb',
                      borderRadius:
                        '0.5rem',
                      fontSize: '1rem',
                      fontFamily:
                        'inherit',
                      boxSizing:
                        'border-box',
                      outline: 'none'
                    }}
                    onFocus={(e) =>
                      e.target.style.borderColor =
                        '#667eea'
                    }
                    onBlur={(e) =>
                      e.target.style.borderColor =
                        '#e5e7eb'
                    }
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: 'block',
                      color: '#374151',
                      fontWeight: '600',
                      marginBottom: '0.5rem',
                      fontSize: '0.875rem'
                    }}
                  >
                    Department
                  </label>

                  <input
                    type="text"
                    value={alumniDepartment}
                    onChange={(e) =>
                      setAlumniDepartment(
                        e.target.value
                      )
                    }
                    onKeyPress={handleKeyPress}
                    placeholder="e.g., B.A MMC"
                    style={{
                      width: '100%',
                      padding:
                        '0.75rem 1rem',
                      border:
                        '2px solid #e5e7eb',
                      borderRadius:
                        '0.5rem',
                      fontSize: '1rem',
                      fontFamily:
                        'inherit',
                      boxSizing:
                        'border-box',
                      outline: 'none'
                    }}
                    onFocus={(e) =>
                      e.target.style.borderColor =
                        '#667eea'
                    }
                    onBlur={(e) =>
                      e.target.style.borderColor =
                        '#e5e7eb'
                    }
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label
                  style={{
                    display: 'block',
                    color: '#374151',
                    fontWeight: '600',
                    marginBottom: '0.5rem',
                    fontSize: '0.875rem'
                  }}
                >
                  Email
                </label>

                <input
                  type="email"
                  value={alumniEmail}
                  onChange={(e) =>
                    setAlumniEmail(
                      e.target.value
                    )
                  }
                  onKeyPress={handleKeyPress}
                  placeholder="your.email@example.com"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                    outline: 'none'
                  }}
                  onFocus={(e) =>
                    e.target.style.borderColor =
                      '#667eea'
                  }
                  onBlur={(e) =>
                    e.target.style.borderColor =
                      '#e5e7eb'
                  }
                />
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <label
                  style={{
                    display: 'block',
                    color: '#374151',
                    fontWeight: '600',
                    marginBottom: '0.5rem',
                    fontSize: '0.875rem'
                  }}
                >
                  Password
                </label>

                <input
                  type="password"
                  value={alumniPassword}
                  onChange={(e) =>
                    setAlumniPassword(
                      e.target.value
                    )
                  }
                  onKeyPress={handleKeyPress}
                  placeholder="Enter password"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                    outline: 'none'
                  }}
                  onFocus={(e) =>
                    e.target.style.borderColor =
                      '#667eea'
                  }
                  onBlur={(e) =>
                    e.target.style.borderColor =
                      '#e5e7eb'
                  }
                />
              </div>

              <button
                onClick={handleAlumniLogin}
                disabled={loading}
                style={{
                  width: '100%',
                  background: loading
                    ? '#9ca3af'
                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '0.875rem 1rem',
                  borderRadius: '0.5rem',
                  fontWeight: '600',
                  cursor: loading
                    ? 'not-allowed'
                    : 'pointer',
                  fontSize: '1rem',
                  transition: 'transform 0.2s',
                  transform: loading
                    ? 'scale(0.98)'
                    : 'scale(1)'
                }}
                onMouseEnter={(e) =>
                  !loading &&
                  (e.target.style.transform =
                    'scale(1.02)')
                }
                onMouseLeave={(e) =>
                  !loading &&
                  (e.target.style.transform =
                    'scale(1)')
                }
              >
                {loading
                  ? '🔄 Logging in...'
                  : '✓ Sign In as Alumni'}
              </button>

              <div
                style={{
                  marginTop: '1.5rem',
                  paddingTop: '1.5rem',
                  borderTop:
                    '1px solid #f3f4f6'
                }}
              >
                <button
                  onClick={handleDemoAlumni}
                  style={{
                    width: '100%',
                    background: '#f3f4f6',
                    border:
                      '1px solid #d1d5db',
                    color: '#374151',
                    padding:
                      '0.75rem 1rem',
                    borderRadius:
                      '0.375rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.background =
                      '#e5e7eb')
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.background =
                      '#f3f4f6')
                  }
                >
                  🎓 Demo Alumni
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div
          style={{
            textAlign: 'center',
            color: '#e0e7ff',
            fontSize: '0.875rem'
          }}
        >
          <p style={{ margin: '0' }}>
            🔒 Secure • 🌐 Verified • 📱 Mobile Ready
          </p>
        </div>
      </div>
    </div>
  );
}
