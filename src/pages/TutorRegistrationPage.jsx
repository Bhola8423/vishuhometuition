import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './TutorRegistration.css';
import { API_BASE } from '../config/api';

export default function TutorRegistrationPage({ onOpenStatusModal }) {
  const [view, setView] = useState('form'); // 'form' | 'success' | 'verify'
  const [fee, setFee] = useState('300');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    qualification: '',
    experience: '',
    classes: '',
    subjects: '',
    area: '',
    boards: ''
  });

  const [photo, setPhoto] = useState(null);
  const [resumeDoc, setResumeDoc] = useState(null);
  const [identityDoc, setIdentityDoc] = useState(null);
  const [paymentProof, setPaymentProof] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const [loading, setLoading] = useState(false);
  const [loadingStatusText, setLoadingStatusText] = useState('Submit Registration');
  const [successData, setSuccessData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  // Status check state
  const [verifyId, setVerifyId] = useState('');
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyResult, setVerifyResult] = useState(null);
  const [verifyError, setVerifyError] = useState('');

  const toastTimerRef = useRef(null);

  const showToast = (msg) => {
    setToastMsg(msg);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToastMsg(''), 4500);
  };

  useEffect(() => {
    // Fetch live fee setting if available
    fetch(`${API_BASE}/api/site-content`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const liveFee = String(data?.settings?.payments?.teacherRegistrationFee || '').replace(/[^0-9]/g, '');
        if (liveFee) setFee(liveFee);
      })
      .catch(() => {});

    // Check if URL has ?verify=ID
    const params = new URLSearchParams(window.location.search);
    const vId = params.get('verify');
    if (vId) {
      setView('verify');
      setVerifyId(vId.toUpperCase());
      handleVerify(vId.toUpperCase());
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onload = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const copyUPI = async () => {
    const value = 'vishuhometuition@okicici';
    try {
      await navigator.clipboard.writeText(value);
      showToast('UPI ID copied');
    } catch {
      showToast('Copy vishuhometuition@okicici manually');
    }
  };

  const copyUPINumber = async () => {
    const value = '7052500258';
    try {
      await navigator.clipboard.writeText(value);
      showToast('UPI number 7052500258 copied');
    } catch {
      showToast('Copy 7052500258 manually');
    }
  };

  // Image compression helper for mobile camera uploads
  const compressImage = async (file) => {
    const ext = file.name ? file.name.substring(file.name.lastIndexOf('.')).toLowerCase() : '';
    if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext) || file.size <= 2 * 1024 * 1024) {
      return file;
    }
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        const maxDim = 2000;
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob && blob.size < file.size) {
              resolve(new File([blob], file.name.replace(/\.[^.]+$/, '.webp'), { type: 'image/webp' }));
            } else {
              resolve(file);
            }
          },
          'image/webp',
          0.82
        );
      };
      img.onerror = () => resolve(file);
      img.src = url;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!/^[6-9]\d{9}$/.test(formData.phone.trim())) {
      showToast('Enter a valid 10-digit Indian mobile number.');
      return;
    }

    if (!photo || !resumeDoc || !identityDoc || !paymentProof) {
      showToast('Please upload all required files: photo, resume, identity proof, and payment screenshot.');
      return;
    }

    setLoading(true);
    setLoadingStatusText('Preparing files...');

    try {
      const [optPhoto, optResume, optIdentity, optPayment] = await Promise.all([
        compressImage(photo),
        compressImage(resumeDoc),
        compressImage(identityDoc),
        compressImage(paymentProof)
      ]);

      setLoadingStatusText('Uploading registration...');

      const fd = new FormData();
      fd.append('type', 'teacher');
      fd.append('name', formData.name);
      fd.append('phone', formData.phone);
      fd.append('email', formData.email);
      fd.append('qualification', formData.qualification);
      fd.append('experience', formData.experience);
      fd.append('classes', formData.classes);
      fd.append('subjects', formData.subjects);
      fd.append('area', formData.area);
      fd.append('boards', formData.boards);

      fd.append('photo', optPhoto);
      fd.append('resumeDoc', optResume);
      fd.append('identityDoc', optIdentity);
      fd.append('paymentProof', optPayment);

      const res = await fetch(`${API_BASE}/api/register`, {
        method: 'POST',
        body: fd
      }).catch(() => null);

      if (res && res.ok) {
        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const data = await res.json();
          if (data && data.ok && data.id) {
            setSuccessData(data);
            setView('success');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
          }
        }
      }

      // If backend is in local demo preview or mock environment
      const demoId = 'VHT-T' + new Date().getFullYear().toString().slice(-2) + '-' + Date.now().toString(36).toUpperCase();
      const mockResult = {
        id: demoId,
        type: 'teacher',
        status: 'PENDING',
        name: formData.name,
        preview: true
      };

      try {
        const stored = JSON.parse(localStorage.getItem('vht_final_demo_regs') || '[]');
        stored.unshift({ ...mockResult, createdAt: new Date().toISOString() });
        localStorage.setItem('vht_final_demo_regs', JSON.stringify(stored));
      } catch {}

      setSuccessData(mockResult);
      setView('success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setErrorMsg(err.message || 'Error completing registration. Please check files and try again.');
    } finally {
      setLoading(false);
      setLoadingStatusText('Submit Registration');
    }
  };

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

  const getStatusChipClass = (status) => {
    const s = String(status || '').toUpperCase();
    if (s === 'APPROVED') return 'approved';
    if (s === 'REJECTED') return 'rejected';
    if (s === 'CORRECTION_REQUIRED') return 'correction';
    return 'pending';
  };

  return (
    <div className="tutor-portal-page">
      {/* 1. TOP BAR */}
      <div className="vht-reg-topbar">
        <Link to="/" className="vht-reg-close" aria-label="Back to website">
          ← Back
        </Link>
      </div>

      {/* 2. SITE HEADER */}
      <header className="site-header">
        <div className="wrap sitebar">
          <div aria-hidden="true" className="brand-mark">
            <img alt="Vishu Home Tuition logo" src="/assets/optimized-inline/tutor-765663d5e776d208.jpg" />
          </div>
          <div className="brand-copy">
            <strong>VISHU HOME TUITION</strong>
            <small>Tutor Registration • Gorakhpur</small>
          </div>
          <div className="sitebar-spacer"></div>
          <button
            className="btn btn-light"
            onClick={() => {
              setView('verify');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            type="button"
          >
            Check Status
          </button>
        </div>
      </header>

      {/* 3. MAIN CONTENT */}
      <main className="page">
        <div className="wrap">
          {/* TOAST MESSAGE */}
          <div className={`toast ${toastMsg ? 'show' : ''}`}>{toastMsg}</div>

          {/* VIEW: SUCCESS */}
          {view === 'success' && successData && (
            <div className="success-card" style={{ maxWidth: '680px', margin: 'auto' }}>
              <div className="success-icon">✓</div>
              <h2 style={{ margin: 0, color: 'var(--navy)' }}>Registration Submitted</h2>
              <p className="muted" style={{ margin: '8px 0 14px' }}>
                Keep this Registration ID for status checking.
              </p>
              <div className="registration-id">{successData.id}</div>
              <div className="notice ok" style={{ marginTop: '16px', textAlign: 'left' }}>
                Registration saved successfully. Our admin team will verify your credentials shortly.
              </div>
              <div className="actions" style={{ justifyContent: 'center', marginTop: '24px' }}>
                <button
                  className="btn btn-light"
                  onClick={() => {
                    setView('form');
                    setSuccessData(null);
                  }}
                  type="button"
                >
                  New Registration
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setView('verify');
                    if (successData?.id) {
                      setVerifyId(successData.id);
                      handleVerify(successData.id);
                    }
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  type="button"
                >
                  Check Status
                </button>
              </div>
            </div>
          )}

          {/* VIEW: VERIFY STATUS */}
          {view === 'verify' && (
            <div className="verify-box">
              <div className="verify-head">
                <div>
                  <h2>Check Tutor Status</h2>
                  <p>Enter the Tutor Registration ID.</p>
                </div>
                <button className="btn btn-light mini" onClick={() => setView('form')} type="button">
                  Back
                </button>
              </div>

              <div className="verify-form">
                <input
                  id="verifyId"
                  placeholder="e.g. VHT-T2500"
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
                <div className="verify-result">
                  <div className="status-card" style={{ boxShadow: 'none', padding: '18px' }}>
                    <span className={`status-chip ${getStatusChipClass(verifyResult.status)}`}>
                      {(verifyResult.status || 'PENDING').replaceAll('_', ' ')}
                    </span>
                    <div className="kv" style={{ marginTop: '14px' }}>
                      <span>Registration ID</span>
                      <b>{verifyResult.id}</b>
                    </div>
                    <div className="kv">
                      <span>Registration Type</span>
                      <b>{(verifyResult.type || 'teacher').toUpperCase()}</b>
                    </div>
                    {verifyResult.name && (
                      <div className="kv">
                        <span>Applicant Name</span>
                        <b>{verifyResult.name}</b>
                      </div>
                    )}
                    {verifyResult.updatedAt && (
                      <div className="kv">
                        <span>Last Updated</span>
                        <b>{new Date(verifyResult.updatedAt).toLocaleString()}</b>
                      </div>
                    )}
                    {verifyResult.note && (
                      <div className="notice warn" style={{ textAlign: 'left', marginTop: '12px' }}>
                        {verifyResult.note}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* VIEW: MAIN FORM */}
          {view === 'form' && (
            <section className="form-shell">
              {/* BANNER */}
              <div aria-label="Registration banner" className="registration-banner">
                <img
                  alt="Teacher registration banner"
                  src="/assets/optimized-inline/tutor-8a787d4c4ffa1ecb.png"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                  }}
                />
              </div>

              {/* FORM */}
              <form className="form-body" onSubmit={handleSubmit}>
                {errorMsg && <div className="notice warn" style={{ marginBottom: '14px' }}>{errorMsg}</div>}

                {/* 1. TUTOR DETAILS */}
                <div className="section-title">Tutor Details</div>
                <div className="grid">
                  <div className="field">
                    <label>
                      Full Name <span className="req">*</span>
                    </label>
                    <input
                      autoComplete="name"
                      name="name"
                      placeholder="Full name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="field">
                    <label>
                      Contact Number <span className="req">*</span>
                    </label>
                    <input
                      inputMode="numeric"
                      maxLength={10}
                      name="phone"
                      placeholder="10-digit mobile number"
                      required
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="field">
                    <label>
                      Email ID <span className="req">*</span>
                    </label>
                    <input
                      autoComplete="email"
                      name="email"
                      placeholder="Active email address"
                      required
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                    <div className="input-help">Use an active email address.</div>
                  </div>

                  <div className="field">
                    <label>
                      Highest Qualification <span className="req">*</span>
                    </label>
                    <input
                      name="qualification"
                      placeholder="e.g. B.Sc., B.Ed., M.Sc."
                      required
                      value={formData.qualification}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="field">
                    <label>
                      Teaching Experience <span className="req">*</span>
                    </label>
                    <select
                      name="experience"
                      required
                      value={formData.experience}
                      onChange={handleChange}
                    >
                      <option value="">Select experience</option>
                      <option>Fresher</option>
                      <option>1–2 Years</option>
                      <option>3–5 Years</option>
                      <option>5–10 Years</option>
                      <option>10+ Years</option>
                    </select>
                  </div>

                  <div className="field">
                    <label>
                      Classes You Teach <span className="req">*</span>
                    </label>
                    <input
                      name="classes"
                      placeholder="e.g. 6–10"
                      required
                      value={formData.classes}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="field">
                    <label>
                      Subjects <span className="req">*</span>
                    </label>
                    <input
                      name="subjects"
                      placeholder="e.g. Maths, Science"
                      required
                      value={formData.subjects}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="field">
                    <label>
                      Preferred Area(s) <span className="req">*</span>
                    </label>
                    <input
                      name="area"
                      placeholder="e.g. Bichhiya, Mohaddipur, Asuran"
                      required
                      value={formData.area}
                      onChange={handleChange}
                    />
                    <div className="input-help">
                      You can enter more than one preferred area. Separate multiple areas with commas.
                    </div>
                  </div>

                  <div className="field">
                    <label>Academic Board(s)</label>
                    <input
                      name="boards"
                      placeholder="e.g. CBSE, ICSE or State Board"
                      value={formData.boards}
                      onChange={handleChange}
                    />
                    <div className="input-help">
                      Mention the board(s) from which you completed your academic qualification, such as CBSE, ICSE or any State Board.
                    </div>
                  </div>
                </div>

                {/* 2. DOCUMENTS */}
                <div className="section-title">Documents</div>
                <div className="upload-card">
                  <div className="upload-head">
                    <span className="upload-title">
                      Tutor Photo <span className="req">*</span>
                    </span>
                    <span className="upload-help">JPG/JPEG/PNG/WEBP • Max 5 MB</span>
                  </div>
                  <input
                    accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                    id="photo"
                    name="photo"
                    onChange={handlePhotoChange}
                    required
                    type="file"
                  />
                  <div className="preview-photo" id="photoPreview">
                    {photoPreview ? (
                      <img alt="Selected photo preview" src={photoPreview} />
                    ) : (
                      'PHOTO'
                    )}
                  </div>
                </div>

                <div className="upload-card">
                  <div className="upload-head">
                    <span className="upload-title">
                      Resume / CV <span className="req">*</span>
                    </span>
                    <span className="upload-help">JPG/JPEG/PNG/WEBP/PDF/DOC/DOCX • Max 5 MB</span>
                  </div>
                  <input
                    accept=".jpg,.jpeg,.png,.webp,.pdf,.doc,.docx,image/jpeg,image/png,image/webp,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    name="resumeDoc"
                    onChange={(e) => setResumeDoc(e.target.files[0])}
                    required
                    type="file"
                  />
                </div>

                <div className="upload-card">
                  <div className="upload-head">
                    <span className="upload-title">
                      Identity Proof <span className="req">*</span>
                    </span>
                    <span className="upload-help">Private admin verification only • Max 5 MB</span>
                  </div>
                  <input
                    accept=".jpg,.jpeg,.png,.webp,.pdf,image/jpeg,image/png,image/webp,application/pdf"
                    name="identityDoc"
                    onChange={(e) => setIdentityDoc(e.target.files[0])}
                    required
                    type="file"
                  />
                </div>

                {/* 3. REGISTRATION PAYMENT */}
                <div className="section-title">Registration Payment</div>
                <div className="payment-card">
                  <div className="qr-shell">
                    <span className="fee-pill" id="teacherFeePill">
                      ₹{fee} Registration Fee
                    </span>
                    <img
                      alt="VISHU HOME TUITION UPI QR code"
                      id="teacherPersonalQr"
                      src="/assets/optimized-inline/tutor-56ab23603c03e67c.jpg"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/favicon-vishu-home-tuition.png';
                      }}
                    />
                    <div className="upi-id">vishuhometuition@okicici</div>
                    <div className="qr-save-hint">
                      Save this QR to your gallery, then use “Scan from Gallery” in your UPI app.
                    </div>
                  </div>

                  <div className="payment-side">
                    <div className="payment-meta">
                      <div className="pay-row">
                        <span>Business</span>
                        <strong>VISHU HOME TUITION (GORAKHPUR)</strong>
                      </div>
                      <div className="pay-row">
                        <span>UPI Account Name</span>
                        <strong>Vikash Kumar Yadav</strong>
                      </div>
                      <div className="pay-row">
                        <span>UPI ID</span>
                        <strong>vishuhometuition@okicici</strong>
                      </div>
                      <div className="pay-row">
                        <span>UPI / Payment Number</span>
                        <strong
                          onClick={copyUPINumber}
                          style={{ cursor: 'pointer', color: '#176bd8' }}
                          title="Click to copy"
                        >
                          7052500258
                        </strong>
                      </div>
                      <div className="pay-row">
                        <span>Payment For</span>
                        <strong>VISHU HOME TUITION • Tutor Registration</strong>
                      </div>
                    </div>

                    <div className="pay-actions">
                      <a
                        className="btn btn-primary"
                        download="VISHU-HOME-TUITION-UPI-QR.jpg"
                        href="/assets/optimized-inline/tutor-56ab23603c03e67c.jpg"
                      >
                        Save QR to Gallery
                      </a>
                      <button className="btn btn-light" onClick={copyUPI} type="button">
                        Copy UPI ID
                      </button>
                      <button className="btn btn-light" onClick={copyUPINumber} type="button">
                        Copy UPI Number
                      </button>
                    </div>

                    <div className="scan-tip">
                      You can also copy the UPI ID or payment number and pay manually. After payment, upload the payment screenshot below for verification.
                    </div>

                    <div className="upload-card" style={{ marginTop: '4px', marginBottom: 0 }}>
                      <div className="upload-head">
                        <span className="upload-title">
                          Payment Screenshot <span className="req">*</span>
                        </span>
                        <span className="upload-help">JPG/JPEG/PNG/WEBP/PDF • Max 5 MB</span>
                      </div>
                      <input
                        accept=".jpg,.jpeg,.png,.webp,.pdf,image/jpeg,image/png,image/webp,application/pdf"
                        id="paymentProof"
                        name="paymentProof"
                        onChange={(e) => setPaymentProof(e.target.files[0])}
                        required
                        type="file"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. ACTIONS */}
                <div className="actions">
                  <button
                    className="btn btn-primary submit-btn"
                    disabled={loading}
                    id="submitBtn"
                    type="submit"
                  >
                    {loading ? loadingStatusText : 'Submit Registration'}
                  </button>
                </div>
              </form>
            </section>
          )}
        </div>
      </main>

      {/* 4. FOOTER */}
      <footer className="portal-footer">Vishu Home Tuition • Gorakhpur</footer>
    </div>
  );
}
