import EmptyState from '../ui/EmptyState';
import { a11yClick } from '../../../utils/a11y';

export function RohanEmptyHome({onNav,showModal}) {
  return (
    <div className="pv-page" style={{animation:'fadeUp .3s ease both'}}>
      {/* Stat strip — empty/zeroed */}
      <div className="stat-strip">
        {[
          {cls:'sc-normal',lbl:'Weight',val:'—',sub:'No data yet'},
          {cls:'sc-info',lbl:'Height',val:'—',sub:'No data yet'},
          {cls:'sc-healthy',lbl:'Vaccines',val:'—',sub:'No schedule set'},
          {cls:'sc-normal',lbl:'Next Visit',val:'—',sub:'None booked'},
        ].map((s,i)=>(
          <div key={s.lbl} className={`stat-card ${s.cls}`}>
            <div className="stat-label">{s.lbl}</div>
            <div className="stat-val" style={{fontSize:'1.6rem',color:'var(--ink-3)'}}>—</div>
            <div className="stat-meta"><span style={{fontSize:'.48rem',color:'var(--ink-3)'}}>{s.sub}</span></div>
          </div>
        ))}
      </div>

      {/* Welcome empty state */}
      <div style={{marginBottom:20}}>
        <EmptyState
          color="var(--blue)"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="8" r="4"/><path d="M6 20v-2a6 6 0 0112 0v2"/></svg>}
          title="Welcome, Rohan!"
          sub="Rohan's health profile is ready. Start by adding his first growth measurement, logging vaccines, or booking a check-up."
        />
      </div>

      {/* Quick start actions */}
      <div className="sh"><div className="sh-title">Get started</div></div>
      <div className="three-col">
        {[
          {ico:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--rose)" strokeWidth="1.7" strokeLinecap="round"><path d="M18 2l4 4-1 1-4-4z"/><path d="M14.5 5.5l4 4"/><path d="M12 8l-8 8 1 3 3 1 8-8"/></svg>,bg:'var(--rose-pale)',border:'var(--rose-lt)',color:'var(--rose)',title:'Log first vaccine',sub:"Add Rohan's immunisation history",action:'vaccine'},
          {ico:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="1.7"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,bg:'var(--green-bg)',border:'rgba(42,158,98,.18)',color:'var(--green)',title:'Record growth',sub:"Enter height, weight and head circumference",action:'growth'},
          {ico:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="1.7" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,bg:'var(--blue-bg)',border:'rgba(52,120,176,.18)',color:'var(--blue)',title:'Book a check-up',sub:"Schedule Rohan's first appointment",action:'book'},
        ].map((c,i)=>(
          <div key={c.title} className="card card-hover" style={{cursor:'pointer',textAlign:'center',borderTop:`3px solid ${c.color}`}} {...a11yClick(()=>showModal(c.action))} aria-label={c.title}>
            <div style={{width:44,height:44,borderRadius:12,background:c.bg,border:`1px solid ${c.border}`,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 12px'}}>{c.ico}</div>
            <div style={{fontSize:'.68rem',fontWeight:600,color:'var(--ink)',marginBottom:4}}>{c.title}</div>
            <div style={{fontSize:'.53rem',fontWeight:300,color:'var(--ink-3)',lineHeight:1.6}}>{c.sub}</div>
          </div>
        ))}
      </div>

      {/* Tips */}
      <div className="sh" style={{marginTop:4}}><div className="sh-title">Tips for getting started</div></div>
      <div className="card" style={{padding:0,overflow:'hidden'}}>
        {[
          {dot:'var(--rose)',text:"Import vaccination history from your paper Impfpass — take a photo and upload it as a record"},
          {dot:'var(--amber)',text:"Set up STIKO vaccine schedule — PediVault will auto-generate reminders based on Rohan's birth date"},
          {dot:'var(--green)',text:"Add your paediatrician to the care team so appointment reminders go directly to them"},
          {dot:'var(--blue)',text:"WHO growth charts are pre-loaded — just add measurements and percentiles are calculated automatically"},
        ].map((t,i)=>(
          <div key={`tip-${i}`} className="act-row">
            <div className="act-dot" style={{background:t.dot}}/>
            <div className="act-info" style={{marginLeft:11}}><div style={{fontSize:'.6rem',fontWeight:300,color:'var(--ink-2)',lineHeight:1.6}}>{t.text}</div></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RohanEmptyHome;
