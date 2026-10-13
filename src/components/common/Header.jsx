import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Header({ onOpenStatusModal }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isHomeActive = location.pathname === '/';

  return (
    <header className="vht-header2026" id="vhtHeader">
      <div className="vht-header-shell">
        <Link 
          to="/" 
          aria-label="VISHU HOME TUITION Gorakhpur - Home" 
          className="vht-header-brand vht-exact-brand"
        >
          <img 
            alt="VISHU HOME TUITION Gorakhpur" 
            className="vht-exact-logo" 
            decoding="sync" 
            fetchPriority="high" 
            height="561" 
            src="/assets/vht-5d5f2f20daa3bbd4.png" 
            width="1428"
          />
        </Link>
        <nav aria-label="Primary navigation" className="vht-header-nav">
          <Link className={isHomeActive ? "active" : ""} to="/">Home</Link>
          <a href="#why">About Us</a>
          <a href="#fees">Fees</a>
          <a href="#founder">Founder</a>
          <Link to="/tutor-registration">Become a Tutor</Link>
          <Link to="/quick-enquiry">Contact</Link>
        </nav>
        <Link aria-label="Get a Tutor" className="vht-header-cta" to="/quick-enquiry">
          Get a Tutor <span aria-hidden="true">→</span>
        </Link>
        <button 
          aria-controls="vhtMobileNav" 
          aria-expanded={mobileMenuOpen ? "true" : "false"} 
          aria-label="Open navigation menu" 
          className="vht-menu-btn" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
          type="button"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path d="M4 6h16M4 12h16M4 18h16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"></path>
          </svg>
        </button>
      </div>
      <nav aria-label="Mobile navigation" className={`vht-mobile-nav2026 ${mobileMenuOpen ? 'open' : ''}`} id="vhtMobileNav">
        <Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
        <a href="#why" onClick={() => setMobileMenuOpen(false)}>About Us</a>
        <a href="#fees" onClick={() => setMobileMenuOpen(false)}>Fees</a>
        <a href="#founder" onClick={() => setMobileMenuOpen(false)}>Founder</a>
        <Link to="/tutor-registration" onClick={() => setMobileMenuOpen(false)}>Become a Tutor</Link>
        <Link to="/quick-enquiry" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
        <Link to="/quick-enquiry" onClick={() => setMobileMenuOpen(false)}>Get a Tutor →</Link>
      </nav>
    </header>
  );
}

