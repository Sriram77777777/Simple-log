'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function AdminLogsPage() {
  const [user, setUser] = useState({ username: 'admin', isAdmin: true }); // Placeholder admin user
  const [logs, setLogs] = useState([
    // Sample audit logs for demonstration
    {
      id: 1,
      username: 'john_doe',
      action: 'SIGNUP',
      timestamp: '2024-01-15 10:30:25',
      details: 'User account created'
    },
    {
      id: 2,
      username: 'jane_smith',
      action: 'LOGIN',
      timestamp: '2024-01-15 09:15:10',
      details: 'Successful login'
    },
    {
      id: 3,
      username: 'john_doe',
      action: 'LOGIN',
      timestamp: '2024-01-15 08:45:33',
      details: 'Successful login'
    },
    {
      id: 4,
      username: 'jane_smith',
      action: 'LOGOUT',
      timestamp: '2024-01-14 17:22:45',
      details: 'User logged out'
    },
    {
      id: 5,
      username: 'mike_wilson',
      action: 'SIGNUP',
      timestamp: '2024-01-14 14:18:22',
      details: 'User account created'
    },
    {
      id: 6,
      username: 'admin',
      action: 'LOGIN',
      timestamp: '2024-01-14 08:00:15',
      details: 'Admin login'
    }
  ]);
  const [filteredLogs, setFilteredLogs] = useState(logs);
  const [filters, setFilters] = useState({
    username: '',
    action: 'ALL'
  });

  useEffect(() => {
    let filtered = logs;

    if (filters.username) {
      filtered = filtered.filter(log => 
        log.username.toLowerCase().includes(filters.username.toLowerCase())
      );
    }

    if (filters.action !== 'ALL') {
      filtered = filtered.filter(log => log.action === filters.action);
    }

    setFilteredLogs(filtered);
  }, [filters, logs]);

  const handleLogout = () => {
    // TODO: Implement logout logic
    console.log('Logging out...');
  };

  // Check if user is admin (in real app, this would be checked via authentication)
  if (!user.isAdmin) {
    return (
      <div className="main-layout">
        <nav className="navbar">
          <div className="container">
            <div className="navbar-content">
              <Link href="/" className="navbar-brand">
                Simple Audit Log Viewer
              </Link>
              <div className="navbar-nav">
                <button onClick={handleLogout} className="button button-secondary button-small">
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>

        <div className="container">
          <main className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 80px)' }}>
            <div className="card text-center" style={{ maxWidth: '500px' }}>
              <div className="card-header">
                <h1 className="card-title" style={{ color: 'var(--error)' }}>Access Denied</h1>
                <p className="card-description">
                  You do not have permission to access this page. Only administrators can view audit logs.
                </p>
              </div>
              <Link href="/dashboard" className="button button-primary">
                Go to Dashboard
              </Link>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="main-layout">
      <nav className="navbar">
        <div className="container">
          <div className="navbar-content">
            <Link href="/" className="navbar-brand">
              Simple Audit Log Viewer
            </Link>
            <div className="navbar-nav">
              <Link href="/dashboard" className="button button-secondary button-small">
                Dashboard
              </Link>
              <span className="text-muted">Welcome, Admin</span>
              <button onClick={handleLogout} className="button button-secondary button-small">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container">
        <main style={{ padding: '2rem 0' }}>
          <div className="mb-4">
            <h1 className="page-title">Audit Logs</h1>
            <p className="page-subtitle">Monitor user activities and system events</p>
          </div>

          {/* Filters */}
          <div className="card mb-4">
            <div className="card-header">
              <h3 className="card-title">Filters</h3>
            </div>
            <div className="flex gap-3">
              <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
                <label className="form-label">Search by Username</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter username..."
                  value={filters.username}
                  onChange={(e) => setFilters(prev => ({ ...prev, username: e.target.value }))}
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0, minWidth: '200px' }}>
                <label className="form-label">Filter by Action</label>
                <select
                  className="form-input"
                  value={filters.action}
                  onChange={(e) => setFilters(prev => ({ ...prev, action: e.target.value }))}
                >
                  <option value="ALL">All Actions</option>
                  <option value="SIGNUP">Sign Up</option>
                  <option value="LOGIN">Login</option>
                  <option value="LOGOUT">Logout</option>
                </select>
              </div>
            </div>
          </div>

          {/* Logs Table */}
          <div className="card">
            <div className="card-header">
              <div className="flex justify-between items-center">
                <h3 className="card-title">Audit Log Entries</h3>
                <span className="text-muted">
                  Showing {filteredLogs.length} of {logs.length} entries
                </span>
              </div>
            </div>

            <div className="table-container">
              {filteredLogs.length === 0 ? (
                <div className="text-center text-muted" style={{ padding: '2rem' }}>
                  <p>No audit logs found matching the current filters.</p>
                </div>
              ) : (
                <table className="table">
                  <thead>
                    <tr>
                      <th>Username</th>
                      <th>Action</th>
                      <th>Timestamp</th>
                      <th>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLogs.map(log => (
                      <tr key={log.id}>
                        <td>
                          <strong>{log.username}</strong>
                        </td>
                        <td>
                          <span 
                            className="button button-small"
                            style={{
                              backgroundColor: 
                                log.action === 'SIGNUP' ? 'var(--success)' :
                                log.action === 'LOGIN' ? 'var(--primary)' :
                                log.action === 'LOGOUT' ? 'var(--warning)' : 'var(--secondary)',
                              color: 'white',
                              fontSize: '0.75rem',
                              padding: '0.25rem 0.5rem',
                              cursor: 'default'
                            }}
                          >
                            {log.action}
                          </span>
                        </td>
                        <td className="text-muted">
                          {log.timestamp}
                        </td>
                        <td className="text-muted">
                          {log.details}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Summary Statistics */}
          <div className="mt-4">
            <div className="flex gap-3">
              <div className="card flex-1">
                <div className="text-center">
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--success)' }}>
                    {logs.filter(log => log.action === 'SIGNUP').length}
                  </div>
                  <div className="text-muted">Total Sign Ups</div>
                </div>
              </div>
              <div className="card flex-1">
                <div className="text-center">
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                    {logs.filter(log => log.action === 'LOGIN').length}
                  </div>
                  <div className="text-muted">Total Logins</div>
                </div>
              </div>
              <div className="card flex-1">
                <div className="text-center">
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--warning)' }}>
                    {logs.filter(log => log.action === 'LOGOUT').length}
                  </div>
                  <div className="text-muted">Total Logouts</div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
