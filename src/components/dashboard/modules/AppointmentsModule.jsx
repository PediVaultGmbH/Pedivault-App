import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import EmptyState from '../ui/EmptyState';
import Modal from '../ui/Modal';
import { APPT_TYPE_CFG, BASE_APPTS_AANYA } from '../../../data/appointmentsData';
import { getApptStatus } from '../../../utils/dateUtils';
import XBtn from '../ui/XBtn';

function CancelApptModal({open, onClose, onConfirm, appt}) {
  const { t } = useTranslation();
  if(!appt) return null;
  const cfg = APPT_TYPE_CFG[appt.type] || APPT_TYPE_CFG['Other'];
  const fmtDate = d => d ? new Date(d).toLocaleDateString('en-DE',{day:'numeric',month:'long',year:'numeric'}) : '—';
  return (
    <Modal open={open} onClose={onClose} maxWidth={380}>
      <div className="pv-mhdr" style={{textAlign:'center',borderBottom:'none',padding:'32px 28px 8px'}}>
        <XBtn onClick={onClose}/>
        <div style={{width:56,height:56,borderRadius:16,background:'var(--red-bg)',border:'1px solid rgba(185,40,20,.2)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 14px',fontSize:'1.6rem'}}>{cfg.icon}</div>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:'1.1rem',fontWeight:400,color:'var(--ink)',marginBottom:6}}>{t('appointments.cancel','Cancel this appointment?')}</div>
        <div style={{fontSize:'.56rem',fontWeight:300,color:'var(--ink-3)',lineHeight:1.7}}>
          <strong style={{color:'var(--ink)',fontWeight:500}}>{appt.type}</strong> with {appt.doctor}<br/>
          {fmtDate(appt.date)} at {appt.time}
        </div>
      </div>
      <div className="pv-mfoot" style={{borderTop:'none',background:'transparent',padding:'16px 28px 24px',justifyContent:'center',gap:10}}>
        <button type="button" className="fb fb-g" style={{flex:1,maxWidth:160}} onClick={onClose}>{t('appointments.keepIt','Keep it')}</button>
        <button type="button" className="fb fb-d" style={{flex:1,maxWidth:160}} onClick={onConfirm}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          {t('appointments.cancelVisit','Cancel visit')}
        </button>
      </div>
    </Modal>
  );
}

