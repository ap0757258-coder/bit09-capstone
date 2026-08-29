import React, { useState } from 'react';

function App() {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ u: user, p: pass })
      });
      
      if (response.ok) {
        const data = await response.json();
        setMsg('✅ Login Successful!');
      } else {
        setMsg('❌ Invalid Credentials!');
      }
    } catch (error) {
      setMsg('❌ Error: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #2563eb, #1e40af)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '28rem', background: 'white', borderRadius: '0.5rem', boxShadow: '0 20px 25px', padding: '2rem' }}>
        <h1 style={{ textAlign: 'center', color: '#2563eb', marginBottom: '1rem' }}>KES SHROFF</h1>
        <h2 style={{ textAlign: 'center', fontSize: '1.5rem', marginBottom: '2rem' }}>Student Login</h2>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input type="text" placeholder="User: test123" value={user} onChange={(e) => setUser(e.target.value)} style={{ padding: '0.75rem', border: '1px solid #ccc', borderRadius: '0.375rem' }} required />
          
          <input type="password" placeholder="Pass: test123" value={pass} onChange={(e) => setPass(e.target.value)} style={{ padding: '0.75rem', border: '1px solid #ccc', borderRadius: '0.375rem' }} required />
          
          <button type="submit" disabled={loading} style={{ padding: '0.75rem', background: '#2563eb', color: 'white', border: 'none', borderRadius: '0.375rem', fontWeight: 'bold', cursor: 'pointer' }}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {msg && <div style={{ marginTop: '1rem', padding: '0.75rem', textAlign: 'center', background: msg.includes('✅') ? '#dcfce7' : '#fee2e2', color: msg.includes('✅') ? '#166534' : '#991b1b', borderRadius: '0.375rem' }}>{msg}</div>}

        <div style={{ marginTop: '1rem', fontSize: '0.75rem', textAlign: 'center', color: '#666' }}>
          <p>Test User: test123</p>
          <p>Test Pass: test123</p>
        </div>
      </div>
    </div>
  );
}

export default App;