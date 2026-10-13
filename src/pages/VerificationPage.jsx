import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, CheckCircle, AlertCircle, Clock, ShieldCheck } from 'lucide-react';
import { API_BASE } from '../config/api';

export default function VerificationPage() {
  const [searchParams] = useSearchParams();
  const initialId = searchParams.get('verify') || searchParams.get('id') || '';

  const [regId, setRegId] = useState(initialId.toUpperCase());
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  const handleVerify = async (idToVerify) => {
    const cleanId = (idToVerify || regId).trim().toUpperCase();
    if (!cleanId) {
      setError('Please enter a valid Registration ID');
      return;
    }

    setLoading(true);
    setError('');
    setData(null);

    try {
      const res = await fetch(`${API_BASE}/api/status?id=${encodeURIComponent(cleanId)}`, {
        headers: { 'accept': 'application/json' }
      });
      const result = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(result.error || 'Registration ID not found in database.');
      }
      setData(result);
    } catch (err) {
      setError(err.message || 'Unable to check status.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialId) {
      handleVerify(initialId);
    }
  }, [initialId]);

  return (
    <main style={{ padding: '60px 0 90px', background: '#F8FAFE' }}>
      <div className="container">
        <div className="quick-enquiry-card" style={{ maxWidth: 640, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ display: 'inline-grid', placeItems: 'center', width: 54, height: 54, borderRadius: '50%', background: '#EAF2FF', color: '#1765E8', marginBottom: 12 }}>
              <ShieldCheck size={28} />
            </div>
            <h1 style={{ fontSize: '1.8rem', color: '#061E49', fontWeight: 950 }}>
              Verify Registration Status
            </h1>
            <p style={{ color: '#6B778D', fontSize: '0.9rem' }}>
              Check live status for Student or Tutor registration cards issued by Vishu Home Tuition.
            </p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); handleVerify(); }} style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
            <input 
              type="text" 
              className="form-control"
              placeholder="e.g. VHT-STU-1001"
              value={regId}
              onChange={(e) => setRegId(e.target.value)}
              style={{ textTransform: 'uppercase', fontSize: '1rem' }}
            />
            <button type="submit" className="btn-submit" disabled={loading} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
              <Search size={18} />
              {loading ? 'Checking...' : 'Verify ID'}
            </button>
          </form>

          {error && (
            <div style={{ background: '#FFF5F5', color: '#C53030', padding: '14px', borderRadius: '12px', border: '1px solid #FEB2B2', fontSize: '0.9rem' }}>
              {error}
            </div>
          )}

          {data && (
            <div style={{ background: '#fff', border: '1px solid #E4EAF3', borderRadius: '18px', padding: '24px', boxShadow: '0 10px 30px rgba(6,30,73,0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid #E4EAF3', paddingBottom: '14px' }}>
                <span style={{ fontSize: '0.9rem', color: '#6B778D', fontWeight: 800 }}>Registration Card</span>
                <span 
                  style={{
                    padding: '6px 14px',
                    borderRadius: '999px',
                    fontWeight: 900,
                    fontSize: '0.82rem',
                    background: data.status === 'APPROVED' ? '#D1FAE5' : data.status === 'REJECTED' ? '#FEE2E2' : '#FEF3C7',
                    color: data.status === 'APPROVED' ? '#065F46' : data.status === 'REJECTED' ? '#991B1B' : '#92400E'
                  }}
                >
                  {data.status || 'PENDING'}
                </span>
              </div>

              <div style={{ display: 'grid', gap: '12px', fontSize: '0.92rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6B778D' }}>Registration ID:</span>
                  <strong style={{ color: '#061E49' }}>{data.id}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6B778D' }}>Registration Type:</span>
                  <strong>{(data.type || 'Standard').toUpperCase()}</strong>
                </div>

                {data.name && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#6B778D' }}>Applicant Name:</span>
                    <strong>{data.name}</strong>
                  </div>
                )}

                {data.createdAt && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#6B778D' }}>Registered On:</span>
                    <span>{new Date(data.createdAt).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              {data.note && (
                <div style={{ marginTop: '18px', background: '#FFFBEB', color: '#B45309', padding: '12px 16px', borderRadius: '12px', fontSize: '0.88rem', border: '1px solid #FCD34D' }}>
                  <strong>Admin Remarks:</strong> {data.note}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
