import React from 'react';

export default function FAQSection() {
  const faqs = [
    {
      q: "Which classes do you provide home tuition for?",
      a: "VISHU HOME TUITION supports students from Nursery, LKG and UKG through Class 12th."
    },
    {
      q: "Which boards are supported?",
      a: "Tuition support is available for CBSE, ICSE and State Board students, including UP Board requirements."
    },
    {
      q: "How do I request a home tutor in Gorakhpur?",
      a: "You can use the quick WhatsApp enquiry form or complete the Student Registration form for a detailed tuition requirement."
    },
    {
      q: "Do you provide subject-specific tutors?",
      a: "Yes. Tutor matching can be based on class, board, subject, area and preferred timing."
    },
    {
      q: "How can a teacher register with VISHU HOME TUITION?",
      a: "Teachers can use the “Register as a Teacher” button on this website to open the official tutor registration form."
    },
    {
      q: "Where do you provide tuition services?",
      a: "The service is focused on Gorakhpur city and nearby areas, with tutor availability depending on the student’s location and requirement."
    },
    {
      q: "Can I request a female home tutor?",
      a: "You can mention a preference for a female tutor in your requirement. Matching depends on suitable tutor availability in your area, subject and preferred timing."
    },
    {
      q: "What if the first tutor option is not suitable?",
      a: "Share your concern with VISHU HOME TUITION so the requirement can be reviewed again and other suitable available options can be considered."
    },
    {
      q: "Do you provide online tuition as well?",
      a: "Yes. You can share whether you prefer home tuition or online tuition. Suitable options depend on the class, subject and tutor availability."
    },
    {
      q: "How are tuition fees decided?",
      a: "Fees can vary according to class, subjects, board, tutor experience, location and tutor availability. The displayed fee section should be treated as an indicative reference."
    },
    {
      q: "Can I request one tutor for multiple subjects?",
      a: "Yes. You can mention all required subjects in your enquiry. Matching depends on the student’s class, subject combination and suitable tutor availability."
    },
    {
      q: "How soon can I get a tutor?",
      a: "There is no fixed matching time because availability depends on the requirement, subject, location and preferred timing. After you share the requirement, suitable available options can be coordinated."
    }
  ];

  return (
    <section className="seo-faq" id="faq">
      <div className="container">
        <div className="section-head reveal show">
          <span className="mini">Helpful Information • Quick Answers</span>
          <h2>HOME TUITION FAQs</h2>
          <p>Quick Answers About VISHU HOME TUITION in Gorakhpur.</p>
        </div>
        <div className="faq-grid reveal show">
          {faqs.map((item, idx) => (
            <details key={idx}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