export function AppointmentsModule({activeChild, showModal, newBookings=[], onCancelBooking}) {
  const { t } = useTranslation();
  const [filter,    setFilter]    = useState('upcoming');
  const [sort,      setSort]      = useState('soonest');
  const [cancelAppt,setCancelAppt]= useState(null);

  /* Fix 5: removed unused fmtDate */
  const fmtMonth = d => d ? new Date(d).toLocaleDateString('en-DE',{month:'short'}).toUpperCase() : '—';
  const fmtDay   = d => d ? new Date(d).getDate() : '—';
  const safeDate = d=>{ const dt=new Date(d); return isNaN(dt)?new Date(0):dt; };

  /* Merge base + new bookings — Fix 3: use stable IDs with timestamp */
  const baseAppts = activeChild==='aanya' ? BASE_APPTS_AANYA : [];
  const newAppts  = newBookings.map((b,i)=>({
    id: b._id || `new-${i}`,
    type:b.type||'Other', doctor:b.doctor||'—',
    clinic:'', date:b.date, time:b.time, notes:b.notes||'',
    isNew:true,
  }));
  const allAppts  = [...newAppts, ...baseAppts];

  const withStatus = allAppts.map(a=>({...a, status:getApptStatus(a.date)}));
  const counts = {
    upcoming: withStatus.filter(a=>a.status==='upcoming'||a.status==='today').length,
    past:     withStatus.filter(a=>a.status==='past').length,
    total:    withStatus.length,
  };

  /* Fix 6: removed dead 'today' branch — today shows in upcoming */
  let visible = withStatus.filter(a=>{
    if(filter==='upcoming') return a.status==='upcoming'||a.status==='today';
    if(filter==='past')     return a.status==='past';
    return true; // 'all'
  });

  visible = [...visible].sort((a,b)=>{
    if(sort==='soonest') return safeDate(a.date)-safeDate(b.date);
    if(sort==='latest')  return safeDate(b.date)-safeDate(a.date);
    if(sort==='type')    return (a.type||'').localeCompare(b.type||'');
    return 0;
  });

  /* Fix 4: sort withStatus by date before finding next */
  const sortedUpcoming = [...withStatus]
    .filter(a=>a.status==='today'||a.status==='upcoming')
    .sort((a,b)=>safeDate(a.date)-safeDate(b.date));

  /* Empty state */
  if(allAppts.length===0) return (
    <div className="pv-page" style={{animation:'fadeUp .3s ease both'}}>
      <EmptyState color="var(--blue)"
        icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>}
        title={t('appointments.noAppointments','No appointments yet')}
        sub={`Book ${activeChild==='aanya'?'Aanya':'Rohan'}'s first paediatric visit. Your schedule will appear here.`}
        btnLabel={t('appointments.book','Book First Visit')}
        onBtn={()=>showModal('book')}/>
    </div>
  );

  return (
    <div className="pv-page" style={{animation:'fadeUp .3s ease both'}}>

      {/* ── STAT STRIP ── */}
      <div className="stat-strip" style={{marginBottom:20}}>
        <div className="stat-card sc-info" style={{cursor:'pointer'}} onClick={()=>setFilter('upcoming')}>
          <div className="stat-label">{t('appointments.upcoming','Upcoming')}</div>
          <div className="stat-val">{counts.upcoming}</div>
          <div className="stat-meta"><span className="pill blue">{t('appointments.upcoming','Scheduled')}</span></div>
          <div className="stat-card-cta">{t('appointments.viewUpcoming','View upcoming →')}</div>
        </div>
        <div className="stat-card sc-normal" style={{cursor:'pointer'}} onClick={()=>setFilter('past')}>
          <div className="stat-label">{t('appointments.completed','Past Visits')}</div>
          <div className="stat-val">{counts.past}</div>
          <div className="stat-meta"><span className="pill rose">{t('appointments.completed','Completed')}</span></div>
          <div className="stat-card-cta">{t('appointments.viewHistory','View history →')}</div>
        </div>
        <div className="stat-card sc-healthy" style={{cursor:'pointer'}} onClick={()=>setFilter('all')}>
          <div className="stat-label">{t('records.title','Total')}</div>
          <div className="stat-val">{counts.total}</div>
          <div className="stat-meta"><span className="pill green">{t('home.viewAll','All visits')}</span></div>
          <div className="stat-card-cta">{t('home.viewAll','View all')} →</div>
        </div>
        <div className="stat-card sc-warning" style={{cursor:'pointer'}} onClick={()=>showModal('book')}>
          <div className="stat-label">{t('appointments.book','Book New')}</div>
          <div className="stat-val"><span style={{fontSize:'1.4rem'}}>+</span></div>
          <div className="stat-meta"><span className="pill amber">{t('appointments.book','Schedule visit')}</span></div>
          <div className="stat-card-cta">{t('appointments.book','Open calendar')} →</div>
        </div>
      </div>

      {/* Fix 4: next appointment uses date-sorted upcoming list */}
      {(() => {
        const next = sortedUpcoming[0];
        if(!next) return null;
        const cfg = APPT_TYPE_CFG[next.type]||APPT_TYPE_CFG['Other'];
        const isToday = next.status==='today';
        return (
          <div style={{
            display:'flex',alignItems:'center',gap:14,
            background:`linear-gradient(135deg,${cfg.bg})`,
            border:`1.5px solid ${cfg.border}`,borderLeft:`3px solid ${cfg.color}`,
            borderRadius:14,padding:'14px 18px',marginBottom:20,
          }}>
            <div style={{textAlign:'center',flexShrink:0,minWidth:44}}>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:'1.6rem',color:cfg.color,lineHeight:1}}>{fmtDay(next.date)}</div>
              <div style={{fontSize:'.42rem',fontWeight:600,letterSpacing:'.16em',color:cfg.color}}>{fmtMonth(next.date)}</div>
            </div>
            <div style={{width:1,height:44,background:cfg.color,opacity:.2,flexShrink:0}}/>
            <div style={{flex:1,minWidth:0}}>
              <div style={{display:'flex',alignItems:'center',gap:7,marginBottom:3}}>
                <span style={{fontSize:'.42rem',fontWeight:600,letterSpacing:'.16em',textTransform:'uppercase',
                  color:'#fff',background:isToday?'var(--red)':cfg.color,
                  borderRadius:20,padding:'2px 8px'}}>
                  {isToday?t('appointments.today','Today'):t('appointments.nextVisit','Next Visit')}
                </span>
                <span style={{fontSize:'.56rem',fontWeight:600,color:'var(--ink)'}}>{next.type}</span>
              </div>
              <div style={{fontSize:'.6rem',fontWeight:500,color:'var(--ink)',marginBottom:2}}>{next.doctor}</div>
              <div style={{fontSize:'.5rem',fontWeight:300,color:'var(--ink-3)'}}>
                {next.clinic&&`${next.clinic} · `}{next.time}
                {next.notes&&<span style={{display:'block',marginTop:2}}>{next.notes}</span>}
              </div>
            </div>
            <button type="button" onClick={()=>showModal('book')} style={{
              flexShrink:0,height:32,padding:'0 14px',borderRadius:9,
              background:cfg.color,color:'#fff',border:'none',
              fontSize:'.55rem',fontWeight:500,cursor:'pointer',
            }}>{t('appointments.reschedule','Reschedule')}</button>
          </div>
        );
      })()}

      {/* ── FILTER + SORT + BOOK ── */}
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:8,flexWrap:'wrap',marginBottom:14}}>
        <div style={{display:'flex',gap:4,flexWrap:'wrap'}}>
          {[
            {k:'upcoming',label:`${t('appointments.upcoming','Upcoming')} (${counts.upcoming})`},
            {k:'past',    label:`${t('appointments.completed','Past')} (${counts.past})`},
            {k:'all',     label:`${t('home.viewAll','All')} (${counts.total})`},
          ].map(tab=>(
            <div key={tab.k} onClick={()=>setFilter(tab.k)} style={{
              height:28,padding:'0 13px',borderRadius:20,cursor:'pointer',userSelect:'none',
              fontSize:'.52rem',fontWeight:filter===tab.k?600:400,
              color:filter===tab.k?'#fff':'var(--ink-2)',
              background:filter===tab.k?'var(--blue)':'var(--cream-2)',
              border:`1px solid ${filter===tab.k?'transparent':'var(--line2)'}`,
              transition:'all .15s',display:'inline-flex',alignItems:'center',justifyContent:'center',lineHeight:1}}>{tab.label}</div>
          ))}
        </div>
        <div style={{display:'flex',gap:6,alignItems:'center',flexShrink:0}}>
          <select value={sort} onChange={e=>setSort(e.target.value)} style={{
            height:30,padding:'0 10px',borderRadius:9,border:'1.5px solid var(--line2)',
            background:'var(--white)',color:'var(--ink-2)',fontSize:'.55rem',
            fontFamily:"'DM Sans',sans-serif",cursor:'pointer',outline:'none',appearance:'none',
          }}>
            <option value="soonest">{t('records.newestFirst','Soonest first')}</option>
            <option value="latest">{t('records.oldestFirst','Latest first')}</option>
            <option value="type">{t('records.byType','By type')}</option>
          </select>
          <button type="button" onClick={()=>showModal('book')} style={{
            height:32,padding:'0 14px',borderRadius:9,background:'var(--rose)',color:'#fff',border:'none',
            fontSize:'.58rem',fontWeight:500,cursor:'pointer',display:'flex',alignItems:'center',gap:6,
            boxShadow:'0 2px 10px rgba(155,58,86,.28)',
          }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
            {t('appointments.book','Book Visit')}
          </button>
        </div>
      </div>

      {/* ── APPOINTMENT LIST ── */}
      {visible.length===0 ? (
        <div className="card" style={{textAlign:'center',padding:'32px 20px'}}>
          <div style={{fontSize:'1.8rem',marginBottom:8}}>📅</div>
          <div style={{fontSize:'.64rem',fontWeight:500,color:'var(--ink)',marginBottom:4}}>{t('appointments.noAppointments','No')} {filter} {t('appointments.title','appointments')}</div>
          {filter==='upcoming' && <button type="button" onClick={()=>showModal('book')} className="pv-empty-btn" style={{marginTop:14}}>{t('appointments.book','Book a Visit')}</button>}
        </div>
      ) : (
        <div style={{display:'flex',flexDirection:'column',gap:0,borderRadius:14,overflow:'hidden',boxShadow:'var(--shadow-card)'}}>
          {visible.map((appt,i)=>{
            const cfg = APPT_TYPE_CFG[appt.type] || APPT_TYPE_CFG['Other'];
            const isPast   = appt.status==='past';
            const isToday  = appt.status==='today';
            const isUpcoming = appt.status==='upcoming';
            return (
              <div key={appt.id} style={{
                display:'flex',alignItems:'center',gap:0,
                background: isToday?`${cfg.bg}`:isPast?'var(--cream-2)':'var(--white)',
                borderBottom: i<visible.length-1 ? '1px solid var(--line2)' : 'none',
                borderLeft:`3px solid ${isPast?'var(--line)':cfg.color}`,
                opacity: isPast ? .75 : 1,
                transition:'opacity .15s',
                animation:`fadeUp .25s ease ${i*.04}s both`,
              }}>
                {/* Date column */}
                <div style={{
                  width:58,flexShrink:0,textAlign:'center',
                  padding:'14px 0',
                  borderRight:'1px solid var(--line2)',
                }}>
                  <div style={{
                    fontFamily:"'Playfair Display',serif",
                    fontSize:'1.4rem',lineHeight:1,
                    color:isPast?'var(--ink-3)':isToday?cfg.color:cfg.color,
                  }}>{fmtDay(appt.date)}</div>
                  <div style={{fontSize:'.4rem',fontWeight:600,letterSpacing:'.14em',color:isPast?'var(--ink-3)':cfg.color,marginTop:1}}>{fmtMonth(appt.date)}</div>
                  {isToday&&<div style={{fontSize:'.38rem',fontWeight:700,color:'#fff',background:'var(--red)',borderRadius:20,padding:'1px 5px',margin:'4px auto 0',display:'inline-block'}}>{t('appointments.today','TODAY')}</div>}
                </div>

                {/* Main content */}
                <div style={{flex:1,padding:'13px 15px',minWidth:0}}>
                  <div style={{display:'flex',alignItems:'center',gap:7,flexWrap:'wrap',marginBottom:3}}>
                    <span style={{fontSize:'.9rem'}}>{cfg.icon}</span>
                    <span style={{fontSize:'.66rem',fontWeight:600,color:isPast?'var(--ink-2)':'var(--ink)'}}>{appt.type}</span>
                    {/* Fix 2: time shown once — in badge for upcoming, "Completed" for past */}
                    <span style={{
                      fontSize:'.42rem',fontWeight:600,padding:'2px 8px',borderRadius:20,
                      color:isToday?'var(--red)':isUpcoming?cfg.color:'var(--ink-3)',
                      background:isToday?'var(--red-bg)':isUpcoming?cfg.bg:'transparent',
                      border:`1px solid ${isToday?'rgba(185,40,20,.2)':isUpcoming?cfg.border:'transparent'}`,
                    }}>
                      {isToday?`${t('appointments.today','Today')} · ${appt.time}`:isUpcoming?appt.time:t('appointments.completed','Completed')}
                    </span>
                  </div>
                  <div style={{fontSize:'.6rem',fontWeight:500,color:isPast?'var(--ink-3)':'var(--ink)',marginBottom:2}}>
                    {appt.doctor}
                    {appt.clinic&&<span style={{fontWeight:300,color:'var(--ink-3)'}}> · {appt.clinic}</span>}
                  </div>
                  {appt.notes&&(
                    <div style={{fontSize:'.5rem',fontWeight:300,color:'var(--ink-3)',lineHeight:1.5,
                      overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',maxWidth:'100%'}}>
                      {appt.notes}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div style={{flexShrink:0,padding:'0 14px',display:'flex',gap:6,alignItems:'center'}}>
                  {isUpcoming && (
                    <button type="button" onClick={()=>showModal('book')} style={{
                      height:26,padding:'0 10px',borderRadius:7,
                      background:'var(--cream-2)',border:'1px solid var(--line2)',
                      color:'var(--ink-2)',fontSize:'.48rem',fontWeight:500,cursor:'pointer',
                      transition:'all .15s',
                    }}>{t('appointments.reschedule','Reschedule')}</button>
                  )}
                  {isUpcoming && appt.isNew && (
                    <button type="button" onClick={()=>setCancelAppt(appt)} style={{
                      height:26,padding:'0 10px',borderRadius:7,
                      background:'var(--red-bg)',border:'1px solid rgba(185,40,20,.18)',
                      color:'var(--red)',fontSize:'.48rem',fontWeight:500,cursor:'pointer',
                    }}>{t('appointments.cancel','Cancel')}</button>
                  )}
                  {isPast && (
                    <div style={{
                      width:26,height:26,borderRadius:7,
                      background:'var(--green-bg)',border:'1px solid var(--green-lt)',
                      display:'flex',alignItems:'center',justifyContent:'center',
                    }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── TIPS FOOTER ── */}
      <div className="card" style={{marginTop:16,padding:'13px 18px',background:'linear-gradient(135deg,var(--blue-bg))'}}>
        <div style={{display:'flex',alignItems:'flex-start',gap:12}}>
          <div style={{width:32,height:32,borderRadius:9,background:'var(--blue-bg)',border:'1px solid var(--blue-lt)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
          <div>
            <div style={{fontSize:'.6rem',fontWeight:600,color:'var(--blue)',marginBottom:3}}>U-Untersuchungen reminder</div>
            <div style={{fontSize:'.5rem',fontWeight:300,color:'var(--ink-3)',lineHeight:1.7}}>
              Germany's statutory U-Untersuchungen (U1–U9) are covered by Krankenkasse and should be completed on schedule. Missing a check-up window can result in developmental gaps going undetected. Book in advance — popular paediatricians fill quickly.
            </div>
          </div>
        </div>
      </div>

      {/* Cancel confirmation modal */}
      <CancelApptModal
        open={!!cancelAppt}
        onClose={()=>setCancelAppt(null)}
        onConfirm={()=>{ if(onCancelBooking) onCancelBooking(cancelAppt); setCancelAppt(null); }}
        appt={cancelAppt}/>
    </div>
  );
}

