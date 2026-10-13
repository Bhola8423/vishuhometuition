import React from 'react';
import { ShieldCheck, Search, FileText, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function VerificationBarSection({ onOpenStatusModal }) {
  return (
    <section className="verification-section">
      <div className="container">
        <div className="verification-shell">
          <div className="verification-head">
            <div>
              <span>IDENTITY &amp; REGISTRATION STATUS</span>
              <h3 style={{ color: '#fff', fontSize: '1.2rem', marginTop: 2, fontWeight: 900 }}>
                Public Registration Verification System
              </h3>
            </div>
            <strong>VISHU HOME TUITION<br />GORAKHPUR</strong>
          </div>

          <div className="verification-grid">
            <div className="verify-item" onClick={onOpenStatusModal} style={{ cursor: 'pointer' }}>
              <div className="verify-icon">✓</div>
              <div>
                <b>Check Registration Status</b>
                <small>Lookup student/tutor ID approval status</small>
              </div>
            </div>

            <Link to="/verify" className="verify-item">
              <div className="verify-icon">🔍</div>
              <div>
                <b>Public ID Verification</b>
                <small>Verify official registration cards</small>
              </div>
            </Link>

            <Link to="/student-registration" className="verify-item">
              <div className="verify-icon">📄</div>
              <div>
                <b>Student Registration</b>
                <small>Submit new home tutor requirement</small>
              </div>
            </Link>

            <Link to="/tutor-registration" className="verify-item">
              <div className="verify-icon">🎓</div>
              <div>
                <b>Teacher Registration</b>
                <small>Join our verified tutor network</small>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
