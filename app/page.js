import Link from 'next/link';

export default function Home() {
  return (
    <div className="main-layout">
      <div className="container">
        <main className="flex flex-column items-center justify-center" style={{ minHeight: '100vh', textAlign: 'center' }}>
          <div className="card" style={{ maxWidth: '500px', width: '100%' }}>
            <div className="card-header">
              <h1 className="page-title">Simple Audit Log Viewer</h1>
              <p className="page-subtitle">
                Manage your notes and track user activities with our clean, professional interface
              </p>
            </div>
            
            <div className="flex flex-column gap-3">
              <Link href="/login" className="button button-primary button-large">
                Login
              </Link>
              <Link href="/signup" className="button button-secondary button-large">
                Sign Up
              </Link>
            </div>
            
            <div className="mt-4 text-muted" style={{ fontSize: '0.875rem' }}>
              <p>New here? Create an account to start managing your notes.</p>
              <p>Administrators can access audit logs and user management.</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
