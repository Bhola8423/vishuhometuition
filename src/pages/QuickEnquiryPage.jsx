import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE } from '../config/api';

export default function QuickEnquiryPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    studentClass: '',
    subject: '',
    board: '',
    area: '',
    time: '',
    details: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const val = (field) => (formData[field] ? formData[field].trim() : 'Not specified');

    const message = `Hello VISHU HOME TUITION,

I need a home tutor in Gorakhpur.

Name: ${val('name')}
Mobile: ${val('phone')}
Class: ${val('studentClass')}
Board: ${val('board')}
Subject: ${val('subject')}
Area / Location: ${val('area')}
Preferred Time: ${val('time')}
Additional Details: ${val('details')}`;

    const encoded = encodeURIComponent(message);
    const waUrl = `https://wa.me/917052500258?text=${encoded}`;

    // Submit to live API asynchronously if available
    fetch(`${API_BASE}/api/lead`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    }).catch(() => { });

    // Open WhatsApp URL directly
    window.open(waUrl, '_blank');
  };

  return (
    <div style={{ background: 'linear-gradient(180deg, #F8FAFE, #F3F7FD)', minHeight: '100vh' }}>
      {/* Header Bar */}
      {/* <header className="vht-header2026" id="vhtHeader" style={{ position: 'sticky', top: 0, zIndex: 1000 }}>
        <div className="vht-header-shell flex justify-between">
          <Link to="/" className="vht-header-brand vht-exact-brand" aria-label="VISHU HOME TUITION Gorakhpur - Home">
            <img
              alt="VISHU HOME TUITION Gorakhpur"
              className="vht-exact-logo"
              src="/assets/vht-5d5f2f20daa3bbd4.png"
              height="58"
              style={{ objectFit: 'contain' }}
            />
          </Link>
          <Link to="/" className="vht-header-cta">
            ← Back to Home
          </Link>
        </div>
      </header> */}

      {/* Main Page Content */}
      <main style={{ padding: '54px 0 82px' }}>
        <div className="container">
          <div className="section-head reveal show">
            <span className="mini">QUICK ENQUIRY</span>
            <h1 style={{ color: 'var(--navy)', fontSize: 'clamp(2.2rem, 5vw, 3.4rem)', fontWeight: 950, margin: '14px 0 8px', letterSpacing: '-0.035em' }}>
              NEED A HOME TUTOR?
            </h1>
            <p style={{ color: 'var(--muted)', fontSize: '0.92rem' }}>
              Fill your Requirement and Continue on WhatsApp.
            </p>
          </div>

          <div className="enquiry-box reveal show" style={{ maxWidth: '860px', margin: '0 auto' }}>
            <form className="form-grid" onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                className="span-2"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <input
                type="tel"
                name="phone"
                className="span-2"
                placeholder="Mobile Number"
                value={formData.phone}
                onChange={handleChange}
                required
              />

              <select
                name="studentClass"
                className="span-2"
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

              <input
                type="text"
                name="subject"
                className="span-2"
                placeholder="Subject"
                value={formData.subject}
                onChange={handleChange}
                required
              />

              <select
                name="board"
                className="span-2"
                value={formData.board}
                onChange={handleChange}
                required
              >
                <option value="">Select Board</option>
                <option value="CBSE">CBSE</option>
                <option value="ICSE">ICSE</option>
                <option value="UP Board">UP Board</option>
                <option value="State Board">State Board</option>
                <option value="Other">Other</option>
              </select>

              <input
                type="text"
                name="area"
                className="span-2"
                placeholder="Area / Location"
                value={formData.area}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="time"
                className="span-2"
                placeholder="Preferred Time"
                value={formData.time}
                onChange={handleChange}
              />

              <textarea
                name="details"
                className="span-2"
                style={{ gridColumn: '1 / -1' }}
                placeholder="Additional Details (Optional)"
                value={formData.details}
                onChange={handleChange}
                rows={4}
              />

              <button
                type="submit"
                className="submit-btn"
                style={{ gridColumn: '1 / -1', minHeight: '50px', fontSize: '1.05rem' }}
              >
                Send Enquiry via WhatsApp
              </button>

              <p className="form-note">
                Your details are prepared in WhatsApp automatically. Review once and tap Send.
              </p>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}


