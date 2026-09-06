import React, { useState, useEffect } from 'react';

function VerifyPage() {
  const [status, setStatus] = useState('loading'); // loading | valid | invalid | error
  const [message, setMessage] = useState('');
  const [requestId, setRequestId] = useState('');

  useEffect(() => {
    // URL is like /verify/REQ-001-123456
    const parts = window.location.pathname.split('/verify/');
    const verificationCode = parts[1] || '';

    if (!verificationCode) {
      setStatus('error');
      setMessage('No verification code found in URL.');
      return;
    }

    fetch(`http://localhost:8080/api/qr/verify/${verificationCode}`)
      .then((res) => res.json())
      .then((data) => {
        setStatus(data.status);
        setMessage(data.message);
        setRequestId(data.requestId || '');
      })
      .catch((err) => {
        setStatus('error');
        setMessage('Could not reach verification server.');
      });
  }, []);

  const colors = {
    loading: { bg: '#f3f4f6', text: '#374151', icon: '⏳' },
    valid: { bg: '#f0fdf4', text: '#16a34a', icon: '✅' },
    invalid: { bg: '#fef2f2', text: '#dc2626', icon: '❌' },
    error: { bg: '#fef2f2', text: '#dc2626', icon: '⚠️' },
  };
  const style = colors[status] || colors.error;

  return (
    <div style={{ minHeight: '100vh', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ width: '100%', maxWidth: '420px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '1.75rem', color: '#111827', fontWeight: '700', marginBottom: '0.5rem' }}>KES SHROFF</h1>
        <p style={{ color: '#6b7280', marginBottom: '2rem' }}>Document Verification</p>

        <div style={{ background: style.bg, border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{style.icon}</div>
          <h2 style={{ color: style.text, fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
            {status === 'loading' && 'Verifying...'}
            {status === 'valid' && 'Document Verified'}
            {status === 'invalid' && 'Verification Failed'}
            {status === 'error' && 'Something Went Wrong'}
          </h2>
          <p style={{ color: '#374151', fontSize: '0.9rem' }}>{message}</p>
          {requestId && (
            <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#6b7280' }}>
              Request ID: <strong>{requestId}</strong>
            </p>
          )}
        </div>

        <p style={{ marginTop: '2rem', fontSize: '0.75rem', color: '#9ca3af' }}>© 2026 KES SHROFF COLLEGE | Secure Platform</p>
      </div>
    </div>
  );
}

export default VerifyPage;