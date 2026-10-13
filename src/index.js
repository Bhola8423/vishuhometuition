const JSON_HEADERS = {
  'content-type': 'application/json; charset=UTF-8',
  'cache-control': 'no-store',
  'x-content-type-options': 'nosniff',
  'x-robots-tag': 'noindex, nofollow',
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'Content-Type, Authorization, x-admin-token'
};
const REGISTRATION_MAX_FILE = 5 * 1024 * 1024;
const MEDIA_MAX_FILE = 10 * 1024 * 1024;
const CHUNK_SIZE = 1500 * 1024; // comfortably below the 2 MB DO value limit
const ALLOWED_STATUS = new Set(['PENDING','APPROVED','REJECTED','CORRECTION_REQUIRED']);
const ALLOWED_TYPES = new Set(['student','teacher']);
const ALLOWED_PAYMENT_STATUS = new Set(['PENDING','SUBMITTED','PAID','WAIVED','NOT_REQUIRED']);

function json(data, status = 200, extra = {}) {
  return new Response(JSON.stringify(data), { status, headers: { ...JSON_HEADERS, ...extra } });
}
function clean(v, max = 4000) { return String(v ?? '').trim().slice(0, max); }
function safeFileName(v='file') { return String(v).replace(/[^a-zA-Z0-9._-]+/g,'_').slice(0,120) || 'file'; }
function nowIso(){ return new Date().toISOString(); }
function sanitizeValue(v, depth=0){
  if(depth>6) return '';
  if(v==null) return v;
  if(typeof v==='string') return v.trim().slice(0,12000);
  if(typeof v==='number') return Number.isFinite(v)?v:0;
  if(typeof v==='boolean') return v;
  if(Array.isArray(v)) return v.slice(0,120).map(x=>sanitizeValue(x,depth+1));
  if(typeof v==='object'){
    const out={}; let n=0;
    for(const [k,val] of Object.entries(v)){
      if(n++>200) break;
      const key=clean(k,80); if(!key) continue;
      out[key]=sanitizeValue(val,depth+1);
    }
    return out;
  }
  return clean(v,12000);
}
function escapeHtmlAttr(v=''){ return String(v).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }
function validPhone(phone){ return /^[6-9]\d{9}$/.test(phone); }
function allowedUpload(field,file){
  const name=String(file?.name||'').toLowerCase();
  const ext=name.includes('.')?name.slice(name.lastIndexOf('.')):'';
  const mime=String(file?.type||'').toLowerCase();
  const imagesExt=new Set(['.jpg','.jpeg','.png','.webp']);
  const imagesMime=new Set(['image/jpeg','image/png','image/webp','application/octet-stream','']);
  const pdfExt=new Set(['.pdf']);
  const pdfMime=new Set(['application/pdf','application/octet-stream','']);
  if(field==='photo' || field==='media') return imagesExt.has(ext) && imagesMime.has(mime);
  if(field==='paymentProof' || field==='identityDoc' || field==='marksheetDoc') return (imagesExt.has(ext)&&imagesMime.has(mime)) || (pdfExt.has(ext)&&pdfMime.has(mime));
  if(field==='resumeDoc'){
    const okExt=new Set(['.jpg','.jpeg','.png','.webp','.pdf','.doc','.docx']);
    const okMime=new Set(['image/jpeg','image/png','image/webp','application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document','application/octet-stream','']);
    return okExt.has(ext) && okMime.has(mime);
  }
  return false;
}
function requiredFields(type){
  return type === 'teacher'
    ? ['name','phone','email','qualification','experience','classes','subjects','area']
    : ['studentName','parentName','phone','email','className','board','subjects','area','registrationType'];
}
function textPayload(fd){
  const out={};
  for(const [k,v] of fd.entries()) if(typeof v === 'string') out[k]=clean(v);
  return out;
}
function adminAuthorized(request, env){
  const auth = request.headers.get('authorization') || '';
  const bearer = auth.replace(/^Bearer\s+/i,'');
  let token = bearer || request.headers.get('x-admin-token') || '';
  if(!token){
    try{
      token = new URL(request.url).searchParams.get('passcode') || '';
    }catch{}
  }
  return Boolean(env.ADMIN_TOKEN && token && token === env.ADMIN_TOKEN);
}

function validEmail(email=''){
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
}
function escapeHtml(v=''){
  return String(v).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}
