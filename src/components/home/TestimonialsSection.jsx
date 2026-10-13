import React, { useState } from 'react';

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      badge: "PARENT FEEDBACK",
      quote: "We liked that our child's weak subjects were discussed first. The tutor option felt suitable.",
      topic: "Better Understanding",
      author: "Neha Singh • Parent, Mohaddipur"
    },
    {
      badge: "PARENT FEEDBACK",
      quote: "The tutor matching process feels simple, clear and easy to coordinate.",
      topic: "Easy Tutor Matching",
      author: "Ritu Singh • Parent, Betiahata"
    },
    {
      badge: "STUDENT FEEDBACK",
      quote: "Physics concepts became crystal clear. The tutor explained complex numericals step-by-step.",
      topic: "Conceptual Clarity",
      author: "Aditya Rai • Student, Golghar"
    },
    {
      badge: "PARENT FEEDBACK",
      quote: "Punctual, polite and very encouraging female tutor for my Class 4 ICSE daughter.",
      topic: "Dedicated Tutors",
      author: "Sunita Pandey • Parent, Taramandal"
    }
  ];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const current = testimonials[currentIndex];

  return (
    <section className="feedback-section" id="feedback">
      <div className="container">
        <div className="section-head reveal show">
          <span className="mini">Experience Highlights</span>
          <h2>PARENTS, STUDENTS &amp; TEACHERS SAY</h2>
        </div>
        <div className="feedback-stage reveal show" id="feedbackStage">
          <button 
            aria-label="Previous feedback" 
            className="feedback-arrow prev" 
            onClick={handlePrev} 
            type="button"
          >
            ‹
          </button>
          <div className="feedback-card">
            <div className="quote-mark">“</div>
            <div className="feedback-badge" id="feedbackBadge">{current.badge}</div>
            <p id="feedbackQuote">"{current.quote}"</p>
            <div className="feedback-topic" id="feedbackTopic">{current.topic}</div>
            <div className="feedback-author" id="feedbackAuthor">{current.author}</div>
            <div aria-hidden="true" className="feedback-dots" id="feedbackDots">
              {testimonials.map((_, idx) => (
                <span 
                  key={idx} 
                  className={`feedback-dot ${idx === currentIndex ? 'active' : ''}`}
                  onClick={() => setCurrentIndex(idx)}
                  style={{ cursor: 'pointer' }}
                ></span>
              ))}
            </div>
          </div>
          <button 
            aria-label="Next feedback" 
            className="feedback-arrow next" 
            onClick={handleNext} 
            type="button"
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
}

