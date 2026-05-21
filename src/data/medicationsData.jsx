export const MED_TYPE_CFG = {
  'Antibiotic':   {color:'var(--rose)',   bg:'var(--rose-pale)',        border:'var(--rose-lt)',           icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--rose)"   strokeWidth="1.8" strokeLinecap="round"><path d="M10.5 20H4a2 2 0 01-2-2V6a2 2 0 012-2h16a2 2 0 012 2v7.5"/><path d="M8 12h8"/><circle cx="18" cy="18" r="4"/><path d="M18 16v4M16 18h4"/></svg>},
  'Painkiller':   {color:'var(--amber)',  bg:'var(--amber-bg)',         border:'var(--amber-lt)',          icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--amber)"  strokeWidth="1.8" strokeLinecap="round"><path d="M14 14.76V3.5a2.5 2.5 0 00-5 0v11.26a4.5 4.5 0 105 0z"/></svg>},
  'Vitamin':      {color:'var(--green)',  bg:'var(--green-bg)',         border:'var(--green-lt)',          icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--green)"  strokeWidth="1.8" strokeLinecap="round"><path d="M11 20A7 7 0 0118 4.93l-3.07 3.07A3 3 0 0014 8a3 3 0 00-3 3l-6 6 3 3h3z"/></svg>},
  'Antihistamine':{color:'var(--blue)',   bg:'var(--blue-bg)',          border:'var(--blue-lt)',           icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--blue)"   strokeWidth="1.8" strokeLinecap="round"><path d="M17.7 7.7a2.5 2.5 0 111.8 4.3H2"/><path d="M9.6 4.6A2 2 0 1111 8H2"/><path d="M12.6 19.4A2 2 0 1014 16H2"/></svg>},
  'Probiotic':    {color:'var(--green)',  bg:'var(--green-bg)',         border:'var(--green-lt)',          icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--green)"  strokeWidth="1.8" strokeLinecap="round"><path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0L12 2.69z"/></svg>},
  'Antiviral':    {color:'var(--purple)', bg:'rgba(123,82,176,.08)',    border:'rgba(123,82,176,.18)',     icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--purple)" strokeWidth="1.8" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>},
  'Steroid':      {color:'var(--amber)',  bg:'var(--amber-bg)',         border:'var(--amber-lt)',          icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--amber)"  strokeWidth="1.8" strokeLinecap="round"><path d="M9 3h6m-6 0v8l-4 9h14l-4-9V3"/><line x1="6" y1="14" x2="18" y2="14"/></svg>},
  'Other':        {color:'var(--ink-3)',  bg:'var(--cream-2)',          border:'var(--line2)',             icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--ink-3)" strokeWidth="1.8" strokeLinecap="round"><path d="M18 2l4 4-1 1-4-4zM14.5 5.5l4 4M12 8l-8 8 1 3 3 1 8-8"/></svg>},
};



export const BASE_MEDS_AANYA = [
  {id:'m1', name:'Amoxicillin 125mg/5ml', type:'Antibiotic',    dosage:'5ml',    frequency:'Twice daily',    duration:'5 days',   startDate:'2025-01-08', doctor:'Dr. Kavita Singh', notes:'Take with food. Complete full course.', status:'completed'},
  {id:'m2', name:'Paracetamol 120mg/5ml', type:'Painkiller',    dosage:'5ml',    frequency:'As needed',      duration:'As needed', startDate:'2025-01-08', doctor:'Dr. Priya Mehta',  notes:'Only for fever above 38.5°C. Max 4 doses per 24h.',status:'active'},
  {id:'m3', name:'Vitamin D 400IU drops', type:'Vitamin',       dosage:'5 drops',frequency:'Once daily',     duration:'Ongoing',  startDate:'2024-10-01', doctor:'Dr. Kavita Singh', notes:'Give after morning feed. Shake well before use.', status:'active'},
  {id:'m4', name:'Cetirizine 2.5mg/ml',   type:'Antihistamine', dosage:'2.5ml',  frequency:'Once daily',     duration:'14 days',  startDate:'2025-04-01', doctor:'Dr. Priya Mehta',  notes:'For seasonal allergies. Give at bedtime.',        status:'completed'},
  {id:'m5', name:'Lactobacillus probiotics',type:'Probiotic',   dosage:'1 sachet',frequency:'Once daily',    duration:'5 days',   startDate:'2025-01-08', doctor:'Dr. Kavita Singh', notes:'During and after antibiotic course to restore gut flora.', status:'completed'},
];
