export const APPT_TYPE_CFG = {
  'Vaccination':     {color:'var(--rose)',   bg:'var(--rose-pale)', border:'var(--rose-lt)',          icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--rose)" strokeWidth="1.8" strokeLinecap="round"><path d="M18 2l4 4-1 1-4-4zM14.5 5.5l4 4M12 8l-8 8 1 3 3 1 8-8"/></svg>},
  'General Check-up':{color:'var(--green)',  bg:'var(--green-bg)',  border:'var(--green-lt)',          icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="1.8" strokeLinecap="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>},
  'U-Untersuchung':  {color:'var(--blue)',   bg:'var(--blue-bg)',   border:'var(--blue-lt)',           icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>},
  'Sick Visit':      {color:'var(--red)',    bg:'var(--red-bg)',    border:'rgba(185,40,20,.18)',       icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="1.8" strokeLinecap="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>},
  'Growth Check':    {color:'var(--green)',  bg:'var(--green-bg)',  border:'var(--green-lt)',           icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="1.8" strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>},
  'Other':           {color:'var(--ink-3)',  bg:'var(--cream-2)',   border:'var(--line2)',              icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--ink-3)" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>},
};




export const BASE_APPTS_AANYA = [
  {id:'a1', type:'Vaccination',     doctor:'Dr. Priya Mehta',  clinic:"Fortis Children's Clinic", date:'2026-05-12', time:'10:30', notes:'MMR Dose 2 + Varicella Dose 2 — bring yellow vaccination booklet (Impfpass)'},
  {id:'a2', type:'Growth Check',    doctor:'Dr. Kavita Singh', clinic:'Apollo Paediatrics',        date:'2026-05-28', time:'14:00', notes:'Height, weight and head circumference. Developmental milestone check.'},
  {id:'a3', type:'General Check-up',doctor:'Dr. Kavita Singh', clinic:'Apollo Paediatrics',        date:'2025-11-15', time:'11:00', notes:'U7a check-up — all milestones met, growth on track'},
  {id:'a4', type:'Sick Visit',      doctor:'Dr. Priya Mehta',  clinic:"Fortis Children's Clinic", date:'2024-03-18', time:'09:30', notes:'High fever 39.2°C — viral infection, prescribed Paracetamol 5-day course'},
  {id:'a5', type:'U-Untersuchung',  doctor:'Dr. Kavita Singh', clinic:'Apollo Paediatrics',        date:'2023-09-12', time:'10:00', notes:'U6 check-up — development and speech on track for age'},
];

