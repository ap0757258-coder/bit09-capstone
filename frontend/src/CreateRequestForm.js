import React, { useState } from 'react';

export default function CreateRequestForm({ studentId, onBack }) {
  const [documentType, setDocumentType] = useState('');
  const [purpose, setPurpose] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');

    console.log('Submitting:', { studentId, documentType, purpose });

    try {
      const response = await fetch('http://localhost:8080/api/create-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, documentType, purpose })
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        setMsg('❌ Server error: ' + response.status);
        setLoading(false);
        return;
      }

      const data = await response.json();
      console.log('Response data:', data);

      if (data.status === 'success') {
        setMsg('✅ ' + data.message);
        setDocumentType('');
        setPurpose('');
        setTimeout(() => onBack(), 1500);
      } else {
        setMsg('❌ ' + (data.message || 'Request creation failed'));
      }
    } catch (error) {
      console.error('Error:', error);
      setMsg('❌ Error: ' + error.message);
    }

    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#ffffff', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#1f2937', fontSize: '1rem', cursor: 'pointer', marginBottom: '2rem', fontWeight: '600' }}>
          ← Back to Dashboard
        </button>

        <div style={{ borderBottom: '2px solid #e5e7eb', paddingBottom: '2rem', marginBottom: '2rem' }}>
          <h1 style={{ margin: '0', fontSize: '2rem', color: '#111827', fontWeight: '700' }}>New Document Request</h1>
          <p style={{ margin: '0.5rem 0 0 0', color: '#6b7280' }}>Request a new document from the college</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div>
            <label style={{ display: 'block', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>Student ID</label>
            <input
              type="text"
              value={studentId}
              disabled
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', fontSize: '1rem', background: '#f3f4f6', color: '#6b7280', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>Document Type *</label>
            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', fontSize: '1rem', outline: 'none', boxSizing: 'border-box' }}
              required
            >
              <option value="">Select a document...</option>
              <option value="Bonafide Letter">📄 Bonafide Letter</option>
              <option value="Transcript">📋 Transcript</option>
              <option value="Character Certificate">🎓 Character Certificate</option>
              <option value="12th Marksheet">📊 12th Marksheet</option>
              <option value="Leaving Certificate">🏫 Leaving Certificate</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>Purpose *</label>
            <textarea
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="Why do you need this document? (e.g., For admission, job application, visa, etc.)"
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', fontSize: '1rem', minHeight: '100px', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
              required
            />
          </div>

          {msg && (
            <div style={{ padding: '0.75rem', background: msg.includes('✅') ? '#f0fdf4' : '#fef2f2', color: msg.includes('✅') ? '#16a34a' : '#dc2626', borderRadius: '0.375rem', textAlign: 'center', fontWeight: '500' }}>
              {msg}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !documentType || !purpose}
            style={{ background: '#1f2937', color: '#ffffff', border: 'none', padding: '0.75rem', borderRadius: '0.375rem', fontWeight: '600', cursor: (loading || !documentType || !purpose) ? 'not-allowed' : 'pointer', opacity: (loading || !documentType || !purpose) ? '0.7' : '1', fontSize: '1rem' }}
          >
            {loading ? 'Creating Request...' : '📝 Create Request'}
          </button>
        </form>

        <div style={{ marginTop: '2rem', padding: '1rem', background: '#f3f4f6', borderRadius: '0.5rem' }}>
          <p style={{ margin: '0', fontSize: '0.875rem', color: '#6b7280' }}>
            ℹ️ Your request will be reviewed by the admin. You'll receive notification once it's approved.
          </p>
        </div>
      </div>
    </div>
  );
}