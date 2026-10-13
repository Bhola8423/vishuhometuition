import React from 'react';
import { BookMarked, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ClassesBoardSection() {
  const levels = [
    {
      grade: "Nursery - Class 5th",
      badge: "Primary Foundation",
      subjects: "All Subjects, Handwriting, Reading, Phonics, Basic Maths",
      desc: "Gentle 1-on-1 tutoring to build strong basics, homework support, and study habits early on."
    },
    {
      grade: "Class 6th - 8th",
      badge: "Middle School",
      subjects: "Maths, Science, English, SST, Hindi, Computer",
      desc: "Conceptual understanding in Science & Mathematics to prepare for higher secondary challenges."
    },
    {
      grade: "Class 9th & 10th",
      badge: "Board Exam Special",
      subjects: "Physics, Chemistry, Biology, Mathematics, English, Social Science",
      desc: "Rigorous board exam preparation, sample paper solving, time management, and mock test series."
    },
    {
      grade: "Class 11th & 12th",
      badge: "Senior Secondary",
      subjects: "Physics, Chemistry, Maths (PCM), Biology (PCB), Accountancy, Economics",
      desc: "Deep subject expertise for school exams and foundation preparation for competitive exams."
    }
  ];

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <span className="mini-badge">Classes & Curriculum</span>
          <h2>Tuition Covered Across All Classes</h2>
          <p>Tailored home tuition for CBSE, ICSE, and UP Board curricula in Gorakhpur.</p>
        </div>

        <div className="grid-2">
          {levels.map((item, idx) => (
            <div className="card" key={idx} style={{ position: 'relative', overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ background: '#FFF4C9', color: '#7B5900', border: '1px solid #F8D865', padding: '4px 10px', borderRadius: '999px', fontSize: '0.74rem', fontWeight: 900 }}>
                  {item.badge}
                </span>
                <BookMarked size={22} color="#1765E8" />
              </div>

              <h3 style={{ fontSize: '1.3rem', color: '#061E49', marginBottom: 8 }}>
                {item.grade}
              </h3>
              
              <p style={{ color: '#1765E8', fontWeight: 800, fontSize: '0.86rem', marginBottom: 8 }}>
                Subjects: {item.subjects}
              </p>

              <p style={{ fontSize: '0.9rem', color: '#6B778D', marginBottom: 16 }}>
                {item.desc}
              </p>

              <Link to="/student-registration" style={{ color: '#061E49', fontWeight: 900, fontSize: '0.86rem', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                Request Tutor for {item.grade} →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
