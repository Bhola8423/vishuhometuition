import React from 'react';
import { Award, Users, GraduationCap, Star } from 'lucide-react';

export default function StatsSection() {
  const stats = [
    { icon: <Award size={28} color="#F7C63D" />, num: "7+ Years", label: "Serving Gorakhpur Since 2017" },
    { icon: <GraduationCap size={28} color="#1765E8" />, num: "2,500+", label: "Happy Students & Parents" },
    { icon: <Users size={28} color="#25D366" />, num: "1,200+", label: "Verified Tutors Registered" },
    { icon: <Star size={28} color="#F7C63D" />, num: "4.9 / 5", label: "Highest Rated Local Network" }
  ];

  return (
    <section className="section soft">
      <div className="container">
        <div className="grid-4">
          {stats.map((item, idx) => (
            <div className="card" key={idx} style={{ textAlign: 'center', padding: '24px 16px' }}>
              <div style={{ display: 'inline-grid', placeItems: 'center', width: 56, height: 56, borderRadius: '50%', background: '#FFF4C9', marginBottom: 14 }}>
                {item.icon}
              </div>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 950, color: '#061E49', marginBottom: 4 }}>
                {item.num}
              </h3>
              <p style={{ color: '#6B778D', fontSize: '0.88rem', fontWeight: 700 }}>
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
