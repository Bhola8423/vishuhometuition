import React, { useState, useEffect } from 'react';
import './HowItWorksSection.css';

export default function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-cycle through the 3 steps smoothly when not hovered
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 3);
    }, 2800);
    return () => clearInterval(interval);
  }, [isHovered]);

  return (
    <section className="section soft" id="how-it-works">
      <div className="container">
        <div className="section-head reveal show">
          <span className="mini">Simple • Fast • Effective</span>
          <h2>HOW IT WORKS</h2>
          <p>Three simple steps from requirement to personalised learning.</p>
        </div>
        <div
          className="process"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <article
            className={`step reveal show ${activeStep === 0 ? 'is-active-step' : ''}`}
            onClick={() => setActiveStep(0)}
            onMouseEnter={() => setActiveStep(0)}
          >
            <div className="step-circle">
              <span className="step-num">01</span>
              <svg fill="none" viewBox="0 0 64 64">
                <rect height="40" rx="5" stroke="#1765E8" strokeWidth="3" width="32" x="16" y="12"></rect>
                <path d="M25 21h14M25 29h14M25 37h10" stroke="#1765E8" strokeLinecap="round" strokeWidth="3"></path>
                <path d="M25 10h14v7H25z" fill="#F7C63D"></path>
              </svg>
            </div>
            <h3>Share Your Requirement</h3>
            <p>Class, subject, board, area and timing.</p>
          </article>

          <article
            className={`step reveal show ${activeStep === 1 ? 'is-active-step' : ''}`}
            onClick={() => setActiveStep(1)}
            onMouseEnter={() => setActiveStep(1)}
          >
            <div className="step-circle">
              <span className="step-num">02</span>
              <svg fill="none" viewBox="0 0 64 64">
                <circle cx="32" cy="28" r="10" stroke="#1765E8" strokeWidth="3"></circle>
                <circle cx="17" cy="30" r="5" stroke="#1765E8" strokeWidth="2.5"></circle>
                <circle cx="47" cy="30" r="5" stroke="#1765E8" strokeWidth="2.5"></circle>
                <path d="M20 49c1-8 5-12 12-12s11 4 12 12" stroke="#1765E8" strokeLinecap="round" strokeWidth="2.8"></path>
                <circle cx="32" cy="28" r="14" stroke="#F7C63D" strokeWidth="3"></circle>
              </svg>
            </div>
            <h3>Get Suitable Tutor Options</h3>
            <p>We match available tutors to your need.</p>
          </article>

          <article
            className={`step reveal show ${activeStep === 2 ? 'is-active-step' : ''}`}
            onClick={() => setActiveStep(2)}
            onMouseEnter={() => setActiveStep(2)}
          >
            <div className="step-circle">
              <span className="step-num">03</span>
              <svg fill="none" viewBox="0 0 64 64">
                <path d="m12 24 20-10 20 10-20 10-20-10Z" fill="#061E49"></path>
                <path d="M20 31v10c8 5 16 5 24 0V31" stroke="#1765E8" strokeWidth="3"></path>
                <path d="M17 46h30M20 51h24" stroke="#F7C63D" strokeLinecap="round" strokeWidth="3"></path>
              </svg>
            </div>
            <h3>Start Personalised Learning</h3>
            <p>Connect, finalise and begin tuition.</p>
          </article>
        </div>
      </div>
    </section>
  );
}
