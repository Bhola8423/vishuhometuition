import React from 'react';

export default function TrustStatsSection() {
  return (
    <section className="why-wrap trusted-highlights" id="why">
      <div className="container">
        <div className="section-head reveal show trusted-center-head">
          <span className="trust-kicker">TRUSTED IN GORAKHPUR</span>
        </div>
        <div className="why-grid trusted-stat-grid">
          <article className="why-card reveal show stat-why-card since-highlight-card">
            <div className="icon trust-icon">
              <svg fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8"></circle>
                <path d="M12 7v5l3.2 2" stroke="currentColor" strokeLinecap="round" strokeWidth="1.9"></path>
                <path d="M7 3.8 5.5 2.5M17 3.8l1.5-1.3" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8"></path>
              </svg>
            </div>
            <div className="stat-number since-number">Trusted Since <span>2017</span></div>
            <h3>Serving Across Gorakhpur</h3>
            <p>Years of consistent work in education, mentorship and tutor support for local families.</p>
          </article>

          <article className="why-card reveal show stat-why-card">
            <div className="icon trust-icon">
              <svg fill="none" viewBox="0 0 24 24">
                <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.8"></circle>
                <circle cx="16.5" cy="9" r="2.2" stroke="currentColor" strokeWidth="1.7"></circle>
                <path d="M3.5 20c.6-4.6 2.6-6.8 5.8-6.8s5.3 2.2 5.9 6.8M14.2 14.8c3.4-.6 5.5 1.1 6.3 5.2" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8"></path>
              </svg>
            </div>
            <div className="stat-number"><span className="countup" data-target="3800">3,800</span><b>+</b></div>
            <h3>Teacher Community</h3>
            <p>Male &amp; female tutors across multiple subjects and classes.</p>
          </article>

          <article className="why-card reveal show stat-why-card">
            <div className="icon trust-icon">
              <svg fill="none" viewBox="0 0 24 24">
                <path d="M3 11.2 12 4l9 7.2V20H3v-8.8Z" stroke="currentColor" strokeWidth="1.8"></path>
                <path d="M8 20v-5h8v5M7.2 9.6c1.2 1.2 2.6 1.8 4.8 1.8s3.6-.6 4.8-1.8" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8"></path>
              </svg>
            </div>
            <div className="stat-number"><span className="countup" data-target="8500">8,500</span><b>+</b></div>
            <h3>Families Served</h3>
            <p>Families Supported Through Home Tuition Services in Gorakhpur.</p>
          </article>

          <article className="why-card reveal show stat-why-card google-rating-card">
            <div aria-hidden="true" className="icon trust-icon rating-icon">
              <svg fill="none" viewBox="0 0 24 24"><path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z" fill="currentColor"></path></svg>
            </div>
            <div className="stat-number rating-number">5.0<span>★</span></div>
            <h3>Google Rating</h3>
            <p>995+ Public Reviews on Google.</p>
          </article>

          <article className="why-card reveal show stat-why-card justdial-rating-card">
            <div aria-hidden="true" className="icon trust-icon rating-icon">
              <svg fill="none" viewBox="0 0 24 24"><path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z" fill="currentColor"></path></svg>
            </div>
            <div className="stat-number rating-number">5.0<span>★</span></div>
            <h3>Justdial Rating</h3>
            <p>2550+ Public Reviews on Justdial.</p>
          </article>
        </div>
      </div>
    </section>
  );
}

