import { useState } from 'react';
import Modal from '../ui/Modal';
import EmptyState from '../ui/EmptyState';
import XBtn from '../ui/XBtn';

export function ProfileModule({ activeChild, showModal, onDeleteChild, apiChildren = [] }) {
  const [section,       setSection]       = useState('overview');
  const [confirmDelete, setConfirmDelete] = useState(false);

  // ── Get child data from API ───────────────────────────────────────────────
  const child = apiChildren.find(c => c.id === activeChild) || null;

  const calcAge = dob => {
    if (!dob) return '—';
    const d = new Date(dob), now = new Date();
    let years  = now.getFullYear() - d.getFullYear();
    let months = now.getMonth()    - d.getMonth();
    if (months < 0) { years--; months += 12; }
    if (now.getDate() < d.getDate()) months = Math.max(0, months - 1);
    if (years === 0 && months === 0) return '< 1 month';
    return years > 0 ? `${years} yr${years !== 1 ? 's' : ''} ${months} mo` : `${months} months`;
  };

  const fmtDate = d => d ? new Date(d).toLocaleDateString('en-DE', { day:'numeric', month:'long', year:'numeric' }) : '—';

  const SECTIONS = [
    { k:'overview', label:'Overview', icon:'👤' },
    { k:'details',  label:'Details',  icon:'📋' },
  ];

  const GENDER_COLOR = { FEMALE:'#C47A92', MALE:'#3478B0', OTHER:'#7B52B0' };
  const pColor = child?.color || GENDER_COLOR[child?.gender] || '#9B3A56';

  const sevCfg = {
    'Mild':     { color:'var(--amber)', bg:'var(--amber-bg)', border:'var(--amber-lt)' },
    'Moderate': { color:'#D46A10',      bg:'rgba(212,106,16,.08)', border:'rgba(212,106,16,.22)' },
    'Severe':   { color:'var(--red)',   bg:'var(--red-bg)',   border:'rgba(185,40,20,.18)' },
  };

  if (!child) return (
    <div className="pv-page" style={{ animation:'fadeUp .3s ease both' }}>
      <EmptyState color="var(--rose)"
        icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--rose)" strokeWidth="1.5" strokeLinecap="round"><circle cx="12" cy="8" r="4"/><path d="M6 20v-2a6 6 0 0112 0v2"/></svg>}
        title="Profile not found"
        sub="This child's profile hasn't been set up yet. Add them using the + button in the header."
        btnLabel="Add Child"
        onBtn={() => showModal('addchild')}/>
    </div>
  );

  const allergies  = child.allergies  || [];
  const conditions = child.conditions || [];

  return (
    <div className="pv-page" style={{ animation:'fadeUp .3s ease both' }}>

      {/* Hero card */}
      <div style={{ background:`linear-gradient(135deg,${pColor}18,${pColor}08,var(--white))`, border:`1.5px solid ${pColor}30`, borderRadius:18, padding:'20px 22px', marginBottom:20, boxShadow:'var(--shadow-card)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:16, flexWrap:'wrap' }}>
          <div style={{ width:64, height:64, borderRadius:18, flexShrink:0, background:`linear-gradient(135deg,${pColor}30,${pColor}18)`, border:`2px solid ${pColor}40`, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Playfair Display',serif", fontSize:'1.6rem', color:pColor }}>
            {child.name[0]}
          </div>
          <div style={{ flex:1, minWidth:140 }}>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.2rem', fontWeight:400, color:'var(--ink)', marginBottom:3 }}>{child.name}</div>
            <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
              <span style={{ fontSize:'.56rem', fontWeight:300, color:'var(--ink-3)' }}>{calcAge(child.dateOfBirth)}</span>
              {child.gender && <>
                <span style={{ color:'var(--line)', fontSize:'.6rem' }}>·</span>
                <span style={{ fontSize:'.56rem', fontWeight:300, color:'var(--ink-3)' }}>{child.gender === 'FEMALE' ? 'Girl' : child.gender === 'MALE' ? 'Boy' : 'Other'}</span>
              </>}
              {child.bloodType && <>
                <span style={{ color:'var(--line)', fontSize:'.6rem' }}>·</span>
                <span style={{ fontSize:'.56rem', fontWeight:500, color:pColor, background:`${pColor}15`, border:`1px solid ${pColor}25`, borderRadius:20, padding:'1px 8px' }}>{child.bloodType}</span>
              </>}
            </div>
            <div style={{ fontSize:'.5rem', fontWeight:300, color:'var(--ink-3)', marginTop:4 }}>{fmtDate(child.dateOfBirth)}</div>
          </div>
        </div>
      </div>

      {/* Section tabs + delete */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16, flexWrap:'wrap', gap:8 }}>
        <div style={{ display:'flex', gap:4, flexWrap:'wrap' }}>
          {SECTIONS.map(s => (
            <div key={s.k} onClick={() => setSection(s.k)} style={{ height:30, padding:'0 13px', borderRadius:20, cursor:'pointer', userSelect:'none', fontSize:'.54rem', fontWeight: section === s.k ? 600 : 400, color: section === s.k ? '#fff' : 'var(--ink-2)', background: section === s.k ? pColor : 'var(--cream-2)', border:`1px solid ${section === s.k ? 'transparent' : 'var(--line2)'}`, transition:'all .15s', display:'inline-flex', alignItems:'center', justifyContent:'center', gap:5, lineHeight:1 }}>
              <span style={{ fontSize:'.7rem' }}>{s.icon}</span>{s.label}
            </div>
          ))}
        </div>
        <button type="button" onClick={() => setConfirmDelete(true)} style={{ height:28, padding:'0 12px', borderRadius:20, background:'var(--red-bg)', border:'1px solid rgba(185,40,20,.2)', color:'var(--red)', fontSize:'.5rem', fontWeight:500, cursor:'pointer', display:'flex', alignItems:'center', gap:5 }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
          Remove child
        </button>
      </div>

      {/* Confirm delete modal */}
      <Modal open={confirmDelete} onClose={() => setConfirmDelete(false)} maxWidth={360}>
        <div style={{ padding:'32px 28px 24px', textAlign:'center' }}>
          <XBtn onClick={() => setConfirmDelete(false)}/>
          <div style={{ width:56, height:56, borderRadius:16, background:'var(--red-bg)', border:'1px solid rgba(185,40,20,.2)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="1.8" strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="17" y1="8" x2="23" y2="8"/></svg>
          </div>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.05rem', color:'var(--ink)', marginBottom:8 }}>Remove this child?</div>
          <div style={{ fontSize:'.54rem', fontWeight:300, color:'var(--ink-3)', lineHeight:1.7, marginBottom:22 }}>
            <strong style={{ color:'var(--ink)' }}>{child.name}</strong> and all their records will be permanently removed from your account. This cannot be undone.
          </div>
          <div style={{ display:'flex', gap:10 }}>
            <button type="button" className="fb fb-g" style={{ flex:1 }} onClick={() => setConfirmDelete(false)}>Cancel</button>
            <button type="button" style={{ flex:1, height:40, borderRadius:10, background:'var(--red)', color:'#fff', border:'none', fontSize:'.6rem', fontWeight:500, cursor:'pointer' }}
              onClick={() => { setConfirmDelete(false); onDeleteChild && onDeleteChild(activeChild); }}>
              Yes, remove
            </button>
          </div>
        </div>
      </Modal>

      {/* Overview */}
      {section === 'overview' && (
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>

          {/* Basic info */}
          <div className="card">
            <div className="sh" style={{ marginBottom:12 }}><div className="sh-title">Basic Information</div></div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              {[
                { lbl:'Date of birth', val: fmtDate(child.dateOfBirth) },
                { lbl:'Age',           val: calcAge(child.dateOfBirth) },
                { lbl:'Gender',        val: child.gender === 'FEMALE' ? 'Girl' : child.gender === 'MALE' ? 'Boy' : child.gender || '—' },
                { lbl:'Blood type',    val: child.bloodType || '—' },
              ].map((d, i) => (
                <div key={i} style={{ background:'var(--cream-2)', borderRadius:9, padding:'9px 12px', border:'1px solid var(--line2)' }}>
                  <div style={{ fontSize:'.41rem', fontWeight:600, letterSpacing:'.13em', textTransform:'uppercase', color:'var(--ink-3)', marginBottom:3 }}>{d.lbl}</div>
                  <div style={{ fontSize:'.6rem', fontWeight:500, color:'var(--ink)' }}>{d.val}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Allergies */}
          <div className="card">
            <div className="sh" style={{ marginBottom: allergies.length ? 12 : 0 }}>
              <div className="sh-title">Allergies & Sensitivities</div>
              <span style={{ fontSize:'.46rem', fontWeight:600, color: allergies.length > 0 ? 'var(--amber)' : 'var(--green)', background: allergies.length > 0 ? 'var(--amber-bg)' : 'var(--green-bg)', border:`1px solid ${allergies.length > 0 ? 'var(--amber-lt)' : 'var(--green-lt)'}`, borderRadius:20, padding:'2px 9px' }}>
                {allergies.length === 0 ? 'None known' : `${allergies.length} recorded`}
              </span>
            </div>
            {allergies.length === 0 ? (
              <div style={{ fontSize:'.56rem', fontWeight:300, color:'var(--green)', display:'flex', alignItems:'center', gap:6 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
                No known allergies recorded
              </div>
            ) : allergies.map((a, i) => {
              const sc = sevCfg[a.severity] || sevCfg['Mild'];
              return (
                <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:12, paddingBottom: i < allergies.length - 1 ? 12 : 0, borderBottom: i < allergies.length - 1 ? '1px solid var(--line2)' : 'none', marginBottom: i < allergies.length - 1 ? 12 : 0 }}>
                  <div style={{ width:32, height:32, borderRadius:9, background:sc.bg, border:`1px solid ${sc.border}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:'1rem' }}>⚠️</div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:3 }}>
                      <span style={{ fontSize:'.65rem', fontWeight:600, color:'var(--ink)' }}>{a.name || a}</span>
                      {a.severity && <span style={{ fontSize:'.42rem', fontWeight:600, color:sc.color, background:sc.bg, border:`1px solid ${sc.border}`, borderRadius:20, padding:'1px 7px' }}>{a.severity}</span>}
                    </div>
                    {a.reaction && <div style={{ fontSize:'.52rem', color:'var(--ink-3)' }}>{a.reaction}</div>}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Medical conditions */}
          <div className="card">
            <div className="sh" style={{ marginBottom: conditions.length ? 12 : 0 }}>
              <div className="sh-title">Medical Conditions</div>
              <span style={{ fontSize:'.46rem', fontWeight:600, color: conditions.length > 0 ? 'var(--red)' : 'var(--green)', background: conditions.length > 0 ? 'var(--red-bg)' : 'var(--green-bg)', border:`1px solid ${conditions.length > 0 ? 'rgba(185,40,20,.18)' : 'var(--green-lt)'}`, borderRadius:20, padding:'2px 9px' }}>
                {conditions.length === 0 ? 'None recorded' : `${conditions.length} recorded`}
              </span>
            </div>
            {conditions.length === 0 ? (
              <div style={{ fontSize:'.56rem', fontWeight:300, color:'var(--green)', display:'flex', alignItems:'center', gap:6 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
                No medical conditions recorded
              </div>
            ) : conditions.map((c, i) => (
              <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:12 }}>
                <div style={{ width:32, height:32, borderRadius:9, background:'var(--cream-2)', border:'1px solid var(--line2)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:'1rem' }}>🏥</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:'.65rem', fontWeight:600, color:'var(--ink)', marginBottom:3 }}>{c.name || c}</div>
                  {c.notes && <div style={{ fontSize:'.5rem', fontWeight:300, color:'var(--ink-3)', lineHeight:1.5 }}>{c.notes}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Details */}
      {section === 'details' && (
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <div className="card">
            <div className="sh" style={{ marginBottom:12 }}><div className="sh-title">Emergency Contact</div></div>
            <div style={{ display:'flex', alignItems:'center', gap:10, background:'var(--red-bg)', border:'1px solid rgba(185,40,20,.18)', borderRadius:12, padding:'10px 14px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.69A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
              <div>
                <div style={{ fontSize:'.58rem', fontWeight:600, color:'var(--red)' }}>Emergency: call 112</div>
                <div style={{ fontSize:'.48rem', fontWeight:300, color:'var(--ink-3)' }}>European emergency number — ambulance, fire, police</div>
              </div>
            </div>
          </div>

          <div className="card" style={{ background:'linear-gradient(135deg,var(--blue-bg),rgba(253,250,248,.8))' }}>
            <div style={{ display:'flex', alignItems:'flex-start', gap:12 }}>
              <div style={{ width:32, height:32, borderRadius:9, background:'var(--blue-bg)', border:'1px solid var(--blue-lt)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              </div>
              <div>
                <div style={{ fontSize:'.6rem', fontWeight:600, color:'var(--blue)', marginBottom:3 }}>About GKV coverage</div>
                <div style={{ fontSize:'.5rem', fontWeight:300, color:'var(--ink-3)', lineHeight:1.7 }}>
                  Under Germany's Gesetzliche Krankenversicherung (GKV), children are fully co-insured under a parent's policy at no extra cost until age 18 (or 23 if in education). All U-Untersuchungen check-ups, vaccinations on the STIKO schedule, and emergency treatment are fully covered.
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="sh" style={{ marginBottom:12 }}><div className="sh-title">Quick Actions</div></div>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {[
                { label:'Book appointment', action: () => showModal('book'),       icon:'📅' },
                { label:'Log vaccine',      action: () => showModal('vaccine'),    icon:'💉' },
                { label:'Add growth entry', action: () => showModal('growth'),     icon:'📏' },
                { label:'Upload record',    action: () => showModal('record'),     icon:'📄' },
                { label:'Add medication',   action: () => showModal('medication'), icon:'💊' },
              ].map((a, i) => (
                <button key={i} type="button" onClick={a.action} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 14px', borderRadius:10, background:'var(--cream-2)', border:'1px solid var(--line2)', cursor:'pointer', fontSize:'.6rem', fontWeight:500, color:'var(--ink)', textAlign:'left', transition:'background .15s' }}>
                  <span style={{ fontSize:'1rem' }}>{a.icon}</span>{a.label}
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--ink-3)" strokeWidth="2.2" strokeLinecap="round" style={{ marginLeft:'auto' }}><path d="M9 18l6-6-6-6"/></svg>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
