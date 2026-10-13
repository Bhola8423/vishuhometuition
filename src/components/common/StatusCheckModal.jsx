import React, { useState } from 'react';
import { X, Search, CheckCircle, AlertCircle, Clock, FileText } from 'lucide-react';
import { API_BASE } from '../../config/api';

export default function StatusCheckModal({ isOpen, onClose }) {
  const [regId, setRegId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleCheck = async (e) => {
    e.preventDefault();
    const cleanId = regId.trim().toUpperCase();
    if (!cleanId) {
      setError('Please enter your Registration ID');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch(`${API_BASE}/api/status?id=${encodeURIComponent(cleanId)}`, {
        headers: { 'accept': 'application/json' }
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || 'Registration ID not found.');
      }
      setResult(data);
    } catch (err) {
      setError(err.message || 'Unable to fetch status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status = 'PENDING') => {
    switch (status) {
      case 'APPROVED':
        return <span style={{ background: '#D1FAE5', color: '#065F46', padding: '4px 12px', borderRadius: '999px', fontWeight: 800, fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: 4 }}><CheckCircle size={14} /> Approved</span>;
      case 'REJECTED':
        return <span style={{ background: '#FEE2E2', color: '#991B1B', padding: '4px 12px', borderRadius: '999px', fontWeight: 800, fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: 4 }}><AlertCircle size={14} /> Rejected</span>;
      case 'CORRECTION_REQUIRED':
        return <span style={{ background: '#FEF3C7', color: '#92400E', padding: '4px 12px', borderRadius: '999px', fontWeight: 800, fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: 4 }}><AlertCircle size={14} /> Correction Needed</span>;
      default:
        return <span style={{ background: '#E0F2FE', color: '#075985', padding: '4px 12px', borderRadius: '999px', fontWeight: 800, fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: 4 }}><Clock size={14} /> Pending Review</span>;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <style>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(6, 30, 73, 0.72);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          z-index: 99999;
          animation: modalFadeIn 0.2s ease-out;
        }
        @keyframes modalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .modal-content {
          background: #ffffff;
          border-radius: 22px;
          max-width: 540px;
          width: 100%;
          padding: 28px;
          position: relative;
          box-shadow: 0 25px 60px rgba(6, 30, 73, 0.28);
          border: 1px solid #dce6f2;
          max-height: 90vh;
          overflow-y: auto;
        }
        .modal-close {
          position: absolute;
          top: 18px;
          right: 18px;
          background: #f1f5fa;
          border: 1px solid #dce6f2;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #556987;
          transition: all 0.15s ease;
        }
        .modal-close:hover {
          background: #e2eaf4;
          color: #061e49;
        }
        .modal-content .form-control {
          flex: 1;
          min-height: 46px;
          padding: 10px 14px;
          border: 1px solid #cfdbe8;
          border-radius: 12px;
          font-size: 14px;
          outline: none;
        }
        .modal-content .form-control:focus {
          border-color: #1765e8;
          box-shadow: 0 0 0 3px rgba(23, 101, 232, 0.12);
        }
        .modal-content .btn-submit {
          min-height: 46px;
          padding: 10px 18px;
          border-radius: 12px;
          border: none;
          background: linear-gradient(135deg, #061e49, #0a428f);
          color: #fff;
          font-weight: 850;
          cursor: pointer;
          transition: transform 0.15s ease;
        }
        .modal-content .btn-submit:hover {
          transform: translateY(-1px);
        }
      `}</style>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        <h3 style={{ fontSize: '1.4rem', color: '#061E49', marginBottom: '6px', fontWeight: 900 }}>
          Check Registration Status
        </h3>
        <p style={{ color: '#6B778D', fontSize: '0.9rem', marginBottom: '20px' }}>
          Enter your Registration ID (e.g. VHT-STU-1001 or VHT-TUT-2002) below to view approval & verification status.
        </p>

        <form onSubmit={handleCheck} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <input 
            type="text" 
            className="form-control"
            placeholder="e.g. VHT-STU-1001"
            value={regId}
            onChange={(e) => setRegId(e.target.value)}
            style={{ textTransform: 'uppercase' }}
          />
          <button type="submit" className="btn-submit" disabled={loading} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Search size={18} />
            {loading ? 'Checking...' : 'Check'}
          </button>
        </form>

        {error && (
          <div style={{ background: '#FFF5F5', color: '#C53030', padding: '12px 16px', borderRadius: '12px', border: '1px solid #FEB2B2', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        {result && (
          <div style={{ background: '#F8FAFE', border: '1px solid #E4EAF3', borderRadius: '16px', padding: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span style={{ fontSize: '0.85rem', color: '#6B778D' }}>Status Result:</span>
              {getStatusBadge(result.status)}
            </div>
            
            <div style={{ display: 'grid', gap: '8px', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6B778D' }}>Registration ID:</span>
                <strong>{result.id}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6B778D' }}>Type:</span>
                <strong>{(result.type || 'Registration').toUpperCase()}</strong>
              </div>
              {result.name && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6B778D' }}>Name:</span>
                  <strong>{result.name}</strong>
                </div>
              )}
              {result.updatedAt && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6B778D' }}>Last Updated:</span>
                  <span>{new Date(result.updatedAt).toLocaleDateString()}</span>
                </div>
              )}
            </div>

            {result.note && (
              <div style={{ marginTop: '14px', background: '#FFFBEB', color: '#B45309', padding: '10px 14px', borderRadius: '10px', fontSize: '0.86rem', border: '1px solid #FCD34D' }}>
                <strong>Note from Admin:</strong> {result.note}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
