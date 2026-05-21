import { useState } from 'react';
import { a11yClick } from '../../../utils/a11y';

const SIDX=[
  {text:'MMR Vaccine — Dose 2',mod:'vaccines',sub:'Overdue · book appointment'},
  {text:'Varicella Chickenpox',mod:'vaccines',sub:'Due soon — May 2026'},
  {text:'Growth Entry Aanya',mod:'growth',sub:'12.4 kg · 89 cm — Apr 2026'},
  {text:'Amoxicillin Prescription',mod:'medications',sub:'Active — 5 ml twice daily'},
  {text:'Allergy Sensitivity Report',mod:'records',sub:'Apollo Diagnostics — 2.4 MB'},
  {text:'MMR Appointment May 12',mod:'appointments',sub:'Dr. Priya Mehta · 10:30 AM'},
];

/* Fix 6: Highlight matched text */
function Highlight({text,query}) {
  if(!query.trim()) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if(idx===-1) return <>{text}</>;
  return (
    <>{text.slice(0,idx)}<mark style={{background:'rgba(155,58,86,.14)',color:'var(--rose)',borderRadius:2,padding:'0 1px',fontWeight:600}}>{text.slice(idx,idx+query.length)}</mark>{text.slice(idx+query.length)}</>
  );
}


export function SearchPanel({open,onClose,onNav}) {
  const [q,setQ] = useState('');
  const hits = q.trim() ? SIDX.filter(r=>r.text.toLowerCase().includes(q.toLowerCase())) : [];
  const modIcons = {
  vaccines:    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--rose)"  strokeWidth="1.8" strokeLinecap="round"><path d="M18 2l4 4-1 1-4-4zM14.5 5.5l4 4M12 8l-8 8 1 3 3 1 8-8"/></svg>,
  growth:      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="1.8" strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  medications: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--amber)" strokeWidth="1.8" strokeLinecap="round"><path d="M14 14.76V3.5a2.5 2.5 0 00-5 0v11.26a4.5 4.5 0 105 0z"/></svg>,
  records:     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--blue)"  strokeWidth="1.8" strokeLinecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M9 13h6M9 17h4"/></svg>,
  appointments:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--purple)"strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
};
  return (
    <div className={`pv-panel${open?' open':''}`}>
      <div className="pv-srch-wrap">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--ink-3)" strokeWidth="1.8" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
        <input className="pv-srch-in" placeholder="Search records, vaccines, visits…" value={q} onChange={e=>setQ(e.target.value)} autoFocus={open}/>
        {q
          ? <span style={{cursor:'pointer',color:'var(--ink-3)',fontSize:'.58rem',padding:4,flexShrink:0}} onClick={()=>setQ('')}>✕</span>
          : <span style={{cursor:'pointer',color:'var(--ink-3)',fontSize:'.58rem',padding:4,flexShrink:0}} onClick={()=>{onClose();setQ('');}}>✕</span>
        }
      </div>
      <div className="pv-panel-results">
        {!q.trim() && (
          <div style={{padding:'10px 15px'}}>
            <div style={{fontSize:'.44rem',fontWeight:600,letterSpacing:'.16em',textTransform:'uppercase',color:'var(--ink-3)',marginBottom:8}}>Quick access</div>
            {['vaccines','growth','records','appointments'].map(mod=>(
              <div key={mod} style={{display:'flex',alignItems:'center',gap:8,padding:'8px 0',cursor:'pointer',borderBottom:'1px solid var(--line2)',transition:'color .12s'}}
                onClick={()=>{onNav(mod);onClose();}}>
                <span style={{fontSize:'.9rem'}}>{modIcons[mod]}</span>
                <span style={{fontSize:'.6rem',color:'var(--ink-2)',textTransform:'capitalize',fontWeight:400}}>{mod}</span>
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="var(--ink-3)" strokeWidth="2.2" style={{marginLeft:'auto'}}><path d="M9 18l6-6-6-6"/></svg>
              </div>
            ))}
          </div>
        )}
        {q.trim() && !hits.length && (
          <div style={{padding:'20px 15px',textAlign:'center'}}>
            <div style={{fontSize:'.56rem',color:'var(--ink-3)',marginBottom:4}}>No results for "<strong>{q}</strong>"</div>
            <div style={{fontSize:'.48rem',color:'var(--ink-3)'}}>Try "vaccine", "growth" or "MMR"</div>
          </div>
        )}
        {hits.map((r,i)=>(
          <div key={`${r.mod}-${r.text}`} className="pv-panel-item" style={{animationDelay:`${i*.04}s`}} {...a11yClick(()=>{onNav(r.mod);onClose();setQ('');})}>
            <div style={{display:'flex',alignItems:'center',gap:7,marginBottom:3}}>
              <span style={{fontSize:'.8rem',flexShrink:0}}>{modIcons[r.mod]||'🔍'}</span>
              <div style={{fontSize:'.62rem',fontWeight:500,color:'var(--ink)'}}><Highlight text={r.text} query={q}/></div>
            </div>
            <div style={{fontSize:'.5rem',color:'var(--ink-3)',paddingLeft:22}}>{r.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchPanel;
