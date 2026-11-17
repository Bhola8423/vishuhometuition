import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { fetchGalleryMedia, getMediaImageUrl } from '../../api';
import './GallerySection.css';

// Curated fallback student & classroom photos from local assets
const DEFAULT_GALLERY_ITEMS = [
  {
    id: 'def-1',
    url: '/assets/vht-82e322c0d6c8ef92.jpg',
    fallbackSrc: '/assets/vht-82e322c0d6c8ef92.jpg',
    title: 'Foundational Learning',
    caption: 'Nursery to UKG play-way interactive home tutoring.',
    tag: 'Early Primary',
    altText: 'Nursery, LKG, UKG home tuition class in Gorakhpur'
  },
  {
    id: 'def-2',
    url: '/assets/vht-b81e838bb19cd4de.jpg',
    fallbackSrc: '/assets/vht-b81e838bb19cd4de.jpg',
    title: 'Concept Building',
    caption: '1st, 2nd & 3rd primary grades building strong English & Maths foundation.',
    tag: 'Class 1st - 3rd',
    altText: 'Class 1 to 3 home tutoring in Gorakhpur'
  },
  {
    id: 'def-3',
    url: '/assets/vht-5d210af036a79d67.jpg',
    fallbackSrc: '/assets/vht-5d210af036a79d67.jpg',
    title: 'Focused Study Habits',
    caption: '4th & 5th graders developing deep subject curiosity and daily study discipline.',
    tag: 'Class 4th - 5th',
    altText: 'Class 4 and 5 home tuition session in Gorakhpur'
  },
  {
    id: 'def-4',
    url: '/assets/vht-853bad776413780e.jpg',
    fallbackSrc: '/assets/vht-853bad776413780e.jpg',
    title: 'Middle School Mastery',
    caption: '6th, 7th & 8th CBSE & ICSE syllabus guidance with doubt clearing.',
    tag: 'Class 6th - 8th',
    altText: 'Class 6 to 8 home tuition in Gorakhpur'
  },
  {
    id: 'def-5',
    url: '/assets/vht-c0ef9563153a4271.jpg',
    fallbackSrc: '/assets/vht-c0ef9563153a4271.jpg',
    title: 'Board Exam Preparation',
    caption: 'Class 9th & 10th science numericals and board exam strategies.',
    tag: 'Class 9th - 10th',
    altText: 'Class 9 and 10 board exam home tuition in Gorakhpur'
  },
  {
    id: 'def-6',
    url: '/assets/vht-83062222d496da6b.jpg',
    fallbackSrc: '/assets/vht-83062222d496da6b.jpg',
    title: 'Senior Secondary Coaching',
    caption: '11th & 12th Physics, Chemistry, Maths & Biology mentorship.',
    tag: 'Class 11th - 12th',
    altText: 'Class 11 and 12 home tuition in Gorakhpur'
  },
  {
    id: 'def-7',
    url: '/assets/student-765663d5e776d208.jpg',
    fallbackSrc: '/assets/vht-82e322c0d6c8ef92.jpg',
    title: 'Personalized 1-on-1 Mentorship',
    caption: 'Individual student focus ensuring complete clarity and confidence.',
    tag: '1-on-1 Focus',
    altText: 'Student portrait during home tuition session'
  },
  {
    id: 'def-8',
    url: '/assets/tutor-765663d5e776d208.jpg',
    fallbackSrc: '/assets/vht-b81e838bb19cd4de.jpg',
    title: 'Expert Home Tutors',
    caption: 'Dedicated verified teachers explaining difficult topics with patience.',
    tag: 'Verified Tutors',
    altText: 'Verified home tutor teaching student in Gorakhpur'
  },
  {
    id: 'def-9',
    url: '/assets/student-8515be770d5c7357.png',
    fallbackSrc: '/assets/vht-5d210af036a79d67.jpg',
    title: 'Academic Excellence',
    caption: 'Proven score improvement and homework assistance.',
    tag: 'Top Results',
    altText: 'Smiling student holding notebook'
  },
  {
    id: 'def-10',
    url: '/assets/tutor-8a787d4c4ffa1ecb.png',
    fallbackSrc: '/assets/vht-853bad776413780e.jpg',
    title: 'Subject Specialists',
    caption: 'Experienced tutors for CBSE, ICSE and UP State Boards.',
    tag: 'Subject Experts',
    altText: 'Vishu Home Tuition subject specialist'
  },
  {
    id: 'def-11',
    url: '/assets/home-01a662b854869aca.png',
    fallbackSrc: '/assets/vht-c0ef9563153a4271.jpg',
    title: 'Comfort of Home Learning',
    caption: 'Safe, distraction-free environment for children in Gorakhpur.',
    tag: 'At Your Home',
    altText: 'Student studying peacefully at home'
  },
  {
    id: 'def-12',
    url: '/assets/home-bc0b0e3286e857ef.png',
    fallbackSrc: '/assets/vht-83062222d496da6b.jpg',
    title: 'Regular Revision & Tests',
    caption: 'Weekly tracking and constructive parent feedback after sessions.',
    tag: 'Progress Tracking',
    altText: 'Tutor reviewing test answers with student'
  }
];

