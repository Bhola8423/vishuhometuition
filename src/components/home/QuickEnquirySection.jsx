import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { API_BASE } from '../../config/api';

export default function QuickEnquirySection() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    studentClass: '',
    subject: '',
    locality: '',
    note: ''
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', msg: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!/^[6-9]\d{9}$/.test(formData.phone.trim())) {
      setStatus({ type: 'error', msg: 'Please enter a valid 10-digit mobile number.' });
      return;
    }

    setLoading(true);
    setStatus({ type: '', msg: '' });

    try {
      const res = await fetch(`${API_BASE}/api/lead`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json().catch(() => ({}));
      
      if (res.ok && data.ok) {
        setStatus({ 
          type: 'success', 
          msg: `Enquiry submitted successfully! Your Lead ID is ${data.id || 'CONFIRMED'}. Our team will contact you shortly.` 
        });
        setFormData({ name: '', phone: '', studentClass: '', subject: '', locality: '', note: '' });
      } else {
        throw new Error(data.error || 'Failed to submit lead request.');
      }
    } catch (err) {
      setStatus({ type: 'error', msg: err.message || 'Error sending lead request. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section" id="quick-enquiry">
      <div className="container">
        <div className="section-head">
          <span className="mini-badge">Instant Matching</span>
          <h2>Quick Tutor Request</h2>
          <p>Tell us your tuition requirement and get matched with suitable Gorakhpur tutors within 24 hours.</p>
        </div>

        <div className="quick-enquiry-card" style={{ maxWidth: 840, margin: 'auto' }}>
          {status.msg && (
            <div 
              style={{ 
                padding: '14px 18px', 
                borderRadius: '12px', 
                marginBottom: '20px', 
                fontSize: '0.92rem',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                background: status.type === 'success' ? '#E6F4EA' : '#FCE8E6',
                color: status.type === 'success' ? '#137333' : '#C5221F',
                border: `1px solid ${status.type === 'success' ? '#CEEAD6' : '#FAD2CF'}`
              }}
            >
              {status.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
              <span>{status.msg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="form-grid">
            <div className="form-group">
              <label style={{ fontSize: '0.86rem', fontWeight: 800, color: '#061E49' }}>Your Name *</label>
              <input 
                type="text" 
                name="name" 
                className="form-control" 
                placeholder="Parent / Student Name"
                value={formData.name}
                onChange={handleChange}
                required 
              />
            </div>

            <div className="form-group">
              <label style={{ fontSize: '0.86rem', fontWeight: 800, color: '#061E49' }}>Mobile Number *</label>
              <input 
                type="tel" 
                name="phone" 
                className="form-control" 
                placeholder="10-digit Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required 
              />
            </div>

            <div className="form-group">
              <label style={{ fontSize: '0.86rem', fontWeight: 800, color: '#061E49' }}>Class / Grade *</label>
              <select 
                name="studentClass" 
                className="form-control" 
                value={formData.studentClass}
                onChange={handleChange}
                required
              >
                <option value="">Select Class</option>
                <option value="Nursery - UKG">Nursery - UKG</option>
                <option value="Class 1st - 5th">Class 1st - 5th</option>
                <option value="Class 6th - 8th">Class 6th - 8th</option>
                <option value="Class 9th - 10th">Class 9th - 10th</option>
                <option value="Class 11th - 12th">Class 11th - 12th</option>
                <option value="Competitive Exams / Other">Competitive Exams / Other</option>
              </select>
            </div>

            <div className="form-group">
              <label style={{ fontSize: '0.86rem', fontWeight: 800, color: '#061E49' }}>Subject(s) Needed *</label>
              <input 
                type="text" 
                name="subject" 
                className="form-control" 
                placeholder="e.g. Maths, Science, English, All Subjects"
                value={formData.subject}
                onChange={handleChange}
                required 
              />
            </div>

            <div className="form-group wide">
              <label style={{ fontSize: '0.86rem', fontWeight: 800, color: '#061E49' }}>Locality / Area in Gorakhpur *</label>
              <input 
                type="text" 
                name="locality" 
                className="form-control" 
                placeholder="e.g. Taramandal, Mohaddipur, Golghar, Betiahata, Rapti Nagar"
                value={formData.locality}
                onChange={handleChange}
                required 
              />
            </div>

            <div className="form-group wide">
              <label style={{ fontSize: '0.86rem', fontWeight: 800, color: '#061E49' }}>Additional Details / Preferences (Optional)</label>
              <textarea 
                name="note" 
                className="form-control" 
                placeholder="Preference for Male/Female tutor, timing preference, board (CBSE/ICSE/UP Board)..."
                value={formData.note}
                onChange={handleChange}
              />
            </div>

            <div className="form-group wide" style={{ marginTop: '10px' }}>
              <button type="submit" className="btn-submit" disabled={loading} style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
                <Send size={18} />
                {loading ? 'Submitting Enquiry...' : 'Submit Tutor Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
