'use client';

import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function AdminPageClientWrapper() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') {
      setLoading(true);
    } else if (status === 'unauthenticated' || session?.user.role !== 'admin') {
      router.push('/login');
    } else {
      setLoading(false);
    }
  }, [status, session, router]);

  if (loading) {
    return <p style={{ padding: '2rem', textAlign: 'center' }}>Loading...</p>;
  }

  return <AdminPageProtected />;
}

function AdminPageProtected() {
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const logsPerPage = 10;

  async function fetchLogs(currentPage) {
    try {
      const res = await fetch(`/api/admin/logs?page=${currentPage}&limit=${logsPerPage}`);
      if (!res.ok) {
        throw new Error('Failed to fetch logs');
      }
      const data = await res.json();

      setLogs(data.logs || []);
      setTotalPages(data.totalPages || 1);
      setError(null);
    } catch (err) {
      setError(err.message || 'An error occurred');
    }
  }

  useEffect(() => {
    fetchLogs(page);
  }, [page]);

  async function handleLogout() {
    try {
      await fetch('/api/logoutLog', { method: 'POST' }); // Call logout log API
    } catch (error) {
      console.error('Failed to log logout event:', error);
    }
    signOut({ callbackUrl: '/login' }); // Then sign out
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h2 style={styles.title}>
          <span style={styles.icon}>📜</span> Audit Log Viewer (Admin)
        </h2>
        <button onClick={handleLogout} style={styles.logoutButton}>
          Logout
        </button>
      </header>

      {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '1rem' }}>{error}</p>}

      {logs.length === 0 ? (
        <p style={styles.noLogs}>No logs found.</p>
      ) : (
        <>
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th style={styles.th}>Action</th>
                  <th style={styles.th}>User</th>
                  <th style={styles.th}>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log._id} style={styles.tableRow}>
                    <td style={styles.td}>{log.action}</td>
                    <td style={styles.td}>{log.username}</td>
                    <td style={styles.td}>{new Date(log.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(p) => setPage(p)}
          />
        </>
      )}
    </div>
  );
}

function Pagination({ currentPage, totalPages, onPageChange }) {
  const pages = [];

  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  if (totalPages <= 1) return null;

  return (
    <div style={styles.pagination}>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          disabled={p === currentPage}
          style={{
            ...styles.pageButton,
            ...(p === currentPage ? styles.pageButtonActive : {}),
          }}
        >
          {p}
        </button>
      ))}
    </div>
  );
}

// Styles object as you had it:

const styles = {
  container: {
    padding: '2rem 1rem',
    fontFamily: '"Inter", Arial, sans-serif',
    backgroundColor: '#f4f6f9',
    minHeight: '100vh',
    maxWidth: '1400px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    width: '100%',
    maxWidth: '1400px',
    gap: '1rem',
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: '700',
    color: '#1a202c',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  icon: {
    fontSize: '1.5rem',
  },
  logoutButton: {
    padding: '0.5rem 1.5rem',
    backgroundColor: '#e53e3e',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '500',
    transition: 'background-color 0.2s ease',
  },
  noLogs: {
    fontStyle: 'italic',
    color: '#6b7280',
    textAlign: 'center',
    padding: '2rem',
    fontSize: '1.1rem',
  },
  tableWrapper: {
    overflowX: 'auto',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    width: '100%',
    maxWidth: '1000px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#ffffff',
    textAlign: 'center',
  },
  tableHeader: {
    backgroundColor: '#2b6cb0',
    color: '#ffffff',
  },
  th: {
    padding: '1rem',
    fontWeight: '600',
    fontSize: '0.95rem',
    borderBottom: '2px solid #e2e8f0',
    textAlign: 'center',
  },
  tableRow: {
    transition: 'background-color 0.2s ease',
  },
  td: {
    padding: '1rem',
    borderBottom: '1px solid #e2e8f0',
    fontSize: '0.9rem',
    color: '#2d3748',
    textAlign: 'center',
  },
  pagination: {
    marginTop: '1.5rem',
    display: 'flex',
    gap: '0.5rem',
    justifyContent: 'center',
  },
  pageButton: {
    padding: '0.5rem 0.75rem',
    border: '1px solid #ccc',
    backgroundColor: '#fff',
    cursor: 'pointer',
    borderRadius: '4px',
    fontWeight: '500',
  },
  pageButtonActive: {
    backgroundColor: '#2b6cb0',
    color: '#fff',
    cursor: 'default',
  },
};
