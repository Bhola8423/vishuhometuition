import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          <div className="footer-inline footer-services">
            <h4 style={{ display: 'inline-block', marginRight: '12px' }}>OUR SERVICES</h4>
            <ul style={{ display: 'inline-flex', gap: '8px', listStyle: 'none', padding: 0 }}>
              <li><Link className="footer-seo-link" to="/home-tuition-gorakhpur">Home Tuition</Link></li>
              <li>•</li>
              <li>Online Tuition</li>
              <li>•</li>
              <li>Subject Experts</li>
              <li>•</li>
              <li>Nursery to 12th</li>
            </ul>
          </div>
        </div>

        <div aria-label="VISHU HOME TUITION official social profiles" className="footer-socials footer-socials-final footer-socials-brand">
          <nav aria-label="Vishu Home Tuition social media" className="vishu-social-strip vishu-social-strip-final">
            <a aria-label="Instagram" className="vishu-social-icon vishu-instagram" href="https://www.instagram.com/VishuHomeTuitionGorakhpur/" rel="noopener noreferrer" target="_blank" title="Instagram">
              <img alt="Instagram" height="22" loading="lazy" src="https://cdn.simpleicons.org/instagram/FFFFFF" width="22"/>
            </a>
            <a aria-label="YouTube" className="vishu-social-icon vishu-youtube" href="https://www.youtube.com/@VishuHomeTuitionGorakhpur" rel="noopener noreferrer" target="_blank" title="YouTube">
              <img alt="YouTube" height="22" loading="lazy" src="https://cdn.simpleicons.org/youtube/FFFFFF" width="22"/>
            </a>
            <a aria-label="Facebook" className="vishu-social-icon vishu-facebook" href="https://www.facebook.com/VishuHomeTuitionGorakhpur/" rel="noopener noreferrer" target="_blank" title="Facebook">
              <img alt="Facebook" height="22" loading="lazy" src="https://cdn.simpleicons.org/facebook/FFFFFF" width="22"/>
            </a>
            <a aria-label="X" className="vishu-social-icon vishu-x" href="https://x.com/VishuHomeTution" rel="noopener noreferrer" target="_blank" title="X">
              <img alt="X" height="22" loading="lazy" src="https://cdn.simpleicons.org/x/FFFFFF" width="22"/>
            </a>
            <a aria-label="Threads" className="vishu-social-icon vishu-threads" href="https://www.threads.com/@VishuHomeTuitionGorakhpur" rel="noopener noreferrer" target="_blank" title="Threads">
              <img alt="Threads" height="22" loading="lazy" src="https://cdn.simpleicons.org/threads/FFFFFF" width="22"/>
            </a>
            <a aria-label="LinkedIn" className="vishu-linkedin vishu-linkedin-final" href="https://www.linkedin.com/in/vishu-home-tuition-gorakhpur-1a71b2424" rel="noopener noreferrer" target="_blank" title="LinkedIn">
              <span aria-hidden="true" className="vishu-linkedin__mark">
                <svg focusable="false" role="img" viewBox="0 0 24 24" width="20" height="20"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" fill="currentColor"></path></svg>
              </span>
            </a>
          </nav>
        </div>

        <div className="footer-bottom">
          <span className="footer-copyright">© {new Date().getFullYear()} VISHU HOME TUITION. All Rights Reserved.</span>
          <span className="footer-center">
            <span className="footer-legal">
              <button type="button" style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>Privacy</button> • <button type="button" style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>Terms</button>
            </span>
          </span>
          <span className="footer-registration">Udyam Reg. No.: UDYAM-UP-32-0104757</span>
        </div>
      </div>
    </footer>
  );
}

