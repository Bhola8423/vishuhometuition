import React from 'react';
import './TestimonialsSection.css';

const PARENT_FEEDBACKS = [
  {
    id: 1,
    name: "Dr. R. K. Srivastava",
    childInfo: "Parent of Class 10 (CBSE) Student",
    location: "Betiahata, Gorakhpur",
    topic: "Maths 94% In Pre-Boards",
    badge: "Class 10th CBSE",
    quote: "Found an exceptional Maths & Science tutor through Vishu Home Tuition. My son scored 94% in his pre-boards. Very disciplined, polite and always on time."
  },
  {
    id: 2,
    name: "Sunita Pandey",
    childInfo: "Parent of Class 4 (ICSE) Student",
    location: "Taramandal, Gorakhpur",
    topic: "Patient Female Tutor",
    badge: "Primary ICSE",
    quote: "Requested a gentle female tutor for my daughter. She made learning English grammar and Mathematics so engaging. My daughter now enjoys her studies."
  },
  {
    id: 3,
    name: "Anurag Tripathi",
    childInfo: "Parent of Class 12 (PCM) Student",
    location: "Civil Lines, Gorakhpur",
    topic: "Physics & Chemistry Clarity",
    badge: "Class 12th PCM",
    quote: "Physics and Chemistry numericals were a big worry for my daughter. The tutor assigned by Vishu Home Tuition cleared every concept from the basics. Highly recommended!"
  },
  {
    id: 4,
    name: "Pooja Jaiswal",
    childInfo: "Parent of Class 8 (CBSE) Student",
    location: "Mohaddipur, Gorakhpur",
    topic: "Remarkable Maths Progress",
    badge: "Class 8th CBSE",
    quote: "The tutor's patience with my son in Mathematics is commendable. His school teacher personally noticed the improvement within two months of joining."
  },
  {
    id: 5,
    name: "Manoj Kumar Shukla",
    childInfo: "Parent of Class 9 (UP Board) Student",
    location: "Rustampur, Gorakhpur",
    topic: "Daily Discipline & Tests",
    badge: "Class 9th UP Board",
    quote: "Best home tuition platform in Gorakhpur. The teacher arrives sharp at 5 PM, takes weekly tests and keeps us updated on my son's chapter-wise progress."
  },
  {
    id: 6,
    name: "Vandana Maurya",
    childInfo: "Parent of Class 2 Student",
    location: "Golghar, Gorakhpur",
    topic: "Handwriting & Phonics",
    badge: "Foundational Primary",
    quote: "We needed someone to build good study habits and neat handwriting. The teacher is very loving, creative and methodical with little kids."
  },
  {
    id: 7,
    name: "Er. Rajesh Verma",
    childInfo: "Parent of Class 11 (JEE Foundation)",
    location: "Kunraghat, Gorakhpur",
    topic: "Advanced Concept Clearing",
    badge: "Class 11th JEE Prep",
    quote: "Very strong concept clearing for Class 11 Physics and Maths. The tutor solves advanced numericals and keeps my son motivated for engineering exams."
  },
  {
    id: 8,
    name: "Rashmi Dubey",
    childInfo: "Parent of Class 7 (ICSE) Student",
    location: "Basharatpur, Gorakhpur",
    topic: "Fast 24-Hour Matching",
    badge: "Class 7th ICSE",
    quote: "We searched locally on our own with no luck. Vishu Home Tuition matched us with a qualified ICSE teacher in Basharatpur within 24 hours of registering."
  },
  {
    id: 9,
    name: "Sanjay Agrawal",
    childInfo: "Parent of Class 12 (Commerce)",
    location: "Bank Road / Golghar",
    topic: "Accounts & Economics",
    badge: "Class 12th Commerce",
    quote: "Accountancy and Economics tutor provided was exceptionally experienced. Clear explanations of balance sheets, journal entries and partnership firms."
  },
  {
    id: 10,
    name: "Kavita Tiwari",
    childInfo: "Parent of Class 5 Student",
    location: "Shahpur, Gorakhpur",
    topic: "Timely Syllabus Completion",
    badge: "Class 5th Primary",
    quote: "Very dedicated teacher. Completes school syllabus well before unit tests and conducts thorough revision with mock question papers."
  },
  {
    id: 11,
    name: "Alok Nath Mishra",
    childInfo: "Parent of Class 10 (CBSE) Student",
    location: "Rapti Nagar, Gorakhpur",
    topic: "Science Diagram & Numerical Prep",
    badge: "Class 10th CBSE",
    quote: "My daughter lacked confidence in Science numericals. The tutor gave her personalized handwritten notes and chapter summaries. Her marks increased rapidly."
  },
  {
    id: 12,
    name: "Neetu Chaurasia",
    childInfo: "Parent of UKG & Class 1 Siblings",
    location: "Padri Bazar, Gorakhpur",
    topic: "Two Kids Handled Patiently",
    badge: "Early Childhood",
    quote: "Handled both my young kids with immense patience and care. They now sit eagerly for their evening study hour without any crying or fuss."
  },
  {
    id: 13,
    name: "Dharmendra Singh",
    childInfo: "Parent of Class 8 Student",
    location: "Medical College Road",
    topic: "Verified & Trustworthy",
    badge: "Class 8th CBSE",
    quote: "Transparent fee structure and thoroughly verified teachers. No false promises. The tutor is sincere, punctual and conducts proper weekly chapter tests."
  },
  {
    id: 14,
    name: "Sangeeta Yadav",
    childInfo: "Parent of Class 9 (CBSE) Student",
    location: "Asuran Chowk, Gorakhpur",
    topic: "Punctual & Responsive Support",
    badge: "Class 9th CBSE",
    quote: "Our tutor is very punctual and takes extra review classes before school assessments. Vishu Home Tuition's WhatsApp team is always quick to assist."
  },
  {
    id: 15,
    name: "Arvind Gupta",
    childInfo: "Parent of Class 11 (PCB) Student",
    location: "Daudpur, Gorakhpur",
    topic: "NCERT Line-by-Line Mastery",
    badge: "Class 11th Medical",
    quote: "The Biology and Chemistry tutor is phenomenal. Explains NCERT line-by-line, which is indispensable for NEET medical entrance preparation."
  },
  {
    id: 16,
    name: "Pratibha Sharma",
    childInfo: "Parent of Class 6 (ICSE) Student",
    location: "Cantt Area, Gorakhpur",
    topic: "History & Geography Interest",
    badge: "Class 6th ICSE",
    quote: "My son used to struggle with ICSE Social Studies. The tutor uses interactive storytelling methods and his subject interest has completely transformed."
  },
  {
    id: 17,
    name: "Vikas Jaiswal",
    childInfo: "Parent of Class 10 (CBSE) Student",
    location: "Taramandal, Gorakhpur",
    topic: "Score Jumped From 60% to 88%",
    badge: "Class 10th Board",
    quote: "Within three months of tuition, his Maths marks leaped from the 60s to 88%. The regular past-year question paper practice made all the difference."
  },
  {
    id: 18,
    name: "Meenakshi Upadhyay",
    childInfo: "Parent of Class 3 Student",
    location: "Betiahata, Gorakhpur",
    topic: "Polite & Caring Mentor",
    badge: "Class 3rd Primary",
    quote: "The female tutor is very gentle, polite and affectionate. My daughter happily finishes her daily homework and waits for her tuition class."
  },
  {
    id: 19,
    name: "Shailesh Srivastava",
    childInfo: "Parent of Class 12 (Maths) Student",
    location: "Mohaddipur, Gorakhpur",
    topic: "Calculus & Integration Simplified",
    badge: "Class 12th Maths",
    quote: "Calculus and Vector 3D were daunting for my son. The tutor gave step-by-step methods and shortcut approaches. Excellent teacher!"
  },
  {
    id: 20,
    name: "Anita Rai",
    childInfo: "Parent of Class 7 (CBSE) Student",
    location: "Surajkund, Gorakhpur",
    topic: "Hassle-Free Tutor Matching",
    badge: "Class 7th CBSE",
    quote: "Finding authentic home tutors in Gorakhpur was difficult until we used Vishu Home Tuition. Smooth matching and completely reliable guidance."
  },
  {
    id: 21,
    name: "Deepak Rawat",
    childInfo: "Parent of Class 5 Student",
    location: "Civil Lines, Gorakhpur",
    topic: "Top 5 Rank in School",
    badge: "Class 5th Primary",
    quote: "Strong emphasis on reading comprehension and mental mathematics. My son is now among the top 5 students in his school section."
  },
  {
    id: 22,
    name: "Rekha Keshari",
    childInfo: "Parent of Class 9 (ICSE) Student",
    location: "Golghar, Gorakhpur",
    topic: "Stress-Free ICSE Prep",
    badge: "Class 9th ICSE",
    quote: "ICSE syllabus can be overwhelming, but our tutor broke it down into daily bite-sized targets. Learning has become totally stress-free."
  },
  {
    id: 23,
    name: "Vivek Sahani",
    childInfo: "Parent of Class 10 (UP Board) Student",
    location: "Alinagar, Gorakhpur",
    topic: "88% in UP Board High School",
    badge: "Class 10th UP Board",
    quote: "Affordable fee charges with an experienced senior tutor. My son achieved 88% marks in UP Board High School exams with flying colors."
  },
  {
    id: 24,
    name: "Archana Singh",
    childInfo: "Parent of Class 8 (CBSE) Student",
    location: "Rustampur, Gorakhpur",
    topic: "Patience with Difficult Topics",
    badge: "Class 8th CBSE",
    quote: "The tutor never rushes through topics. If my child doesn't understand a concept, he explains it three times using practical everyday examples."
  },
  {
    id: 25,
    name: "Dr. Amit Pandey",
    childInfo: "Parent of Class 11 (PCM) Student",
    location: "Medical College Road",
    topic: "Full Academic Ownership",
    badge: "Class 11th Science",
    quote: "Being working doctors, we could not supervise our daughter's studies daily. Vishu Home Tuition assigned a top-notch tutor who took full ownership."
  },
  {
    id: 26,
    name: "Poonam Patel",
    childInfo: "Parent of Class 4 Student",
    location: "Kunraghat, Gorakhpur",
    topic: "Hindi & English Foundation",
    badge: "Class 4th Primary",
    quote: "My son struggled with Hindi matras and English grammar. The teacher patiently corrected his handwriting and pronunciation every single day."
  },
  {
    id: 27,
    name: "Jitendra Mall",
    childInfo: "Parent of Class 12 (Biology)",
    location: "Basharatpur, Gorakhpur",
    topic: "Dedicated Doubt Solving",
    badge: "Class 12th Biology",
    quote: "Doubt clearing sessions are first-rate. The teacher readily clarifies difficult diagram questions even over WhatsApp outside class hours."
  },
  {
    id: 28,
    name: "Seema Srivastava",
    childInfo: "Parent of Class 6 Student",
    location: "Shahpur, Gorakhpur",
    topic: "Demo Class Transparency",
    badge: "Class 6th CBSE",
    quote: "Very professional service. We evaluated the demo session, observed the tutor's teaching approach, and finalized on the spot."
  },
  {
    id: 29,
    name: "Ajay Kumar Singh",
    childInfo: "Parent of Class 10 (CBSE) Student",
    location: "Padri Bazar, Gorakhpur",
    topic: "Weekly Mock Tests",
    badge: "Class 10th CBSE",
    quote: "A true professional home tutor. Punctual, polite and conducts chapter-end test papers every Sunday without fail."
  },
  {
    id: 30,
    name: "Reena Gupta",
    childInfo: "Parent of Class 1 & 3 Siblings",
    location: "Rapti Nagar, Gorakhpur",
    topic: "Interactive Activity Learning",
    badge: "Primary Siblings",
    quote: "Teaching two young primary school kids requires immense patience. The teacher keeps both happily engaged with interactive worksheets."
  },
  {
    id: 31,
    name: "Santosh Vishwakarma",
    childInfo: "Parent of Class 9 (CBSE) Student",
    location: "Daudpur, Gorakhpur",
    topic: "Exam Fear Eliminated",
    badge: "Class 9th CBSE",
    quote: "Clear understanding of the latest CBSE board pattern. My daughter's fear of exam question papers is completely gone."
  },
  {
    id: 32,
    name: "Ritu Barnwal",
    childInfo: "Parent of Class 7 (ICSE) Student",
    location: "Taramandal, Gorakhpur",
    topic: "Spoken & Written English",
    badge: "Class 7th ICSE",
    quote: "Very satisfied with the English literature and grammar tutor. My son's essay writing and vocabulary have improved tremendously."
  },
  {
    id: 33,
    name: "Rajeshwar Nath",
    childInfo: "Parent of Class 12 (Commerce)",
    location: "Civil Lines, Gorakhpur",
    topic: "Business Studies & Accounts",
    badge: "Class 12th Commerce",
    quote: "Accountancy problems and Business Studies case studies were covered thoroughly with sample papers. Very knowledgeable teacher."
  },
  {
    id: 34,
    name: "Manju Sharma",
    childInfo: "Parent of Class 5 Student",
    location: "Betiahata, Gorakhpur",
    topic: "Overcame Classroom Hesitation",
    badge: "Class 5th Primary",
    quote: "My child was too hesitant to ask questions in his school classroom. With personal 1-on-1 home tuition, he asks freely and understands quickly."
  },
  {
    id: 35,
    name: "Vinay Kumar Rai",
    childInfo: "Parent of Class 8 (CBSE) Student",
    location: "Mohaddipur, Gorakhpur",
    topic: "Daily Attendance & Tracking",
    badge: "Class 8th CBSE",
    quote: "Disciplined study environment created right at home. The tutor arrives on time and maintains a structured weekly study log."
  },
  {
    id: 36,
    name: "Shweta Singh",
    childInfo: "Parent of Class 10 (ICSE) Student",
    location: "Golghar, Gorakhpur",
    topic: "Physics & Chemistry Equations",
    badge: "Class 10th ICSE",
    quote: "ICSE Chemistry chemical reactions and Physics formulas were systematically taught with revision notes. Highly recommended in Gorakhpur."
  },
  {
    id: 37,
    name: "Ashok Kumar Tripathi",
    childInfo: "Parent of Class 11 (Maths) Student",
    location: "Asuran Chowk, Gorakhpur",
    topic: "Trigonometry & Coordinate Geometry",
    badge: "Class 11th Maths",
    quote: "Trigonometry and Coordinate Geometry were made simple with lots of step-by-step problem-solving. Outstanding subject expert."
  },
  {
    id: 38,
    name: "Priyanka Jaiswal",
    childInfo: "Parent of Class 2 Student",
    location: "Cantt Area, Gorakhpur",
    topic: "Caring & Joyful Teaching",
    badge: "Class 2nd Primary",
    quote: "My daughter loves her teacher. Very friendly approach with colorful worksheets, storytelling and daily phonics reading."
  },
  {
    id: 39,
    name: "Narendra Chaubey",
    childInfo: "Parent of Class 9 (CBSE) Student",
    location: "Surajkund, Gorakhpur",
    topic: "Independent Self-Study Routine",
    badge: "Class 9th CBSE",
    quote: "Helped my son build a consistent study schedule. He now sits down to revise his lessons independently even on Sundays."
  },
  {
    id: 40,
    name: "Geeta Devi",
    childInfo: "Parent of Class 6 (UP Board) Student",
    location: "Rustampur, Gorakhpur",
    topic: "Affordable & Respectful Teacher",
    badge: "Class 6th UP Board",
    quote: "Very polite, respectful and hardworking teacher. Fees are transparent and within reach for middle-class families in Gorakhpur."
  },
  {
    id: 41,
    name: "Abhishek Mani",
    childInfo: "Parent of Class 12 (Physics) Student",
    location: "Medical College Road",
    topic: "Electromagnetism & Derivations",
    badge: "Class 12th Physics",
    quote: "Electromagnetism and Wave Optics derivations were simplified with diagrammatic breakdowns. Exceptional coaching for Class 12 Boards."
  },
  {
    id: 42,
    name: "Jyoti Srivastava",
    childInfo: "Parent of Class 4 (CBSE) Student",
    location: "Kunraghat, Gorakhpur",
    topic: "Curious & Eager to Learn",
    badge: "Class 4th CBSE",
    quote: "Practical examples and real-life connections used by the tutor kept my child curious and motivated throughout the academic year."
  },
  {
    id: 43,
    name: "Pradeep Kumar",
    childInfo: "Parent of Class 8 (ICSE) Student",
    location: "Basharatpur, Gorakhpur",
    topic: "Accurate Profile Matching",
    badge: "Class 8th ICSE",
    quote: "Vishu Home Tuition understands specific requirements thoroughly. They provided the exact qualified profile we requested without any delay."
  },
  {
    id: 44,
    name: "Sunita Agrahari",
    childInfo: "Parent of Class 10 (CBSE) Student",
    location: "Shahpur, Gorakhpur",
    topic: "Confidence in Final Board Exams",
    badge: "Class 10th CBSE",
    quote: "Timed mock test papers conducted before board exams removed all nervousness. My daughter wrote her exams with complete confidence."
  },
  {
    id: 45,
    name: "Kamleshwar Prasad",
    childInfo: "Parent of Class 7 Student",
    location: "Padri Bazar, Gorakhpur",
    topic: "Regular Progress Reviews",
    badge: "Class 7th General",
    quote: "Punctual, decent and respectful tutor. Takes tests every weekend and discusses results openly with us to fix weak areas."
  },
  {
    id: 46,
    name: "Renu Singh",
    childInfo: "Parent of Class 5 (CBSE) Student",
    location: "Rapti Nagar, Gorakhpur",
    topic: "Maths Word Problems Solved",
    badge: "Class 5th Maths",
    quote: "Maths word problems used to confuse my son. The tutor taught him how to break down the question step-by-step. His grades improved."
  },
  {
    id: 47,
    name: "Manoj Mishra",
    childInfo: "Parent of Class 11 (Chemistry) Student",
    location: "Daudpur, Gorakhpur",
    topic: "Organic Reaction Mechanisms",
    badge: "Class 11th Chemistry",
    quote: "Organic Chemistry reactions and mechanisms were made crystal clear. One of the finest home tutors available in Gorakhpur."
  },
  {
    id: 48,
    name: "Preeti Verma",
    childInfo: "Parent of Class 3 Student",
    location: "Taramandal, Gorakhpur",
    topic: "Reading Fluency & Confidence",
    badge: "Class 3rd Primary",
    quote: "Gentle guidance with zero scolding. My daughter's reading fluency, spelling accuracy and spoken confidence have flourished."
  },
  {
    id: 49,
    name: "Anand Prakash",
    childInfo: "Parent of Class 12 (Maths) Student",
    location: "Betiahata, Gorakhpur",
    topic: "Board Exam & CUET Prep",
    badge: "Class 12th Maths & CUET",
    quote: "Prepared my son thoroughly for Class 12 Board exams and competitive CUET foundation simultaneously. Outstanding mentorship."
  },
  {
    id: 50,
    name: "Sarita Dubey",
    childInfo: "Parent of Class 9 (ICSE) Student",
    location: "Civil Lines, Gorakhpur",
    topic: "Number 1 Home Tuition Choice",
    badge: "Class 9th ICSE",
    quote: "Vishu Home Tuition is our family's trusted recommendation for any parent in Gorakhpur looking for authentic, qualified home tutors."
  }
];

