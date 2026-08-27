import React, { useState } from 'react';

function App() {
  const [enrollmentNumber, setEnrollmentNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          enrollmentNumber,
          password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(`✅ Login Successful!`);
        localStorage.setItem('token', data.token);
        alert(`Welcome ${data.name}!`);
      } else {
        setMessage('❌ Login Failed! Invalid credentials');
      }
    } catch (error) {
      setMessage('❌ Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #2563eb, #1e40af)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{ width: '100%', maxWidth: '28rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', color: 'white', marginBottom: '0.5rem' }}>
            KES SHROFF
          </h1>
          <p style={{ color: '#dbeafe', fontSize: '1.125rem' }}>Document Portal</p>
          <p style={{ color: '#bfdbfe', fontSize: '0.875rem', marginTop: '0.5rem' }}>
            Zero-Trust Student Document Platform
          </p>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '0.5rem',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          padding: '2rem'
        }}>
          <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1.5rem', textAlign: 'center' }}>
            Student Login
          </h2>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', color: '#374151', fontWeight: '600', marginBottom: '0.5rem' }}>
                Enrollment Number
              </label>
              <input
                type="text"
                placeholder="e.g., AP0757258"
                value={enrollmentNumber}
                onChange={(e) => setEnrollmentNumber(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem 1rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  outline: 'none'
                }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', color: '#374151', fontWeight: '600', marginBottom: '0.5rem' }}>
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem 1rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  outline: 'none'
                }}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '0.375rem',
                fontWeight: 'bold',
                color: 'white',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                background: loading ? '#9ca3af' : '#2563eb'
              }}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {message && (
            <div style={{
              marginTop: '1rem',
              padding: '0.75rem',
              borderRadius: '0.375rem',
              textAlign: 'center',
              fontWeight: '600',
              background: message.includes('✅') ? '#dcfce7' : '#fee2e2',
              color: message.includes('✅') ? '#166534' : '#991b1b'
            }}>
              {message}
            </div>
          )}

          <div style={{ marginTop: '1.5rem', textAlign: 'center', color: '#4b5563', fontSize: '0.875rem' }}>
            <p>© 2026 KES SHROFF COLLEGE</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;