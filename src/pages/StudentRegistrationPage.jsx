import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE } from '../config/api';

export default function StudentRegistrationPage({ onOpenStatusModal }) {
  const [view, setView] = useState('form'); // 'form' | 'success' | 'verify'
  const [regType, setRegType] = useState('STANDARD');
  const [formData, setFormData] = useState({
    studentName: '',
    parentName: '',
    phone: '',
    email: '',
    className: '',
    board: '',
    subjects: '',
    area: '',
    tutorPref: 'Any',
    timing: '',
    budget: '',
    note: '',
    advanceAmount: '500'
  });

  const [studentPhoto, setStudentPhoto] = useState(null);
  const [paymentProof, setPaymentProof] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('PHOTO');
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  // Status verify state
  const [verifyId, setVerifyId] = useState('');
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyResult, setVerifyResult] = useState(null);
  const [verifyError, setVerifyError] = useState('');

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const vId = params.get('verify');
    if (vId) {
      setView('verify');
      setVerifyId(vId.toUpperCase());
      handleVerify(vId.toUpperCase());
    }
  }, []);

  const handleVerify = async (targetId) => {
    const id = (targetId || verifyId).trim().toUpperCase();
    if (!id) {
      showToast('Enter your Registration ID.');
      return;
    }
    setVerifyLoading(true);
    setVerifyError('');
    setVerifyResult(null);

    try {
      const res = await fetch(`${API_BASE}/api/status?id=${encodeURIComponent(id)}`, {
        headers: { 'accept': 'application/json' }
      }).catch(() => null);

      if (res && res.ok) {
        const data = await res.json().catch(() => ({}));
        setVerifyResult(data);
        return;
      }

      // Check local preview items
      const localItems = JSON.parse(localStorage.getItem('vht_final_demo_regs') || '[]');
      const match = localItems.find((x) => x.id === id);
      if (match) {
        setVerifyResult(match);
        return;
      }

      const errData = res ? await res.json().catch(() => ({})) : {};
      setVerifyError(errData.error || 'Registration ID not found.');
    } catch (err) {
      setVerifyError('Registration ID not found.');
    } finally {
      setVerifyLoading(false);
    }
  };

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setStudentPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const copyUPI = () => {
    const value = 'vishuhometuition@okicici';
    navigator.clipboard?.writeText(value).then(() => showToast('UPI ID copied')).catch(() => showToast('Copy vishuhometuition@okicici manually'));
  };

  const copyUPINumber = () => {
    const value = '7052500258';
    navigator.clipboard?.writeText(value).then(() => showToast('UPI number 7052500258 copied')).catch(() => showToast('Copy 7052500258 manually'));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!/^[6-9]\d{9}$/.test(formData.phone.trim())) {
      showToast('Enter a valid 10-digit Indian mobile number.');
      return;
    }

    if (regType === 'ADVANCE' && (!formData.advanceAmount || !paymentProof)) {
      showToast('Enter advance amount and upload payment screenshot.');
      return;
    }

    setLoading(true);

    try {
      const fd = new FormData();
      fd.append('type', 'student');
      fd.append('registrationType', regType);
      fd.append('studentName', formData.studentName);
      fd.append('parentName', formData.parentName);
      fd.append('phone', formData.phone);
      fd.append('email', formData.email);
      fd.append('studentClass', formData.className);
      fd.append('board', formData.board);
      fd.append('subjects', formData.subjects);
      fd.append('address', formData.area);
      fd.append('tutorGender', formData.tutorPref);
      fd.append('preferredTiming', formData.timing);
      fd.append('budget', formData.budget);
      fd.append('note', formData.note);

      if (studentPhoto) fd.append('photo', studentPhoto);
      if (regType === 'ADVANCE') {
        fd.append('advanceAmount', formData.advanceAmount);
        if (paymentProof) fd.append('paymentProof', paymentProof);
      }

      const res = await fetch(`${API_BASE}/api/register`, {
        method: 'POST',
        body: fd
      });

      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        if (res.status === 413) throw new Error('File sizes are too large to upload together.');
        throw new Error('Registration endpoint unavailable.');
      }

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok || !data.id) {
        throw new Error(data.error || 'Registration failed to save.');
      }

      setSuccessData(data);
      setView('success');
    } catch (err) {
      setErrorMsg(err.message || 'Error completing registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page">
      <div className="wrap">
        {toastMsg && <div className="toast show">{toastMsg}</div>}

        {/* VIEW: SUCCESS */}
        {view === 'success' && successData && (
          <div className="success-card" style={{ maxWidth: '680px', margin: 'auto' }}>
            <div className="success-icon">✓</div>
            <h2 style={{ margin: 0, color: 'var(--navy)' }}>Registration Submitted</h2>
            <p className="muted" style={{ margin: '8px 0 14px' }}>Keep this Registration ID for status checking.</p>
            <div className="registration-id">{successData.id}</div>
            <div className="notice ok" style={{ marginTop: '14px' }}>
              Registration saved successfully. Our team will contact you shortly.
            </div>
            <div className="actions" style={{ justifyContent: 'center', marginTop: '20px' }}>
              <button className="btn btn-light" onClick={() => { setView('form'); setSuccessData(null); }} type="button">New Registration</button>
              <button className="btn btn-primary" onClick={() => { setView('verify'); setVerifyId(successData.id); handleVerify(successData.id); }} type="button">Check Status</button>
            </div>
          </div>
        )}

        {/* VIEW: VERIFY */}
        {view === 'verify' && (
          <div className="verify-box">
            <div className="verify-head">
              <div>
                <h2>Check Registration Status</h2>
                <p>Enter the Student Registration ID.</p>
              </div>
              <button className="btn btn-light mini" onClick={() => setView('form')} type="button">
                Back
              </button>
            </div>

            <div className="verify-form">
              <input
                id="verifyId"
                placeholder="e.g. VHT-S8500"
                value={verifyId}
                onChange={(e) => setVerifyId(e.target.value.toUpperCase())}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleVerify();
                }}
                style={{ textTransform: 'uppercase' }}
              />
              <button className="btn btn-primary" disabled={verifyLoading} onClick={() => handleVerify()} type="button">
                {verifyLoading ? 'Checking...' : 'Check Status'}
              </button>
            </div>

            {verifyError && <div className="notice warn" style={{ marginTop: '14px' }}>{verifyError}</div>}

            {verifyResult && (
              <div className="verify-result" style={{ marginTop: '14px' }}>
                <div className="status-card" style={{ boxShadow: 'none', padding: '18px' }}>
                  <span className={`status-chip ${verifyResult.status === 'APPROVED' ? 'approved' : verifyResult.status === 'REJECTED' ? 'rejected' : 'pending'}`}>
                    {(verifyResult.status || 'PENDING').replaceAll('_', ' ')}
                  </span>
                  <div className="kv" style={{ marginTop: '14px' }}>
                    <span>Registration ID</span>
                    <b>{verifyResult.id}</b>
                  </div>
                  <div className="kv">
                    <span>Registration Type</span>
                    <b>{(verifyResult.type || 'student').toUpperCase()}</b>
                  </div>
                  {verifyResult.name && (
                    <div className="kv">
                      <span>Student Name</span>
                      <b>{verifyResult.name}</b>
                    </div>
                  )}
                  {verifyResult.phone && (
                    <div className="kv">
                      <span>Phone</span>
                      <b>{verifyResult.phone}</b>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW: FORM */}
        {view === 'form' && (
          <section className="form-shell">
            <div aria-label="Registration banner" className="registration-banner">
              <img alt="Student registration banner" src="/assets/optimized-inline/student-8515be770d5c7357.png" onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }} />
            </div>

            <form className="form-body" onSubmit={handleSubmit}>
              <div className="form-top-inner" style={{ padding: '16px 0 20px', borderBottom: '1px solid #e7edf5', marginBottom: '20px' }}>
                <div className="form-top-copy">
                  <span className="eyebrow">STUDENT REGISTRATION PORTAL</span>
                  <h1 style={{ fontSize: '24px', color: '#06285f', fontWeight: 900 }}>Request a Home Tutor</h1>
                  <p style={{ color: '#6f7d91', fontSize: '13px', margin: '4px 0 0' }}>Provide student details to match with suitable male or female tutors in Gorakhpur.</p>
                </div>
              </div>

              {errorMsg && <div className="notice warn">{errorMsg}</div>}

              <div className="section-title">Student &amp; Parent Details</div>
              <div className="grid">
                <div className="field">
                  <label>Student Name <span className="req">*</span></label>
                  <input name="studentName" placeholder="Student full name" required="" value={formData.studentName} onChange={handleChange} />
                </div>

                <div className="field">
                  <label>Parent / Guardian Name <span className="req">*</span></label>
                  <input name="parentName" placeholder="Parent or guardian name" required="" value={formData.parentName} onChange={handleChange} />
                </div>

                <div className="field">
                  <label>Contact Number <span className="req">*</span></label>
                  <input inputmode="numeric" maxlength="10" name="phone" placeholder="10-digit mobile number" required="" type="tel" value={formData.phone} onChange={handleChange} />
                </div>

                <div className="field">
                  <label>Email ID <span className="req">*</span></label>
                  <input name="email" placeholder="Active email address" required="" type="email" value={formData.email} onChange={handleChange} />
                </div>

                <div className="field">
                  <label>Class <span className="req">*</span></label>
                  <input name="className" placeholder="e.g. Class 8" required="" value={formData.className} onChange={handleChange} />
                </div>

                <div className="field">
                  <label>Board <span className="req">*</span></label>
                  <select name="board" required="" value={formData.board} onChange={handleChange}>
                    <option value="">Select board</option>
                    <option>CBSE</option>
                    <option>ICSE</option>
                    <option>UP Board</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className="field">
                  <label>Subject(s) <span className="req">*</span></label>
                  <input name="subjects" placeholder="e.g. Maths, Science" required="" value={formData.subjects} onChange={handleChange} />
                </div>

                <div className="field">
                  <label>Address <span className="req">*</span></label>
                  <input name="area" placeholder="Full address / locality / landmark" required="" value={formData.area} onChange={handleChange} />
                </div>

                <div className="field">
                  <label>Preferred Tutor</label>
                  <select name="tutorPref" value={formData.tutorPref} onChange={handleChange}>
                    <option>Any</option>
                    <option>Male Tutor</option>
                    <option>Female Tutor</option>
                  </select>
                </div>

                <div className="field">
                  <label>Preferred Timing</label>
                  <input name="timing" placeholder="e.g. 5 PM - 6 PM" value={formData.timing} onChange={handleChange} />
                </div>

                <div className="field">
                  <label>Monthly Budget</label>
                  <input inputmode="numeric" name="budget" placeholder="Optional" value={formData.budget} onChange={handleChange} />
                </div>
              </div>

              <div className="field">
                <label>Special Requirement Note</label>
                <textarea name="note" placeholder="Weak subjects or any special requirement" value={formData.note} onChange={handleChange}></textarea>
              </div>

              <div className="section-title">Student Photo</div>
              <div className="upload-card">
                <div className="upload-head">
                  <span className="upload-title">Student Photo <span className="req">*</span></span>
                  <span className="upload-help">JPG/JPEG/PNG/WEBP • Max 5 MB</span>
                </div>
                <input accept=".jpg,.jpeg,.png,.webp,image/*" id="photo" name="photo" onChange={handlePhotoChange} required="" type="file" />
                <div className="preview-photo" id="photoPreview">
                  {photoPreview !== 'PHOTO' ? <img src={photoPreview} alt="Preview" /> : 'PHOTO'}
                </div>
              </div>

              <div className="section-title">Registration Type</div>
              <div className="choice">
                <label style={{ cursor: 'pointer' }}>
                  <input type="radio" name="regChoice" checked={regType === 'STANDARD'} onChange={() => setRegType('STANDARD')} />
                  <div>
                    <strong>Standard Registration</strong>
                    <div style={{ fontSize: '11px', color: '#6f7d91' }}>Free student registration (Standard queue matching)</div>
                  </div>
                </label>

                <label style={{ cursor: 'pointer' }}>
                  <input type="radio" name="regChoice" checked={regType === 'ADVANCE'} onChange={() => setRegType('ADVANCE')} />
                  <div>
                    <strong>Priority Advance Booking</strong>
                    <div style={{ fontSize: '11px', color: '#6f7d91' }}>Priority tutor selection & rapid dispatch</div>
                  </div>
                </label>
              </div>

              {regType === 'ADVANCE' && (
                <div className="payment-card personal-upi-final" style={{ marginTop: '16px' }}>
                  <div className="qr-shell">
                    <span className="fee-pill">₹500 Advance Fee</span>
                    <img alt="UPI QR Code" src="/assets/optimized-inline/tutor-56ab23603c03e67c.jpg" onError={(e) => { e.target.onerror = null; e.target.src = "/favicon-vishu-home-tuition.png"; }} />
                    <div className="upi-id">vishuhometuition@okicici</div>
                  </div>
                  <div className="payment-side">
                    <div className="payment-meta">
                      <div className="pay-row"><span>Business</span><strong>VISHU HOME TUITION</strong></div>
                      <div className="pay-row"><span>UPI Account Name</span><strong>Vikash Kumar Yadav</strong></div>
                      <div className="pay-row"><span>UPI ID</span><strong>vishuhometuition@okicici</strong></div>
                      <div className="pay-row"><span>UPI Number</span><strong onClick={copyUPINumber} style={{ cursor: 'pointer', color: '#1765E8' }}>7052500258</strong></div>
                    </div>
                    <div className="pay-actions">
                      <button className="btn btn-light" type="button" onClick={copyUPI}>Copy UPI ID</button>
                      <button className="btn btn-light" type="button" onClick={copyUPINumber}>Copy Number</button>
                    </div>
                    <div className="upload-card">
                      <div className="upload-head">
                        <span className="upload-title">Payment Screenshot <span className="req">*</span></span>
                      </div>
                      <input accept="image/*,.pdf" onChange={(e) => setPaymentProof(e.target.files[0])} required="" type="file" />
                    </div>
                  </div>
                </div>
              )}

              <div className="actions" style={{ marginTop: '24px' }}>
                <button className="btn btn-primary submit-btn" disabled={loading} type="submit">
                  {loading ? 'Submitting Registration...' : 'Submit Student Registration'}
                </button>
              </div>
            </form>
          </section>
        )}
      </div>
    </main>
  );
}
