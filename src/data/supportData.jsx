export const FAQ_SVG = {
  lock:    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--rose)" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>,
  child:   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--rose)" strokeWidth="1.8" strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>,
  share:   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--rose)" strokeWidth="1.8" strokeLinecap="round"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>,
  vacc:    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--rose)" strokeWidth="1.8" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/><polyline points="8 14 2 20"/><polyline points="20 6 14 12"/></svg>,
  appt:    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--rose)" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  ai:      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--rose)" strokeWidth="1.8" strokeLinecap="round"><path d="M12 2a4 4 0 014 4c0 1.5-.8 2.8-2 3.5V11h-4V9.5A4 4 0 0112 2z"/><rect x="8" y="11" width="8" height="5" rx="1"/><path d="M10 16v3M14 16v3M7 19h10"/></svg>,
  growth:  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--rose)" strokeWidth="1.8" strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  edit:    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--rose)" strokeWidth="1.8" strokeLinecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
};


export const FAQ_ITEMS = [
  { q:'How is my data stored and protected?',
    a:'All your health records are encrypted with AES-256 and stored on servers in Germany, fully compliant with DSGVO (GDPR). Only you can access your data — PediVault staff cannot view your records. You can export or delete all your data at any time from account settings.',
    icon:FAQ_SVG.lock, tag:'Privacy' },
  { q:'How do I add a second child to my account?',
    a:'Tap the "+" button next to your child tabs in the header. Enter your child\'s name, date of birth, gender and blood group. They\'ll appear as a new tab and all modules will show their individual records.',
    icon:FAQ_SVG.child, tag:'Account' },
  { q:'Can I share records with my child\'s doctor?',
    a:'Yes — open any health record and tap the Download button to save it as a PDF. You can then share it via email, WhatsApp or print it to bring to your paediatrician.',
    icon:FAQ_SVG.share, tag:'Records' },
  { q:'Are the vaccine recommendations official?',
    a:'Yes. PediVault uses the official STIKO 2026 immunisation schedule published by the Robert Koch Institute (RKI). Recommendations are updated annually. Always discuss any changes with your paediatrician.',
    icon:FAQ_SVG.vacc, tag:'Vaccines' },
  { q:'What does U-Untersuchung mean?',
    a:'U-Untersuchungen are Germany\'s statutory paediatric check-ups (U1 through U9) covered by all Krankenkassen at no cost. They check your child\'s development, growth and vaccination status at specific ages from birth to 5 years.',
    icon:FAQ_SVG.appt, tag:'Healthcare' },
  { q:'How does the AI Assistant work?',
    a:'The AI Assistant is powered by Claude (Anthropic) and has access to your child\'s health context. It can answer paediatric questions and help you understand your child\'s records. It is not a substitute for medical advice.',
    icon:FAQ_SVG.ai, tag:'AI' },
  { q:'How do I update my child\'s growth measurements?',
    a:'Go to the Growth module and tap "Add Entry". Enter the date, weight, height and head circumference. The charts and percentiles will update automatically.',
    icon:FAQ_SVG.growth, tag:'Growth' },
  { q:'What should I do if I find an error in my records?',
    a:'Tap "Contact Support" below and describe the issue. For records uploaded in error, open the record and contact us with the record name. We\'ll help you correct it.',
    icon:FAQ_SVG.edit, tag:'Records' },
];


export const EMERGENCY_SVG = {
  phone: (c) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.69A2 2 0 012 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>,
  heart: (c) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
  clock: (c) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>,
  warn:  (c) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
};


export const EMERGENCY_NUMBERS = [
  {number:'112',            label:'Emergency Services', sub:'Ambulance, fire, police — Europe-wide',            color:'var(--red)',    icon:EMERGENCY_SVG.phone('var(--red)')},
  {number:'116 117',        label:'Medical On-Call',    sub:'Non-emergency medical advice outside clinic hours', color:'var(--amber)',  icon:EMERGENCY_SVG.heart('var(--amber)')},
  {number:'0800 111 0 111', label:'Crisis Line',        sub:'Telefonseelsorge — free, 24h, confidential',        color:'var(--blue)',   icon:EMERGENCY_SVG.clock('var(--blue)')},
  {number:'0800 1110333',   label:'Poison Control',     sub:'Giftnotruf — if your child has swallowed something', color:'var(--purple)', icon:EMERGENCY_SVG.warn('var(--purple)')},
];




