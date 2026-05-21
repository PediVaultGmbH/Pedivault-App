export function getApptStatus(dateStr) {
  if(!dateStr) return 'upcoming';
  const d   = new Date(dateStr);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const apptDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  if(apptDay.getTime() === today.getTime()) return 'today';
  return apptDay > today ? 'upcoming' : 'past';
}

