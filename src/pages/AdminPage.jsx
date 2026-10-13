import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, RefreshCw, LogOut, CheckCircle, XCircle, Clock, 
  AlertTriangle, Eye, Phone, Mail, FileText, ChevronRight, X,
  Save, RotateCcw, ArrowLeft, Upload, Trash2, Check, ExternalLink
} from 'lucide-react';
import { API_BASE, apiFetch } from '../config/api';

const DEFAULTS = {
  schemaVersion: 2,
  hero: {
    kicker: "👑 Gorakhpur's No. 1 Home Tuition Platform",
    title1: "VISHU",
    title2: "HOME TUITION",
    city: "GORAKHPUR",
    solution: "Your Complete Home Tuition Solution in Gorakhpur",
    sub: "Personalised learning with the right guidance for a brighter future.",
    chip1: "Nursery to 12th",
    chip2: "CBSE • ICSE",
    chip3: "State Boards"
  },
  trust: {
    kicker: "TRUSTED IN GORAKHPUR",
    sinceYear: "2017",
    sinceTitle: "Serving Across Gorakhpur",
    sinceText: "Years of consistent work in education, mentorship and tutor support for local families.",
    teacherCount: "3800",
    teacherTitle: "Teacher Community",
    teacherText: "Male & female tutors across multiple subjects and classes.",
    familyCount: "8500",
    familyTitle: "Families Served",
    familyText: "Approx. families supported through home tuition services in Gorakhpur.",
    googleRating: "5.0",
    googleText: "995+ public reviews on Google.",
    justdialRating: "5.0",
    justdialText: "2500+ public reviews on Justdial."
  },
  tutor: {
    kicker: "TEACHER REGISTRATION",
    title: "BECOME A TUTOR",
    text: "Join our tutor community and connect with suitable teaching opportunities according to your subject, class preference, location, availability and teaching experience.",
    button: "Register as a Teacher"
  },
  student: {
    kicker: "STUDENT REGISTRATION",
    title: "RIGHT TUTOR FOR YOUR CHILD",
    text: "Share your child’s class, subject, board, location and preferred timing. We’ll use your requirement to help connect you with a suitable home tutor in Gorakhpur.",
    button: "Register as a Student"
  },
  feesSection: {
    kicker: "Simple & Transparent",
    title: "TUITION FEES",
    noteBadge: "PLEASE NOTE",
    noteText: "Fees may vary by subject, board, tutor availability and experience."
  },
  contactSection: {
    kicker: "Quick Enquiry",
    title: "NEED A HOME TUTOR?",
    text: "Fill your requirement and continue on WhatsApp.",
    button: "Send Enquiry via WhatsApp"
  },
  howSection: {
    kicker: "Simple • Fast • Effective",
    title: "HOW IT WORKS",
    text: "Three simple steps from requirement to personalised learning."
  },
  feedbackSection: {
    kicker: "Experience Highlights",
    title: "PARENTS, STUDENTS & TEACHERS SAY"
  },
  founder: {
    name: "Vikash Kumar",
    role: "Founder & Director",
    brand: "VISHU HOME TUITION",
    quote: "हमारा विश्वास है कि हर बच्चे में आगे बढ़ने की क्षमता होती है। सही शिक्षक, व्यक्तिगत मार्गदर्शन और निरंतर प्रोत्साहन से हम उस क्षमता को आत्मविश्वास और उपलब्धियों में बदलने का प्रयास करते हैं।"
  },
  faqSection: {
    kicker: "Helpful Information • Quick Answers",
    title: "HOME TUITION FAQs",
    intro: "Quick answers about VISHU HOME TUITION in Gorakhpur."
  },
  contact: {
    phone: "+91 7052500258",
    email: "vishuhometuition.gkp@gmail.com"
  },
  footer: {
    tagline: "Better Learning. Brighter Future.",
    services: [
      "Home Tuition",
      "Online Tuition",
      "Subject Experts",
      "Nursery to 12th"
    ]
  },
  social: {
    instagram: "https://www.instagram.com/vishuhometuitiongorakhpur",
    youtube: "https://youtube.com/@vishuhometuitiongorakhpur",
    facebook: "https://www.facebook.com/profile.php?id=61579272522736",
    x: "https://x.com/VishuHomeTution",
    linkedin: "https://www.linkedin.com/in/vishu-home-tuition-gorakhpur-1a71b2424",
    threads: "https://www.threads.com/@vishuhometuitiongorakhpur"
  },
  theme: {
    navy: "#061A3F",
    gold: "#F7C63D",
    blue: "#1765E8"
  },
  seo: {
    homeTitle: "Best Home Tuition in Gorakhpur | VISHU HOME TUITION GORAKHPUR",
    homeDescription: "Find trusted home tuition in Gorakhpur for Nursery to Class 12 across CBSE, ICSE and UP Board with personalised tutor matching from VISHU HOME TUITION.",
    landingTitle: "Home Tutor in Gorakhpur | CBSE, ICSE, UP Board | VISHU HOME TUITION GORAKHPUR",
    landingDescription: "Find a suitable home tutor in Gorakhpur for CBSE, ICSE and UP Board students from Nursery to Class 12 with VISHU HOME TUITION."
  },
  notice: {
    enabled: false,
    text: ""
  },
  visibility: {
    trust: true,
    tutor: true,
    student: true,
    fees: true,
    contact: true,
    how: true,
    feedback: true,
    founder: true,
    faq: true,
    gallery: true
  },
  operations: {
    teacherRegistrationEnabled: true,
    studentRegistrationEnabled: true,
    quickEnquiryEnabled: true,
    registrationEmailsEnabled: true,
    statusEmailsEnabled: true,
    autoCardEmailOnApproval: true
  },
  payments: {
    teacherRegistrationFee: "500",
    studentDefaultAdvanceAmount: ""
  },
  fees: [],
  areas: [],
  testimonials: []
};

function deepMerge(a, b) {
  if (Array.isArray(b)) return b;
  if (b && typeof b === 'object') {
    const o = { ...(a || {}) };
    for (const k of Object.keys(b)) {
      o[k] = deepMerge(a?.[k], b[k]);
    }
    return o;
  }
  return b === undefined ? a : b;
}