// Duplicate the 50 reviews to ensure an infinite seamless continuous marquee loop
const SLIDING_FEEDBACKS = [
  ...PARENT_FEEDBACKS,
  ...PARENT_FEEDBACKS
];

export default function TestimonialsSection() {
  return (
    <section className="feedback-section" id="feedback">
      <div className="container">
        <div className="section-head reveal show">
          <span className="mini">Verified Experiences</span>
          <h2>WHAT GORAKHPUR PARENTS SAY</h2>
          <p className="feedback-subhead">
            Real feedback from 8,500+ families supported across Taramandal, Betiahata, Mohaddipur, Golghar, Civil Lines, and localities across Gorakhpur.
          </p>
        </div>
      </div>

      <div className="feedback-marquee-wrapper">
        <div className="feedback-marquee-viewport" title="Hover to pause reviews">
          <div className="feedback-marquee-track">
            {SLIDING_FEEDBACKS.map((item, idx) => (
              <article
                className="feedback-item-card"
                key={`feedback-${item.id}-${idx}`}
                aria-hidden={idx >= PARENT_FEEDBACKS.length ? 'true' : undefined}
              >
                <div className="card-quote-bg" aria-hidden="true">“</div>

                <div className="feedback-card-top">
                  <span className="feedback-card-badge">{item.badge}</span>
                  <div className="feedback-card-stars" aria-label="5 out of 5 stars">
                    ★★★★★ <span>5.0</span>
                  </div>
                </div>

                <p className="feedback-card-quote">
                  "{item.quote}"
                </p>

                <div className="feedback-card-footer">
                  <div className="feedback-card-topic">✨ {item.topic}</div>
                  <div className="feedback-card-parent">
                    <div className="feedback-card-author-info">
                      <strong className="feedback-card-name">{item.name}</strong>
                      <span className="feedback-card-area">{item.childInfo} • {item.location}</span>
                    </div>
                    <span className="feedback-verified-pill">
                      ✓ Verified Parent
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
