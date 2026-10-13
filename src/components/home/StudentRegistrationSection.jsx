import React from 'react';
import { Link } from 'react-router-dom';

export default function StudentRegistrationSection() {
  return (
    <section className="student-section" id="student-registration">
      <div className="container">
        <div className="student-showcase reveal show">
          <div className="student-showcase-copy">
            <span className="student-kicker">STUDENT REGISTRATION</span>
            <h2>RIGHT TUTOR FOR YOUR CHILD</h2>
            <p>Share your child’s class, subject, board, location and preferred timing. We’ll use your requirement to help connect you with a suitable home tutor in Gorakhpur.</p>
            <div className="student-register-actions">
              <Link 
                className="student-main-btn registration-cta vht-emerald-btn" 
                data-vht-register="student" 
                to="/student-registration"
              >
                <span className="cta-label vht-emerald-text">Register as a Student</span>
                <span className="vht-emerald-arrow" aria-hidden="true">›</span>
              </Link>
            </div>
          </div>
          <div className="student-group-visual">
            <div aria-hidden="true" className="student-group-orbit orbit-one"></div>
            <div aria-hidden="true" className="student-group-orbit orbit-two"></div>
            <div aria-hidden="true" className="student-group-glow"></div>
            <img 
              alt="Students from different school age groups for VISHU HOME TUITION registration" 
              className="student-group-img" 
              decoding="async" 
              loading="lazy" 
              src="/assets/optimized-inline/home-01a662b854869aca.png"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
