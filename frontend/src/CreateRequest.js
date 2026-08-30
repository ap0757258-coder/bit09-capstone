import React, { useState } from 'react';

export default function CreateRequest({ onBack }) {
  const [docType, setDocType] = useState('');
  const [purpose, setPurpose] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');

    try {
      const res = await fetch('http://localhost:8080/api/create-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentType: docType, purpose: purpose })
      });

      const data = await res.json();
      
      if (data.status === 'success') {
        setMsg('✅ Request created successfully');
        setTimeout(() => onBack(), 1200);
      } else {
        setMsg('❌ ' + data.message);
      }
    } catch (error) {
      setMsg('❌ Error: ' + error.message);
    }

    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#ffffff', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#1f2937', fontSize: '1rem', cursor: 'pointer', marginBottom: '2rem', fontWeight: '600' }}>
          ← Back
        </button>

        <div style={{ borderBottom: '2px solid #e5e7eb', paddingBottom: '2rem', marginBottom: '2rem' }}>
          <h1 style={{ margin: '0', fontSize: '2rem', color: '#111827', fontWeight: '700' }}>New Request</h1>
          <p style={{ margin: '0.5rem 0 0 0', color: '#6b7280' }}>Request a new document</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div>
            <label style={{ display: 'block', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>Document Type</label>
            <select 
              value={docType} 
              onChange={(e) => setDocType(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', fontSize: '1rem', outline: 'none', boxSizing: 'border-box' }}
              required
            >
              <option value="">Select document...</option>
              <option value="Bonafide Letter">Bonafide Letter</option>
              <option value="Transcript">Transcript</option>
              <option value="Character Certificate">Character Certificate</option>
              <option value="12th Marksheet">12th Marksheet</option>
              <option value="Leaving Certificate">Leaving Certificate</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>Purpose</label>
            <textarea 
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="Why do you need this document?"
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', fontSize: '1rem', minHeight: '120px', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
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
            disabled={loading}
            style={{ background: '#1f2937', color: '#ffffff', border: 'none', padding: '0.75rem', borderRadius: '0.375rem', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? '0.7' : '1' }}
          >
            {loading ? 'Creating...' : 'Create Request'}
          </button>
        </form>
      </div>
    </div>
  );
}