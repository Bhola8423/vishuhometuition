import React from 'react';
import { ShieldCheck, UserCheck, Clock, DollarSign, BookOpen, ThumbsUp } from 'lucide-react';

export default function WhyChooseUsSection() {
  const features = [
    {
      icon: <ShieldCheck size={32} color="#1765E8" />,
      title: "100% Background Verified Tutors",
      desc: "Every tutor undergoes identity verification, qualification checks, and reference confirmation before assignment."
    },
    {
      icon: <UserCheck size={32} color="#F7C63D" />,
      title: "Male & Female Tutor Options",
      desc: "Choose experienced male or female tutors according to student comfort and family preference."
    },
    {
      icon: <Clock size={32} color="#25D366" />,
      title: "Flexible Timings at Home",
      desc: "No travel stress! Convenient morning or evening home tuition slots tailored around school hours."
    },
    {
      icon: <BookOpen size={32} color="#1765E8" />,
      title: "CBSE, ICSE & State Boards",
      desc: "Specialised tutors trained in current school curricula, exam patterns, and conceptual clarity."
    },
    {
      icon: <DollarSign size={32} color="#F7C63D" />,
      title: "Transparent & Affordable Fees",
      desc: "Clear monthly fee structures based on class level and subjects with no hidden agency charges."
    },
    {
      icon: <ThumbsUp size={32} color="#25D366" />,
      title: "Free Demo Class Guaranteed",
      desc: "Attend a free trial class to assess tutor compatibility and teaching style before final enrollment."
    }
  ];

  return (
    <section className="section soft">
      <div className="container">
        <div className="section-head">
          <span className="mini-badge">Why Parents Trust Us</span>
          <h2>The VISHU HOME TUITION Advantage</h2>
          <p>We connect your child with dedicated tutors who inspire confidence and academic excellence.</p>
        </div>

        <div className="grid-3">
          {features.map((item, idx) => (
            <div className="card" key={idx}>
              <div style={{ marginBottom: 16 }}>{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