export default function GallerySection() {
  const [dbItems, setDbItems] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  // Fetch live images from DB gallery section
  useEffect(() => {
    let isMounted = true;

    async function loadGallery() {
      try {
        const items = await fetchGalleryMedia('student-gallery');
        if (isMounted && Array.isArray(items) && items.length > 0) {
          // Format DB items
          const formatted = items.map((item, idx) => ({
            id: item.id || `db-${idx}`,
            url: item.url,
            fallbackSrc: DEFAULT_GALLERY_ITEMS[idx % DEFAULT_GALLERY_ITEMS.length].url,
            title: item.title?.trim() || `Learning Moment #${idx + 1}`,
            caption: item.caption?.trim() || 'Vishu Home Tuition • Gorakhpur',
            tag: 'Student Gallery',
            altText: item.altText?.trim() || item.title?.trim() || 'Vishu Home Tuition student gallery'
          }));
          setDbItems(formatted);
        }
      } catch (err) {
        console.warn('Error fetching gallery photos from DB:', err);
      }
    }

    loadGallery();

    return () => {
      isMounted = false;
    };
  }, []);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && selectedImage) {
        setSelectedImage(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage]);

  // Combine DB photos with default photos so all rows are richly populated
  const combinedItems = useMemo(() => {
    if (dbItems.length > 0) {
      // Put all DB photos first, then supplement with defaults
      return [...dbItems, ...DEFAULT_GALLERY_ITEMS];
    }
    return DEFAULT_GALLERY_ITEMS;
  }, [dbItems]);

  // Distribute items into 3 distinct rows
  const [row1Items, row2Items, row3Items] = useMemo(() => {
    const r1 = [];
    const r2 = [];
    const r3 = [];

    combinedItems.forEach((item, index) => {
      if (index % 3 === 0) r1.push(item);
      else if (index % 3 === 1) r2.push(item);
      else r3.push(item);
    });

    // Ensure each row has at least 8 items for a continuous seamless marquee
    const padRow = (list) => {
      if (list.length === 0) return DEFAULT_GALLERY_ITEMS.slice(0, 8);
      let res = [...list];
      while (res.length < 8) {
        res = [...res, ...list];
      }
      return res;
    };

    return [padRow(r1), padRow(r2), padRow(r3)];
  }, [combinedItems]);

  const handleCardClick = useCallback((item) => {
    setSelectedImage(item);
  }, []);

  const handleImageError = useCallback((e, fallbackSrc) => {
    if (e.target && fallbackSrc && e.target.src !== fallbackSrc) {
      e.target.src = fallbackSrc;
    }
  }, []);

  return (
    <section className="section gallery-section" id="gallery">
      <div className="container">
        <div className="gallery-head reveal show">
          <span className="gallery-kicker">Our Learners &amp; Moments</span>
          <h2>STUDENT &amp; LEARNING GALLERY</h2>
          <p className="gallery-subtitle">
            Glimpses of focused home tutoring sessions, inspiring academic growth, and dedicated mentorship across Gorakhpur.
          </p>
        </div>
      </div>

      <div className="gallery-rows-wrapper">
        {/* ROW 1: Scrolling Left to Right in Slow Motion */}
        <div className="gallery-row-viewport" title="Hover to pause">
          <div className="gallery-row-track scroll-ltr">
            {/* Original Set */}
            {row1Items.map((item, idx) => (
              <GalleryCard
                key={`r1-orig-${item.id}-${idx}`}
                item={item}
                onClick={() => handleCardClick(item)}
                onError={handleImageError}
              />
            ))}
            {/* Cloned Set for Seamless Infinite Loop */}
            {row1Items.map((item, idx) => (
              <GalleryCard
                key={`r1-clone-${item.id}-${idx}`}
                item={item}
                onClick={() => handleCardClick(item)}
                onError={handleImageError}
                ariaHidden={true}
              />
            ))}
          </div>
        </div>

        {/* ROW 2: Scrolling Right to Left in Slow Motion */}
        <div className="gallery-row-viewport" title="Hover to pause">
          <div className="gallery-row-track scroll-rtl">
            {/* Original Set */}
            {row2Items.map((item, idx) => (
              <GalleryCard
                key={`r2-orig-${item.id}-${idx}`}
                item={item}
                onClick={() => handleCardClick(item)}
                onError={handleImageError}
              />
            ))}
            {/* Cloned Set for Seamless Infinite Loop */}
            {row2Items.map((item, idx) => (
              <GalleryCard
                key={`r2-clone-${item.id}-${idx}`}
                item={item}
                onClick={() => handleCardClick(item)}
                onError={handleImageError}
                ariaHidden={true}
              />
            ))}
          </div>
        </div>

        {/* ROW 3: Scrolling Left to Right in Slow Motion */}
        <div className="gallery-row-viewport" title="Hover to pause">
          <div className="gallery-row-track scroll-ltr-slow">
            {/* Original Set */}
            {row3Items.map((item, idx) => (
              <GalleryCard
                key={`r3-orig-${item.id}-${idx}`}
                item={item}
                onClick={() => handleCardClick(item)}
                onError={handleImageError}
              />
            ))}
            {/* Cloned Set for Seamless Infinite Loop */}
            {row3Items.map((item, idx) => (
              <GalleryCard
                key={`r3-clone-${item.id}-${idx}`}
                item={item}
                onClick={() => handleCardClick(item)}
                onError={handleImageError}
                ariaHidden={true}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox / Preview Modal */}
      {selectedImage && (
        <div 
          className="gallery-lightbox-overlay" 
          onClick={() => setSelectedImage(null)}
          role="dialog"
          aria-modal="true"
        >
          <div 
            className="gallery-lightbox-modal" 
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="gallery-lightbox-close" 
              onClick={() => setSelectedImage(null)}
              type="button"
              aria-label="Close preview"
            >
              ✕
            </button>
            <div className="gallery-lightbox-img-wrap">
              <img
                src={getMediaImageUrl(selectedImage.url)}
                alt={selectedImage.altText || selectedImage.title}
                className="gallery-lightbox-img"
                onError={(e) => handleImageError(e, selectedImage.fallbackSrc)}
              />
            </div>
            <div className="gallery-lightbox-content">
              <div className="gallery-lightbox-header">
                <h3 className="gallery-lightbox-title">{selectedImage.title}</h3>
                <span className="gallery-lightbox-badge">{selectedImage.tag}</span>
              </div>
              <p className="gallery-lightbox-caption">{selectedImage.caption}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/**
 * Individual Gallery Card Component
 */
function GalleryCard({ item, onClick, onError, ariaHidden = false }) {
  const imgSrc = getMediaImageUrl(item.url);

  return (
    <article 
      className="gallery-card" 
      onClick={onClick}
      aria-hidden={ariaHidden ? "true" : undefined}
      tabIndex={ariaHidden ? -1 : 0}
      onKeyDown={(e) => {
        if (!ariaHidden && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className="gallery-card-img-wrap">
        <img
          src={imgSrc}
          alt={item.altText || item.title || 'Vishu Home Tuition Gallery'}
          className="gallery-card-img"
          loading="lazy"
          decoding="async"
          onError={(e) => onError(e, item.fallbackSrc)}
        />
        <div className="gallery-card-zoom-badge">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            <line x1="11" y1="8" x2="11" y2="14"></line>
            <line x1="8" y1="11" x2="14" y2="11"></line>
          </svg>
          Zoom
        </div>
        {item.tag && <span className="gallery-card-tag">{item.tag}</span>}
      </div>

      <div className="gallery-card-meta">
        <h4 className="gallery-card-title">{item.title}</h4>
        <p className="gallery-card-caption">{item.caption}</p>
      </div>
    </article>
  );
}
