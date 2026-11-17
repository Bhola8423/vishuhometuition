import React from 'react';
import './TrustStatsSection.css';

const TRUST_CARDS_DATA = [
  {
    id: 'since',
    cardClass: 'since-highlight-card',
    icon: (
      <svg fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8"></circle>
        <path d="M12 7v5l3.2 2" stroke="currentColor" strokeLinecap="round" strokeWidth="1.9"></path>
        <path d="M7 3.8 5.5 2.5M17 3.8l1.5-1.3" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8"></path>
      </svg>
    ),
    number: (
      <div className="stat-number since-number">
        Trusted Since <span>2017</span>
      </div>
    ),
    title: 'Serving Across Gorakhpur',
    text: 'Years of consistent work in education, mentorship and tutor support for local families.'
  },
  {
    id: 'tutors',
    cardClass: '',
    icon: (
      <svg fill="none" viewBox="0 0 24 24">
        <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.8"></circle>
        <circle cx="16.5" cy="9" r="2.2" stroke="currentColor" strokeWidth="1.7"></circle>
        <path d="M3.5 20c.6-4.6 2.6-6.8 5.8-6.8s5.3 2.2 5.9 6.8M14.2 14.8c3.4-.6 5.5 1.1 6.3 5.2" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8"></path>
      </svg>
    ),
    number: (
      <div className="stat-number">
        <span className="countup" data-target="3800">3,800</span><b>+</b>
      </div>
    ),
    title: 'Teacher Community',
    text: 'Male & female tutors across multiple subjects and classes.'
  },
  {
    id: 'families',
    cardClass: '',
    icon: (
      <svg fill="none" viewBox="0 0 24 24">
        <path d="M3 11.2 12 4l9 7.2V20H3v-8.8Z" stroke="currentColor" strokeWidth="1.8"></path>
        <path d="M8 20v-5h8v5M7.2 9.6c1.2 1.2 2.6 1.8 4.8 1.8s3.6-.6 4.8-1.8" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8"></path>
      </svg>
    ),
    number: (
      <div className="stat-number">
        <span className="countup" data-target="8500">8,500</span><b>+</b>
      </div>
    ),
    title: 'Families Served',
    text: 'Families Supported Through Home Tuition Services in Gorakhpur.'
  },
  {
    id: 'google',
    cardClass: 'google-rating-card',
    iconClass: 'rating-icon',
    icon: (
      <svg fill="none" viewBox="0 0 24 24">
        <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z" fill="currentColor"></path>
      </svg>
    ),
    number: (
      <div className="stat-number rating-number">
        5.0<span>★</span>
      </div>
    ),
    title: 'Google Rating',
    text: '995+ Public Reviews on Google.'
  },
  {
    id: 'justdial',
    cardClass: 'justdial-rating-card',
    iconClass: 'rating-icon',
    icon: (
      <svg fill="none" viewBox="0 0 24 24">
        <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z" fill="currentColor"></path>
      </svg>
    ),
    number: (
      <div className="stat-number rating-number">
        5.0<span>★</span>
      </div>
    ),
    title: 'Justdial Rating',
    text: '2550+ Public Reviews on Justdial.'
  }
];

// Replicate sets to ensure seamless infinite loop without blank gaps across any screen width
const SLIDER_ITEMS = [
  ...TRUST_CARDS_DATA,
  ...TRUST_CARDS_DATA,
  ...TRUST_CARDS_DATA,
  ...TRUST_CARDS_DATA
];

export default function TrustStatsSection() {
  return (
    <section className="why-wrap trusted-highlights" id="why">
      <div className="container">
        <div className="section-head reveal show trusted-center-head">
          <span className="trust-kicker">TRUSTED IN GORAKHPUR</span>
        </div>
      </div>

      <div className="trusted-slider-wrapper">
        <div className="trusted-slider-viewport" title="Hover to pause">
          <div className="trusted-slider-track">
            {SLIDER_ITEMS.map((item, index) => (
              <article
                key={`${item.id}-${index}`}
                className={`why-card reveal show stat-why-card ${item.cardClass || ''}`}
                aria-hidden={index >= TRUST_CARDS_DATA.length ? 'true' : undefined}
              >
                <div aria-hidden="true" className={`icon trust-icon ${item.iconClass || ''}`}>
                  {item.icon}
                </div>
                {item.number}
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
