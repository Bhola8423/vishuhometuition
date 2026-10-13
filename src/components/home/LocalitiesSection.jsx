import React from 'react';
import { MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LocalitiesSection() {
  const topLocalities = [
    "Taramandal", "Mohaddipur", "Golghar", "Betiahata", "Civil Lines",
    "Rapti Nagar", "Shahpur", "Basharatpur", "Padri Bazar", "Asuran",
    "Kunraghat", "Transport Nagar", "Rustampur", "Medical College Road",
    "Ferdpur", "Charphatakar", "Daudpur", "Singharia", "Standard Colony", "Kewatlia"
  ];

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <span className="mini-badge">Coverage Map</span>
          <h2>Home Tutors Available in 163+ Gorakhpur Localities</h2>
          <p>We provide doorstep home tuition matching across all residential areas in Gorakhpur.</p>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', marginBottom: '28px' }}>
          {topLocalities.map((loc, idx) => (
            <Link 
              key={idx} 
              to="/home-tuition-gorakhpur"
              style={{
                background: '#F5F8FD',
                border: '1px solid #DCE7F5',
                borderRadius: '999px',
                padding: '8px 16px',
                fontSize: '0.85rem',
                fontWeight: 800,
                color: '#2E466D',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <MapPin size={14} color="#1765E8" />
              {loc}
            </Link>
          ))}
        </div>

        <div style={{ textAlign: 'center' }}>
          <Link 
            to="/home-tuition-gorakhpur" 
            className="btn-submit"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', textDecoration: 'none' }}
          >
            <span>Explore All 163+ Localities & Landmark Search</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
