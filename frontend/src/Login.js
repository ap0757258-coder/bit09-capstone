
import React, { useState } from 'react';

export default function Login({ onSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMsg('');

    if (!username.trim() || !password.trim()) {
      setMsg('Please enter enrollment number and password.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          u: username.trim(),
          p: password,
        }),
      });

      const data = await response.json();

      console.log('Login response:', data);

      if (data.status === 'success') {
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
        localStorage.setItem('username', username.trim());

        if (data.role === 'admin') {
          onSuccess('admin');
        } else if (data.role === 'student') {
          onSuccess('student');
        }
      } else {
        setMsg(data.message || 'Login failed.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setMsg('Cannot connect to server. Please make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          background: '#ffffff',
          borderRadius: '20px',
          padding: '40px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ margin: 0, color: '#2d3748', fontSize: '28px' }}>
            KES Shroff College
          </h1>

          <p
            style={{
              marginTop: '8px',
              color: '#718096',
              fontSize: '14px',
            }}
          >
            Student Document Portal
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <label
            style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              color: '#2d3748',
            }}
          >
            Enrollment Number
          </label>

          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter enrollment number"
            autoComplete="username"
            style={{
              width: '100%',
              padding: '13px 14px',
              marginBottom: '18px',
              border: '1px solid #cbd5e0',
              borderRadius: '10px',
              fontSize: '15px',
              boxSizing: 'border-box',
            }}
          />

          <label
            style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              color: '#2d3748',
            }}
          >
            Password
          </label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            autoComplete="current-password"
            style={{
              width: '100%',
              padding: '13px 14px',
              marginBottom: '20px',
              border: '1px solid #cbd5e0',
              borderRadius: '10px',
              fontSize: '15px',
              boxSizing: 'border-box',
            }}
          />

          {msg && (
            <div
              style={{
                background: '#fff5f5',
                color: '#c53030',
                border: '1px solid #feb2b2',
                padding: '11px 13px',
                borderRadius: '8px',
                marginBottom: '18px',
                fontSize: '14px',
              }}
            >
              {msg}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              border: 'none',
              borderRadius: '10px',
              background: loading ? '#a0aec0' : '#667eea',
              color: '#ffffff',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div
          style={{
            marginTop: '25px',
            textAlign: 'center',
            fontSize: '12px',
            color: '#a0aec0',
          }}
        >
          KES Shroff College • Document Verification System
        </div>
      </div>
    </div>
  );
}