function siteUrl(env){ return String(env.SITE_URL || 'https://vishuhometuition.in').replace(/\/+$/,''); }
function adminEmail(env){ return clean(env.ADMIN_EMAIL || 'vishuhometuition.gkp@gmail.com',180); }
function mailFrom(env){ return clean(env.MAIL_FROM || 'VISHU HOME TUITION <registrations@vishuhometuition.in>',220); }
function replyToEmail(env){ return clean(env.REPLY_TO_EMAIL || env.ADMIN_EMAIL || 'vishuhometuition.gkp@gmail.com',180); }
const SITE_DEFAULT_SETTINGS={"schemaVersion":2,"hero":{"kicker":"👑 Gorakhpur's No. 1 Home Tuition Platform","title1":"VISHU","title2":"HOME TUITION","city":"GORAKHPUR","solution":"Your Complete Home Tuition Solution in Gorakhpur","sub":"Personalised learning with the right guidance for a brighter future.","chip1":"Nursery to 12th","chip2":"CBSE • ICSE","chip3":"State Boards"},"trust":{"kicker":"TRUSTED IN GORAKHPUR","sinceYear":"2017","sinceTitle":"Serving Across Gorakhpur","sinceText":"Years of consistent work in education, mentorship and tutor support for local families.","teacherCount":"3800","teacherTitle":"Teacher Community","teacherText":"Male & female tutors across multiple subjects and classes.","familyCount":"8500","familyTitle":"Families Served","familyText":"Approx. families supported through home tuition services in Gorakhpur.","googleRating":"5.0","googleText":"995+ public reviews on Google.","justdialRating":"5.0","justdialText":"2500+ public reviews on Justdial."},"tutor":{"kicker":"TEACHER REGISTRATION","title":"BECOME A TUTOR","text":"Join our tutor community and connect with suitable teaching opportunities according to your subject, class preference, location, availability and teaching experience.","button":"Register as a Teacher"},"student":{"kicker":"STUDENT REGISTRATION","title":"RIGHT TUTOR FOR YOUR CHILD","text":"Share your child’s class, subject, board, location and preferred timing. We’ll use your requirement to help connect you with a suitable home tutor in Gorakhpur.","button":"Register as a Student"},"feesSection":{"kicker":"Simple & Transparent","title":"TUITION FEES","noteBadge":"PLEASE NOTE","noteText":"Fees may vary by subject, board, tutor availability and experience."},"contactSection":{"kicker":"Quick Enquiry","title":"NEED A HOME TUTOR?","text":"Fill your requirement and continue on WhatsApp.","button":"Send Enquiry via WhatsApp"},"howSection":{"kicker":"Simple • Fast • Effective","title":"HOW IT WORKS","text":"Three simple steps from requirement to personalised learning."},"feedbackSection":{"kicker":"Experience Highlights","title":"PARENTS, STUDENTS & TEACHERS SAY"},"founder":{"name":"Vikash Kumar","role":"Founder & Director","brand":"VISHU HOME TUITION","quote":"हमारा विश्वास है कि हर बच्चे में आगे बढ़ने की क्षमता होती है। सही शिक्षक, व्यक्तिगत मार्गदर्शन और निरंतर प्रोत्साहन से हम उस क्षमता को आत्मविश्वास और उपलब्धियों में बदलने का प्रयास करते हैं।"},"faqSection":{"kicker":"Helpful Information • Quick Answers","title":"HOME TUITION FAQs","intro":"Quick answers about VISHU HOME TUITION in Gorakhpur."},"contact":{"phone":"+91 7052500258","email":"vishuhometuition.gkp@gmail.com"},"footer":{"tagline":"Better Learning. Brighter Future.","services":["Home Tuition","Online Tuition","Subject Experts","Nursery to 12th"]},"social":{"instagram":"https://www.instagram.com/vishuhometuitiongorakhpur","youtube":"https://youtube.com/@vishuhometuitiongorakhpur","facebook":"https://www.facebook.com/profile.php?id=61579272522736","x":"https://x.com/VishuHomeTution","linkedin":"https://www.linkedin.com/in/vishu-home-tuition-gorakhpur-1a71b2424","threads":"https://www.threads.com/@vishuhometuitiongorakhpur"},"theme":{"navy":"#061A3F","gold":"#F7C63D","blue":"#1765E8"},"seo":{"homeTitle":"Best Home Tuition in Gorakhpur | VISHU HOME TUITION GORAKHPUR","homeDescription":"Find trusted home tuition in Gorakhpur for Nursery to Class 12 across CBSE, ICSE and UP Board with personalised tutor matching from VISHU HOME TUITION.","landingTitle":"Home Tutor in Gorakhpur | CBSE, ICSE, UP Board | VISHU HOME TUITION GORAKHPUR","landingDescription":"Find a suitable home tutor in Gorakhpur for CBSE, ICSE and UP Board students from Nursery to Class 12 with VISHU HOME TUITION."},"notice":{"enabled":false,"text":""},"visibility":{"trust":true,"tutor":true,"student":true,"fees":true,"contact":true,"how":true,"feedback":true,"founder":true,"faq":true,"gallery":true},"operations":{"teacherRegistrationEnabled":true,"studentRegistrationEnabled":true,"quickEnquiryEnabled":true,"registrationEmailsEnabled":true,"statusEmailsEnabled":true,"autoCardEmailOnApproval":true},"payments":{"teacherRegistrationFee":"500","studentDefaultAdvanceAmount":""},"fees":[],"areas":[],"testimonials":[]};
function mergeSiteSettings(base,override){
  if(Array.isArray(override)) return override.slice(0,120).map(x=>sanitizeValue(x));
  if(override && typeof override==='object'){
    const out={...(base||{})};
    for(const [k,v] of Object.entries(override)) out[k]=mergeSiteSettings(base?.[k],v);
    return out;
  }
  return override===undefined?base:override;
}
function normalizeSiteSettings(saved={}){
  const raw=(saved&&typeof saved==='object')?saved:{};
  if(Number(raw.schemaVersion||0)>=2){
    const merged=mergeSiteSettings(SITE_DEFAULT_SETTINGS,raw);
    merged.schemaVersion=2;
    merged.contact={...(merged.contact||{}),email:clean(merged.contact?.email||SITE_DEFAULT_SETTINGS.contact.email,180)};
    merged.hero={...(merged.hero||{}),kicker:"👑 Gorakhpur's No. 1 Home Tuition Platform"};
    merged.tutor={...(merged.tutor||{}),button:'Register as a Teacher'};
    return merged;
  }
  // Legacy CMS values were based on an older page. Preserve safe owner-managed lists/links,
  // but refresh visible core copy to the current production frontend so Admin and live site match.
  const migrated={schemaVersion:2};
  for(const key of ['social','theme','seo','notice','payments','fees','areas','testimonials']) if(raw[key]!==undefined) migrated[key]=raw[key];
  if(raw.contact?.phone) migrated.contact={phone:raw.contact.phone,email:SITE_DEFAULT_SETTINGS.contact.email};
  return mergeSiteSettings(SITE_DEFAULT_SETTINGS,migrated);
}
function statusLabel(status){
  return ({PENDING:'Pending Verification',APPROVED:'Approved',REJECTED:'Rejected',CORRECTION_REQUIRED:'Correction Required'})[status] || status;
}
function emailShell(title, body){
  return `<!doctype html><html><body style="margin:0;background:#f3f6fb;font-family:Arial,sans-serif;color:#17233a"><div style="max-width:640px;margin:0 auto;padding:24px"><div style="background:#061A3F;border-radius:18px 18px 0 0;padding:20px 24px;color:#fff"><div style="font-size:11px;letter-spacing:.14em;color:#F7C63D;font-weight:800">VISHU HOME TUITION • GORAKHPUR</div><h1 style="margin:7px 0 0;font-size:24px">${escapeHtml(title)}</h1></div><div style="background:#fff;border:1px solid #dfe7f1;border-top:0;border-radius:0 0 18px 18px;padding:24px;line-height:1.6">${body}<div style="margin-top:22px;padding-top:16px;border-top:1px solid #e7edf5;color:#617089;font-size:12px">VISHU HOME TUITION • Gorakhpur<br>+91 7052500258 • vishuhometuition.gkp@gmail.com</div></div></div></body></html>`;
}
async function sendResendEmail(env,{to,subject,html,text,replyTo,attachments}){
  const recipient=clean(to,220);
  if(!validEmail(recipient)) return {ok:false,skipped:true,reason:'invalid-recipient'};
  if(!env.RESEND_API_KEY) return {ok:false,skipped:true,reason:'email-not-configured'};
  const payload={from:mailFrom(env),to:[recipient],subject:clean(subject,240),html:String(html||''),text:String(text||'')};
  payload.reply_to=clean(replyTo || replyToEmail(env),220);
  if(Array.isArray(attachments) && attachments.length){
    payload.attachments=attachments.slice(0,5).map(a=>({
      content:String(a?.content||''),
      filename:safeFileName(a?.filename||'attachment'),
      ...(a?.content_type?{content_type:clean(a.content_type,120)}:{})
    })).filter(a=>a.content && a.filename);
  }
  try{
    const r=await fetch('https://api.resend.com/emails',{
      method:'POST',
      headers:{'authorization':`Bearer ${env.RESEND_API_KEY}`,'content-type':'application/json'},
      body:JSON.stringify(payload)
    });
    const data=await r.json().catch(()=>({}));
    if(!r.ok) return {ok:false,status:r.status,reason:clean(data?.message||data?.error||'email-provider-error',500)};
    return {ok:true,id:clean(data?.id||'',160)};
  }catch(err){
    return {ok:false,reason:clean(err?.message||'email-send-failed',500)};
  }
}
function registrationSummary(payload,type){
  const rows=type==='teacher'
    ? [
      ['Name',payload.name],['Phone',payload.phone],['Email',payload.email],['Qualification',payload.qualification],['Experience',payload.experience],['Classes',payload.classes],['Subjects',payload.subjects],['Area',payload.area],['Boards',payload.boards]
    ]
    : [
      ['Student',payload.studentName],['Parent/Guardian',payload.parentName],['Phone',payload.phone],['Email',payload.email],['Class',payload.className],['Board',payload.board],['Subjects',payload.subjects],['Address',payload.area],['Tutor Preference',payload.tutorPref],['Timing',payload.timing],['Registration Type',payload.registrationType],['Advance Amount',payload.advanceAmount]
    ];
  return rows.filter(([,v])=>String(v||'').trim()).map(([k,v])=>`<tr><td style="padding:7px 10px;color:#6b7890;border-bottom:1px solid #eef2f7;width:38%">${escapeHtml(k)}</td><td style="padding:7px 10px;font-weight:700;border-bottom:1px solid #eef2f7">${escapeHtml(v)}</td></tr>`).join('');
}
function statusEmailCopy(status,note,id,type,env){
  const verify=`${siteUrl(env)}/verify?id=${encodeURIComponent(id)}`;
  const typeLabel=type==='teacher'?'Tutor':'Student';
  if(status==='APPROVED') return {
    subject:`${typeLabel} Registration Approved • ${id}`,
    title:'Registration Approved',
    body:`<p>Your <b>${escapeHtml(typeLabel)}</b> registration <b>${escapeHtml(id)}</b> has been approved.</p><p>Your digital ID card can now be generated by the VISHU HOME TUITION admin team and shared with you.</p><p><a href="${escapeHtmlAttr(verify)}" style="display:inline-block;background:#1765E8;color:#fff;text-decoration:none;padding:11px 16px;border-radius:10px;font-weight:800">Verify Registration</a></p>${note?`<p><b>Admin note:</b> ${escapeHtml(note)}</p>`:''}`
  };
  if(status==='CORRECTION_REQUIRED') return {
    subject:`Correction Required • ${id}`,
    title:'Correction Required',
    body:`<p>Your registration <b>${escapeHtml(id)}</b> needs a correction before approval.</p>${note?`<p><b>What to review:</b> ${escapeHtml(note)}</p>`:''}<p>Please contact VISHU HOME TUITION on WhatsApp at <b>+91 7052500258</b>.</p>`
  };
  if(status==='REJECTED') return {
    subject:`Registration Update • ${id}`,
    title:'Registration Update',
    body:`<p>Your registration <b>${escapeHtml(id)}</b> has been marked as rejected.</p>${note?`<p><b>Admin note:</b> ${escapeHtml(note)}</p>`:''}<p>For clarification, contact VISHU HOME TUITION at <b>+91 7052500258</b>.</p>`
  };
  return {
    subject:`Registration Status • ${id}`,
    title:'Registration Status Updated',
    body:`<p>Your registration <b>${escapeHtml(id)}</b> is currently <b>${escapeHtml(statusLabel(status))}</b>.</p>${note?`<p><b>Admin note:</b> ${escapeHtml(note)}</p>`:''}`
  };
}
function verificationPage(data){
  const ok=Boolean(data?.verified);
  const status=escapeHtml(statusLabel(data?.status||''));
  const type=data?.type==='teacher'?'Teacher':'Student';
  const details=data?.details||{};
  const rows=Object.entries(details).filter(([,v])=>String(v||'').trim()).map(([k,v])=>{
    const label=({qualification:'Qualification',experience:'Experience',classes:'Classes',subjects:'Subjects',area:'Area',address:'Address',parentGuardian:'Parent / Guardian',contactNumber:'Contact Number',className:'Class',board:'Board'})[k]||k;
    return `<div class="row"><span>${escapeHtml(label)}</span><b>${escapeHtml(v)}</b></div>`;
  }).join('');
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Registration Verification • VISHU HOME TUITION</title><style>*{box-sizing:border-box}body{margin:0;background:#f4f7fb;font-family:Inter,Arial,sans-serif;color:#17233a}.wrap{width:min(620px,92%);margin:45px auto}.brand{background:#061A3F;color:#fff;border-radius:22px 22px 0 0;padding:22px;text-align:center}.brand strong{font-size:22px;letter-spacing:.04em}.brand small{display:block;color:#F7C63D;margin-top:5px;letter-spacing:.12em}.card{background:#fff;border:1px solid #dfe7f1;border-top:0;border-radius:0 0 22px 22px;padding:24px;box-shadow:0 18px 50px rgba(6,26,63,.10)}.badge{display:inline-flex;padding:8px 12px;border-radius:999px;font-weight:900;font-size:12px;background:${ok?'#eaf8f1':'#fff4dd'};color:${ok?'#146d48':'#8a5a12'}}h1{font-size:26px;margin:15px 0 4px;color:#061A3F}.id{font-weight:900;color:#1765E8;margin-bottom:18px}.row{display:grid;grid-template-columns:145px 1fr;gap:10px;padding:10px 0;border-bottom:1px dashed #e4eaf1;font-size:13px}.row span{color:#718096}.foot{margin-top:20px;padding-top:16px;border-top:1px solid #edf1f6;color:#65748a;font-size:12px;line-height:1.6}@media(max-width:520px){.row{grid-template-columns:1fr;gap:2px}.wrap{margin:18px auto}}</style></head><body><div class="wrap"><div class="brand"><strong>VISHU HOME TUITION</strong><small>GORAKHPUR • DIGITAL ID VERIFICATION</small></div><div class="card"><span class="badge">${ok?'✓ VERIFIED & APPROVED':status}</span><h1>${escapeHtml(data?.name||'Registration')}</h1><div class="id">${escapeHtml(data?.id||'')}</div><div class="row"><span>Registration Type</span><b>${type}</b></div><div class="row"><span>Status</span><b>${status}</b></div>${rows}<div class="foot">This page verifies registration data stored by VISHU HOME TUITION. For assistance, contact +91 7052500258 or vishuhometuition.gkp@gmail.com.</div></div></div></body></html>`;
}

export class RegistrationStore {
  constructor(ctx, env) {
    this.ctx = ctx;
    this.env = env;
    this.sql = ctx.storage.sql;
    ctx.blockConcurrencyWhile(async () => {
      this.sql.exec(`
      CREATE TABLE IF NOT EXISTS registrations (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        status TEXT NOT NULL,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT NOT NULL,
        payload_json TEXT NOT NULL,
        files_json TEXT NOT NULL,
        note TEXT NOT NULL DEFAULT '',
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_reg_created ON registrations(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_reg_type ON registrations(type);
      CREATE INDEX IF NOT EXISTS idx_reg_status ON registrations(status);
      CREATE TABLE IF NOT EXISTS site_content (
        key TEXT PRIMARY KEY,
        value_json TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS site_media (
        id TEXT PRIMARY KEY,
        kind TEXT NOT NULL,
        title TEXT NOT NULL DEFAULT '',
        caption TEXT NOT NULL DEFAULT '',
        alt_text TEXT NOT NULL DEFAULT '',
        file_json TEXT NOT NULL,
        published INTEGER NOT NULL DEFAULT 1,
        sort_order INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_media_kind ON site_media(kind);
      CREATE INDEX IF NOT EXISTS idx_media_pub ON site_media(published,sort_order,created_at DESC);
      CREATE TABLE IF NOT EXISTS email_events (
        id TEXT PRIMARY KEY,
        registration_id TEXT NOT NULL DEFAULT '',
        event TEXT NOT NULL,
        recipient TEXT NOT NULL,
        status TEXT NOT NULL,
        provider_id TEXT NOT NULL DEFAULT '',
        detail TEXT NOT NULL DEFAULT '',
        created_at TEXT NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_email_reg ON email_events(registration_id,created_at DESC);
      CREATE TABLE IF NOT EXISTS registration_sequences (
        key TEXT PRIMARY KEY,
        last_value INTEGER NOT NULL DEFAULT 0,
        updated_at TEXT NOT NULL
      );
      `);
      // Backward-compatible operational controls. Existing live registrations are preserved.
      const cols=[...this.sql.exec('PRAGMA table_info(registrations)')].map(r=>String(r.name||''));
      if(!cols.includes('active')) this.sql.exec('ALTER TABLE registrations ADD COLUMN active INTEGER NOT NULL DEFAULT 1');
      if(!cols.includes('payment_status')) this.sql.exec("ALTER TABLE registrations ADD COLUMN payment_status TEXT NOT NULL DEFAULT 'PENDING'");
    });
  }

  one(sql, ...binds){
    const rows = [...this.sql.exec(sql, ...binds)];
    return rows[0] || null;
  }
  many(sql, ...binds){ return [...this.sql.exec(sql, ...binds)]; }

  logEmail(registrationId,event,recipient,result){
    try{
      const id='MAIL-'+crypto.randomUUID();
      const status=result?.ok?'SENT':(result?.skipped?'SKIPPED':'FAILED');
      const detail=clean(result?.reason||'',500);
      const providerId=clean(result?.id||'',180);
      this.sql.exec('INSERT INTO email_events(id,registration_id,event,recipient,status,provider_id,detail,created_at) VALUES(?,?,?,?,?,?,?,?)',
        id,clean(registrationId,80),clean(event,80),clean(recipient,220),status,providerId,detail,nowIso());
    }catch(err){ console.error('email log failed',err); }
  }

  async sendLoggedEmail(registrationId,event,options){
    const result=await sendResendEmail(this.env,options);
    this.logEmail(registrationId,event,options.to,result);
    return result;
  }

  async sendRegistrationEmails({id,type,payload,files}){
    const ops=this.siteSettings().settings.operations||{};
    if(ops.registrationEmailsEnabled===false) return {emailSent:false,emailConfigured:Boolean(this.env.RESEND_API_KEY),emailReason:'disabled-by-admin'};
    const typeLabel=type==='teacher'?'Tutor':'Student';
    const verify=`${siteUrl(this.env)}/verify?id=${encodeURIComponent(id)}`;
    const rows=registrationSummary(payload,type);
    const uploadedFiles=Object.entries(files||{}).map(([field,meta])=>`${escapeHtml(field)}: ${escapeHtml(meta?.originalName||meta?.name||'uploaded file')}`).join('<br>');
    const applicantBody=emailShell('Registration Received',`
      <p>Hello <b>${escapeHtml(type==='teacher'?payload.name:payload.studentName)}</b>,</p>
      <p>Your ${escapeHtml(typeLabel.toLowerCase())} registration has been received successfully.</p>
      <p><b>Registration ID:</b> ${escapeHtml(id)}<br><b>Status:</b> Pending Verification</p>
      <p>Please keep this ID safe. You can check the current status at any time.</p>
      <p><a href="${escapeHtmlAttr(verify)}" style="display:inline-block;background:#1765E8;color:#fff;text-decoration:none;padding:11px 16px;border-radius:10px;font-weight:800">Check Registration Status</a></p>
    `);
    const paymentNote=files?.paymentProof
      ? '<p><b>Payment proof:</b> Submitted with this registration. Please review it in the Admin Panel before approval.</p>'
      : '';
    const adminBody=emailShell(`New ${typeLabel} Registration`,`
      <p>A new ${escapeHtml(typeLabel.toLowerCase())} registration has been submitted.</p>
      <p><b>Registration ID:</b> ${escapeHtml(id)}</p>
      <table style="width:100%;border-collapse:collapse;background:#f8fafc;border-radius:12px;overflow:hidden">${rows}</table>
      ${paymentNote}
      ${uploadedFiles?`<p><b>Uploaded documents:</b><br>${uploadedFiles}</p>`:''}
      <p style="margin-top:18px"><a href="${escapeHtmlAttr(siteUrl(this.env)+'/admin')}" style="display:inline-block;background:#061A3F;color:#fff;text-decoration:none;padding:11px 16px;border-radius:10px;font-weight:800">Open Admin Panel</a></p>
    `);
    const reply=adminEmail(this.env);
    const applicant=await this.sendLoggedEmail(id,'REGISTRATION_APPLICANT',{
      to:payload.email,
      subject:`Registration Received • ${id}`,
      html:applicantBody,
      text:`VISHU HOME TUITION: Registration received. ID: ${id}. Status: Pending Verification. Check: ${verify}`,
      replyTo:reply
    });
    const admin=await this.sendLoggedEmail(id,'REGISTRATION_ADMIN',{
      to:adminEmail(this.env),
      subject:`New ${typeLabel} Registration • ${id}`,
      html:adminBody,
      text:`New ${typeLabel} registration ${id}. ${type==='teacher'?payload.name:payload.studentName} • ${payload.phone} • ${payload.email}`,
      replyTo:payload.email
    });
    return {
      emailSent:Boolean(applicant.ok && admin.ok),
      emailConfigured:Boolean(this.env.RESEND_API_KEY)
    };
  }

  publicVerify(url){
    const id=clean(url.searchParams.get('id'),40).toUpperCase();
    if(!id) return json({error:'Registration ID is required.'},400);
    const row=this.one('SELECT id,type,status,name,phone,payload_json,active,created_at,updated_at FROM registrations WHERE id=?',id);
    if(!row) return json({error:'Registration ID not found.'},404);
    let payload={}; try{payload=JSON.parse(row.payload_json||'{}')}catch{}
    const isActive=Number(row.active)!==0;
    const details=row.type==='teacher'
      ? {qualification:clean(payload.qualification,160),experience:clean(payload.experience,120),classes:clean(payload.classes,120),subjects:clean(payload.subjects,220),area:clean(payload.area,160),contactNumber:clean(row.phone,20)}
      : {className:clean(payload.className,120),board:clean(payload.board,120),subjects:clean(payload.subjects,220),address:clean(payload.area,240),parentGuardian:clean(payload.parentName,160),contactNumber:clean(row.phone,20)};
    return json({
      id:row.id,type:row.type,status:(!isActive && row.status==='APPROVED')?'INACTIVE':row.status,name:row.name,
      active:isActive,verified:row.status==='APPROVED' && isActive,details,
      createdAt:row.created_at,updatedAt:row.updated_at
    });
  }


  uniqueId(type){
    // Permanent owner-approved ID format. No year or extra code.
    // Teacher sequence starts at VHT-T2500; Student sequence starts at VHT-S8500.
    // SQLite-backed per-type counters remain persistent across deployments.
    const isTeacher=type==='teacher';
    const prefix=isTeacher?'VHT-T':'VHT-S';
    const seed=isTeacher?2499:8499;
    const key=isTeacher?'teacher:permanent':'student:permanent';
    const ts=nowIso();
    const existing=this.one(
      `SELECT MAX(CAST(SUBSTR(id,6) AS INTEGER)) AS max_value FROM registrations WHERE id GLOB ?`,
      `${prefix}[0-9]*`
    );
    const start=Math.max(seed,Number(existing?.max_value||0));
    this.sql.exec(`INSERT INTO registration_sequences(key,last_value,updated_at) VALUES(?,?,?)
      ON CONFLICT(key) DO NOTHING`,key,start,ts);
    // If records with the new format were restored/imported later, never move the sequence backwards.
    this.sql.exec('UPDATE registration_sequences SET last_value=MAX(last_value,?),updated_at=? WHERE key=?',start,ts,key);
    this.sql.exec('UPDATE registration_sequences SET last_value=last_value+1,updated_at=? WHERE key=?',ts,key);
    const row=this.one('SELECT last_value FROM registration_sequences WHERE key=?',key);
    const seq=Math.max(seed+1,Number(row?.last_value||seed+1));
    return `${prefix}${seq}`;
  }

  async saveFile(id, type, field, file){
    if(!(file instanceof File) || !file.size) return null;
    const maxFile = type==='site' ? MEDIA_MAX_FILE : REGISTRATION_MAX_FILE;
    if(file.size > maxFile) throw new Error(`${field} exceeds ${type==='site'?'10':'5'} MB.`);
    if(!allowedUpload(field,file)) throw new Error(`${field} file type is not allowed.`);
    const raw = new Uint8Array(await file.arrayBuffer());
    const prefix = `file:${type}:${id}:${field}:${crypto.randomUUID()}`;
    const chunks = Math.ceil(raw.byteLength / CHUNK_SIZE);
    const savedKeys=[];
    try{
      for(let i=0;i<chunks;i++){
        const start=i*CHUNK_SIZE;
        const end=Math.min(start+CHUNK_SIZE,raw.byteLength);
        const piece=raw.slice(start,end);
        const key=`${prefix}:${i}`;
        await this.ctx.storage.put(key,piece.buffer,{noCache:true});
        savedKeys.push(key);
      }
    }catch(err){
      if(savedKeys.length) await this.ctx.storage.delete(savedKeys).catch(()=>{});
      throw err;
    }
    return {
      prefix,
      chunks,
      name:safeFileName(file.name || field),
      originalName:clean(file.name || field,180),
      type:clean(file.type || 'application/octet-stream',120),
      size:file.size
    };
  }

  async deleteFileMeta(meta){
    if(!meta?.prefix || !meta?.chunks) return;
    const keys=[];
    for(let i=0;i<meta.chunks;i++) keys.push(`${meta.prefix}:${i}`);
    if(keys.length) await this.ctx.storage.delete(keys).catch(()=>{});
  }
  async deleteFiles(files){
    await Promise.all(Object.values(files||{}).map(m=>this.deleteFileMeta(m)));
  }

  async register(request){
    let fd;
    try{ fd=await request.formData(); }
    catch{ return json({error:'Invalid form submission.'},400); }

    const type=clean(fd.get('type'),20).toLowerCase();
    if(!ALLOWED_TYPES.has(type)) return json({error:'Invalid registration type.'},400);
    const ops=this.siteSettings().settings.operations||{};
    if(type==='teacher' && ops.teacherRegistrationEnabled===false) return json({error:'Tutor registration is temporarily paused. Please contact VISHU HOME TUITION.'},503);
    if(type==='student' && ops.studentRegistrationEnabled===false) return json({error:'Student registration is temporarily paused. Please contact VISHU HOME TUITION.'},503);
    const payload=textPayload(fd);
    for(const field of requiredFields(type)){
      if(!payload[field]) return json({error:`Please complete ${field}.`},400);
    }
    if(!validPhone(payload.phone)) return json({error:'Enter a valid 10-digit Indian mobile number.'},400);
    if(!validEmail(payload.email)) return json({error:'Enter a valid email address.'},400);
    if(type==='student' && !['ADVANCE','NON_ADVANCE'].includes(payload.registrationType)){
      return json({error:'Select a valid registration option.'},400);
    }
    if(type==='student' && payload.registrationType==='ADVANCE' && !payload.advanceAmount){
      return json({error:'Enter the advance amount.'},400);
    }

    const id=await this.uniqueId(type);
    const files={};
    const fileFields=type==='teacher'
      ? ['photo','resumeDoc','marksheetDoc','identityDoc','paymentProof']
      : ['photo','paymentProof'];

    try{
      for(const field of fileFields){
        const f=fd.get(field);
        if(f instanceof File && f.size) files[field]=await this.saveFile(id,type,field,f);
      }
      if(!files.photo) throw new Error('Photo is required.');
      if(type==='teacher' && (!files.resumeDoc || !files.identityDoc || !files.paymentProof)){
        throw new Error('Photo, resume, identity proof and payment screenshot are required.');
      }
      if(type==='student' && payload.registrationType==='ADVANCE' && !files.paymentProof){
        throw new Error('Payment screenshot is required for advance registration.');
      }
    }catch(err){
      await this.deleteFiles(files);
      return json({error:err?.message || 'File upload failed.'},400);
    }

    const name=type==='teacher'?payload.name:payload.studentName;
    const ts=nowIso();
    try{
      this.sql.exec(`INSERT INTO registrations
        (id,type,status,name,phone,email,payload_json,files_json,note,created_at,updated_at)
        VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
        id,type,'PENDING',name,payload.phone,payload.email,JSON.stringify(payload),JSON.stringify(files),'',ts,ts);
      const initialPayment=files.paymentProof?'SUBMITTED':(type==='student' && payload.registrationType!=='ADVANCE'?'NOT_REQUIRED':'PENDING');
      this.sql.exec('UPDATE registrations SET payment_status=? WHERE id=?',initialPayment,id);
    }catch(err){
      await this.deleteFiles(files);
      console.error('insert failed',err);
      return json({error:'Registration could not be saved. Please try again.'},500);
    }
    const emailConfigured=Boolean(this.env.RESEND_API_KEY);
    const emailQueued=emailConfigured && ops.registrationEmailsEnabled!==false;
    if(emailQueued){
      this.ctx.waitUntil(
        this.sendRegistrationEmails({id,type,payload,files})
          .catch(err=>console.error('registration email flow failed',err))
      );
    }
    return json({ok:true,id,type,status:'PENDING',saved:true,emailConfigured,emailQueued,emailSent:false,paymentEmailSent:false});
  }


  async lead(request){
    const ops=this.siteSettings().settings.operations||{};
    if(ops.quickEnquiryEnabled===false) return json({error:'Quick enquiry is temporarily paused. Please contact VISHU HOME TUITION.'},503);
    let body={};
    try{
      const ct=request.headers.get('content-type')||'';
      if(ct.includes('application/json')) body=await request.json();
      else { const fd=await request.formData(); body=textPayload(fd); }
    }catch{return json({error:'Invalid request.'},400)}
    const source=clean(body.source||'website-quick-lead',60);
    const name=clean(body.name,120),phone=clean(body.phone,20),className=clean(body.className,80),board=clean(body.board,80),subjects=clean(body.subjects,240),area=clean(body.area,240),preferredTime=clean(body.preferredTime,120),details=clean(body.details,1800);
    if(!name||!phone||!className||!subjects||!area) return json({error:'Please complete name, mobile, class, subject and area.'},400);
    if(!validPhone(phone)) return json({error:'Enter a valid 10-digit Indian mobile number.'},400);
    const id=await this.uniqueId('student');
    const payload={source,quickLead:true,studentName:name,parentName:name,phone,email:'',className,board,subjects,area,preferredTime,details,registrationType:'QUICK_LEAD'};
    const ts=nowIso();
    try{
      this.sql.exec(`INSERT INTO registrations
        (id,type,status,name,phone,email,payload_json,files_json,note,created_at,updated_at)
        VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
        id,'student','PENDING',name,phone,'',JSON.stringify(payload),'{}','Quick website lead',ts,ts);
      this.sql.exec("UPDATE registrations SET payment_status='NOT_REQUIRED' WHERE id=?",id);
    }catch(err){
      console.error('lead insert failed',err);
      return json({error:'Request could not be saved. Please try again.'},500);
    }
    let adminNotified=false;
    try{
      const leadBody=emailShell('New Website Tutor Request',`
        <p>A new tutor request was submitted from <b>${escapeHtml(source)}</b>.</p>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:7px 10px;color:#6b7890;border-bottom:1px solid #eef2f7">Name</td><td style="padding:7px 10px;font-weight:700;border-bottom:1px solid #eef2f7">${escapeHtml(name)}</td></tr>
          <tr><td style="padding:7px 10px;color:#6b7890;border-bottom:1px solid #eef2f7">Phone</td><td style="padding:7px 10px;font-weight:700;border-bottom:1px solid #eef2f7">${escapeHtml(phone)}</td></tr>
          <tr><td style="padding:7px 10px;color:#6b7890;border-bottom:1px solid #eef2f7">Class</td><td style="padding:7px 10px;font-weight:700;border-bottom:1px solid #eef2f7">${escapeHtml(className)}</td></tr>
          <tr><td style="padding:7px 10px;color:#6b7890;border-bottom:1px solid #eef2f7">Subjects</td><td style="padding:7px 10px;font-weight:700;border-bottom:1px solid #eef2f7">${escapeHtml(subjects)}</td></tr>
          <tr><td style="padding:7px 10px;color:#6b7890">Area</td><td style="padding:7px 10px;font-weight:700">${escapeHtml(area)}</td></tr>
        </table>
        <p><b>Lead ID:</b> ${escapeHtml(id)}</p>
      `);
      const result=await this.sendLoggedEmail(id,'QUICK_LEAD_ADMIN',{
        to:adminEmail(this.env),
        subject:`New Tutor Request • ${id} • ${name}`,
        html:leadBody,
        text:`New tutor request ${id}: ${name}, ${phone}, Class ${className}, ${subjects}, ${area}.`
      });
      adminNotified=Boolean(result.ok);
    }catch(err){ console.error('quick lead email failed',err); }
    return json({ok:true,id,type:'student',status:'PENDING',source,saved:true,adminNotified,emailConfigured:Boolean(this.env.RESEND_API_KEY)});
  }

  status(url){
    const id=clean(url.searchParams.get('id'),40).toUpperCase();
    if(!id) return json({error:'Registration ID is required.'},400);
    const row=this.one('SELECT id,type,status,note,active,updated_at FROM registrations WHERE id=?',id);
    if(!row) return json({error:'Registration ID not found.'},404);
    return json({id:row.id,type:row.type,status:row.status,active:Number(row.active)!==0,note:row.note||'',updatedAt:row.updated_at});
  }

  list(url){
    let sql='SELECT id,type,status,name,phone,email,note,active,payment_status,created_at,updated_at FROM registrations WHERE 1=1';
    const binds=[];
    const type=clean(url.searchParams.get('type'),20).toLowerCase();
    const status=clean(url.searchParams.get('status'),30).toUpperCase();
    const q=clean(url.searchParams.get('q'),40);
    if(ALLOWED_TYPES.has(type)){sql+=' AND type=?';binds.push(type);}
    if(ALLOWED_STATUS.has(status)){sql+=' AND status=?';binds.push(status);}
    if(q){
      sql+=' AND (id LIKE ? OR name LIKE ? OR phone LIKE ? OR email LIKE ?)';
      const z=`%${q}%`;binds.push(z,z,z,z);
    }
    sql+=' ORDER BY created_at DESC LIMIT 300';
    return json({items:this.many(sql,...binds)});
  }

  detail(url){
    const id=clean(url.searchParams.get('id'),40).toUpperCase();
    if(!id) return json({error:'Registration ID is required.'},400);
    const row=this.one('SELECT * FROM registrations WHERE id=?',id);
    if(!row) return json({error:'Registration not found.'},404);
    let payload={},files={};
    try{payload=JSON.parse(row.payload_json||'{}')}catch{}
    try{files=JSON.parse(row.files_json||'{}')}catch{}
    const emails=this.many('SELECT event,recipient,status,provider_id,detail,created_at FROM email_events WHERE registration_id=? ORDER BY created_at DESC LIMIT 30',id);
    return json({id:row.id,type:row.type,status:row.status,name:row.name,phone:row.phone,email:row.email,note:row.note||'',active:Number(row.active)!==0,paymentStatus:row.payment_status||'PENDING',createdAt:row.created_at,updatedAt:row.updated_at,payload,files,emails});
  }

  async update(request){
    let body={};
    try{body=await request.json()}catch{return json({error:'Invalid JSON.'},400)}
    const id=clean(body.id,40).toUpperCase();
    const status=clean(body.status,30).toUpperCase();
    const note=clean(body.note,2000);
    const active=body.active===undefined?null:Boolean(body.active);
    const paymentStatus=body.paymentStatus===undefined?'':clean(body.paymentStatus,30).toUpperCase();
    if(!id || !ALLOWED_STATUS.has(status)) return json({error:'Valid id and status are required.'},400);
    if(paymentStatus && !ALLOWED_PAYMENT_STATUS.has(paymentStatus)) return json({error:'Invalid payment status.'},400);
    const row=this.one('SELECT id,type,status,name,email,payload_json,active,payment_status FROM registrations WHERE id=?',id);
    if(!row) return json({error:'Registration not found.'},404);
    const previousStatus=row.status;
    const ts=nowIso();
        const nextActive=active===null?(Number(row.active)!==0):active;
    const nextPayment=paymentStatus||row.payment_status||'PENDING';
    this.sql.exec('UPDATE registrations SET status=?,note=?,active=?,payment_status=?,updated_at=? WHERE id=?',status,note,nextActive?1:0,nextPayment,ts,id);
    // Owner-requested minimal applicant email flow:
    // 1) Registration Received, 2) Approved + Digital ID.
    // No separate payment/status/correction/rejection emails are sent.
    const emailSent=false;
    const emailResult={ok:false,skipped:true,reason:status==='APPROVED'?'approval-email-combined-with-digital-card':'owner-minimal-email-flow'};
    return json({ok:true,id,status,note,active:nextActive,paymentStatus:nextPayment,updatedAt:ts,statusChanged:status!==previousStatus,emailSent,emailConfigured:Boolean(this.env.RESEND_API_KEY),emailReason:emailResult?.reason||''});
  }

  async editRegistration(request){
    let body={};
    try{body=await request.json()}catch{return json({error:'Invalid JSON.'},400)}
    const id=clean(body.id,40).toUpperCase();
    if(!id) return json({error:'Registration ID is required.'},400);
    const row=this.one('SELECT id,type,payload_json FROM registrations WHERE id=?',id);
    if(!row) return json({error:'Registration not found.'},404);
    let current={};try{current=JSON.parse(row.payload_json||'{}')}catch{}
    const name=clean(body.name,160);
    const phone=clean(body.phone,20).replace(/\D+/g,'');
    const email=clean(body.email,180).toLowerCase();
    if(!name) return json({error:'Name is required.'},400);
    if(!validPhone(phone)) return json({error:'Enter a valid 10-digit Indian mobile number.'},400);
    if(!validEmail(email)) return json({error:'Enter a valid email address.'},400);
    const incoming=(body.payload&&typeof body.payload==='object')?sanitizeValue(body.payload):{};
    const payload={...current,...incoming};
    if(row.type==='teacher') payload.name=name; else payload.studentName=name;
    payload.phone=phone;payload.email=email;
    const ts=nowIso();
    this.sql.exec('UPDATE registrations SET name=?,phone=?,email=?,payload_json=?,updated_at=? WHERE id=?',name,phone,email,JSON.stringify(payload),ts,id);
    return json({ok:true,id,name,phone,email,payload,updatedAt:ts});
  }

  async sendCard(request){
    let body={};
    try{body=await request.json()}catch{return json({error:'Invalid JSON.'},400)}
    const id=clean(body.id,40).toUpperCase();
    const imageBase64=String(body.imageBase64||'').replace(/^data:image\/png;base64,/i,'').trim();
    const filename=safeFileName(body.filename||`${id}-DIGITAL-CARD.png`);
    if(!id || !imageBase64) return json({error:'Registration ID and digital card image are required.'},400);
    if(imageBase64.length > 9_000_000) return json({error:'Digital card image is too large.'},400);
    const row=this.one('SELECT id,type,status,name,email,active FROM registrations WHERE id=?',id);
    if(!row) return json({error:'Registration not found.'},404);
    if(row.status!=='APPROVED' || Number(row.active)===0) return json({error:'Registration must be approved and active before emailing the digital card.'},400);
    if(!validEmail(row.email)) return json({error:'Applicant email address is not valid.'},400);
    const verify=`${siteUrl(this.env)}/verify?id=${encodeURIComponent(id)}`;
    const typeLabel=row.type==='teacher'?'Tutor':'Student';
    const html=emailShell('Registration Approved • Digital ID',`
      <p>Hello <b>${escapeHtml(row.name)}</b>,</p>
      <p>Your VISHU HOME TUITION ${escapeHtml(typeLabel.toLowerCase())} registration has been <b>approved</b>.</p><p>Your approved digital ID card is attached to this email.</p>
      <p><b>Registration ID:</b> ${escapeHtml(id)}</p>
      <p><a href="${escapeHtmlAttr(verify)}" style="display:inline-block;background:#1765E8;color:#fff;text-decoration:none;padding:11px 16px;border-radius:10px;font-weight:800">Verify Digital ID</a></p>
      <p>Please keep the attached card for your records.</p>
    `);
    const result=await this.sendLoggedEmail(id,'DIGITAL_CARD_EMAIL',{
      to:row.email,
      subject:`Registration Approved • Digital ID • ${id}`,
      html,
      text:`VISHU HOME TUITION: Registration ${id} is approved. Your digital ID card is attached. Verify: ${verify}`,
      replyTo:replyToEmail(this.env),
      attachments:[{content:imageBase64,filename,content_type:'image/png'}]
    });
    if(!result.ok) return json({ok:false,error:result.reason||'Digital card email could not be sent.',emailConfigured:Boolean(this.env.RESEND_API_KEY)},400);
    return json({ok:true,id,to:row.email,providerId:result.id||''});
  }

  async file(url){
    const id=clean(url.searchParams.get('id'),40).toUpperCase();
    const field=clean(url.searchParams.get('field'),50);
    if(!id || !field) return json({error:'Registration ID and file field are required.'},400);
    const row=this.one('SELECT files_json FROM registrations WHERE id=?',id);
    if(!row) return json({error:'Registration not found.'},404);
    let files={};try{files=JSON.parse(row.files_json||'{}')}catch{}
    const meta=files[field];
    if(!meta?.prefix || !meta?.chunks) return json({error:'File not found.'},404);
    const pieces=[];
    let total=0;
    for(let i=0;i<meta.chunks;i++){
      const part=await this.ctx.storage.get(`${meta.prefix}:${i}`,{noCache:true});
      if(part==null) return json({error:'Stored file is incomplete.'},500);
      const bytes=part instanceof ArrayBuffer ? new Uint8Array(part) : new Uint8Array(part.buffer || part);
      pieces.push(bytes); total+=bytes.byteLength;
    }
    const all=new Uint8Array(total);let off=0;
    for(const p of pieces){all.set(p,off);off+=p.byteLength;}
    return new Response(all.buffer,{headers:{
      'content-type':meta.type||'application/octet-stream',
      'content-length':String(total),
      'content-disposition':`inline; filename="${safeFileName(meta.originalName||meta.name||field)}"`,
      'cache-control':'private, no-store',
      'x-content-type-options':'nosniff',
      'access-control-allow-origin':'*'
    }});
  }

  siteSettings(){
    const row=this.one("SELECT value_json,updated_at FROM site_content WHERE key='site'");
    let saved={}; if(row){try{saved=JSON.parse(row.value_json||'{}')}catch{saved={}}}
    return {settings:normalizeSiteSettings(saved),updatedAt:row?.updated_at||null};
  }

  contentGet(){
    const data=this.siteSettings();
    return json(data);
  }

  async contentSave(request){
    let body={};
    try{body=await request.json()}catch{return json({error:'Invalid JSON.'},400)}
    const settings=normalizeSiteSettings(sanitizeValue(body.settings ?? body));
    settings.schemaVersion=2;
    const raw=JSON.stringify(settings||{});
    if(raw.length>300000) return json({error:'Website settings are too large.'},400);
    const ts=nowIso();
    this.sql.exec(`INSERT INTO site_content(key,value_json,updated_at) VALUES('site',?,?)
      ON CONFLICT(key) DO UPDATE SET value_json=excluded.value_json,updated_at=excluded.updated_at`,raw,ts);
    return json({ok:true,settings,updatedAt:ts});
  }

  mediaList(url, admin=false){
    const kind=clean(url.searchParams.get('kind'),40);
    let sql='SELECT id,kind,title,caption,alt_text,published,sort_order,created_at,updated_at FROM site_media WHERE 1=1';
    const binds=[];
    if(!admin) sql+=' AND published=1';
    if(kind){sql+=' AND kind=?';binds.push(kind)}
    sql+=' ORDER BY sort_order ASC, created_at DESC LIMIT 250';
    const items=this.many(sql,...binds).map(r=>({
      id:r.id,kind:r.kind,title:r.title,caption:r.caption,altText:r.alt_text,
      published:Boolean(r.published),sortOrder:Number(r.sort_order||0),createdAt:r.created_at,updatedAt:r.updated_at,
      url:`/api/site-media/file?id=${encodeURIComponent(r.id)}`
    }));
    return json({items});
  }

  async mediaUpload(request){
    let fd; try{fd=await request.formData()}catch{return json({error:'Invalid upload.'},400)}
    const file=fd.get('file');
    if(!(file instanceof File) || !file.size) return json({error:'Choose an image file.'},400);
    if(!String(file.type||'').startsWith('image/')) return json({error:'Only image files are allowed.'},400);
    const id='VHT-M-'+crypto.randomUUID().replace(/-/g,'').slice(0,16).toUpperCase();
    let meta;
    try{meta=await this.saveFile(id,'site','media',file)}catch(err){return json({error:err?.message||'Upload failed.'},400)}
    const kind=clean(fd.get('kind')||'student-gallery',40) || 'student-gallery';
    const title=clean(fd.get('title'),180),caption=clean(fd.get('caption'),1000),alt=clean(fd.get('altText')||title,300);
    const published=String(fd.get('published')??'1')==='0'?0:1;
    const sortOrder=Math.max(-9999,Math.min(9999,Number(fd.get('sortOrder')||0)||0));
    const ts=nowIso();
    try{
      this.sql.exec('INSERT INTO site_media(id,kind,title,caption,alt_text,file_json,published,sort_order,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?)',
        id,kind,title,caption,alt,JSON.stringify(meta),published,sortOrder,ts,ts);
    }catch(err){await this.deleteFileMeta(meta);return json({error:'Could not save image.'},500)}
    return json({ok:true,id,url:`/api/site-media/file?id=${encodeURIComponent(id)}`});
  }

  async mediaUpdate(request){
    let body={}; try{body=await request.json()}catch{return json({error:'Invalid JSON.'},400)}
    const id=clean(body.id,80); if(!id) return json({error:'Media id is required.'},400);
    const row=this.one('SELECT id FROM site_media WHERE id=?',id); if(!row) return json({error:'Media not found.'},404);
    const title=clean(body.title,180),caption=clean(body.caption,1000),alt=clean(body.altText||title,300);
    const kind=clean(body.kind||'student-gallery',40)||'student-gallery';
    const published=body.published===false||body.published===0?0:1;
    const sortOrder=Math.max(-9999,Math.min(9999,Number(body.sortOrder||0)||0));
    const ts=nowIso();
    this.sql.exec('UPDATE site_media SET kind=?,title=?,caption=?,alt_text=?,published=?,sort_order=?,updated_at=? WHERE id=?',kind,title,caption,alt,published,sortOrder,ts,id);
    return json({ok:true,id,updatedAt:ts});
  }

  async mediaDelete(request){
    let body={}; try{body=await request.json()}catch{return json({error:'Invalid JSON.'},400)}
    const id=clean(body.id,80); if(!id) return json({error:'Media id is required.'},400);
    const row=this.one('SELECT file_json FROM site_media WHERE id=?',id); if(!row) return json({error:'Media not found.'},404);
    let meta={}; try{meta=JSON.parse(row.file_json||'{}')}catch{}
    await this.deleteFileMeta(meta); this.sql.exec('DELETE FROM site_media WHERE id=?',id);
    return json({ok:true,id});
  }

  async mediaFile(url, admin=false){
    const id=clean(url.searchParams.get('id'),80); if(!id) return json({error:'Media id is required.'},400);
    const row=this.one('SELECT file_json,published FROM site_media WHERE id=?',id); if(!row || (!admin && !row.published)) return json({error:'Image not found.'},404);
    let meta={}; try{meta=JSON.parse(row.file_json||'{}')}catch{}
    if(!meta?.prefix || !meta?.chunks) return json({error:'Image data not found.'},404);
    const pieces=[]; let total=0;
    for(let i=0;i<meta.chunks;i++){
      const part=await this.ctx.storage.get(`${meta.prefix}:${i}`,{noCache:true});
      if(part==null) return json({error:'Stored image is incomplete.'},500);
      const bytes=part instanceof ArrayBuffer?new Uint8Array(part):new Uint8Array(part.buffer||part);pieces.push(bytes);total+=bytes.byteLength;
    }
    const all=new Uint8Array(total);let off=0;for(const piece of pieces){all.set(piece,off);off+=piece.byteLength;}
    return new Response(all.buffer,{headers:{
      'content-type':meta.type||'image/jpeg','content-length':String(total),
      'cache-control':admin?'private, no-store':'public, max-age=3600','x-content-type-options':'nosniff',
      'access-control-allow-origin':'*'
    }});
  }

  async fetch(request){
    try{
      if(request.method==='OPTIONS'){
        const reqHeaders = request.headers.get('access-control-request-headers') || 'Content-Type, Authorization, x-admin-token, accept';
        return new Response(null,{
          status: 204,
          headers: {
            'access-control-allow-origin': '*',
            'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'access-control-allow-headers': reqHeaders,
            'access-control-max-age': '86400'
          }
        });
      }
      const url=new URL(request.url);
      const p=url.pathname.length>1?url.pathname.replace(/\/+$/,''):url.pathname;
      if(p==='/api/internal-health') return json({ok:true,storage:'durable-object-sqlite'});
      if(p==='/api/register' && request.method==='POST') return this.register(request);
      if(p==='/api/lead' && request.method==='POST') return this.lead(request);
      if(p==='/api/status' && request.method==='GET') return this.status(url);
      if(p==='/api/public-verify' && request.method==='GET') return this.publicVerify(url);
      if(p==='/api/site-content' && request.method==='GET') return this.contentGet();
      if(p==='/api/site-media' && request.method==='GET') return this.mediaList(url,false);
      if(p==='/api/site-media/file' && request.method==='GET') return this.mediaFile(url,false);
      if(p==='/api/admin/content' && request.method==='GET') return this.contentGet();
      if(p==='/api/admin/content' && request.method==='POST') return this.contentSave(request);
      if(p==='/api/admin/media/list' && request.method==='GET') return this.mediaList(url,true);
      if(p==='/api/admin/media/upload' && request.method==='POST') return this.mediaUpload(request);
      if(p==='/api/admin/media/update' && request.method==='POST') return this.mediaUpdate(request);
      if(p==='/api/admin/media/delete' && request.method==='POST') return this.mediaDelete(request);
      if(p==='/api/admin/media/file' && request.method==='GET') return this.mediaFile(url,true);
      if(p==='/api/admin/list' && request.method==='GET') return this.list(url);
      if(p==='/api/admin/detail' && request.method==='GET') return this.detail(url);
      if(p==='/api/admin/update' && request.method==='POST') return this.update(request);
      if(p==='/api/admin/edit' && request.method==='POST') return this.editRegistration(request);
      if(p==='/api/admin/send-card' && request.method==='POST') return this.sendCard(request);
      if(p==='/api/admin/file' && request.method==='GET') return this.file(url);
      return json({error:'Not found.'},404);
    }catch(err){
      console.error('DO error',err);
      return json({error:'Server error. Please try again.'},500);
    }
  }
}

export default {
  async fetch(request, env) {
    try{
      if(request.method==='OPTIONS'){
        const reqHeaders = request.headers.get('access-control-request-headers') || 'Content-Type, Authorization, x-admin-token, accept';
        return new Response(null,{
          status: 204,
          headers: {
            'access-control-allow-origin': '*',
            'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'access-control-allow-headers': reqHeaders,
            'access-control-max-age': '86400'
          }
        });
      }
      const url=new URL(request.url);
      const p=url.pathname.length>1?url.pathname.replace(/\/+$/,''):url.pathname;

      if(url.hostname.endsWith('.pages.dev')){
        const canonical=new URL(request.url);
        canonical.protocol='https:'; canonical.hostname='vishuhometuition.in'; canonical.port='';
        return Response.redirect(canonical.toString(),301);
      }

      if(url.hostname==='www.vishuhometuition.in'){
        url.hostname='vishuhometuition.in';
        return Response.redirect(url.toString(),301);
      }

      if(p==='/admin'){
        const homeUrl=new URL('/',request.url);
        const r=await env.ASSETS.fetch(new Request(homeUrl,request));
        const h=new Headers(r.headers);
        h.set('x-robots-tag','noindex, nofollow');
        h.set('cache-control','no-store');
        h.set('x-frame-options','SAMEORIGIN');
        h.set('referrer-policy','same-origin');
        h.set('permissions-policy','camera=(), microphone=(), geolocation=()');
        h.set('content-security-policy',"frame-ancestors 'self'");
        return new Response(r.body,{status:r.status,statusText:r.statusText,headers:h});
      }
      if(p==='/quick-enquiry'){
        const qUrl=new URL('/quick-enquiry/index.html',request.url);
        return env.ASSETS.fetch(new Request(qUrl,request));
      }
      if(p==='/student-registration') return Response.redirect(new URL('/#register-student',request.url).toString(),302);
      if(p==='/tutor-registration'||p==='/teacher-registration') return Response.redirect(new URL('/#register-tutor',request.url).toString(),302);

      if(p==='/verify' && request.method==='GET'){
        const id=clean(url.searchParams.get('id'),40).toUpperCase();
        if(!id) return new Response(verificationPage({status:'REQUIRED',id:'',name:'Registration ID required'}),{status:400,headers:{'content-type':'text/html; charset=UTF-8','cache-control':'no-store','x-robots-tag':'noindex, nofollow'}});
        const storeId=env.REG_STORE.idFromName('vishu-home-tuition-registrations');
        const stub=env.REG_STORE.get(storeId);
        const vr=await stub.fetch(new Request(new URL(`/api/public-verify?id=${encodeURIComponent(id)}`,request.url),{method:'GET'}));
        const data=await vr.json().catch(()=>({error:'Verification unavailable.'}));
        if(!vr.ok){
          const body=verificationPage({status:'NOT_FOUND',id,name:data.error||'Registration not found',verified:false,details:{}});
          return new Response(body,{status:vr.status,headers:{'content-type':'text/html; charset=UTF-8','cache-control':'no-store','x-robots-tag':'noindex, nofollow'}});
        }
        return new Response(verificationPage(data),{headers:{'content-type':'text/html; charset=UTF-8','cache-control':'no-store','x-robots-tag':'noindex, nofollow'}});
      }

      if(p.startsWith('/api/')){
        if(p.startsWith('/api/admin/') && !adminAuthorized(request,env)){
          return json({error:'Unauthorized.'},401);
        }
        if(p==='/api/admin/system' && request.method==='GET'){
          return json({
            ok:true,
            emailProvider:'Resend',
            emailConfigured:Boolean(env.RESEND_API_KEY),
            adminEmail:adminEmail(env),
            replyToEmail:replyToEmail(env),
            mailFrom:mailFrom(env),
            siteUrl:siteUrl(env),
            digitalCard:true,
            verifyUrl:`${siteUrl(env)}/verify?id=REGISTRATION_ID`
          });
        }
        if(p==='/api/admin/email-test' && request.method==='POST'){
          const target=adminEmail(env);
          const result=await sendResendEmail(env,{
            to:target,
            subject:'VISHU HOME TUITION • Email Test',
            html:emailShell('Email System Test','<p>Your website transactional email system is configured correctly.</p><p>This test was sent from the live VISHU HOME TUITION Worker.</p>'),
            text:'VISHU HOME TUITION email system test successful.',
            replyTo:target
          });
          if(!result.ok) return json({ok:false,error:result.reason||'Email test failed.',emailConfigured:Boolean(env.RESEND_API_KEY)},400);
          return json({ok:true,to:target,providerId:result.id||''});
        }
        const id=env.REG_STORE.idFromName('vishu-home-tuition-registrations');
        const stub=env.REG_STORE.get(id);
        if(p==='/api/health'){
          const probe=new Request(new URL('/api/internal-health',request.url),{method:'GET'});
          const r=await stub.fetch(probe);
          const d=await r.json().catch(()=>({}));
          return json({ok:r.ok,backendReady:r.ok,storage:d.storage||'durable-object',admin:Boolean(env.ADMIN_TOKEN)} , r.ok?200:503);
        }
        const resp = await stub.fetch(request);
        const corsHeaders = new Headers(resp.headers);
        if(!corsHeaders.has('access-control-allow-origin')){
          corsHeaders.set('access-control-allow-origin', '*');
          corsHeaders.set('access-control-allow-methods', 'GET, POST, PUT, DELETE, OPTIONS');
          corsHeaders.set('access-control-allow-headers', 'Content-Type, Authorization, x-admin-token, accept');
        }
        return new Response(resp.body, { status: resp.status, statusText: resp.statusText, headers: corsHeaders });
      }

      // Serve the two SEO-critical HTML pages through the Worker so Admin content changes can
      // update browser/search metadata without rebuilding the static bundle.
      if(request.method==='GET' && (p==='/' || p==='/home-tuition-gorakhpur')){
        const assetResponse=await env.ASSETS.fetch(request);
        const ct=assetResponse.headers.get('content-type')||'';
        if(assetResponse.ok && ct.includes('text/html')){
          let html=await assetResponse.text();
          try{
            const id=env.REG_STORE.idFromName('vishu-home-tuition-registrations');
            const stub=env.REG_STORE.get(id);
            const cfgResp=await stub.fetch(new Request(new URL('/api/site-content',request.url),{method:'GET'}));
            const cfg=await cfgResp.json().catch(()=>({settings:{}}));
            const settings=cfg.settings||{};
            const seo=settings.seo||{};
            const isLanding=p==='/home-tuition-gorakhpur';
            const title=clean(isLanding?seo.landingTitle:seo.homeTitle,180);
            const desc=clean(isLanding?seo.landingDescription:seo.homeDescription,350);
            if(title) html=html.replace(/<title>[\s\S]*?<\/title>/i,`<title>${escapeHtmlAttr(title)}</title>`);
            if(desc){
              const meta=`<meta name="description" content="${escapeHtmlAttr(desc)}">`;
              if(/<meta\s+name=["']description["'][^>]*>/i.test(html)) html=html.replace(/<meta\s+name=["']description["'][^>]*>/i,meta);
              else html=html.replace(/<\/head>/i,meta+'\n</head>');
            }
            const seed=JSON.stringify(settings).replace(/</g,'\\u003c');
            html=html.replace(/<\/head>/i,`<script>window.__VHT_CMS_SEED__=${seed};<\/script>\n</head>`);
          }catch(err){ console.error('cms html injection failed',err); }
          const h=new Headers(assetResponse.headers);h.set('cache-control','no-store');h.delete('content-length');
          return new Response(html,{status:assetResponse.status,statusText:assetResponse.statusText,headers:h});
        }
        return assetResponse;
      }

      return env.ASSETS.fetch(request);
    }catch(err){
      console.error('worker error',err);
      return json({error:'Server error. Please try again.'},500);
    }
  }
};
