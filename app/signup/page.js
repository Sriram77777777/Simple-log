'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    email: '',
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
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Signup failed');
      }

      window.location.href = '/login';
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
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
              <Link href="/login" className="button button-secondary">
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container">
        <main className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 80px)' }}>
          <div className="card" style={{ maxWidth: 400, width: '100%' }}>
            <div className="card-header">
              <h1 className="card-title text-center">Create Account</h1>
              <p className="card-description text-center">Sign up to start managing your notes</p>
            </div>

            {error && (
              <div
                className="mb-3"
                style={{
                  padding: '0.75rem',
                  backgroundColor: '#fee',
                  border: '1px solid var(--error)',
                  borderRadius: 'var(--radius)',
                  color: 'var(--error)',
                }}
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-input"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                />
              </div>

              <div className="form-group">
                <label htmlFor="username" className="form-label">
                  Username (optional)
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  className="form-input"
                  value={formData.username}
                  onChange={handleChange}
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
                {isLoading ? 'Creating Account...' : 'Sign Up'}
              </button>
            </form>

            <div className="mt-4 text-center">
              <p className="text-muted">
                Already have an account?{' '}
                <Link href="/login" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>
                  Login here
                </Link>
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
