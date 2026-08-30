import React, { useState } from 'react';
import Dashboard from './Dashboard';
import AdminDashboard from './AdminDashboard';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ u: user, p: pass })
      });
      
      if (response.ok) {
        // Check if admin login
        if (user === 'admin' && pass === 'admin123') {
          setMsg('✅ Admin Login Successful');
          setUserRole('admin');
          setTimeout(() => { setLoggedIn(true); setIsAdmin(true); }, 800);
        } else {
          setMsg('✅ Student Login Successful');
          setUserRole('student');
          setTimeout(() => { setLoggedIn(true); setIsAdmin(false); }, 800);
        }
      } else {
        setMsg('❌ Invalid Credentials');
      }
    } catch (error) {
      setMsg('❌ Error: ' + error.message);
    }
    setLoading(false);
  };

  if (loggedIn && isAdmin) {
    return <AdminDashboard />;
  }

  if (loggedIn && !isAdmin) {
    return <Dashboard />;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <h1 style={{ margin: '0', fontSize: '2.5rem', color: '#111827', fontWeight: '700', letterSpacing: '-0.05em' }}>KES SHROFF</h1>
          <p style={{ margin: '0.5rem 0 0 0', fontSize: '1rem', color: '#6b7280', fontWeight: '500' }}>Document Portal</p>
          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#9ca3af' }}>Zero-Trust Credential System</p>
        </div>

        {/* Login Card */}
        <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '2rem' }}>
          <h2 style={{ margin: '0 0 2rem 0', fontSize: '1.5rem', color: '#1f2937', fontWeight: '600', textAlign: 'center' }}>Login</h2>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>Username/Enrollment</label>
              <input
                type="text"
                placeholder="test123 or admin"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', fontSize: '1rem', outline: 'none', boxSizing: 'border-box' }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>Password</label>
              <input
                type="password"
                placeholder="test123 or admin123"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', fontSize: '1rem', outline: 'none', boxSizing: 'border-box' }}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', padding: '0.75rem', background: '#1f2937', color: '#ffffff', border: 'none', borderRadius: '0.375rem', fontWeight: '600', fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? '0.7' : '1' }}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          {msg && (
            <div style={{ marginTop: '1rem', padding: '0.75rem', background: msg.includes('✅') ? '#f0fdf4' : '#fef2f2', color: msg.includes('✅') ? '#16a34a' : '#dc2626', borderRadius: '0.375rem', textAlign: 'center', fontSize: '0.875rem', fontWeight: '500' }}>
              {msg}
            </div>
          )}

          <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e5e7eb', fontSize: '0.75rem', color: '#6b7280', textAlign: 'center' }}>
            <p style={{ margin: '0' }}>Student: test123 / test123</p>
            <p style={{ margin: '0.25rem 0 0 0' }}>Admin: admin / admin123</p>
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.75rem', color: '#9ca3af' }}>
          <p>© 2026 KES SHROFF COLLEGE | Secure Platform</p>
        </div>
      </div>
    </div>
  );
}

export default App;