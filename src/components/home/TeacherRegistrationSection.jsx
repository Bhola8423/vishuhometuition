import React from 'react';
import { Link } from 'react-router-dom';

export default function TeacherRegistrationSection() {
  return (
    <section className="tutor-section" id="tutor">
      <div className="container tutor-grid">
        <div className="tutor-copy reveal show">
          <span className="tutor-mini">TEACHER REGISTRATION</span>
          <h2>BECOME A TEACHER</h2>
          <p>Join our tutor community and connect with suitable teaching opportunities according to your subject, class preference, location, availability and teaching experience.</p>
          <Link 
            className="tutor-btn registration-cta vht-emerald-btn" 
            data-vht-register="teacher" 
            to="/tutor-registration"
          >
            <span className="cta-label vht-emerald-text">Register as a Teacher</span>
            <span className="vht-emerald-arrow" aria-hidden="true">›</span>
          </Link>
        </div>
        <div className="group-visual reveal show">
          <div className="group-blob"></div>
          <div aria-hidden="true" className="group-halo"></div>
          <img 
            alt="VISHU HOME TUITION professional tutor community" 
            className="group-img" 
            decoding="async" 
            loading="lazy" 
            src="/assets/optimized-inline/home-bc0b0e3286e857ef.png"
          />
        </div>
      </div>
    </section>
  );
}
