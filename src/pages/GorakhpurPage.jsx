import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE } from '../config/api';

export default function GorakhpurPage() {
  const [filterText, setFilterText] = useState('');
  const [leadForm, setLeadForm] = useState({
    name: '',
    phone: '',
    studentClass: '',
    board: '',
    subject: '',
    area: '',
    time: '',
    details: ''
  });

  const [loading, setLoading] = useState(false);
  const [resultMsg, setResultMsg] = useState({ type: '', text: '' });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    const fieldMap = {
      leadName: 'name',
      leadPhone: 'phone',
      leadClass: 'studentClass',
      leadBoard: 'board',
      leadSubject: 'subject',
      leadArea: 'area',
      leadTime: 'time',
      leadDetails: 'details'
    };
    setLeadForm(prev => ({ ...prev, [fieldMap[id] || id]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!/^[6-9]\d{9}$/.test(leadForm.phone.trim())) {
      setResultMsg({ type: 'bad', text: 'Please enter a valid 10-digit mobile number starting with 6-9.' });
      return;
    }

    setLoading(true);
    setResultMsg({ type: '', text: '' });

    try {
      const res = await fetch(`${API_BASE}/api/lead`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: leadForm.name,
          phone: leadForm.phone,
          studentClass: leadForm.studentClass,
          board: leadForm.board,
          subject: leadForm.subject,
          locality: leadForm.area,
          preferredTime: leadForm.time,
          note: leadForm.details
        })
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setResultMsg({ 
          type: 'ok', 
          text: `Quick Tutor Request submitted successfully! Request ID: ${data.id || 'CONFIRMED'}. Our Gorakhpur coordinator will call you shortly.` 
        });
        setLeadForm({ name: '', phone: '', studentClass: '', board: '', subject: '', area: '', time: '', details: '' });
      } else {
        throw new Error(data.error || 'Failed to submit request.');
      }
    } catch (err) {
      setResultMsg({ type: 'bad', text: err.message || 'Unable to submit request. Please try again or call +91 7052500258.' });
    } finally {
      setLoading(false);
    }
  };

  // Locality filter matching
  const matchesFilter = (chipAreaText) => {
    if (!filterText.trim()) return true;
    return chipAreaText.toLowerCase().includes(filterText.trim().toLowerCase());
  };

  return (
    <main>
      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <span className="eyebrow">Gorakhpur • Home Tutor Matching Since 2017</span>
            <h1>Best Home Tuition <span>in Gorakhpur</span></h1>
            <p>Looking for a home tutor in Gorakhpur? VISHU HOME TUITION helps families connect with suitable tutors for Nursery to Class 12 across CBSE, ICSE and UP Board, based on class, subject, area, timing and tutor availability.</p>
            <div className="trust">
              <span>Nursery to Class 12</span>
              <span>CBSE • ICSE • UP Board</span>
              <span>One-to-One Home Tuition</span>
              <span>Male &amp; Female Tutor Requests</span>
              <span>Local Gorakhpur Support</span>
            </div>
            <div className="cta-row">
              <a className="btn btn-primary" href="#quick-request">Quick Tutor Request</a>
              <Link className="btn btn-gold" to="/tutor-registration">Register as a Teacher</Link>
              <a className="btn btn-outline" href="tel:+917052500258">Call +91 7052500258</a>
            </div>
          </div>
          <aside className="hero-card">
            <h2>Home Tutor in Gorakhpur</h2>
            <p>Personalised tutor matching for school subjects, boards and exam preparation.</p>
            <div className="hero-list">
              <div>Maths &amp; Science</div>
              <div>English &amp; SST</div>
              <div>Physics • Chemistry</div>
              <div>Biology • Commerce</div>
              <div>Primary All Subjects</div>
              <div>Exam Preparation</div>
            </div>
          </aside>
        </div>
      </section>

      {/* Why Families Use Us */}
      <section>
        <div className="container">
          <div className="section-head">
            <span className="mini">Why Families Use Us</span>
            <h2>One Local Platform for Home Tuition in Gorakhpur</h2>
            <p>Share the class, board, subject, locality and preferred timing. Tutor matching is then coordinated according to the requirement and suitable availability.</p>
          </div>
          <div className="grid-3">
            <article className="card">
              <h3>Area-based tutor matching</h3>
              <p>Requirements can be matched around your locality so travel distance and preferred timing can be considered.</p>
            </article>
            <article className="card">
              <h3>Classes &amp; boards</h3>
              <p>Nursery, LKG, UKG and Classes 1–12 for CBSE, ICSE and UP Board / State Board requirements.</p>
            </article>
            <article className="card">
              <h3>Subject-specific support</h3>
              <p>Ask for one tutor for multiple subjects or subject specialists for higher classes, depending on availability.</p>
            </article>
          </div>
        </div>
      </section>

      {/* Quick Facts */}
      <section className="soft quick-facts-section">
        <div className="container">
          <div className="section-head">
            <span className="mini">Quick Facts</span>
            <h2>VISHU HOME TUITION — Gorakhpur</h2>
            <p>Clear business and service details for parents, students and tutors.</p>
          </div>
          <div className="facts-grid">
            <div><span>Founder</span><strong>Vikash Kumar</strong></div>
            <div><span>Established</span><strong>2017</strong></div>
            <div><span>Classes</span><strong>Nursery to Class 12</strong></div>
            <div><span>Boards</span><strong>CBSE • ICSE • UP Board</strong></div>
            <div><span>Service</span><strong>Home Tutor Matching</strong></div>
            <div><span>Primary Area</span><strong>Gorakhpur, Uttar Pradesh, India</strong></div>
          </div>
        </div>
      </section>

      {/* Service Coverage / Localities */}
      <section className="soft" id="areas">
        <div className="container">
          <div className="section-head">
            <span className="mini">Gorakhpur Service Coverage</span>
            <h2>Home Tuition Across Major &amp; Micro Localities of Gorakhpur</h2>
            <p>Use the search box to quickly check a locality name. The list is written as service-area information, not as repeated keyword pages.</p>
          </div>
          <div className="area-search">
            <input 
              aria-label="Search Gorakhpur service areas" 
              id="areaFilter" 
              placeholder="Search your area — e.g. Taramandal, Mohaddipur, Rapti Nagar" 
              type="search"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
          </div>
          <div className="area-groups" id="areaGroups">
            <div className="area-group">
              <h3>Central Gorakhpur</h3>
              <div className="chips">
                {["golghar", "civil lines", "betiahata", "daudpur", "bilandpur", "indira nagar", "vijay chowk", "alinagar", "bade kajipur", "sumer sagar", "miyan bazar", "reti chowk", "urdu bazar", "raiganj", "turkmanpur", "pandey hata", "ghanta ghar", "bank road", "cinema road", "kali mandir area"].map(a => (
                  matchesFilter(a) && <span key={a} className="chip" data-area={a}>{a.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</span>
                ))}
              </div>
            </div>
            
            <div className="area-group">
              <h3>North &amp; Medical College Side</h3>
              <div className="chips">
                {["asuran", "basharatpur", "shahpur", "rapti nagar", "rapti nagar phase 1", "rapti nagar phase 2", "rapti nagar phase 3", "rapti nagar phase 4", "arogya mandir", "medical college road", "chargawan", "khajanchi chowk", "padri bazar", "sports college", "jhungia", "gulariha", "mughala", "karim nagar", "dharampur", "ramjanki nagar"].map(a => (
                  matchesFilter(a) && <span key={a} className="chip" data-area={a}>{a.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</span>
                ))}
              </div>
            </div>

            <div className="area-group">
              <h3>East, Mohaddipur &amp; Kunraghat Side</h3>
              <div className="chips">
                {["mohaddipur", "kunraghat", "nanda nagar", "bichhiya", "air force area", "singhariya", "engineering college road", "mahadev jharkhandi", "deoria bypass", "khorabar", "soobabazar", "ranidiha", "divya nagar", "rail vihar", "kusmi", "kusmi jungle", "jagdishpur", "motiram adda"].map(a => (
                  matchesFilter(a) && <span key={a} className="chip" data-area={a}>{a.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</span>
                ))}
              </div>
            </div>

            <div className="area-group">
              <h3>South, Taramandal &amp; Ramgarh Tal Side</h3>
              <div className="chips">
                {["taramandal", "ramgarh tal", "rustampur", "azad chowk", "transport nagar", "paidleyganj paidleganj", "nausad naushad naushahr", "buddha vihar", "sahara estate", "siddharth enclave", "pawan vihar", "mahuesugharpur", "chilmapur", "gopalapur", "mahadevpuram", "sainik kunj", "shatabdipuram"].map(a => (
                  matchesFilter(a) && <span key={a} className="chip" data-area={a}>{a.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</span>
                ))}
              </div>
            </div>

            <div className="area-group">
              <h3>West &amp; Gorakhnath Side</h3>
              <div className="chips">
                {["gorakhnath", "rajendra nagar", "humayunpur", "north humayunpur", "surajkund colony", "lachhipur", "bargadwa", "fertilizer colony", "domingarh", "nathmalpur", "dharamshala", "mahesra", "semra", "jungle salikram", "jungle benimadhav", "shivpur", "sahbajganj", "manbela"].map(a => (
                  matchesFilter(a) && <span key={a} className="chip" data-area={a}>{a.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</span>
                ))}
              </div>
            </div>

            <div className="area-group">
              <h3>Nearby / Outer Requests — Subject to Tutor Availability</h3>
              <div className="chips">
                {["maniram", "pipraich", "sahjanwa", "gida", "chauri chaura", "pipiganj", "bhiti belipar", "campierganj"].map(a => (
                  matchesFilter(a) && <span key={a} className="chip" data-area={a}>{a.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</span>
                ))}
              </div>
            </div>

            <div className="area-group">
              <h3>Additional Ward &amp; Locality Search Names</h3>
              <div className="chips">
                {["arya nagar alinagar", "maya bazar miyan bazar", "atmaram nagar jafra bazar", "sahabganj ismailpur", "jagannathpur qazipur khurd", "ghanta ghar muftipur", "vishnupuram bheriyagar", "sardar bhagat singh nagar mohaddipur", "chandrashekhar azad chowk rustampur", "bandhu singh nagar ilahibagh", "raghupati sahay firaq nagar daudpur bilandpur", "shaheed ashfaqullah nagar turkmanpur", "maharana pratap nagar rasoolpur", "hanumant nagar north humayunpur", "maitripuram railway colony", "geeta press nagar sheikhpur", "ashok nagar", "gayatri nagar", "basantpur", "nakaha", "gayghat", "shakti nagar", "vikas nagar", "krishna nagar", "narsinghpur", "giridhar ganj", "purana gorakhpur old gorakhpur", "civil lines 1", "civil lines 2", "vindhyavasini nagar"].map(a => (
                  matchesFilter(a) && <span key={a} className="chip" data-area={a}>{a.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</span>
                ))}
              </div>
            </div>
          </div>

          <details className="micro">
            <summary>Micro-localities &amp; Nagar Nigam locality names we also recognise</summary>
            <div className="chips">
              {["pokharbhinda / karim nagar", "hamidpur", "bharwalia buzurg", "harsewakpur", "mahewa mustakil", "rampur urf ramgarh", "jatepur uttari", "nautan tappa khuthan", "jungle mahuawa / muhammadpur", "fattepur", "mirzapur bilandpur", "tal ramgarh", "jungle matadin", "chargawan", "jungle hakim", "chainpur", "bharwalia khurd", "rampur naya gaon", "mahewa ehtemali", "mohiuddin chak / muhammad chak", "chaksa husain", "pattan", "mirzapur pachpedwa", "naya kshetra chilmapur", "harsewakpur no 1", "jungle benimadhav no 1", "jungle benimadhav no 2", "mahadev jharkhandi tola 1", "mahadev jharkhandi tola 2", "mahadev jharkhandi tola 3", "humayunpur uttari naya kshetra", "shivpur sahbajganj"].map(a => (
                matchesFilter(a) && <span key={a} className="chip" data-area={a}>{a.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</span>
              ))}
            </div>
          </details>

          <p className="area-note">Coverage depends on the student’s exact address, subject, class and tutor availability. If your locality is not listed, submit the requirement anyway; nearby tutor availability can still be checked.</p>
        </div>
      </section>

      {/* Landmarks */}
      <section>
        <div className="container">
          <div className="section-head">
            <span className="mini">Landmark-based Search</span>
            <h2>Popular Gorakhpur Landmarks &amp; Corridors</h2>
            <p>Parents often describe their location using a landmark or major road. These references help narrow the tutor requirement.</p>
          </div>
          <div className="landmarks">
            <div className="landmark">Near Gorakhpur Junction Railway Station</div>
            <div className="landmark">Near Gorakhnath Temple</div>
            <div className="landmark">Near Gita Press</div>
            <div className="landmark">Near Ramgarh Tal</div>
            <div className="landmark">Near Veer Bahadur Singh Planetarium (Taramandal)</div>
            <div className="landmark">Near BRD Medical College</div>
            <div className="landmark">Near AIIMS Gorakhpur</div>
            <div className="landmark">Near Madan Mohan Malaviya University of Technology (MMMUT)</div>
            <div className="landmark">Near Deen Dayal Upadhyaya Gorakhpur University</div>
            <div className="landmark">Near Geeta Vatika</div>
            <div className="landmark">Near Vindhyavasini Park</div>
            <div className="landmark">Near Regional Sports College</div>
            <div className="landmark">Near Air Force area</div>
            <div className="landmark">Near Transport Nagar / Nausad corridor</div>
            <div className="landmark">Near Kachahri / Court Road corridor</div>
          </div>
        </div>
      </section>

      {/* Subjects */}
      <section className="soft" id="subjects">
        <div className="container">
          <div className="section-head">
            <span className="mini">Subjects &amp; Learning Needs</span>
            <h2>Home Tutors for School Subjects &amp; Exam Preparation</h2>
            <p>Choose the subjects required and mention whether you prefer one tutor or subject-specific tutors.</p>
          </div>
          <div className="subjects">
            <span>Mathematics</span><span>Science</span><span>English</span><span>Hindi</span><span>Social Science (SST)</span><span>Computer</span><span>Physics</span><span>Chemistry</span><span>Biology</span><span>Accounts</span><span>Commerce</span><span>Economics</span><span>Spoken English</span><span>Board Exam Preparation</span><span>Olympiad</span><span>IIT-JEE foundation</span><span>NEET foundation</span><span>Sainik School / Navodaya preparation</span>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section>
        <div className="container">
          <div className="section-head">
            <span className="mini">Simple Process</span>
            <h2>How to Get a Home Tutor in Gorakhpur</h2>
          </div>
          <div className="steps">
            <article className="step">
              <div className="num">1</div>
              <h3>Share Requirement</h3>
              <p>Enter student class, board, subjects, area and preferred timing.</p>
            </article>
            <article className="step">
              <div className="num">2</div>
              <h3>Tutor Matching</h3>
              <p>Suitable available tutors are considered according to the requirement.</p>
            </article>
            <article className="step">
              <div className="num">3</div>
              <h3>Start Tuition</h3>
              <p>Coordinate the tutor and begin personalised learning after finalisation.</p>
            </article>
          </div>
          <div className="cta-row" style={{ justifyContent: 'center' }}>
            <Link className="btn btn-primary" to="/student-registration">Open Student Registration</Link>
            <a className="btn btn-outline" href="/#fees">View Tuition Fees</a>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="soft" id="faq">
        <div className="container">
          <div className="section-head">
            <span className="mini">Quick Answers</span>
            <h2>Home Tuition in Gorakhpur — FAQs</h2>
          </div>
          <div className="faq">
            <details><summary>Which areas of Gorakhpur do you cover?</summary><p>We receive requirements from major Gorakhpur localities including Taramandal, Rapti Nagar, Mohaddipur, Golghar, Betiahata, Civil Lines, Rustampur, Basharatpur, Shahpur, Padri Bazar, Kunraghat and many nearby micro-localities. Exact matching depends on tutor availability.</p></details>
            <details><summary>Do you provide female home tutors in Gorakhpur?</summary><p>You can request a female tutor. Matching depends on class, subject, exact locality, preferred timing and suitable tutor availability.</p></details>
            <details><summary>Which classes and boards are supported?</summary><p>Requirements can be submitted from Nursery, LKG and UKG through Class 12 for CBSE, ICSE and UP Board / State Board students.</p></details>
            <details><summary>Can I get a tutor for Maths and Science?</summary><p>Yes. You can request Maths, Science, English, Hindi, SST, Computer, Physics, Chemistry, Biology, Accounts, Commerce and other academic subjects.</p></details>
            <details><summary>How do I register a student?</summary><p>Use the “Register Student / Get a Tutor” button. It opens the official student registration flow on the main VISHU HOME TUITION website.</p></details>
            <details><summary>How can a teacher register?</summary><p>Use “Register as a Teacher” to open the tutor registration form and submit the required details and documents.</p></details>
            <details><summary>Are the displayed areas guaranteed?</summary><p>No. Area names indicate locations where requirements may be received or checked. Final tutor availability depends on the exact requirement and tutor network at that time.</p></details>
            <details><summary>Do you provide online tuition?</summary><p>Online tuition can also be requested when appropriate for the class, subject and available tutor.</p></details>
          </div>
        </div>
      </section>

      {/* Quick Request Form */}
      <section className="soft" id="quick-request">
        <div className="container">
          <div className="section-head">
            <span className="mini">Quick Tutor Request</span>
            <h2>NEED A HOME TUTOR?</h2>
            <p>Share the essential details here. Your request can be reviewed from the private admin panel after submission.</p>
          </div>
          <form className="quick-request-shell" id="landingLeadForm" onSubmit={handleFormSubmit}>
            <div className="quick-request-grid">
              <input aria-label="Parent or Student Name" autocomplete="name" id="leadName" placeholder="Parent / Student Name" required="" value={leadForm.name} onChange={handleInputChange} />
              <input aria-label="Mobile Number" autocomplete="tel" id="leadPhone" inputmode="numeric" maxlength="10" pattern="[6-9][0-9]{9}" placeholder="10-digit Mobile Number" required="" type="tel" value={leadForm.phone} onChange={handleInputChange} />
              <select aria-label="Class" id="leadClass" required="" value={leadForm.studentClass} onChange={handleInputChange}>
                <option value="">Select Class</option>
                <option>Nursery</option><option>LKG</option><option>UKG</option>
                <option>1st</option><option>2nd</option><option>3rd</option><option>4th</option><option>5th</option>
                <option>6th</option><option>7th</option><option>8th</option><option>9th</option><option>10th</option>
                <option>11th</option><option>12th</option>
                <option>Competitive Exam</option><option>Other</option>
              </select>
              <select aria-label="Board" id="leadBoard" value={leadForm.board} onChange={handleInputChange}>
                <option value="">Select Board</option>
                <option>CBSE</option><option>ICSE</option><option>UP Board / State Board</option><option>Other</option>
              </select>
              <input aria-label="Subjects" id="leadSubject" placeholder="Subject / Subjects" required="" value={leadForm.subject} onChange={handleInputChange} />
              <input aria-label="Area or Locality" id="leadArea" placeholder="Area / Locality in Gorakhpur" required="" value={leadForm.area} onChange={handleInputChange} />
              <input aria-label="Preferred Time" id="leadTime" placeholder="Preferred Time (Optional)" value={leadForm.time} onChange={handleInputChange} />
              <textarea aria-label="Additional Details" className="wide" id="leadDetails" placeholder="Additional Details (Optional)" value={leadForm.details} onChange={handleInputChange}></textarea>
              <button className="btn btn-primary quick-request-submit" id="landingLeadSubmit" type="submit" disabled={loading}>
                {loading ? 'Submitting Request...' : 'Submit Quick Tutor Request'}
              </button>
            </div>
            {resultMsg.text && (
              <div className={`lead-result ${resultMsg.type}`} style={{ display: 'block' }}>
                {resultMsg.text}
              </div>
            )}
          </form>
        </div>
      </section>

      {/* Final CTA Banner */}
      <section>
        <div className="container">
          <div className="final-cta">
            <div>
              <h2>Need a Home Tutor in Gorakhpur?</h2>
              <p>Submit your requirement with class, subject, board and exact locality.</p>
            </div>
            <div className="cta-row">
              <a className="btn btn-gold" href="#quick-request">Quick Request</a>
              <a className="btn btn-outline" href="https://wa.me/917052500258?text=Hello%20VISHU%20HOME%20TUITION%2C%20I%20need%20a%20home%20tutor%20in%20Gorakhpur." style={{ color: '#fff', borderColor: 'rgba(255,255,255,.35)', background: 'rgba(255,255,255,.08)' }}>WhatsApp</a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
