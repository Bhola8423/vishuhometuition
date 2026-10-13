import React from 'react';
import { Link } from 'react-router-dom';

export default function HeroSection() {
  return (
    <section className="hero" id="home">
      <div aria-hidden="true" className="hero-motion-layer">
        <span className="motion-dot d1"></span>
        <span className="motion-dot d2"></span>
        <span className="motion-dot d3"></span>
        <span className="motion-dot d4"></span>
        <span className="motion-dot d5"></span>
        <span className="motion-dot d6"></span>
        <span className="motion-star s1">✦</span>
        <span className="motion-star s2">✧</span>
        <span className="motion-star s3">✦</span>
        <span className="motion-ring mr1"></span>
        <span className="motion-ring mr2"></span>
      </div>
      <div className="container hero-grid">
        <div className="hero-copy reveal show">
          <span className="hero-kicker">🍿 Gorakhpur's No. 1 Home Tuition Platform</span>
          <h1>VISHU<span>HOME TUITION</span></h1>
          <div className="city">GORAKHPUR</div>
          <div className="solution">Your <strong>Complete Home Tuition Solution</strong> in Gorakhpur</div>
          <div className="hero-sub">Personalised learning with the right guidance for a brighter future.</div>
          <div className="hero-chips">
            <span>Nursery to 12th</span>
            <span>CBSE • ICSE</span>
            <span>State Boards</span>
          </div>
          <div className="hero-demo-action">
            <Link aria-label="Book Free Demo Class" className="vht-premium-demo-btn vht-emerald-btn" to="/quick-enquiry">
              <span className="vht-premium-label vht-emerald-text">Book Free Demo Class</span>
              <span className="vht-emerald-arrow" aria-hidden="true">›</span>
            </Link>
          </div>
        </div>
        <div className="hero-visual reveal show">
          <div className="hero-orbit"></div>
          <div className="hero-photo-card">
            <span aria-hidden="true" className="vip-ring ring-one"></span>
            <span aria-hidden="true" className="vip-ring ring-two"></span>
            <span aria-hidden="true" className="vip-spark spark-one">✦</span>
            <span aria-hidden="true" className="vip-spark spark-two">✦</span>
            <img 
              alt="VISHU HOME TUITION tutor guiding a student at home" 
              src="/assets/vht-013f58bd9c4e592d.webp"
            />
          </div>
          <div className="hero-float a">
            One-to-One Learning
            <small>Personal attention</small>
          </div>
          <div className="hero-float b">
            Better Learning
            <small>Brighter Future</small>
          </div>
        </div>
      </div>
    </section>
  );
}

