import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import Log from '@/app/models/Log';
import { connectToDatabase } from '@/app/lib/db';

export default async function AdminPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get('session');
  const userSession = session ? JSON.parse(session.value) : null;

  if (!userSession || userSession.role !== 'admin') {
    return redirect('/login');
  }

  await connectToDatabase();
  const logs = await Log.find({}).sort({ createdAt: -1 }).lean();

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>
          <span style={styles.icon}>📜</span> Audit Log Viewer (Admin)
        </h2>
        <form action="/login" method="POST">
          <button type="submit" style={styles.logoutButton}>Logout</button>
        </form>
      </div>

      {logs.length === 0 ? (
        <p style={styles.noLogs}>No logs found.</p>
      ) : (
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
      )}
    </div>
  );
}

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
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    gap: '1rem',
    width: '100%',
    textAlign: 'center',
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: '700',
    color: '#1a202c',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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
};