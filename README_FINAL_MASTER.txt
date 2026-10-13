VISHU HOME TUITION — AUDITED FINAL MASTER
Domain: vishuhometuition.in
Date: 2026-09-21

Architecture
- Cloudflare Worker + Static Assets
- SQLite-backed Durable Object registration/storage backend
- Resend transactional email integration
- Single main website + dedicated Gorakhpur landing page
- Student/Tutor/Admin interfaces embedded inside public/index.html

Primary files
- public/index.html — main website + embedded Student/Tutor/Admin interfaces
- public/home-tuition-gorakhpur/index.html — local SEO/GEO landing page
- src/index.js — APIs, registration storage, files, email, status, verification, CMS
- wrangler.jsonc — Cloudflare Worker/static assets/Durable Object config
- deploy.bat / deploy.sh — deployment helper
- setup-first-time.bat / setup-first-time.sh — secrets setup helper

Final UI behavior
- Mobile carousels: continuous smooth conveyor movement
- Current speed: 32.89 px/sec
- Touch/drag interaction pauses movement and resumes after 2 seconds
- Student/Tutor registration CTA buttons do not zoom/expand on click
- Fees note uses single-line navy capsule strip
- WhatsApp/Call floating buttons use a subtle shine sweep every 4 seconds
- All original deploy assets remain in public/assets

Final logo
- The latest approved VISHU HOME TUITION Gorakhpur logo is embedded in Student/Tutor registration header slots.

Important
This package must be deployed as a Cloudflare Worker project using Wrangler because the backend uses Durable Objects. Uploading only public/ as a static Pages site will NOT provide registration/admin/email/database functionality.
