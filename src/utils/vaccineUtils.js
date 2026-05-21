import { STIKO } from '../data/stiko';

export function getVaccStatus(vaccId, dose, records, childAgeMo) {
 const given = (records[vaccId]||[]).find(r=>r.dose===dose.dose && new Date(r.date) <= new Date());
if(given) return {status:'done', date:given.date, by:given.by};
  if(childAgeMo >= dose.ageMaxMo) return {status:'overdue'};
  if(childAgeMo >= dose.ageMinMo-1) return {status:'due-soon'};
  return {status:'upcoming'};
}


/* ── Fix 1: robust vaccine ID lookup ── */

// Robust vaccine ID lookup — matches by id, partial name, or alias
export function findVaccId(name) {
  if(!name) return null;
  const n = name.toLowerCase();
  return STIKO.find(v=>
    n.includes(v.short.toLowerCase()) ||
    n.includes(v.id.toLowerCase()) ||
    v.name.toLowerCase().includes(n.split('(')[0].trim()) ||
    n.includes(v.name.toLowerCase().split('(')[0].trim())
  )?.id || null;
}
