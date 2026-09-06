import React, { useState, useEffect } from 'react';

export default function Verify() {
  const [verificationCode, setVerificationCode] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const pathArray = window.location.pathname.split('/');
    const code = pathArray[pathArray.length - 1];
    setVerificationCode(code);
    verifyDocument(code);
  }, []);

  const verifyDocument = async (code) => {
    try {
      const res = await fetch(`http://localhost:8080/api/qr/verify/${code}`);
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setResult({ status: 'error', message: 'Verification failed' });
    }
    setLoading(false);
  };

  const isValid = result?.status === 'valid';

  return (
    <div style={{ minHeight: '100vh', background: '#ffffff', padding: '2rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: '600px', width: '100%', textAlign: 'center' }}>
        <h1 style={{ margin: '0 0 1rem 0', fontSize: '2rem', color: '#111827', fontWeight: '700' }}>Document Verification</h1>
        {loading ? (
          <p style={{ color: '#6b7280' }}>Verifying document...</p>
        ) : (
          <div>
            <div style={{ background: isValid ? '#d1fae5' : '#fee2e2', border: isValid ? '2px solid #10b981' : '2px solid #dc2626', borderRadius: '0.75rem', padding: '2rem', marginBottom: '2rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{isValid ? '✅' : '❌'}</div>
              <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.5rem', color: isValid ? '#065f46' : '#7f1d1d', fontWeight: '600' }}>
                {isValid ? 'Document is Authentic' : 'Document is Invalid'}
              </h2>
              <p style={{ margin: '0', color: isValid ? '#059669' : '#dc2626', fontSize: '1.1rem', fontWeight: '500' }}>
                {result?.message}
              </p>
            </div>
            <div style={{ background: '#f3f4f6', padding: '1.5rem', borderRadius: '0.5rem', marginBottom: '2rem' }}>
              <p style={{ margin: '0 0 0.5rem 0', color: '#6b7280', fontSize: '0.875rem' }}>Verification Code:</p>
              <p style={{ margin: '0', color: '#1f2937', fontWeight: '600', fontSize: '1.1rem', wordBreak: 'break-all' }}>
                {verificationCode}
              </p>
            </div>
            <button onClick={() => window.location.href = '/'} style={{ background: '#1f2937', color: '#ffffff', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '0.375rem', fontWeight: '600', cursor: 'pointer' }}>
              Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}