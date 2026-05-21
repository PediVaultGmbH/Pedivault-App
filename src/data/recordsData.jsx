export const RECORD_TYPE_CFG = {
  'Lab Report':             {color:'var(--blue)',   bg:'var(--blue-bg)',   border:'var(--blue-lt)',            icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="1.8" strokeLinecap="round"><path d="M9 3h6m-6 0v8l-4 9h14l-4-9V3"/><line x1="6" y1="14" x2="18" y2="14"/></svg>},
  'Prescription':           {color:'var(--rose)',   bg:'var(--rose-pale)', border:'var(--rose-lt)',            icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--rose)" strokeWidth="1.8" strokeLinecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M9 13h6M9 17h4"/></svg>},
  'Vaccination Certificate':{color:'var(--green)',  bg:'var(--green-bg)',  border:'var(--green-lt)',           icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="1.8" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>},
  'Scan / X-ray':           {color:'var(--purple)', bg:'rgba(123,82,176,.08)', border:'rgba(123,82,176,.18)', icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--purple)" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6M9 12h6M9 15h4"/></svg>},
  'Discharge Summary':      {color:'var(--amber)',  bg:'var(--amber-bg)',  border:'var(--amber-lt)',           icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--amber)" strokeWidth="1.8" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>},
  'Other':                  {color:'var(--ink-3)',  bg:'var(--cream-2)',   border:'var(--line2)',              icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--ink-3)" strokeWidth="1.8" strokeLinecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>},
};



export const BASE_RECORDS_AANYA = [
  {id:'r1', name:'Full Blood Count — CBC Panel',           type:'Lab Report',              date:'2025-04-10', source:'Apollo Diagnostics',    size:'1.8 MB', tags:['CBC','Iron','Haemoglobin'],   notes:'Annual blood work — all values within normal range'},
  {id:'r2', name:'Allergy Sensitivity Panel',              type:'Lab Report',              date:'2025-02-14', source:'Fortis Diagnostics',    size:'2.4 MB', tags:['Allergy','IgE','RAST'],        notes:'Mild sensitivity to dust mites and pollen detected'},
  {id:'r3', name:'Amoxicillin 125mg/5ml Prescription',    type:'Prescription',            date:'2025-01-08', source:'Dr. Kavita Singh',      size:'0.3 MB', tags:['Antibiotic','5-day course'],   notes:'Dosage: 5ml twice daily with food for 5 days'},
  {id:'r4', name:'STIKO Vaccination Certificate 2024',     type:'Vaccination Certificate', date:'2024-09-12', source:'Dr. Priya Mehta',       size:'0.5 MB', tags:['STIKO','Immunisation'],        notes:'Official German vaccination record — HepB, DTaP, PCV, Rota, MenB completed'},
  {id:'r5', name:'Chest X-ray — Respiratory Check',        type:'Scan / X-ray',           date:'2024-06-03', source:'Charité Radiologie',    size:'8.2 MB', tags:['X-ray','Chest','Lungs'],       notes:'Mild bronchitis episode — lungs clear, no consolidation'},
  {id:'r6', name:'Viral Fever Discharge Summary',          type:'Discharge Summary',       date:'2024-03-18', source:'Fortis Children\'s Clinic', size:'1.1 MB', tags:['Fever','Discharge'],      notes:'3-day admission — resolved with IV fluids and Paracetamol'},
  {id:'r7', name:'Growth Chart Printout — Q2 2024',        type:'Other',                  date:'2024-05-10', source:'Dr. Kavita Singh',      size:'0.4 MB', tags:['Growth','WHO','Percentile'],   notes:'Weight 11.3kg (52nd %ile), Height 83cm (48th %ile)'},
  {id:'r8', name:'Paracetamol 120mg Suspension Rx',        type:'Prescription',            date:'2024-03-18', source:'Fortis Children\'s Clinic', size:'0.2 MB', tags:['Antipyretic','Fever'],    notes:'Dosage: 5ml every 6 hours as needed for fever above 38.5°C'},
];

