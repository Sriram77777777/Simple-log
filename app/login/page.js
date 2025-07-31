'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation'; 



export default function LoginPage() {
    const router = useRouter(); 
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setError('');

  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', 
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (res.ok) {
      if (data.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }

    } else {
      setError(data.message || 'Invalid credentials. Try again.');
    }
  } catch (err) {
    console.error('Login error:', err);
    setError('Something went wrong. Please try again.');
  } finally {
    setIsLoading(false);
  }
};


  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="main-layout">
      <nav className="navbar">
        <div className="container">
          <div className="navbar-content">
            <Link href="/" className="navbar-brand">
              Simple Audit Log Viewer
            </Link>
            <div className="navbar-nav">
              <Link href="/signup" className="button button-secondary">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container">
        <main className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 80px)' }}>
          <div className="card" style={{ maxWidth: '400px', width: '100%' }}>
            <div className="card-header">
              <h1 className="card-title text-center">Welcome Back</h1>
              <p className="card-description text-center">
                Sign in to access your notes and dashboard
              </p>
            </div>

            {error && (
              <div className="mb-3" style={{ 
                padding: '0.75rem', 
                backgroundColor: '#fee', 
                border: '1px solid var(--error)', 
                borderRadius: 'var(--radius)', 
                color: 'var(--error)' 
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="username" className="form-label">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  className="form-input"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  placeholder="Enter your username"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="form-input"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                />
              </div>

              <button
                type="submit"
                className="button button-primary"
                style={{ width: '100%' }}
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Login'}
              </button>
            </form>

            <div className="mt-4 text-center">
             <p className="text-muted">
                  Don&apos;t have an account?{' '}
                  <Link href="/signup" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>
                    Sign up here
                  </Link>
              </p>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
