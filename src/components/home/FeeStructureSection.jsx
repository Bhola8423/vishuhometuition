import React, { useRef, useState, useEffect, useCallback } from 'react';
import './FeeStructureSection.css';

const feeCards = [
  { src: "/assets/vht-82e322c0d6c8ef92.jpg", alt: "Nursery, LKG & UKG home tuition fees - VISHU HOME TUITION", label: "Nursery - UKG" },
  { src: "/assets/vht-b81e838bb19cd4de.jpg", alt: "1st, 2nd & 3rd home tuition fees - VISHU HOME TUITION", label: "1st - 3rd" },
  { src: "/assets/vht-5d210af036a79d67.jpg", alt: "4th & 5th home tuition fees - VISHU HOME TUITION", label: "4th - 5th" },
  { src: "/assets/vht-853bad776413780e.jpg", alt: "6th, 7th & 8th home tuition fees - VISHU HOME TUITION", label: "6th - 8th" },
  { src: "/assets/vht-c0ef9563153a4271.jpg", alt: "9th & 10th home tuition fees - VISHU HOME TUITION", label: "9th - 10th" },
  { src: "/assets/vht-83062222d496da6b.jpg", alt: "11th & 12th home tuition fees - VISHU HOME TUITION", label: "11th - 12th" }
];

export default function FeeStructureSection() {
  const sliderRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const scrollToCard = useCallback((index) => {
    if (sliderRef.current) {
      const container = sliderRef.current;
      const cards = container.querySelectorAll('.fee-card');
      if (cards[index]) {
        cards[index].scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
        setActiveIndex(index);
      }
    }
  }, []);

  const scroll = (direction) => {
    const nextIndex = (activeIndex + direction + feeCards.length) % feeCards.length;
    scrollToCard(nextIndex);
  };

  // Auto-slide every 3.5 seconds when not hovered/paused
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % feeCards.length;
        scrollToCard(next);
        return next;
      });
    }, 3500);
    return () => clearInterval(interval);
  }, [isPaused, scrollToCard]);

  // Update active dot on user manual scroll/swipe
  const handleScroll = () => {
    if (!sliderRef.current) return;
    const container = sliderRef.current;
    const scrollCenter = container.scrollLeft + container.clientWidth / 2;
    const cards = container.querySelectorAll('.fee-card');
    let closestIndex = 0;
    let minDistance = Infinity;

    cards.forEach((card, idx) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const dist = Math.abs(scrollCenter - cardCenter);
      if (dist < minDistance) {
        minDistance = dist;
        closestIndex = idx;
      }
    });

    setActiveIndex(closestIndex);
  };

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

        <div
          className="fees-shell reveal show"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          <button
            aria-label="Previous Fee Structure"
            className="slider-btn prev"
            onClick={() => scroll(-1)}
            type="button"
          >
            ‹
          </button>

          <div
            className="fee-slider fee-slider-rect"
            id="feeSlider"
            ref={sliderRef}
            onScroll={handleScroll}
          >
            {feeCards.map((card, idx) => (
              <article
                className={`fee-card ${activeIndex === idx ? 'is-active' : ''}`}
                data-fee-index={idx}
                key={idx}
                onClick={() => scrollToCard(idx)}
              >
                <img
                  alt={card.alt}
                  decoding="async"
                  height="864"
                  loading="lazy"
                  src={card.src}
                  width="1536"
                />
              </article>
            ))}
          </div>

          <button
            aria-label="Next Fee Structure"
            className="slider-btn next"
            onClick={() => scroll(1)}
            type="button"
          >
            ›
          </button>
        </div>

        <div className="fee-dots" role="tablist" aria-label="Fee Card Pagination">
          {feeCards.map((card, idx) => (
            <button
              key={idx}
              type="button"
              className={activeIndex === idx ? 'active' : ''}
              onClick={() => scrollToCard(idx)}
              aria-label={`Go to ${card.label}`}
              aria-selected={activeIndex === idx}
              role="tab"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
