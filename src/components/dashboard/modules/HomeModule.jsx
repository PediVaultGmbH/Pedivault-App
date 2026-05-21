import { a11yClick } from '../../../utils/a11y';

export function HomeModule({
  activeChild, activeChildData, growthData,
  onNav, showModal, vaccStats, overdueList,
  growthCount, vaccineCount, recordCount, bookingCount,
  recentActivity, upcomingVisits,
}) {
  // ── Real child data ───────────────────────────────────────────────────────
  const childName = activeChildData?.name || 'Child';

  const calcAge = dob => {
    if (!dob) return '—';
    const d = new Date(dob), now = new Date();
    let years  = now.getFullYear() - d.getFullYear();
    let months = now.getMonth()    - d.getMonth();
    if (months < 0) { years--; months += 12; }
    if (years === 0 && months === 0) return '< 1 month';
    return years > 0 ? `${years} yr${years !== 1 ? 's' : ''} ${months} mo` : `${months} months`;
  };

  const childAge    = calcAge(activeChildData?.dateOfBirth);
  const currWeight  = growthData?.weight  || growthData?.weightKg  || '—';
  const currHeight  = growthData?.height  || growthData?.heightCm  || '—';
  const currHead    = growthData?.head    || growthData?.headCm    || '—';
  const bmi         = currWeight !== '—' && currHeight !== '—'
    ? (currWeight / ((currHeight / 100) ** 2)).toFixed(1)
    : '—';

  // ── Next appointment ──────────────────────────────────────────────────────
  const nextVisit = upcomingVisits[0] || null;

  // ── Quick Add counts — real only ──────────────────────────────────────────
  const qCounts = {
    vaccine: vaccineCount,
    growth:  growthCount,
    record:  recordCount,
    book:    bookingCount,
  };

  return (
    <div className="pv-page" key={activeChild} style={{ animation:'fadeUp .3s ease both' }}>

      {/* Overdue alert */}
      {overdueList.length > 0 && (
        <div style={{
          display:'flex', alignItems:'center', gap:12,
          background:'linear-gradient(135deg,rgba(185,40,20,.06),rgba(185,40,20,.03))',
          border:'1px solid rgba(185,40,20,.18)', borderLeft:'3px solid var(--red)',
          borderRadius:12, padding:'11px 16px', marginBottom:18,
        }}>
          <div style={{ width:30, height:30, borderRadius:9, background:'var(--red-bg)', border:'1px solid rgba(185,40,20,.2)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:'.64rem', fontWeight:600, color:'var(--red)', marginBottom:2 }}>
              {overdueList.length === 1
                ? `${overdueList[0].name} — ${overdueList[0].dose} is overdue`
                : `${overdueList.length} vaccines are overdue — action needed`}
            </div>
            <div style={{ fontSize:'.52rem', fontWeight:300, color:'var(--ink-2)' }}>
              {overdueList.slice(0, 2).map(v => `${v.name} ${v.dose}`).join(' · ')}
              {overdueList.length > 2 ? ` · +${overdueList.length - 2} more` : ''}
              {' — Please book an appointment as soon as possible.'}
            </div>
          </div>
          <button type="button" onClick={() => showModal('book')} style={{ flexShrink:0, height:28, padding:'0 12px', borderRadius:8, background:'var(--red)', color:'#fff', border:'none', fontSize:'.54rem', fontWeight:500, cursor:'pointer', whiteSpace:'nowrap' }}>Book Now</button>
        </div>
      )}

      {/* Stat strip */}
      <div className="stat-strip">
        <div className={`stat-card ${vaccStats.overdue > 0 ? 'sc-urgent' : 'sc-healthy'}`} onClick={() => onNav('vaccines')} style={{ cursor:'pointer' }}>
          {vaccStats.overdue > 0 && <div className="sc-urgent-flag"><div className="sc-urgent-dot"/>Overdue</div>}
          <div className="stat-label">Vaccines</div>
          <div className="stat-val">{vaccStats.pct}<span className="stat-unit">%</span></div>
          <div className="stat-meta">
            <span className={`pill ${vaccStats.overdue > 0 ? 'red' : 'green'}`}>
              {vaccStats.overdue > 0 ? `${vaccStats.overdue} Overdue` : `${vaccStats.done}/${vaccStats.total} Done`}
            </span>
          </div>
          <div className="stat-card-cta">View schedule →</div>
        </div>
        <div className="stat-card sc-info" onClick={() => showModal('book')} style={{ cursor:'pointer' }}>
          <div className="stat-label">Next Visit</div>
          <div className="stat-val" style={{ fontSize:'1.35rem' }}>
            {nextVisit ? `${nextVisit.day} ${nextVisit.mon}` : '—'}
          </div>
          <div className="stat-meta">
            <span className="pill blue">{nextVisit ? nextVisit.name : 'No visits booked'}</span>
          </div>
          <div className="stat-card-cta">Book visit →</div>
        </div>
        <div className="stat-card sc-healthy" onClick={() => onNav('growth')} style={{ cursor:'pointer' }}>
          <div className="stat-label">Weight</div>
          <div className="stat-val">{currWeight}<span className="stat-unit">{currWeight !== '—' ? ' kg' : ''}</span></div>
          <div className="stat-meta"><span className="pill green">{currWeight !== '—' ? 'Latest' : 'No data'}</span></div>
          <div className="stat-card-cta">View growth →</div>
        </div>
        <div className="stat-card sc-normal" onClick={() => onNav('growth')} style={{ cursor:'pointer' }}>
          <div className="stat-label" style={{ color:'var(--rose-mid)' }}>Height</div>
          <div className="stat-val">{currHeight}<span className="stat-unit">{currHeight !== '—' ? ' cm' : ''}</span></div>
          <div className="stat-meta"><span className="pill rose">{currHeight !== '—' ? 'Latest' : 'No data'}</span></div>
          <div className="stat-card-cta">View charts →</div>
        </div>
      </div>

      {/* Vaccine summary + Growth mini-card */}
      <div className="two-col">
        <div className="card-hover" style={{ background:'var(--white)', border:`1px solid ${vaccStats.overdue > 0 ? 'rgba(185,40,20,.18)' : 'var(--line2)'}`, borderTop:`3px solid ${vaccStats.overdue > 0 ? 'var(--red)' : 'var(--green)'}`, borderRadius:'var(--radius-card)', padding:0, overflow:'hidden', cursor:'pointer', boxShadow:'var(--shadow-card)' }} onClick={() => onNav('vaccines')}>
          <div style={{ padding:'14px 17px 11px', display:'flex', alignItems:'center', gap:12, borderBottom:'1px solid var(--line2)' }}>
            <div className="icon-box" style={{ background:vaccStats.overdue > 0 ? 'var(--red-bg)' : 'var(--green-bg)', border:`1px solid ${vaccStats.overdue > 0 ? 'rgba(185,40,20,.18)' : 'rgba(42,158,98,.18)'}` }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={vaccStats.overdue > 0 ? 'var(--red)' : 'var(--green)'} strokeWidth="1.7" strokeLinecap="round"><path d="M18 2l4 4-1 1-4-4z"/><path d="M14.5 5.5l4 4"/><path d="M12 8l-8 8 1 3 3 1 8-8"/></svg>
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div className="eyebrow" style={{ color:vaccStats.overdue > 0 ? 'var(--red)' : 'var(--green)', marginBottom:2 }}>
                {vaccStats.overdue > 0 ? 'Immunisation — Action needed' : 'Immunisation — On track'}
              </div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'.9rem', color:'var(--ink)' }}>{childName} · {childAge}</div>
            </div>
            <div style={{ textAlign:'right', flexShrink:0 }}>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.4rem', color:vaccStats.overdue > 0 ? 'var(--red)' : 'var(--green)', lineHeight:1 }}>{vaccStats.pct}<span style={{ fontSize:'.7rem', fontFamily:"'DM Sans',sans-serif", fontWeight:300 }}>%</span></div>
              <div style={{ fontSize:'.4rem', fontWeight:300, color:'var(--ink-3)' }}>{vaccStats.done} of {vaccStats.total}</div>
            </div>
          </div>
          <div style={{ padding:'9px 17px', borderBottom:'1px solid var(--line2)' }}>
            <div style={{ height:4, borderRadius:2, background:'var(--cream-2)' }}>
              <div style={{ width:`${vaccStats.pct}%`, height:'100%', borderRadius:2, background:`linear-gradient(90deg,${vaccStats.overdue > 0 ? 'rgba(185,40,20,.4),var(--red)' : 'rgba(42,158,98,.4),var(--green)'})` }}/>
            </div>
          </div>
          <div style={{ padding:'9px 17px 13px', display:'flex', flexDirection:'column', gap:7 }}>
            {overdueList.slice(0, 2).map((v, i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:9 }}>
                <div style={{ width:5, height:5, borderRadius:'50%', background:'var(--red)', flexShrink:0 }}/>
                <div style={{ flex:1, fontSize:'.57rem', color:'var(--ink)' }}>{v.name} — {v.dose}</div>
                <span style={{ fontSize:'.41rem', fontWeight:600, color:'var(--red)', background:'var(--red-bg)', border:'1px solid rgba(185,40,20,.18)', borderRadius:20, padding:'2px 8px' }}>Overdue</span>
              </div>
            ))}
            {overdueList.length === 0 && (
              <div style={{ display:'flex', alignItems:'center', gap:9 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
                <span style={{ fontSize:'.57rem', color:'var(--green)', fontWeight:500 }}>All vaccines are up to date</span>
              </div>
            )}
          </div>
        </div>

        {/* Growth mini card */}
        <div className="card card-hover" style={{ cursor:'pointer', borderTop:'3px solid var(--green)' }} onClick={() => onNav('growth')}>
          <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:12 }}>
            <div>
              <div className="eyebrow">Current Weight</div>
              <div className="serif-val" style={{ fontSize:'1.75rem' }}>
                {currWeight}<span style={{ fontSize:'.95rem', color:'var(--ink-3)', fontFamily:"'DM Sans',sans-serif" }}>{currWeight !== '—' ? ' kg' : ''}</span>
              </div>
            </div>
            <span className="pill green">{currWeight !== '—' ? 'Latest' : 'No data yet'}</span>
          </div>
          {currWeight !== '—' && (
            <svg width="100%" height="46" viewBox="0 0 560 46" fill="none" preserveAspectRatio="none">
              <defs><linearGradient id="ga" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="rgba(42,158,98,.12)"/><stop offset="100%" stopColor="rgba(42,158,98,0)"/></linearGradient></defs>
              <path d="M0 38 L93 33 L186 27 L280 21 L373 15 L466 10 L560 6 L560 46 L0 46 Z" fill="url(#ga)"/>
              <path d="M0 38 L93 33 L186 27 L280 21 L373 15 L466 10 L560 6" stroke="var(--green)" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="560" cy="6" r="4" fill="var(--green)"/>
              <circle cx="560" cy="6" r="2" fill="white"/>
            </svg>
          )}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:7, marginTop:10 }}>
            {[
              { lbl:'Height', val: currHeight !== '—' ? `${currHeight} cm` : '—', c:'var(--green)' },
              { lbl:'Head',   val: currHead   !== '—' ? `${currHead} cm`   : '—', c:'var(--blue)'  },
              { lbl:'BMI',    val: bmi,                                             c:'var(--green)' },
            ].map((s, i) => (
              <div key={i} style={{ background:'var(--cream-2)', border:'1px solid var(--line2)', borderRadius:9, padding:'8px 10px' }}>
                <div className="eyebrow" style={{ marginBottom:2 }}>{s.lbl}</div>
                <div className="serif-val" style={{ fontSize:'.88rem' }}>{s.val}</div>
                <div style={{ fontSize:'.4rem', color:s.c, marginTop:2 }}>{s.val !== '—' ? 'Latest' : 'No data'}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Due Soon — real overdue/due-soon from vaccStats */}
      {overdueList.length > 0 && (
        <>
          <div className="sh"><div className="sh-title">Action Needed</div><button type="button" className="sh-link" onClick={() => onNav('vaccines')}>All vaccines →</button></div>
          <div className="three-col">
            {overdueList.slice(0, 3).map((v, i) => (
              <div key={i} className="due-card" {...a11yClick(() => onNav('vaccines'))} aria-label={`Overdue: ${v.name}`}>
                <div className="due-bar" style={{ background:'var(--red)' }}/>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:9, paddingTop:2 }}>
                  <div className="icon-box-sm" style={{ background:'var(--red-bg)', border:'1px solid rgba(185,40,20,.18)' }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
                  </div>
                  <span className="lbl lbl-red">Overdue</span>
                </div>
                <div style={{ fontSize:'.65rem', fontWeight:600, color:'var(--ink)', marginBottom:2 }}>{v.name}</div>
                <div style={{ fontSize:'.51rem', fontWeight:300, color:'var(--ink-3)', lineHeight:1.5 }}>{v.dose}</div>
                <div className="divider"/>
                <div style={{ fontSize:'.5rem', fontWeight:500, color:'var(--red)' }}>Action needed</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Upcoming Visits + Quick Add */}
      <div className="two-col">
        <div>
          <div className="sh"><div className="sh-title">Upcoming Visits</div><button type="button" className="sh-link" onClick={() => showModal('book')}>+ Book →</button></div>
          <div className="card" style={{ padding:0, overflow:'hidden', borderTop:'3px solid var(--blue)' }}>
            {upcomingVisits.length === 0 ? (
              <div style={{ padding:'22px 17px', textAlign:'center', fontSize:'.58rem', color:'var(--ink-3)' }}>
                No upcoming visits — <button type="button" onClick={() => showModal('book')} style={{ color:'var(--rose)', cursor:'pointer', background:'none', border:'none', font:'inherit', padding:0, textDecoration:'underline' }}>book one now</button>
              </div>
            ) : upcomingVisits.map((a, i) => (
              <div key={`visit-${i}`} className="appt-row" {...a11yClick(() => onNav('appointments'))} aria-label={`Appointment: ${a.name}`}>
                <div className="appt-date"><div className="ad-day">{a.day}</div><div className="ad-mon">{a.mon}</div></div>
                <div className="appt-vr"/>
                <div className="appt-info">
                  <div className="ai-name">{a.name}</div>
                  <div className="ai-sub">{a.sub}</div>
                  <div className="ai-tags">{a.tags.map((t, j) => <span key={j} className={`lbl ${t.cls}`}>{t.t}</span>)}</div>
                </div>
                <div className="appt-chev"><svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="var(--rose)" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg></div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="sh"><div className="sh-title">Quick Add</div></div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
            {[
              { ico:<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--rose)"  strokeWidth="1.8" strokeLinecap="round"><path d="M18 2l4 4-1 1-4-4z"/><path d="M14.5 5.5l4 4"/><path d="M12 8l-8 8 1 3 3 1 8-8"/></svg>,  bg:'var(--rose-pale)', border:'var(--rose-lt)',        label:'Log Vaccine',  sub:`${qCounts.vaccine} logged`,    action:'vaccine' },
              { ico:<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--blue)"  strokeWidth="1.8"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,                                                              bg:'var(--blue-bg)',  border:'rgba(52,120,176,.18)',  label:'Growth Entry',  sub:`${qCounts.growth} entries`,    action:'growth'  },
              { ico:<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="1.8"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/></svg>, bg:'var(--green-bg)', border:'rgba(42,158,98,.18)',  label:'Upload Record', sub:`${qCounts.record} uploaded`,   action:'record'  },
              { ico:<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--amber)" strokeWidth="1.8"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>, bg:'var(--amber-bg)', border:'rgba(186,112,24,.18)', label:'Book Visit',    sub:`${qCounts.book} upcoming`,     action:'book'    },
            ].map((q, i) => (
              <div key={q.label} className="quick-card" {...a11yClick(() => showModal(q.action))} aria-label={q.label}>
                <div className="quick-ico" style={{ background:q.bg, border:`1px solid ${q.border}` }}>{q.ico}</div>
                <div style={{ fontSize:'.62rem', fontWeight:500, color:'var(--ink)', marginBottom:2 }}>{q.label}</div>
                <div style={{ fontSize:'.48rem', fontWeight:300, color:'var(--ink-3)' }}>{q.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="sh" style={{ marginTop:4 }}><div className="sh-title">Recent Activity</div></div>
      <div className="card" style={{ padding:0, overflow:'hidden' }}>
        {recentActivity.length === 0 ? (
          <div style={{ padding:'22px 17px', textAlign:'center', fontSize:'.58rem', color:'var(--ink-3)' }}>No recent activity yet</div>
        ) : recentActivity.map((a, i) => (
          <div key={`act-${i}-${a.ts}`} className="act-row">
            <div className="act-dot" style={{ background:a.dot }}/>
            <div className="act-info"><div className="act-name">{a.name}</div><div className="act-sub">{a.sub}</div></div>
            <span className={`lbl ${a.tc}`}>{a.tag}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomeModule;
