import React, { useRef } from 'react';

export default function FeeStructureSection() {
  const sliderRef = useRef(null);

  const scroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = 320;
      sliderRef.current.scrollBy({
        left: direction * scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const feeCards = [
    { src: "/assets/vht-82e322c0d6c8ef92.jpg", alt: "Nursery, LKG & UKG home tuition fees - VISHU HOME TUITION" },
    { src: "/assets/vht-b81e838bb19cd4de.jpg", alt: "1st, 2nd & 3rd home tuition fees - VISHU HOME TUITION" },
    { src: "/assets/vht-5d210af036a79d67.jpg", alt: "4th & 5th home tuition fees - VISHU HOME TUITION" },
    { src: "/assets/vht-853bad776413780e.jpg", alt: "6th, 7th & 8th home tuition fees - VISHU HOME TUITION" },
    { src: "/assets/vht-c0ef9563153a4271.jpg", alt: "9th & 10th home tuition fees - VISHU HOME TUITION" },
    { src: "/assets/vht-83062222d496da6b.jpg", alt: "11th & 12th home tuition fees - VISHU HOME TUITION" }
  ];

  return (
    <section className="section" id="fees">
      <div className="container">
        <div className="section-head reveal show">
          <span className="mini">Simple &amp; Transparent</span>
          <h2>TUITION FEES</h2>
          <p className="fee-variation-note">
            <span className="note-badge">PLEASE NOTE</span>
            <span>Fees may vary by subject, board, tutor availability and experience.</span>
          </p>
        </div>
        <div className="fees-shell reveal show">
          <button aria-label="Previous" className="slider-btn prev" onClick={() => scroll(-1)} type="button">‹</button>
          <div className="fee-slider fee-slider-rect" id="feeSlider" ref={sliderRef}>
            {feeCards.map((card, idx) => (
              <article className="fee-card" data-fee-index={idx} key={idx}>
                <img alt={card.alt} decoding="async" height="864" loading="lazy" src={card.src} width="1536" />
              </article>
            ))}
          </div>
          <button aria-label="Next" className="slider-btn next" onClick={() => scroll(1)} type="button">›</button>
        </div>
        <div className="fee-dots">
          <span></span><span></span><span></span><span></span><span></span><span></span>
        </div>
      </div>
    </section>
  );
}