export default function AdminPage() {
  const [token, setToken] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('registrations'); // 'registrations' | 'content' | 'controls' | 'gallery' | 'system'

  // Registrations state
  const [registrations, setRegistrations] = useState([]);
  const [selectedReg, setSelectedReg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Website Control CMS state
  const [settings, setSettings] = useState(DEFAULTS);
  const [savedSettings, setSavedSettings] = useState(DEFAULTS);
  const [feedbackText, setFeedbackText] = useState('');
  const [feesText, setFeesText] = useState('');
  const [areasText, setAreasText] = useState('');
  const [servicesText, setServicesText] = useState('');
  const [contentMsg, setContentMsg] = useState('Loaded current saved website settings.');
  const [controlMsg, setControlMsg] = useState('Controls loaded.');
  const [savingContent, setSavingContent] = useState(false);

  // Gallery state
  const [mediaItems, setMediaItems] = useState([]);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [mediaMsg, setMediaMsg] = useState('');
  const [mFile, setMFile] = useState(null);
  const [mTitle, setMTitle] = useState('');
  const [mCaption, setMCaption] = useState('');
  const [mAlt, setMAlt] = useState('');
  const [mOrder, setMOrder] = useState('0');
  const [mPublished, setMPublished] = useState(true);

  // System & Email Health state
  const [systemInfo, setSystemInfo] = useState(null);
  const [systemMsg, setSystemMsg] = useState('');
  const [systemTesting, setSystemTesting] = useState(false);

  // Auto-authenticate if token exists in sessionStorage
  useEffect(() => {
    const savedToken = sessionStorage.getItem('vht_admin_token');
    if (savedToken) {
      setToken(savedToken);
      fetchLiveRegistrations(savedToken);
      loadWebsiteContent(savedToken);
    }
  }, []);

  const fetchLiveRegistrations = async (authToken) => {
    const tok = authToken || token;
    if (!tok) return;
    setLoading(true);
    setMsg({ type: '', text: '' });

    try {
      const res = await apiFetch('/api/admin/list', {
        headers: {
          'accept': 'application/json',
          'authorization': `Bearer ${tok.trim()}`
        }
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (res.status === 401) {
          sessionStorage.removeItem('vht_admin_token');
          setAuthenticated(false);
        }
        throw new Error(data.error || 'Invalid ADMIN_TOKEN provided.');
      }

      sessionStorage.setItem('vht_admin_token', tok.trim());
      setAuthenticated(true);
      setRegistrations(data.items || data.registrations || []);
    } catch (err) {
      setMsg({ type: 'danger', text: err.message || 'Authentication failed.' });
    } finally {
      setLoading(false);
    }
  };

  const loadWebsiteContent = async (authToken) => {
    const tok = authToken || token;
    if (!tok) return;
    try {
      const res = await apiFetch('/api/admin/content', {
        headers: {
          'accept': 'application/json',
          'authorization': `Bearer ${tok.trim()}`
        }
      });
      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        const remote = data.settings && Object.keys(data.settings).length > 0 ? data.settings : {};
        const merged = deepMerge(DEFAULTS, remote);
        setSettings(merged);
        setSavedSettings(merged);
        setServicesText((merged.footer?.services || []).join('\n'));
        setFeesText((merged.fees || []).join('\n'));
        setAreasText((merged.areas || []).join('\n'));
        setFeedbackText((merged.testimonials || []).map(t => [t.name, t.role, t.text].join(' | ')).join('\n'));
        setContentMsg('Loaded current saved website settings.');
        setControlMsg('Controls loaded.');
      } else {
        // Fallback to defaults
        setServicesText((DEFAULTS.footer?.services || []).join('\n'));
        setFeesText((DEFAULTS.fees || []).join('\n'));
        setAreasText((DEFAULTS.areas || []).join('\n'));
        setFeedbackText((DEFAULTS.testimonials || []).map(t => [t.name, t.role, t.text].join(' | ')).join('\n'));
      }
    } catch (err) {
      console.warn('Could not load website content:', err);
    }
  };

  const loadMedia = async () => {
    if (!token) return;
    setMediaLoading(true);
    try {
      const res = await apiFetch('/api/admin/media/list?kind=student-gallery', {
        headers: {
          'authorization': `Bearer ${token.trim()}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setMediaItems(data.items || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setMediaLoading(false);
    }
  };

  const loadSystemInfo = async () => {
    if (!token) return;
    try {
      const res = await apiFetch('/api/admin/system', {
        headers: {
          'accept': 'application/json',
          'authorization': `Bearer ${token.trim()}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setSystemInfo(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (authenticated) {
      if (activeTab === 'content' || activeTab === 'controls') {
        loadWebsiteContent(token);
      } else if (activeTab === 'gallery') {
        loadMedia();
      } else if (activeTab === 'system') {
        loadSystemInfo();
      }
    }
  }, [activeTab, authenticated]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!token.trim()) {
      setMsg({ type: 'danger', text: 'Please enter the private Admin Token.' });
      return;
    }
    await fetchLiveRegistrations(token.trim());
    await loadWebsiteContent(token.trim());
  };

  const handleLogout = () => {
    sessionStorage.removeItem('vht_admin_token');
    setToken('');
    setAuthenticated(false);
    setRegistrations([]);
    setSelectedReg(null);
  };

  const handleUpdateStatus = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      const res = await apiFetch('/api/admin/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${token.trim()}`
        },
        body: JSON.stringify({ id, status: newStatus, active: true })
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setRegistrations(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
        if (selectedReg && selectedReg.id === id) {
          setSelectedReg(prev => ({ ...prev, status: newStatus }));
        }
      } else {
        alert(data.error || 'Failed to update status.');
      }
    } catch (err) {
      alert('Error connecting to backend server.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleViewDetail = async (id) => {
    try {
      const res = await apiFetch(`/api/admin/detail?id=${encodeURIComponent(id)}`, {
        headers: {
          'accept': 'application/json',
          'authorization': `Bearer ${token.trim()}`
        }
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setSelectedReg(data);
      } else {
        alert(data.error || 'Could not fetch registration details.');
      }
    } catch (err) {
      alert('Error connecting to live API.');
    }
  };

  // State update helpers for CMS
  const updateNested = (category, field, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...(prev[category] || {}),
        [field]: value
      }
    }));
  };

  const handleLoadDefaults = () => {
    setSettings(JSON.parse(JSON.stringify(DEFAULTS)));
    setServicesText((DEFAULTS.footer?.services || []).join('\n'));
    setFeesText((DEFAULTS.fees || []).join('\n'));
    setAreasText((DEFAULTS.areas || []).join('\n'));
    setFeedbackText((DEFAULTS.testimonials || []).map(t => [t.name, t.role, t.text].join(' | ')).join('\n'));
    setContentMsg('Current production defaults loaded. Click Save to apply them to the live CMS.');
  };

  const handleResetSaved = () => {
    setSettings(JSON.parse(JSON.stringify(savedSettings)));
    setServicesText((savedSettings.footer?.services || []).join('\n'));
    setFeesText((savedSettings.fees || []).join('\n'));
    setAreasText((savedSettings.areas || []).join('\n'));
    setFeedbackText((savedSettings.testimonials || []).map(t => [t.name, t.role, t.text].join(' | ')).join('\n'));
    setContentMsg('Loaded current saved website settings.');
  };

  const handleSaveContent = async (fromControls = false) => {
    setSavingContent(true);
    const targetMsg = fromControls ? setControlMsg : setContentMsg;
    targetMsg('Saving changes to Cloudflare live backend...');

    const parseLines = (text) => text.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
    const testimonials = feedbackText.split(/\r?\n/).map(line => {
      const p = line.split('|').map(x => x.trim());
      return { name: p[0] || '', role: p[1] || '', text: p.slice(2).join(' | ') || '' };
    }).filter(x => x.text);

    const payloadSettings = {
      ...settings,
      footer: {
        ...settings.footer,
        services: parseLines(servicesText)
      },
      fees: parseLines(feesText),
      areas: parseLines(areasText),
      testimonials
    };

    try {
      const res = await apiFetch('/api/admin/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${token.trim()}`
        },
        body: JSON.stringify({ settings: payloadSettings })
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setSavedSettings(payloadSettings);
        targetMsg('Saved. Live website + backend controls are updated.');
      } else {
        targetMsg(`Error: ${data.error || 'Failed to save settings.'}`);
      }
    } catch (err) {
      targetMsg(`Error: ${err.message || 'Could not connect to backend.'}`);
    } finally {
      setSavingContent(false);
    }
  };

  // Gallery actions
  const handleUploadMedia = async (e) => {
    e.preventDefault();
    if (!mFile) {
      setMediaMsg('Please select an image file first.');
      return;
    }
    setMediaMsg('Uploading photo...');
    const fd = new FormData();
    fd.append('file', mFile);
    fd.append('kind', 'student-gallery');
    fd.append('title', mTitle);
    fd.append('caption', mCaption);
    fd.append('altText', mAlt);
    fd.append('sortOrder', mOrder);
    fd.append('published', mPublished ? '1' : '0');

    try {
      const res = await apiFetch('/api/admin/media/upload', {
        method: 'POST',
        headers: {
          'authorization': `Bearer ${token.trim()}`
        },
        body: fd
      });
      if (res.ok) {
        setMediaMsg('Photo uploaded successfully.');
        setMFile(null);
        setMTitle('');
        setMCaption('');
        setMAlt('');
        loadMedia();
      } else {
        const d = await res.json().catch(() => ({}));
        setMediaMsg(d.error || 'Upload failed.');
      }
    } catch (err) {
      setMediaMsg('Error connecting to upload API.');
    }
  };

  const handleToggleMedia = async (id, currentPublished, sortOrder, title, caption, altText) => {
    try {
      await apiFetch('/api/admin/media/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${token.trim()}`
        },
        body: JSON.stringify({
          id,
          published: !currentPublished,
          sortOrder: Number(sortOrder || 0),
          title: title || '',
          caption: caption || '',
          altText: altText || '',
          kind: 'student-gallery'
        })
      });
      loadMedia();
    } catch (err) {
      alert('Failed to update photo state.');
    }
  };

  const handleDeleteMedia = async (id) => {
    if (!window.confirm('Delete this photo from gallery?')) return;
    try {
      await apiFetch('/api/admin/media/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${token.trim()}`
        },
        body: JSON.stringify({ id })
      });
      loadMedia();
    } catch (err) {
      alert('Failed to delete photo.');
    }
  };

  const handleSendTestEmail = async () => {
    setSystemTesting(true);
    setSystemMsg('Sending test email to admin inbox...');
    try {
      const res = await apiFetch('/api/admin/email-test', {
        method: 'POST',
        headers: {
          'authorization': `Bearer ${token.trim()}`
        }
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setSystemMsg(`✓ Test email sent successfully to ${data.to || 'admin inbox'}.`);
      } else {
        setSystemMsg(`✗ Test failed: ${data.error || 'Check RESEND_API_KEY configuration.'}`);
      }
    } catch (err) {
      setSystemMsg('✗ Connection error sending test email.');
    } finally {
      setSystemTesting(false);
    }
  };

  // Filtered rows for Registrations tab
  const filteredRows = registrations.filter(r => {
    if (filterType && (r.type || 'student') !== filterType) return false;
    if (filterStatus && (r.status || 'PENDING') !== filterStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const name = (r.name || r.studentName || '').toLowerCase();
      const phone = (r.phone || '').toLowerCase();
      const id = (r.id || '').toLowerCase();
      const email = (r.email || '').toLowerCase();
      return name.includes(q) || phone.includes(q) || id.includes(q) || email.includes(q);
    }
    return true;
  });

  const counts = {
    total: registrations.length,
    teachers: registrations.filter(r => r.type === 'teacher').length,
    students: registrations.filter(r => r.type === 'student').length,
    approved: registrations.filter(r => r.status === 'APPROVED').length,
    pending: registrations.filter(r => (r.status || 'PENDING') === 'PENDING'),
  };

  return (
    <div style={{ background: '#f3f6fb', minHeight: '100vh', color: '#17233a', display: 'flex', flexDirection: 'column', fontFamily: 'Inter, "Segoe UI", Arial, sans-serif' }}>
      
      {/* Component Scoped CSS to match live admin exactly */}
      <style>{`
        .section-title {
          display: flex;
          align-items: center;
          gap: 9px;
          margin: 0 0 13px;
          color: #061A3F;
          font-size: 16px;
          font-weight: 850;
        }
        .section-title:before {
          content: "";
          width: 5px;
          height: 21px;
          border-radius: 6px;
          background: linear-gradient(#1765E8, #F7C63D);
        }
        .hint {
          font-size: 11px;
          line-height: 1.55;
          color: #6f7d91;
          margin: -4px 0 12px;
        }
        .field {
          margin-bottom: 12px;
        }
        .field label {
          display: block;
          font-size: 11px;
          font-weight: 900;
          color: #40516d;
          margin-bottom: 6px;
          letter-spacing: .02em;
        }
        .field input, .field textarea, .field select {
          width: 100%;
          padding: 11px;
          border: 1px solid #cfdbe8;
          border-radius: 10px;
          background: white;
          color: #17233a;
          font-family: inherit;
          font-size: 13.5px;
          box-sizing: border-box;
          outline: none;
          transition: border-color .15s ease, box-shadow .15s ease;
        }
        .field input:focus, .field textarea:focus, .field select:focus {
          border-color: #1765E8;
          box-shadow: 0 0 0 3px rgba(23,101,232,0.12);
        }
        .field textarea {
          resize: vertical;
          min-height: 84px;
        }
        .three {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }
        .two {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }
        .switch {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          font-weight: 850;
          color: #17233a;
          cursor: pointer;
        }
        .switch input {
          width: auto;
          cursor: pointer;
        }
        .savebar {
          position: sticky;
          bottom: 10px;
          z-index: 50;
          display: flex;
          gap: 9px;
          align-items: center;
          justify-content: flex-end;
          background: rgba(255,255,255,.93);
          backdrop-filter: blur(10px);
          border: 1px solid #dfe7f1;
          border-radius: 14px;
          padding: 10px 16px;
          box-shadow: 0 12px 30px rgba(6,26,63,.12);
          margin-top: 16px;
        }
        .savebar .btn {
          border: 0;
          border-radius: 10px;
          padding: 10px 14px;
          font-weight: 850;
          cursor: pointer;
          transition: .18s;
          font-size: 0.85rem;
        }
        .savebar .btn.primary {
          background: #1765E8;
          color: #fff;
        }
        .savebar .btn.light {
          background: #fff;
          color: #061A3F;
          border: 1px solid #dfe7f1;
        }
        .savebar .btn:hover {
          transform: translateY(-1px);
        }
        .savebar .btn:disabled {
          opacity: 0.55;
          cursor: not-allowed;
          transform: none;
        }
        @media (max-width: 900px) {
          .three {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (max-width: 650px) {
          .three, .two {
            grid-template-columns: 1fr;
          }
          .savebar {
            flex-direction: column;
            align-items: stretch;
          }
          .savebar .btn {
            width: 100%;
          }
        }
      `}</style>

      {/* Header Bar matching live production site */}
      <header className="head" style={{ background: '#061A3F', color: '#fff', padding: '14px 0', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 7px 24px rgba(0,0,0,.15)' }}>
        <div style={{ width: 'min(1240px, 94%)', margin: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" style={{ background: '#fff', color: '#061A3F', borderRadius: '10px', padding: '8px 18px', fontSize: '0.82rem', fontWeight: 850, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px', border: 0 }}>
            ← Back
          </Link>
          <div style={{ textAlign: 'center' }}>
            <b style={{ fontSize: '18px', fontWeight: 900, letterSpacing: '-0.01em', color: '#fff' }}>VISHU HOME TUITION</b><br />
            <small style={{ opacity: 0.78, fontSize: '11px', fontWeight: 600, color: '#fff' }}>Admin • Registrations + Website Content</small>
          </div>
          <div>
            {authenticated && (
              <button 
                onClick={handleLogout}
                style={{ background: '#fff', color: '#061A3F', borderRadius: '10px', padding: '8px 16px', fontWeight: 850, border: '0', cursor: 'pointer', fontSize: '0.82rem' }}
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ width: 'min(1240px, 94%)', margin: 'auto', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', paddingTop: '20px', paddingBottom: '60px' }}>
        {!authenticated ? (
          /* Login Card */
          <section style={{ width: '100%', maxWidth: '480px', margin: '50px auto 0', background: '#fff', border: '1px solid #dfe7f1', borderRadius: '20px', boxShadow: '0 10px 28px rgba(6,40,95,.07)', padding: '36px 32px' }}>
            <div style={{ width: 48, height: 48, borderRadius: '12px', background: '#eaf2ff', color: '#1765E8', display: 'grid', placeItems: 'center', marginBottom: 16 }}>
              <ShieldCheck size={26} />
            </div>
            <h2 style={{ color: '#061A3F', fontSize: '1.55rem', fontWeight: 900, margin: '0 0 6px', letterSpacing: '-0.02em' }}>Admin Login</h2>
            <p style={{ color: '#6f7d91', fontSize: '0.86rem', margin: '0 0 20px', lineHeight: '1.5' }}>
              Enter the private <strong>ADMIN_TOKEN</strong> configured in Cloudflare to open the controls.
            </p>
            
            {msg.text && (
              <div style={{ background: '#fff0f0', color: '#c63f45', border: '1px solid #f1cfd1', padding: '10px 14px', borderRadius: '10px', fontSize: '0.84rem', marginBottom: '16px' }}>
                {msg.text}
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div className="field" style={{ marginBottom: '16px' }}>
                <label>ADMIN TOKEN</label>
                <input 
                  type="password" 
                  placeholder="••••••••••••" 
                  value={token} 
                  onChange={(e) => setToken(e.target.value)} 
                  required
                />
              </div>
              <button 
                type="submit" 
                disabled={loading}
                style={{ width: '100%', padding: '13px 24px', background: '#1765E8', color: '#fff', border: 0, borderRadius: '12px', fontWeight: 850, fontSize: '0.92rem', cursor: 'pointer' }}
              >
                {loading ? 'Opening Admin Panel...' : 'Open Admin Panel'}
              </button>
            </form>
          </section>
        ) : (
          /* Authenticated Dashboard */
          <div>
            {/* Top Navigation Tabs matching screenshot */}
            <div className="tabs" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
              {[
                { id: 'registrations', label: 'Registrations' },
                { id: 'content', label: 'Website Control' },
                { id: 'controls', label: 'Backend Controls' },
                { id: 'gallery', label: 'Gallery / Photos' },
                { id: 'system', label: 'System / Email' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '10px',
                    border: '1px solid #dfe7f1',
                    fontWeight: 850,
                    fontSize: '0.86rem',
                    cursor: 'pointer',
                    background: activeTab === tab.id ? '#061A3F' : '#fff',
                    color: activeTab === tab.id ? '#fff' : '#17325f',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                    transition: '0.15s ease'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* TAB 1: REGISTRATIONS */}
            {activeTab === 'registrations' && (
              <div>
                {/* Metric Summary Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '16px' }}>
                  <div style={{ background: '#fff', border: '1px solid #dfe7f1', borderRadius: '14px', padding: '14px 18px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>Total Registrations</span>
                    <div style={{ fontSize: '1.6rem', fontWeight: 950, color: '#061A3F', marginTop: 4 }}>{counts.total}</div>
                  </div>
                  <div style={{ background: '#fff', border: '1px solid #dfe7f1', borderRadius: '14px', padding: '14px 18px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>Teachers</span>
                    <div style={{ fontSize: '1.6rem', fontWeight: 950, color: '#1765E8', marginTop: 4 }}>{counts.teachers}</div>
                  </div>
                  <div style={{ background: '#fff', border: '1px solid #dfe7f1', borderRadius: '14px', padding: '14px 18px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>Students</span>
                    <div style={{ fontSize: '1.6rem', fontWeight: 950, color: '#0F766E', marginTop: 4 }}>{counts.students}</div>
                  </div>
                  <div style={{ background: '#fff', border: '1px solid #dfe7f1', borderRadius: '14px', padding: '14px 18px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>Approved</span>
                    <div style={{ fontSize: '1.6rem', fontWeight: 950, color: '#16A34A', marginTop: 4 }}>{counts.approved}</div>
                  </div>
                </div>

                <div className="card" style={{ background: '#fff', border: '1px solid #dfe7f1', borderRadius: '16px', padding: '16px 20px', marginBottom: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                    <select value={filterType} onChange={(e) => setFilterType(e.target.value)} style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid #cfdbe8', fontWeight: 700, color: '#17233a' }}>
                      <option value="">All Registration Types</option>
                      <option value="teacher">Teachers ({counts.teachers})</option>
                      <option value="student">Students ({counts.students})</option>
                    </select>

                    <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid #cfdbe8', fontWeight: 700, color: '#17233a' }}>
                      <option value="">All Approval Status</option>
                      <option value="PENDING">PENDING</option>
                      <option value="APPROVED">APPROVED ({counts.approved})</option>
                      <option value="REJECTED">REJECTED</option>
                      <option value="CORRECTION_REQUIRED">CORRECTION_REQUIRED</option>
                    </select>

                    <input 
                      type="text" 
                      placeholder="Search by ID, name, phone, or email..." 
                      value={searchQuery} 
                      onChange={(e) => setSearchQuery(e.target.value)} 
                      style={{ padding: '10px 14px', borderRadius: '10px', border: '1px solid #cfdbe8', gridColumn: 'span 2' }}
                    />
                  </div>
                </div>

                <div className="card table" style={{ background: '#fff', border: '1px solid #dfe7f1', borderRadius: '16px', padding: '0', overflowX: 'auto', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', borderBottom: '1px solid #edf1f6', color: '#64748B', fontWeight: 800 }}>
                        <th style={{ padding: '14px 16px' }}>Registration ID</th>
                        <th style={{ padding: '14px 12px' }}>Type</th>
                        <th style={{ padding: '14px 16px' }}>Applicant Name</th>
                        <th style={{ padding: '14px 14px' }}>Contact Phone</th>
                        <th style={{ padding: '14px 12px' }}>Status</th>
                        <th style={{ padding: '14px 12px' }}>Payment</th>
                        <th style={{ padding: '14px 16px', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan="7" style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>
                            <RefreshCw size={24} className="spin" style={{ margin: 'auto', display: 'block', marginBottom: 8 }} />
                            Fetching records from database...
                          </td>
                        </tr>
                      ) : filteredRows.length === 0 ? (
                        <tr>
                          <td colSpan="7" style={{ padding: '40px', textAlign: 'center', color: '#6f7d91' }}>
                            No registration records match your filter criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredRows.map((r, idx) => (
                          <tr key={idx} style={{ borderBottom: '1px solid #edf1f6', background: idx % 2 === 0 ? '#fff' : '#fafcff' }}>
                            <td style={{ padding: '12px 16px', fontWeight: 900, color: '#1765E8' }}>{r.id}</td>
                            <td style={{ padding: '12px 12px' }}>
                              <span style={{ 
                                background: r.type === 'teacher' ? '#EEF2FF' : '#ECFDF5', 
                                color: r.type === 'teacher' ? '#4F46E5' : '#047857', 
                                padding: '4px 10px', 
                                borderRadius: '99px', 
                                fontSize: '11px', 
                                fontWeight: 900, 
                                textTransform: 'uppercase' 
                              }}>
                                {r.type || 'student'}
                              </span>
                            </td>
                            <td style={{ padding: '12px 16px', fontWeight: 800, color: '#0F172A' }}>
                              {r.name || r.studentName || '—'}
                              {r.email && <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 500 }}>{r.email}</div>}
                            </td>
                            <td style={{ padding: '12px 14px' }}>
                              <a href={`tel:${r.phone}`} style={{ color: '#1765E8', textDecoration: 'none', fontWeight: 700 }}>{r.phone || '—'}</a>
                            </td>
                            <td style={{ padding: '12px 12px' }}>
                              <span style={{ 
                                padding: '4px 10px', 
                                borderRadius: '99px', 
                                fontSize: '11px', 
                                fontWeight: 900, 
                                background: r.status === 'APPROVED' ? '#DEF7EC' : r.status === 'REJECTED' ? '#FDE8E8' : '#FEF3C7', 
                                color: r.status === 'APPROVED' ? '#03543F' : r.status === 'REJECTED' ? '#9B1C1C' : '#92400E' 
                              }}>
                                {r.status || 'PENDING'}
                              </span>
                            </td>
                            <td style={{ padding: '12px 12px' }}>
                              <span style={{ fontSize: '11px', fontWeight: 800, color: (r.payment_status || r.paymentStatus) === 'PAID' ? '#16A34A' : '#64748B' }}>
                                {r.payment_status || r.paymentStatus || 'PENDING'}
                              </span>
                            </td>
                            <td style={{ padding: '12px 16px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                              <button 
                                onClick={() => handleViewDetail(r.id)}
                                style={{ background: '#f1f5f9', color: '#1e293b', border: 0, padding: '6px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 850, marginRight: '6px', cursor: 'pointer' }}
                              >
                                View Details
                              </button>
                              <button 
                                onClick={() => handleUpdateStatus(r.id, 'APPROVED')} 
                                disabled={updatingId === r.id || r.status === 'APPROVED'}
                                style={{ 
                                  background: r.status === 'APPROVED' ? '#E2E8F0' : '#16A34A', 
                                  color: r.status === 'APPROVED' ? '#94A3B8' : '#fff', 
                                  border: 0, 
                                  padding: '6px 12px', 
                                  borderRadius: '8px', 
                                  fontSize: '11px', 
                                  fontWeight: 850, 
                                  marginRight: '6px', 
                                  cursor: r.status === 'APPROVED' ? 'default' : 'pointer' 
                                }}
                              >
                                Approve
                              </button>
                              <button 
                                onClick={() => handleUpdateStatus(r.id, 'REJECTED')} 
                                disabled={updatingId === r.id || r.status === 'REJECTED'}
                                style={{ 
                                  background: r.status === 'REJECTED' ? '#E2E8F0' : '#DC2626', 
                                  color: r.status === 'REJECTED' ? '#94A3B8' : '#fff', 
                                  border: 0, 
                                  padding: '6px 12px', 
                                  borderRadius: '8px', 
                                  fontSize: '11px', 
                                  fontWeight: 850, 
                                  cursor: r.status === 'REJECTED' ? 'default' : 'pointer' 
                                }}
                              >
                                Reject
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 2: WEBSITE CONTROL (Exact match to live production site) */}
            {activeTab === 'content' && (
              <div>
                {/* 1. Current Hero */}
                <div className="card" style={{ background: '#fff', border: '1px solid #dfe7f1', borderRadius: '16px', boxShadow: '0 10px 28px rgba(6,40,95,.07)', padding: '16px', marginBottom: '14px' }}>
                  <h3 className="section-title">Current Hero</h3>
                  <p className="hint">These defaults match the current production frontend. Saving here updates the live site without editing HTML.</p>
                  <div className="three">
                    <div className="field">
                      <label>Hero kicker</label>
                      <input value={settings.hero?.kicker || ''} onChange={e => updateNested('hero', 'kicker', e.target.value)} />
                    </div>
                    <div className="field">
                      <label>Hero title — first line</label>
                      <input value={settings.hero?.title1 || ''} onChange={e => updateNested('hero', 'title1', e.target.value)} />
                    </div>
                    <div className="field">
                      <label>Hero title — second line</label>
                      <input value={settings.hero?.title2 || ''} onChange={e => updateNested('hero', 'title2', e.target.value)} />
                    </div>
                    <div className="field">
                      <label>Hero city</label>
                      <input value={settings.hero?.city || ''} onChange={e => updateNested('hero', 'city', e.target.value)} />
                    </div>
                    <div className="field">
                      <label>Hero solution line</label>
                      <input value={settings.hero?.solution || ''} onChange={e => updateNested('hero', 'solution', e.target.value)} />
                    </div>
                    <div className="field">
                      <label>Hero description</label>
                      <input value={settings.hero?.sub || ''} onChange={e => updateNested('hero', 'sub', e.target.value)} />
                    </div>
                    <div className="field">
                      <label>Hero chip 1</label>
                      <input value={settings.hero?.chip1 || ''} onChange={e => updateNested('hero', 'chip1', e.target.value)} />
                    </div>
                    <div className="field">
                      <label>Hero chip 2</label>
                      <input value={settings.hero?.chip2 || ''} onChange={e => updateNested('hero', 'chip2', e.target.value)} />
                    </div>
                    <div className="field">
                      <label>Hero chip 3</label>
                      <input value={settings.hero?.chip3 || ''} onChange={e => updateNested('hero', 'chip3', e.target.value)} />
                    </div>
                  </div>
                </div>

                {/* 2. Trust / Social Proof */}
                <div className="card" style={{ background: '#fff', border: '1px solid #dfe7f1', borderRadius: '16px', boxShadow: '0 10px 28px rgba(6,40,95,.07)', padding: '16px', marginBottom: '14px' }}>
                  <h3 className="section-title">Trust / Social Proof</h3>
                  <div className="three">
                    <div className="field">
                      <label>Trust heading</label>
                      <input value={settings.trust?.kicker || ''} onChange={e => updateNested('trust', 'kicker', e.target.value)} />
                    </div>
                    <div className="field">
                      <label>Trusted since year</label>
                      <input value={settings.trust?.sinceYear || ''} onChange={e => updateNested('trust', 'sinceYear', e.target.value)} />
                    </div>
                    <div className="field">
                      <label>Since card title</label>
                      <input value={settings.trust?.sinceTitle || ''} onChange={e => updateNested('trust', 'sinceTitle', e.target.value)} />
                    </div>
                    <div className="field">
                      <label>Teacher count</label>
                      <input inputMode="numeric" value={settings.trust?.teacherCount || ''} onChange={e => updateNested('trust', 'teacherCount', e.target.value)} />
                    </div>
                    <div className="field">
                      <label>Families count</label>
                      <input inputMode="numeric" value={settings.trust?.familyCount || ''} onChange={e => updateNested('trust', 'familyCount', e.target.value)} />
                    </div>
                    <div className="field">
                      <label>Google rating</label>
                      <input value={settings.trust?.googleRating || ''} onChange={e => updateNested('trust', 'googleRating', e.target.value)} />
                    </div>
                    <div className="field">
                      <label>Google review line</label>
                      <input value={settings.trust?.googleText || ''} onChange={e => updateNested('trust', 'googleText', e.target.value)} />
                    </div>
                    <div className="field">
                      <label>Justdial rating</label>
                      <input value={settings.trust?.justdialRating || ''} onChange={e => updateNested('trust', 'justdialRating', e.target.value)} />
                    </div>
                    <div className="field">
                      <label>Justdial review line</label>
                      <input value={settings.trust?.justdialText || ''} onChange={e => updateNested('trust', 'justdialText', e.target.value)} />
                    </div>
                  </div>
                  <div className="two">
                    <div className="field">
                      <label>Since card description</label>
                      <textarea value={settings.trust?.sinceText || ''} onChange={e => updateNested('trust', 'sinceText', e.target.value)} />
                    </div>
                    <div>
                      <div className="field">
                        <label>Teacher card text</label>
                        <input value={settings.trust?.teacherText || ''} onChange={e => updateNested('trust', 'teacherText', e.target.value)} />
                      </div>
                      <div className="field">
                        <label>Families card text</label>
                        <input value={settings.trust?.familyText || ''} onChange={e => updateNested('trust', 'familyText', e.target.value)} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Registration Sections */}
                <div className="card" style={{ background: '#fff', border: '1px solid #dfe7f1', borderRadius: '16px', boxShadow: '0 10px 28px rgba(6,40,95,.07)', padding: '16px', marginBottom: '14px' }}>
                  <h3 className="section-title">Registration Sections</h3>
                  <div className="two">
                    <div>
                      <div className="field">
                        <label>Student kicker</label>
                        <input value={settings.student?.kicker || ''} onChange={e => updateNested('student', 'kicker', e.target.value)} />
                      </div>
                      <div className="field">
                        <label>Student title</label>
                        <input value={settings.student?.title || ''} onChange={e => updateNested('student', 'title', e.target.value)} />
                      </div>
                      <div className="field">
                        <label>Student description</label>
                        <textarea value={settings.student?.text || ''} onChange={e => updateNested('student', 'text', e.target.value)} />
                      </div>
                      <div className="field">
                        <label>Student button</label>
                        <input value={settings.student?.button || ''} onChange={e => updateNested('student', 'button', e.target.value)} />
                      </div>
                    </div>
                    <div>
                      <div className="field">
                        <label>Tutor kicker</label>
                        <input value={settings.tutor?.kicker || ''} onChange={e => updateNested('tutor', 'kicker', e.target.value)} />
                      </div>
                      <div className="field">
                        <label>Tutor title</label>
                        <input value={settings.tutor?.title || ''} onChange={e => updateNested('tutor', 'title', e.target.value)} />
                      </div>
                      <div className="field">
                        <label>Tutor description</label>
                        <textarea value={settings.tutor?.text || ''} onChange={e => updateNested('tutor', 'text', e.target.value)} />
                      </div>
                      <div className="field">
                        <label>Tutor button</label>
                        <input value={settings.tutor?.button || ''} onChange={e => updateNested('tutor', 'button', e.target.value)} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. Fees, Quick Enquiry & How It Works */}
                <div className="card" style={{ background: '#fff', border: '1px solid #dfe7f1', borderRadius: '16px', boxShadow: '0 10px 28px rgba(6,40,95,.07)', padding: '16px', marginBottom: '14px' }}>
                  <h3 className="section-title">Fees, Quick Enquiry & How It Works</h3>
                  <div className="three">
                    <div className="field">
                      <label>Fees kicker</label>
                      <input value={settings.feesSection?.kicker || ''} onChange={e => updateNested('feesSection', 'kicker', e.target.value)} />
                    </div>
                    <div className="field">
                      <label>Fees title</label>
                      <input value={settings.feesSection?.title || ''} onChange={e => updateNested('feesSection', 'title', e.target.value)} />
                    </div>
                    <div className="field">
                      <label>Fees note badge</label>
                      <input value={settings.feesSection?.noteBadge || ''} onChange={e => updateNested('feesSection', 'noteBadge', e.target.value)} />
                    </div>
                  </div>
                  <div className="field">
                    <label>Fees note</label>
                    <input value={settings.feesSection?.noteText || ''} onChange={e => updateNested('feesSection', 'noteText', e.target.value)} />
                  </div>
                  <hr style={{ border: 0, borderTop: '1px solid #dfe7f1', margin: '15px 0' }} />
                  <div className="three">
                    <div className="field">
                      <label>Enquiry kicker</label>
                      <input value={settings.contactSection?.kicker || ''} onChange={e => updateNested('contactSection', 'kicker', e.target.value)} />
                    </div>
                    <div className="field">
                      <label>Enquiry title</label>
                      <input value={settings.contactSection?.title || ''} onChange={e => updateNested('contactSection', 'title', e.target.value)} />
                    </div>
                    <div className="field">
                      <label>Enquiry button</label>
                      <input value={settings.contactSection?.button || ''} onChange={e => updateNested('contactSection', 'button', e.target.value)} />
                    </div>
                  </div>
                  <div className="field">
                    <label>Enquiry description</label>
                    <input value={settings.contactSection?.text || ''} onChange={e => updateNested('contactSection', 'text', e.target.value)} />
                  </div>
                  <div className="three">
                    <div className="field">
                      <label>How it works kicker</label>
                      <input value={settings.howSection?.kicker || ''} onChange={e => updateNested('howSection', 'kicker', e.target.value)} />
                    </div>
                    <div className="field">
                      <label>How it works title</label>
                      <input value={settings.howSection?.title || ''} onChange={e => updateNested('howSection', 'title', e.target.value)} />
                    </div>
                    <div className="field">
                      <label>How it works description</label>
                      <input value={settings.howSection?.text || ''} onChange={e => updateNested('howSection', 'text', e.target.value)} />
                    </div>
                  </div>
                </div>

                {/* 5. Feedback, Founder & FAQ */}
                <div className="card" style={{ background: '#fff', border: '1px solid #dfe7f1', borderRadius: '16px', boxShadow: '0 10px 28px rgba(6,40,95,.07)', padding: '16px', marginBottom: '14px' }}>
                  <h3 className="section-title">Feedback, Founder & FAQ</h3>
                  <div className="two">
                    <div>
                      <div className="field">
                        <label>Feedback kicker</label>
                        <input value={settings.feedbackSection?.kicker || ''} onChange={e => updateNested('feedbackSection', 'kicker', e.target.value)} />
                      </div>
                      <div className="field">
                        <label>Feedback title</label>
                        <input value={settings.feedbackSection?.title || ''} onChange={e => updateNested('feedbackSection', 'title', e.target.value)} />
                      </div>
                    </div>
                    <div>
                      <div className="field">
                        <label>Founder role</label>
                        <input value={settings.founder?.role || ''} onChange={e => updateNested('founder', 'role', e.target.value)} />
                      </div>
                      <div className="field">
                        <label>Founder brand</label>
                        <input value={settings.founder?.brand || ''} onChange={e => updateNested('founder', 'brand', e.target.value)} />
                      </div>
                    </div>
                  </div>
                  <div className="field">
                    <label>Founder quote</label>
                    <textarea rows={4} value={settings.founder?.quote || ''} onChange={e => updateNested('founder', 'quote', e.target.value)} />
                  </div>
                  <div className="three">
                    <div className="field">
                      <label>FAQ kicker</label>
                      <input value={settings.faqSection?.kicker || ''} onChange={e => updateNested('faqSection', 'kicker', e.target.value)} />
                    </div>
                    <div className="field">
                      <label>FAQ title</label>
                      <input value={settings.faqSection?.title || ''} onChange={e => updateNested('faqSection', 'title', e.target.value)} />
                    </div>
                    <div className="field">
                      <label>FAQ intro</label>
                      <input value={settings.faqSection?.intro || ''} onChange={e => updateNested('faqSection', 'intro', e.target.value)} />
                    </div>
                  </div>
                </div>

                {/* 6. Business Contact & Footer */}
                <div className="card" style={{ background: '#fff', border: '1px solid #dfe7f1', borderRadius: '16px', boxShadow: '0 10px 28px rgba(6,40,95,.07)', padding: '16px', marginBottom: '14px' }}>
                  <h3 className="section-title">Business Contact & Footer</h3>
                  <div className="three">
                    <div className="field">
                      <label>Phone / WhatsApp</label>
                      <input value={settings.contact?.phone || ''} onChange={e => updateNested('contact', 'phone', e.target.value)} />
                    </div>
                    <div className="field">
                      <label>Official website contact email</label>
                      <input value={settings.contact?.email || ''} onChange={e => updateNested('contact', 'email', e.target.value)} />
                    </div>
                    <div className="field">
                      <label>Footer tagline</label>
                      <input value={settings.footer?.tagline || ''} onChange={e => updateNested('footer', 'tagline', e.target.value)} />
                    </div>
                  </div>
                  <div className="field">
                    <label>Footer services — one per line</label>
                    <textarea rows={4} value={servicesText} onChange={e => setServicesText(e.target.value)} />
                  </div>
                </div>

                {/* 7. Social Links & Theme */}
                <div className="card" style={{ background: '#fff', border: '1px solid #dfe7f1', borderRadius: '16px', boxShadow: '0 10px 28px rgba(6,40,95,.07)', padding: '16px', marginBottom: '14px' }}>
                  <h3 className="section-title">Social Links & Theme</h3>
                  <div className="three">
                    <div className="field">
                      <label>Instagram URL</label>
                      <input value={settings.social?.instagram || ''} onChange={e => updateNested('social', 'instagram', e.target.value)} />
                    </div>
                    <div className="field">
                      <label>YouTube URL</label>
                      <input value={settings.social?.youtube || ''} onChange={e => updateNested('social', 'youtube', e.target.value)} />
                    </div>
                    <div className="field">
                      <label>Facebook URL</label>
                      <input value={settings.social?.facebook || ''} onChange={e => updateNested('social', 'facebook', e.target.value)} />
                    </div>
                    <div className="field">
                      <label>X URL</label>
                      <input value={settings.social?.x || ''} onChange={e => updateNested('social', 'x', e.target.value)} />
                    </div>
                    <div className="field">
                      <label>LinkedIn URL</label>
                      <input value={settings.social?.linkedin || ''} onChange={e => updateNested('social', 'linkedin', e.target.value)} />
                    </div>
                    <div className="field">
                      <label>Threads URL</label>
                      <input value={settings.social?.threads || ''} onChange={e => updateNested('social', 'threads', e.target.value)} />
                    </div>
                    <div className="field">
                      <label>Navy</label>
                      <input type="color" value={settings.theme?.navy || '#061A3F'} onChange={e => updateNested('theme', 'navy', e.target.value)} />
                    </div>
                    <div className="field">
                      <label>Gold</label>
                      <input type="color" value={settings.theme?.gold || '#F7C63D'} onChange={e => updateNested('theme', 'gold', e.target.value)} />
                    </div>
                    <div className="field">
                      <label>Blue</label>
                      <input type="color" value={settings.theme?.blue || '#1765E8'} onChange={e => updateNested('theme', 'blue', e.target.value)} />
                    </div>
                  </div>
                </div>

                {/* 8. SEO, Notice, Extra Fees/Areas & Feedback Items */}
                <div className="card" style={{ background: '#fff', border: '1px solid #dfe7f1', borderRadius: '16px', boxShadow: '0 10px 28px rgba(6,40,95,.07)', padding: '16px', marginBottom: '14px' }}>
                  <h3 className="section-title">SEO, Notice, Extra Fees/Areas & Feedback Items</h3>
                  <div className="field">
                    <label>Homepage title</label>
                    <input value={settings.seo?.homeTitle || ''} onChange={e => updateNested('seo', 'homeTitle', e.target.value)} />
                  </div>
                  <div className="field">
                    <label>Homepage meta description</label>
                    <textarea value={settings.seo?.homeDescription || ''} onChange={e => updateNested('seo', 'homeDescription', e.target.value)} />
                  </div>
                  <div className="field">
                    <label>Gorakhpur landing page title</label>
                    <input value={settings.seo?.landingTitle || ''} onChange={e => updateNested('seo', 'landingTitle', e.target.value)} />
                  </div>
                  <div className="field">
                    <label>Landing page meta description</label>
                    <textarea value={settings.seo?.landingDescription || ''} onChange={e => updateNested('seo', 'landingDescription', e.target.value)} />
                  </div>
                  <label className="switch" style={{ margin: '10px 0 12px' }}>
                    <input 
                      type="checkbox" 
                      checked={!!settings.notice?.enabled} 
                      onChange={e => updateNested('notice', 'enabled', e.target.checked)} 
                    />
                    Show notice / offer strip
                  </label>
                  <div className="field" style={{ marginTop: '10px' }}>
                    <label>Notice / Offer text</label>
                    <input value={settings.notice?.text || ''} onChange={e => updateNested('notice', 'text', e.target.value)} />
                  </div>
                  <div className="two">
                    <div className="field">
                      <label>Additional fee updates — one line per item</label>
                      <textarea rows={6} value={feesText} onChange={e => setFeesText(e.target.value)} />
                    </div>
                    <div className="field">
                      <label>Additional service areas — one per line</label>
                      <textarea rows={6} value={areasText} onChange={e => setAreasText(e.target.value)} />
                    </div>
                  </div>
                  <div className="field">
                    <label>Feedback — one per line: Name | Role/Area | Feedback</label>
                    <textarea rows={7} value={feedbackText} onChange={e => setFeedbackText(e.target.value)} />
                  </div>
                  <p className="hint">Canonical domain, database code, ADMIN_TOKEN and API secrets remain protected in Cloudflare so they cannot be accidentally exposed from the browser.</p>
                </div>

                {/* Sticky Savebar matching live site */}
                <div className="savebar">
                  <span style={{ marginRight: 'auto', fontSize: '11px', fontWeight: 700, color: contentMsg.includes('Error') ? '#c63f45' : '#17815a' }}>
                    {contentMsg}
                  </span>
                  <button type="button" className="btn light" onClick={handleLoadDefaults}>
                    Load Current Website Defaults
                  </button>
                  <button type="button" className="btn light" onClick={handleResetSaved}>
                    Reset from Saved
                  </button>
                  <button type="button" className="btn primary" disabled={savingContent} onClick={() => handleSaveContent(false)}>
                    {savingContent ? 'Saving...' : 'Save Website Changes'}
                  </button>
                </div>
              </div>
            )}

            {/* TAB 3: BACKEND CONTROLS */}
            {activeTab === 'controls' && (
              <div>
                <div className="card" style={{ background: '#fff', border: '1px solid #dfe7f1', borderRadius: '16px', boxShadow: '0 10px 28px rgba(6,40,95,.07)', padding: '16px', marginBottom: '14px' }}>
                  <h3 className="section-title">Frontend Section Visibility</h3>
                  <p className="hint">Turn a section off without deleting its content. You can turn it back on anytime.</p>
                  <div className="three">
                    {[
                      { key: 'trust', label: 'Trust / statistics' },
                      { key: 'tutor', label: 'Tutor registration section' },
                      { key: 'student', label: 'Student registration section' },
                      { key: 'fees', label: 'Fees section' },
                      { key: 'contact', label: 'Quick enquiry section' },
                      { key: 'how', label: 'How it works' },
                      { key: 'feedback', label: 'Feedback' },
                      { key: 'founder', label: 'Founder vision' },
                      { key: 'faq', label: 'FAQ' },
                      { key: 'gallery', label: 'Admin gallery' },
                    ].map(item => (
                      <label key={item.key} className="switch">
                        <input 
                          type="checkbox" 
                          checked={settings.visibility?.[item.key] !== false} 
                          onChange={e => updateNested('visibility', item.key, e.target.checked)} 
                        />
                        {item.label}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="card" style={{ background: '#fff', border: '1px solid #dfe7f1', borderRadius: '16px', boxShadow: '0 10px 28px rgba(6,40,95,.07)', padding: '16px', marginBottom: '14px' }}>
                  <h3 className="section-title">Registration Payment Control</h3>
                  <p className="hint">Change registration/payment amounts here. Saved values update the Teacher and Student registration forms automatically.</p>
                  <div className="two">
                    <div className="field">
                      <label>Teacher Registration Fee (₹)</label>
                      <input 
                        type="number" 
                        min="0" 
                        step="1" 
                        placeholder="500" 
                        value={settings.payments?.teacherRegistrationFee ?? '500'} 
                        onChange={e => updateNested('payments', 'teacherRegistrationFee', e.target.value)} 
                      />
                    </div>
                    <div className="field">
                      <label>Student Default Advance Amount (₹, optional)</label>
                      <input 
                        type="number" 
                        min="0" 
                        step="1" 
                        placeholder="Leave blank for student-entered amount" 
                        value={settings.payments?.studentDefaultAdvanceAmount ?? ''} 
                        onChange={e => updateNested('payments', 'studentDefaultAdvanceAmount', e.target.value)} 
                      />
                    </div>
                  </div>
                </div>

                <div className="card" style={{ background: '#fff', border: '1px solid #dfe7f1', borderRadius: '16px', boxShadow: '0 10px 28px rgba(6,40,95,.07)', padding: '16px', marginBottom: '14px' }}>
                  <h3 className="section-title">Backend / Registration Controls</h3>
                  <p className="hint">These switches are enforced by the Worker backend, not just visually hidden on the frontend.</p>
                  <div className="two">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <label className="switch">
                        <input 
                          type="checkbox" 
                          checked={settings.operations?.teacherRegistrationEnabled !== false} 
                          onChange={e => updateNested('operations', 'teacherRegistrationEnabled', e.target.checked)} 
                        />
                        Accept Teacher registrations
                      </label>
                      <label className="switch">
                        <input 
                          type="checkbox" 
                          checked={settings.operations?.studentRegistrationEnabled !== false} 
                          onChange={e => updateNested('operations', 'studentRegistrationEnabled', e.target.checked)} 
                        />
                        Accept Student registrations
                      </label>
                      <label className="switch">
                        <input 
                          type="checkbox" 
                          checked={settings.operations?.quickEnquiryEnabled !== false} 
                          onChange={e => updateNested('operations', 'quickEnquiryEnabled', e.target.checked)} 
                        />
                        Accept Quick Enquiry submissions
                      </label>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <label className="switch">
                        <input 
                          type="checkbox" 
                          checked={settings.operations?.registrationEmailsEnabled !== false} 
                          onChange={e => updateNested('operations', 'registrationEmailsEnabled', e.target.checked)} 
                        />
                        Automatic registration + payment emails
                      </label>
                      <label className="switch">
                        <input 
                          type="checkbox" 
                          checked={settings.operations?.statusEmailsEnabled !== false} 
                          onChange={e => updateNested('operations', 'statusEmailsEnabled', e.target.checked)} 
                        />
                        Automatic status-change emails
                      </label>
                      <label className="switch">
                        <input 
                          type="checkbox" 
                          checked={settings.operations?.autoCardEmailOnApproval !== false} 
                          onChange={e => updateNested('operations', 'autoCardEmailOnApproval', e.target.checked)} 
                        />
                        Auto-email digital card on new approval
                      </label>
                    </div>
                  </div>
                </div>

                <div className="card" style={{ background: '#fff', border: '1px solid #dfe7f1', borderRadius: '16px', boxShadow: '0 10px 28px rgba(6,40,95,.07)', padding: '16px', marginBottom: '14px' }}>
                  <h3 className="section-title">Protected Backend Architecture</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                    <div style={{ border: '1px solid #dfe7f1', borderRadius: '14px', padding: '13px', background: '#fafcff' }}>
                      <span style={{ display: 'block', fontSize: '10px', color: '#6f7d91', fontWeight: 850, textTransform: 'uppercase', letterSpacing: '.06em' }}>Database</span>
                      <b style={{ display: 'block', marginTop: 5, fontSize: '13px', color: '#17815a' }}>Durable Object • SQLite</b>
                    </div>
                    <div style={{ border: '1px solid #dfe7f1', borderRadius: '14px', padding: '13px', background: '#fafcff' }}>
                      <span style={{ display: 'block', fontSize: '10px', color: '#6f7d91', fontWeight: 850, textTransform: 'uppercase', letterSpacing: '.06em' }}>Registration IDs</span>
                      <b style={{ display: 'block', marginTop: 5, fontSize: '13px', color: '#17815a' }}>Sequential • Teacher + Student</b>
                    </div>
                    <div style={{ border: '1px solid #dfe7f1', borderRadius: '14px', padding: '13px', background: '#fafcff' }}>
                      <span style={{ display: 'block', fontSize: '10px', color: '#6f7d91', fontWeight: 850, textTransform: 'uppercase', letterSpacing: '.06em' }}>Files</span>
                      <b style={{ display: 'block', marginTop: 5, fontSize: '13px', color: '#17815a' }}>Registration 5 MB • Gallery 10 MB validation</b>
                    </div>
                    <div style={{ border: '1px solid #dfe7f1', borderRadius: '14px', padding: '13px', background: '#fafcff' }}>
                      <span style={{ display: 'block', fontSize: '10px', color: '#6f7d91', fontWeight: 850, textTransform: 'uppercase', letterSpacing: '.06em' }}>Secrets</span>
                      <b style={{ display: 'block', marginTop: 5, fontSize: '13px', color: '#061A3F' }}>ADMIN_TOKEN + RESEND_API_KEY stay protected</b>
                    </div>
                  </div>
                  <p className="hint" style={{ marginTop: '12px' }}>Raw Worker source and secret values are intentionally not editable inside the public browser Admin Panel.</p>
                </div>

                <div className="savebar">
                  <span style={{ marginRight: 'auto', fontSize: '11px', fontWeight: 700, color: controlMsg.includes('Error') ? '#c63f45' : '#17815a' }}>
                    {controlMsg}
                  </span>
                  <button type="button" className="btn primary" disabled={savingContent} onClick={() => handleSaveContent(true)}>
                    {savingContent ? 'Saving...' : 'Save Controls'}
                  </button>
                </div>
              </div>
            )}

            {/* TAB 4: GALLERY / PHOTOS */}
            {activeTab === 'gallery' && (
              <div>
                <div className="card" style={{ background: '#fff', border: '1px solid #dfe7f1', borderRadius: '16px', boxShadow: '0 10px 28px rgba(6,40,95,.07)', padding: '16px', marginBottom: '14px' }}>
                  <h3 className="section-title">Upload Student / Website Photo</h3>
                  <p className="hint">Use JPG/PNG/WebP, up to 10 MB. Published photos appear automatically in the website gallery.</p>
                  <form onSubmit={handleUploadMedia}>
                    <div className="three">
                      <div className="field">
                        <label>Photo</label>
                        <input type="file" accept="image/*" onChange={e => setMFile(e.target.files?.[0] || null)} />
                      </div>
                      <div className="field">
                        <label>Title / Student name</label>
                        <input value={mTitle} onChange={e => setMTitle(e.target.value)} />
                      </div>
                      <div className="field">
                        <label>Order</label>
                        <input type="number" value={mOrder} onChange={e => setMOrder(e.target.value)} />
                      </div>
                    </div>
                    <div className="two">
                      <div className="field">
                        <label>Caption</label>
                        <input value={mCaption} onChange={e => setMCaption(e.target.value)} />
                      </div>
                      <div className="field">
                        <label>Image alt text</label>
                        <input value={mAlt} onChange={e => setMAlt(e.target.value)} />
                      </div>
                    </div>
                    <label className="switch" style={{ margin: '8px 0 14px' }}>
                      <input type="checkbox" checked={mPublished} onChange={e => setMPublished(e.target.checked)} />
                      Publish immediately
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <button type="submit" className="btn primary" style={{ background: '#1765E8', color: '#fff', border: 0, padding: '10px 16px', borderRadius: '10px', fontWeight: 850, cursor: 'pointer' }}>
                        Upload Photo
                      </button>
                      {mediaMsg && <span style={{ fontSize: '11px', color: '#6f7d91' }}>{mediaMsg}</span>}
                    </div>
                  </form>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
                  {mediaLoading ? (
                    <div style={{ padding: '30px', textAlign: 'center', color: '#6f7d91', gridColumn: '1/-1' }}>Loading gallery photos...</div>
                  ) : mediaItems.length === 0 ? (
                    <div className="card" style={{ padding: '24px', textAlign: 'center', color: '#6f7d91', gridColumn: '1/-1' }}>
                      No gallery photos uploaded yet. Upload a student photo above to display it on the website.
                    </div>
                  ) : (
                    mediaItems.map(item => (
                      <article key={item.id} style={{ border: '1px solid #dfe7f1', borderRadius: '14px', overflow: 'hidden', background: '#fff' }}>
                        <img 
                          src={item.url} 
                          alt={item.altText || item.title || 'Photo'} 
                          style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', display: 'block', background: '#eef3f8' }} 
                        />
                        <div style={{ padding: '12px' }}>
                          <h4 style={{ margin: '0 0 5px', fontSize: '13px', fontWeight: 850, color: '#061A3F' }}>{item.title || 'Photo'}</h4>
                          <p style={{ margin: '0 0 9px', color: '#6f7d91', fontSize: '11px', lineHeight: 1.4 }}>{item.caption || 'No caption'}</p>
                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            <button 
                              onClick={() => handleToggleMedia(item.id, item.published, item.sortOrder, item.title, item.caption, item.altText)}
                              style={{ background: '#fff', color: '#061A3F', border: '1px solid #dfe7f1', padding: '6px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 800, cursor: 'pointer' }}
                            >
                              {item.published ? 'Unpublish' : 'Publish'}
                            </button>
                            <button 
                              onClick={() => handleDeleteMedia(item.id)}
                              style={{ background: '#fff0f0', color: '#a83239', border: '1px solid #f1cfd1', padding: '6px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 800, cursor: 'pointer' }}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </article>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB 5: SYSTEM / EMAIL */}
            {activeTab === 'system' && (
              <div>
                <div className="card" style={{ background: '#fff', border: '1px solid #dfe7f1', borderRadius: '16px', boxShadow: '0 10px 28px rgba(6,40,95,.07)', padding: '16px', marginBottom: '14px' }}>
                  <h3 className="section-title">Email & Digital Card System</h3>
                  <p className="hint">Email uses Resend through the Cloudflare Worker. The admin inbox and Reply-To use your active business Gmail; sender remains your verified domain address.</p>
                  
                  {systemInfo ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
                      <div style={{ border: '1px solid #dfe7f1', borderRadius: '14px', padding: '13px', background: '#fafcff' }}>
                        <span style={{ display: 'block', fontSize: '10px', color: '#6f7d91', fontWeight: 850, textTransform: 'uppercase', letterSpacing: '.06em' }}>Email Provider</span>
                        <b style={{ display: 'block', marginTop: 5, fontSize: '13px' }}>{systemInfo.emailProvider || 'Resend'}</b>
                      </div>
                      <div style={{ border: '1px solid #dfe7f1', borderRadius: '14px', padding: '13px', background: '#fafcff' }}>
                        <span style={{ display: 'block', fontSize: '10px', color: '#6f7d91', fontWeight: 850, textTransform: 'uppercase', letterSpacing: '.06em' }}>Email Status</span>
                        <b style={{ display: 'block', marginTop: 5, fontSize: '13px', color: systemInfo.emailConfigured ? '#17815a' : '#c63f45' }}>
                          {systemInfo.emailConfigured ? 'Configured & Ready' : 'RESEND_API_KEY not set'}
                        </b>
                      </div>
                      <div style={{ border: '1px solid #dfe7f1', borderRadius: '14px', padding: '13px', background: '#fafcff' }}>
                        <span style={{ display: 'block', fontSize: '10px', color: '#6f7d91', fontWeight: 850, textTransform: 'uppercase', letterSpacing: '.06em' }}>Admin Inbox</span>
                        <b style={{ display: 'block', marginTop: 5, fontSize: '13px' }}>{systemInfo.adminEmail || 'vishuhometuition.gkp@gmail.com'}</b>
                      </div>
                      <div style={{ border: '1px solid #dfe7f1', borderRadius: '14px', padding: '13px', background: '#fafcff' }}>
                        <span style={{ display: 'block', fontSize: '10px', color: '#6f7d91', fontWeight: 850, textTransform: 'uppercase', letterSpacing: '.06em' }}>Live Site URL</span>
                        <b style={{ display: 'block', marginTop: 5, fontSize: '13px', color: '#1765E8' }}>{systemInfo.siteUrl || 'https://vishuhometuition.in'}</b>
                      </div>
                    </div>
                  ) : (
                    <div style={{ padding: '20px 0', color: '#6f7d91' }}>Loading system diagnostic information...</div>
                  )}

                  <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button 
                      onClick={handleSendTestEmail}
                      disabled={systemTesting}
                      style={{ background: '#1765E8', color: '#fff', border: 0, padding: '10px 18px', borderRadius: '10px', fontWeight: 850, fontSize: '0.85rem', cursor: 'pointer' }}
                    >
                      {systemTesting ? 'Sending Test Email...' : 'Send Test Email'}
                    </button>
                    {systemMsg && <span style={{ fontSize: '11px', fontWeight: 700, color: systemMsg.startsWith('✓') ? '#17815a' : '#c63f45' }}>{systemMsg}</span>}
                  </div>
                </div>

                <div className="card" style={{ background: '#fff', border: '1px solid #dfe7f1', borderRadius: '16px', boxShadow: '0 10px 28px rgba(6,40,95,.07)', padding: '16px' }}>
                  <h3 className="section-title">Digital Card Workflow</h3>
                  <p className="hint">Approve a Teacher/Student registration → card is generated with an auto-fit rectangular photo → verification QR stays active → automatic email is sent when Resend is configured and Auto-email is enabled.</p>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Registration Detail Modal */}
      {selectedReg && (
        <div 
          style={{ position: 'fixed', inset: 0, background: 'rgba(6,26,63,0.65)', backdropFilter: 'blur(3px)', zIndex: 1000, display: 'grid', placeItems: 'center', padding: '16px' }}
          onClick={() => setSelectedReg(null)}
        >
          <div 
            style={{ background: '#fff', width: 'min(720px, 96%)', maxHeight: '90vh', overflowY: 'auto', borderRadius: '20px', padding: '28px', boxShadow: '0 20px 40px rgba(0,0,0,0.25)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px', marginBottom: '20px' }}>
              <div>
                <span style={{ background: '#EEF2FF', color: '#4F46E5', padding: '4px 10px', borderRadius: '99px', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase' }}>
                  {selectedReg.type || 'Registration'}
                </span>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 950, color: '#061A3F', margin: '8px 0 2px' }}>
                  {selectedReg.id} • {selectedReg.name || selectedReg.studentName}
                </h2>
                <span style={{ fontSize: '0.82rem', color: '#64748B' }}>
                  Registered on: {new Date(selectedReg.createdAt || selectedReg.created_at || Date.now()).toLocaleString()}
                </span>
              </div>
              <button 
                onClick={() => setSelectedReg(null)}
                style={{ background: '#f1f5f9', border: 0, borderRadius: '50%', width: 36, height: 36, display: 'grid', placeItems: 'center', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '20px' }}>
              <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '10px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748B', display: 'block' }}>PHONE NUMBER</span>
                <a href={`tel:${selectedReg.phone}`} style={{ fontSize: '1rem', fontWeight: 850, color: '#1765E8', textDecoration: 'none' }}>
                  {selectedReg.phone || '—'}
                </a>
              </div>
              <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '10px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748B', display: 'block' }}>EMAIL ADDRESS</span>
                <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#061A3F' }}>
                  {selectedReg.email || '—'}
                </span>
              </div>
              <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '10px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748B', display: 'block' }}>APPROVAL STATUS</span>
                <span style={{ fontSize: '0.95rem', fontWeight: 900, color: selectedReg.status === 'APPROVED' ? '#16A34A' : '#D97706' }}>
                  {selectedReg.status || 'PENDING'}
                </span>
              </div>
              <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '10px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748B', display: 'block' }}>PAYMENT STATUS</span>
                <span style={{ fontSize: '0.95rem', fontWeight: 900, color: '#061A3F' }}>
                  {selectedReg.paymentStatus || selectedReg.payment_status || 'PENDING'}
                </span>
              </div>
            </div>

            {/* Application Payload */}
            {selectedReg.payload && Object.keys(selectedReg.payload).length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 900, color: '#061A3F', marginBottom: '10px' }}>Application Details</h4>
                <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '14px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                  {Object.entries(selectedReg.payload)
                    .filter(([k, v]) => ['string', 'number', 'boolean'].includes(typeof v))
                    .map(([k, v]) => (
                      <div key={k} style={{ borderBottom: '1px solid #edf2f7', paddingBottom: '6px' }}>
                        <span style={{ fontSize: '0.75rem', color: '#64748B', textTransform: 'capitalize' }}>{k.replace(/([A-Z])/g, ' $1')}: </span>
                        <strong style={{ fontSize: '0.85rem', color: '#1e293b', display: 'block' }}>{String(v)}</strong>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Note */}
            {selectedReg.note && (
              <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', padding: '12px 14px', borderRadius: '10px', marginBottom: '20px', color: '#92400e', fontSize: '0.85rem' }}>
                <strong>Admin Note:</strong> {selectedReg.note}
              </div>
            )}

            {/* Modal Actions */}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
              <button 
                onClick={() => handleUpdateStatus(selectedReg.id, 'APPROVED')}
                disabled={selectedReg.status === 'APPROVED'}
                style={{ background: '#16A34A', color: '#fff', border: 0, padding: '10px 18px', borderRadius: '10px', fontWeight: 850, fontSize: '0.85rem', cursor: 'pointer' }}
              >
                Approve Registration
              </button>
              <button 
                onClick={() => handleUpdateStatus(selectedReg.id, 'REJECTED')}
                disabled={selectedReg.status === 'REJECTED'}
                style={{ background: '#DC2626', color: '#fff', border: 0, padding: '10px 18px', borderRadius: '10px', fontWeight: 850, fontSize: '0.85rem', cursor: 'pointer' }}
              >
                Reject Registration
              </button>
              <button 
                onClick={() => setSelectedReg(null)}
                style={{ background: '#f1f5f9', color: '#475569', border: 0, padding: '10px 18px', borderRadius: '10px', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
