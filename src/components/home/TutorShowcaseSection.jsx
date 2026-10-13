import React from 'react';
import { Star, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TutorShowcaseSection() {
  const tutors = [
    { name: "Er. Alok Verma", qual: "B.Tech (NIT), 6+ Yrs Exp", subjects: "Physics & Maths (9th - 12th)", loc: "Taramandal / Golghar", rating: "4.9" },
    { name: "Priya Sharma", qual: "M.Sc Mathematics, B.Ed", subjects: "Maths & Science (6th - 10th)", loc: "Betiahata / Mohaddipur", rating: "5.0" },
    { name: "Dr. Vikas Singh", qual: "M.Sc Chemistry, Ph.D", subjects: "Chemistry & Biology (11th - 12th)", loc: "Civil Lines / Shahpur", rating: "4.8" },
    { name: "Neha Gupta", qual: "B.Sc, B.Ed (5+ Yrs Exp)", subjects: "All Subjects (Nursery - 5th)", loc: "Rapti Nagar / Basharatpur", rating: "4.9" },
    { name: "Siddharth Srivastava", qual: "M.Tech, Ex-Faculty", subjects: "Physics & Chemistry (CBSE/ICSE)", loc: "Kunraghat / Asuran", rating: "5.0" },
    { name: "Anjali Mishra", qual: "M.A English, B.Ed", subjects: "English & Social Studies", loc: "Golghar / Padri Bazar", rating: "4.9" },
  ];

  // Double array for continuous seamless looping
  const carouselItems = [...tutors, ...tutors];

  return (
    <section className="section soft" id="tutors">
      <div className="container">
        <div className="section-head">
          <span className="mini-badge">Our Registered Tutors</span>
          <h2>Verified Male & Female Tutors in Gorakhpur</h2>
          <p>Over 1,200+ qualified tutors registered across all areas of Gorakhpur.</p>
        </div>

        {/* Continuous Conveyor Carousel */}
        <div className="carousel-viewport">
          <div className="carousel-track">
            {carouselItems.map((tutor, idx) => (
              <div className="tutor-card" key={idx}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#061E49', color: '#FFF', display: 'grid', placeItems: 'center', margin: '0 auto 12px', fontWeight: 900, fontSize: '1.2rem' }}>
                  {tutor.name.charAt(0)}
                </div>
                <h4>{tutor.name}</h4>
                <p className="sub">{tutor.qual}</p>

                <div style={{ fontSize: '0.82rem', color: '#14233D', fontWeight: 800, marginBottom: 6 }}>
                  {tutor.subjects}
                </div>

                <div style={{ fontSize: '0.78rem', color: '#6B778D', marginBottom: 12 }}>
                  📍 {tutor.loc}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F5F8FD', padding: '6px 10px', borderRadius: 10 }}>
                  <span className="tutor-badge">✓ Verified</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 900, color: '#061E49', display: 'inline-flex', alignItems: 'center', gap: 2 }}>
                    <Star size={14} fill="#F7C63D" color="#F7C63D" /> {tutor.rating}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Become a Tutor Banner */}
        <div 
          style={{ 
            marginTop: '36px', 
            background: 'linear-gradient(135deg, #061E49, #0B3679)', 
            borderRadius: '24px', 
            padding: '30px', 
            color: '#fff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px'
          }}
        >
          <div>
            <span className="tutor-mini" style={{ background: '#FFF3C8', color: '#8A6600', padding: '4px 10px', borderRadius: 999, fontSize: '0.72rem', fontWeight: 900 }}>
              FOR TEACHERS & TUTORS
            </span>
            <h3 style={{ fontSize: '1.6rem', color: '#F7C63D', marginTop: '8px', fontWeight: 900 }}>
              Are You a Qualified Tutor in Gorakhpur?
            </h3>
            <p style={{ color: '#D0DCEC', fontSize: '0.92rem' }}>
              Join our network of 1,200+ tutors and get home tuition student leads near your locality.
            </p>
          </div>

          <Link to="/tutor-registration" className="nav-cta" style={{ background: '#F7C63D', color: '#061E49', fontSize: '0.92rem', padding: '12px 24px' }}>
            Register as a Tutor →
          </Link>
        </div>
      </div>
    </section>
  );
}
