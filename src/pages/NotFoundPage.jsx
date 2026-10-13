import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <main style={{ padding: '90px 0', textAlign: 'center', background: '#F8FAFE', minHeight: '65vh', display: 'grid', placeItems: 'center' }}>
      <div className="container">
        <div style={{ maxWidth: 500, margin: 'auto' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#FEE2E2', color: '#DC2626', display: 'grid', placeItems: 'center', margin: '0 auto 20px' }}>
            <AlertTriangle size={36} />
          </div>
          <h1 style={{ fontSize: '3rem', color: '#061E49', fontWeight: 950, marginBottom: 8 }}>404</h1>
          <h2 style={{ fontSize: '1.4rem', color: '#14233D', marginBottom: 12 }}>Page Not Found</h2>
          <p style={{ color: '#6B778D', marginBottom: 24 }}>
            The page you are looking for does not exist or has been moved.
          </p>

          <Link to="/" className="btn-submit" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <Home size={18} />
            Back to Homepage
          </Link>
        </div>
      </div>
    </main>
  );
}