export const HELP_TOPICS = [
  {id:'started', label:'Getting Started', articles:12, color:'var(--rose)',
   icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--rose)" strokeWidth="1.7" strokeLinecap="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>,
   items:[
     {n:1,title:'Adding your first child profile',    time:'2 min', views:'5.2k'},
     {n:2,title:'Uploading your first health record', time:'3 min', views:'4.1k'},
     {n:3,title:'Navigating the dashboard',            time:'2 min', views:'3.8k'},
     {n:4,title:'Setting up vaccine tracking',         time:'4 min', views:'3.3k'},
     {n:5,title:'Logging a growth measurement',        time:'2 min', views:'2.9k'},
     {n:6,title:'Booking your first appointment',      time:'2 min', views:'2.6k'},
     {n:7,title:'Understanding the home dashboard',    time:'3 min', views:'2.2k'},
     {n:8,title:'Using the AI Assistant',              time:'3 min', views:'2.0k'},
     {n:9,title:'Switching between children',          time:'1 min', views:'1.8k'},
     {n:10,title:'Downloading records as PDF',         time:'2 min', views:'1.5k'},
     {n:11,title:'Setting up emergency contacts',      time:'2 min', views:'1.3k'},
     {n:12,title:'Managing medications',               time:'3 min', views:'1.1k'},
   ]},
  {id:'records', label:'Health Records', articles:9, color:'var(--blue)',
   icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="1.7" strokeLinecap="round"><path d="M9 2H5a2 2 0 00-2 2v16a2 2 0 002 2h14a2 2 0 002-2V9z"/><polyline points="9 2 9 9 16 9"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>,
   items:[
     {n:1,title:'Supported file types for uploads',     time:'1 min', views:'4.5k'},
     {n:2,title:'Organising records by category',       time:'2 min', views:'3.7k'},
     {n:3,title:'Sharing records with your doctor',     time:'3 min', views:'3.2k'},
     {n:4,title:'Searching and filtering records',      time:'2 min', views:'2.8k'},
     {n:5,title:'Understanding record security',        time:'4 min', views:'2.1k'},
     {n:6,title:'Exporting all your data',              time:'2 min', views:'1.9k'},
     {n:7,title:'Correcting an uploaded record',        time:'2 min', views:'1.6k'},
     {n:8,title:'Storage limits on free vs premium',    time:'1 min', views:'1.4k'},
     {n:9,title:'Deleting individual records',          time:'1 min', views:'1.2k'},
   ]},
  {id:'vaccines', label:'Vaccine Tracker', articles:7, color:'var(--green)',
   icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="1.7" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>,
   items:[
     {n:1,title:'How the STIKO schedule works',         time:'3 min', views:'6.1k'},
     {n:2,title:'Logging a completed vaccination',      time:'2 min', views:'5.3k'},
     {n:3,title:'What "Overdue" means for vaccines',    time:'2 min', views:'4.8k'},
     {n:4,title:'Generating a vaccination summary PDF', time:'2 min', views:'3.2k'},
     {n:5,title:'Catch-up schedules after missed doses',time:'4 min', views:'2.9k'},
     {n:6,title:'Influenza — annual vaccine guidance',  time:'2 min', views:'2.1k'},
     {n:7,title:'U-Untersuchungen and vaccines',        time:'3 min', views:'1.8k'},
   ]},
  {id:'privacy', label:'Account & Privacy', articles:8, color:'var(--purple)',
   icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--purple)" strokeWidth="1.7" strokeLinecap="round"><circle cx="12" cy="7" r="4"/><path d="M6 20v-1a6 6 0 0112 0v1"/><rect x="9" y="12" width="6" height="5" rx="1" ry="1"/><line x1="12" y1="12" x2="12" y2="10"/></svg>,
   items:[
     {n:1,title:'Changing your password',               time:'1 min', views:'3.8k'},
     {n:2,title:'Two-factor authentication setup',      time:'3 min', views:'2.2k'},
     {n:3,title:'Data encryption and security',         time:'4 min', views:'1.9k'},
     {n:4,title:'GDPR / DSGVO compliance overview',     time:'5 min', views:'1.3k'},
     {n:5,title:'Deleting your account',                time:'2 min', views:'1.4k'},
     {n:6,title:'Accessing your data export',           time:'2 min', views:'1.7k'},
     {n:7,title:'Managing linked devices',              time:'2 min', views:'0.9k'},
     {n:8,title:'Privacy settings overview',            time:'3 min', views:'2.0k'},
   ]},
  {id:'ai', label:'AI Assistant', articles:5, color:'var(--amber)',
   icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--amber)" strokeWidth="1.7" strokeLinecap="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/><path d="M8 10h.01M12 10h.01M16 10h.01"/></svg>,
   items:[
     {n:1,title:'How the AI Assistant uses your data',  time:'3 min', views:'4.4k'},
     {n:2,title:'What the AI can and cannot do',        time:'2 min', views:'3.9k'},
     {n:3,title:'Data privacy and AI responses',        time:'3 min', views:'2.6k'},
     {n:4,title:'Getting the best answers from AI',     time:'2 min', views:'2.1k'},
     {n:5,title:'Disabling the AI Assistant',           time:'1 min', views:'1.3k'},
   ]},
  {id:'billing', label:'Billing & Plans', articles:6, color:'var(--rose)',
   icon:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--rose)" strokeWidth="1.7" strokeLinecap="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/><line x1="6" y1="15" x2="10" y2="15"/></svg>,
   items:[
     {n:1,title:'PediVault Free vs Pro — comparison',   time:'3 min', views:'6.1k'},
     {n:2,title:'Upgrading to Pro',                     time:'2 min', views:'4.3k'},
     {n:3,title:'Cancelling your subscription',         time:'2 min', views:'2.8k'},
     {n:4,title:'Accepted payment methods',             time:'1 min', views:'2.1k'},
     {n:5,title:'Requesting a refund',                  time:'2 min', views:'1.7k'},
     {n:6,title:'Family plan pricing',                  time:'2 min', views:'1.4k'},
   ]},
];

