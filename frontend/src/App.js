import React, { useState, useEffect } from 'react';
import './App.css';

import Login from './Login';
import Dashboard from './Dashboard';
import AdminDashboard from './AdminDashboard';
import Verify from './Verify';

export default function App() {
  const [currentPage, setCurrentPage] = useState('login');

  useEffect(() => {
    const path = window.location.pathname;

    if (path.startsWith('/verify/')) {
      setCurrentPage('verify');
    } else if (path === '/admin') {
      setCurrentPage('admin');
    } else if (path === '/dashboard') {
      setCurrentPage('dashboard');
    } else {
      setCurrentPage('login');
    }
  }, []);

  const handleLoginSuccess = (role) => {
    if (role === 'admin') {
      window.location.href = '/admin';
    } else {
      window.location.href = '/dashboard';
    }
  };

  return (
    <div>
      {currentPage === 'login' && (
        <Login onSuccess={handleLoginSuccess} />
      )}

      {currentPage === 'dashboard' && (
        <Dashboard />
      )}

      {currentPage === 'admin' && (
        <AdminDashboard />
      )}

      {currentPage === 'verify' && (
        <Verify />
      )}
    </div>
  );
}