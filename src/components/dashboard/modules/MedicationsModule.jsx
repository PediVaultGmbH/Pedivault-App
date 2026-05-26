import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import EmptyState from '../ui/EmptyState';
import { MED_TYPE_CFG } from '../../../data/medicationsData';
import Modal from '../ui/Modal';
import XBtn from '../ui/XBtn';

export function MedicationsModule({ activeChild, showModal, extraMeds = [], onMarkComplete }) {
  const { t } = useTranslation();
  const [filter,      setFilter]      = useState('all');
  const [expanded,    setExpanded]    = useState(null);
  const [confirmDone, setConfirmDone] = useState(null);

  const fmtDate = d => d ? new Date(d).toLocaleDateString('en-DE', { day:'numeric', month:'short', year:'numeric' }) : '—';

  // ── All meds from API only ────────────────────────────────────────────────
  const allMeds = extraMeds
    .filter(m => !m._baseOverride)
    .map(m => ({
      ...m,
      isNew:     true,
      status:    m.status?.toLowerCase() || 'active',
      frequency: m.frequency || '',
      duration:  m.duration  || '',
      doctor:    m.prescribedBy || m.doctor || '',
    }));

  const counts = {
    active:    allMeds.filter(m => m.status === 'active'    && m.frequency !== 'As needed').length,
    asNeeded:  allMeds.filter(m => m.frequency === 'As needed').length,
    completed: allMeds.filter(m => m.status === 'completed' || m.status === 'COMPLETED').length,
    total:     allMeds.length,
  };

  const visible = allMeds.filter(m => {
    if (filter === 'active')    return (m.status === 'active' || m.status === 'ACTIVE') && m.frequency !== 'As needed';
    if (filter === 'completed') return m.status === 'completed' || m.status === 'COMPLETED';
    if (filter === 'as-needed') return m.frequency === 'As needed';
    return true;
  });

  const sectionTitle = { all:t('medications.title','All Medications'), active:t('medications.active','Active Medications'), 'as-needed':t('medications.add','As Needed (PRN)'), completed:t('medications.completed','Completed Medications') }[filter] || t('medications.title','All Medications');

  const handleDone = (med) => setConfirmDone(med);
  const confirmComplete = () => {
    if (confirmDone) { onMarkComplete && onMarkComplete(confirmDone.id, confirmDone.isNew); setConfirmDone(null); }
  };

  if (allMeds.length === 0) return (
    <div className="pv-page" style={{ animation:'fadeUp .3s ease both' }}>
      <EmptyState color="var(--green)"
        icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="1.5" strokeLinecap="round"><path d="M10.5 20.5L3.5 13.5a5 5 0 017.07-7.07l7 7a5 5 0 01-7.07 7.07z"/><line x1="14" y1="7" x2="7" y2="14"/></svg>}
        title={t('medications.noMedications','No medications logged')}
        sub="Log prescriptions, vitamins and ongoing medications. You'll get a full history and dosage reminders."
        btnLabel={t('medications.add','Add First Medication')}
        onBtn={() => showModal('medication')}/>
    </div>
  );

  return (
    <div className="pv-page" style={{ animation:'fadeUp .3s ease both' }}>

      {/* Stat strip */}
      <div className="stat-strip" style={{ marginBottom:20 }}>
        <div className="stat-card sc-healthy" style={{ cursor:'pointer' }} onClick={() => setFilter('active')}>
          <div className="stat-label">{t('medications.active','Active')}</div>
          <div className="stat-val">{counts.active}</div>
          <div className="stat-meta"><span className="pill green">{t('medications.active','In progress')}</span></div>
          <div className="stat-card-cta">{t('medications.active','Active')} →</div>
        </div>
        <div className="stat-card sc-info" style={{ cursor:'pointer' }} onClick={() => setFilter('as-needed')}>
          <div className="stat-label">{t('medications.frequency','As Needed')}</div>
          <div className="stat-val">{counts.asNeeded}</div>
          <div className="stat-meta"><span className="pill blue">PRN</span></div>
          <div className="stat-card-cta">PRN →</div>
        </div>
        <div className="stat-card sc-normal" style={{ cursor:'pointer' }} onClick={() => setFilter('completed')}>
          <div className="stat-label">{t('medications.completed','Completed')}</div>
          <div className="stat-val">{counts.completed}</div>
          <div className="stat-meta"><span className="pill rose">{t('medications.completed','Finished')}</span></div>
          <div className="stat-card-cta">{t('home.viewAll','View')} →</div>
        </div>
        <div className="stat-card sc-warning" style={{ cursor:'pointer' }} onClick={() => showModal('medication')}>
          <div className="stat-label">{t('medications.add','Add New')}</div>
          <div className="stat-val"><span style={{ fontSize:'1.4rem' }}>+</span></div>
          <div className="stat-meta"><span className="pill amber">{t('medications.add','Log medication')}</span></div>
          <div className="stat-card-cta">{t('medications.add','Open form')} →</div>
        </div>
      </div>

      {/* Active highlight */}
      {counts.active > 0 && (filter === 'all' || filter === 'active') && (
        <div style={{ marginBottom:20 }}>
          <div className="sh"><div className="sh-title">{t('medications.active','Currently Active')}</div><button type="button" className="sh-link" onClick={() => showModal('medication')}>+ {t('common.add','Add')} →</button></div>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {allMeds.filter(m => (m.status === 'active' || m.status === 'ACTIVE') && m.frequency !== 'As needed').map((med, i) => {
              const cfg = MED_TYPE_CFG[med.type] || MED_TYPE_CFG['Other'];
              return (
                <div key={med.id} style={{ background:`linear-gradient(135deg,${cfg.bg},var(--white))`, border:`1.5px solid ${cfg.border}`, borderLeft:`3px solid ${cfg.color}`, borderRadius:12, padding:'13px 16px', animation:`fadeUp .25s ease ${i * .06}s both` }}>
                  <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                    <div style={{ width:36, height:36, borderRadius:10, background:cfg.bg, border:`1px solid ${cfg.border}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.1rem', flexShrink:0 }}>{cfg.icon}</div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:2, flexWrap:'wrap' }}>
                        <span style={{ fontSize:'.68rem', fontWeight:600, color:'var(--ink)' }}>{med.name}</span>
                        <span style={{ fontSize:'.46rem', fontWeight:600, color:cfg.color, background:cfg.bg, border:`1px solid ${cfg.border}`, borderRadius:20, padding:'1px 7px' }}>{med.type}</span>
                      </div>
                      <div style={{ fontSize:'.56rem', fontWeight:500, color:cfg.color, marginBottom:2 }}>{med.dosage} · {med.frequency}</div>
                      <div style={{ fontSize:'.48rem', fontWeight:300, color:'var(--ink-3)' }}>
                        {t('medications.startDate','Started')} {fmtDate(med.startDate)}{med.doctor && ` · ${med.doctor}`}
                      </div>
                    </div>
                    <div style={{ flexShrink:0, display:'flex', flexDirection:'column', alignItems:'flex-end', gap:6 }}>
                      <div style={{ height:24, padding:'0 10px', borderRadius:20, background:cfg.color, color:'#fff', fontSize:'.46rem', fontWeight:600, display:'flex', alignItems:'center', gap:4 }}>
                        <div style={{ width:5, height:5, borderRadius:'50%', background:'rgba(255,255,255,.6)' }}/>
                        {t('medications.active','Active')}
                      </div>
                      <button type="button" onClick={() => handleDone(med)} style={{ height:22, padding:'0 9px', borderRadius:7, background:'var(--green-bg)', border:'1px solid var(--green-lt)', color:'var(--green)', fontSize:'.43rem', fontWeight:500, cursor:'pointer' }}>{t('medications.markComplete','✓ Mark done')}</button>
                    </div>
                  </div>
                  {med.notes && (
                    <div style={{ marginTop:9, padding:'8px 11px', background:'rgba(255,255,255,.7)', borderRadius:8, border:'1px solid var(--line2)' }}>
                      <div style={{ fontSize:'.5rem', fontWeight:300, color:'var(--ink-3)', lineHeight:1.6 }}>
                        <strong style={{ fontWeight:500, color:'var(--ink-2)' }}>{t('medications.instructions','Instructions')}: </strong>{med.notes}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* PRN section */}
      {counts.asNeeded > 0 && (filter === 'all' || filter === 'as-needed') && (
        <div style={{ marginBottom:20 }}>
          <div className="sh"><div className="sh-title">{t('medications.frequency','As Needed (PRN)')}</div></div>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {allMeds.filter(m => m.frequency === 'As needed').map((med, i) => {
              const cfg = MED_TYPE_CFG[med.type] || MED_TYPE_CFG['Other'];
              return (
                <div key={med.id} style={{ background:'var(--white)', border:`1.5px solid ${cfg.border}`, borderLeft:`3px solid ${cfg.color}`, borderRadius:12, padding:'13px 16px', animation:`fadeUp .25s ease ${i * .06}s both` }}>
                  <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                    <div style={{ width:36, height:36, borderRadius:10, background:cfg.bg, border:`1px solid ${cfg.border}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.1rem', flexShrink:0 }}>{cfg.icon}</div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:2, flexWrap:'wrap' }}>
                        <span style={{ fontSize:'.68rem', fontWeight:600, color:'var(--ink)' }}>{med.name}</span>
                        <span style={{ fontSize:'.46rem', fontWeight:600, color:cfg.color, background:cfg.bg, border:`1px solid ${cfg.border}`, borderRadius:20, padding:'1px 7px' }}>{med.type}</span>
                      </div>
                      <div style={{ fontSize:'.56rem', fontWeight:500, color:'var(--blue)', marginBottom:2 }}>{med.dosage} · {t('medications.frequency','As needed')}</div>
                      <div style={{ fontSize:'.48rem', fontWeight:300, color:'var(--ink-3)' }}>{med.doctor && `${med.doctor} · `}{t('medications.startDate','Since')} {fmtDate(med.startDate)}</div>
                    </div>
                    <span style={{ fontSize:'.46rem', fontWeight:600, padding:'3px 9px', borderRadius:20, flexShrink:0, color:'var(--blue)', background:'var(--blue-bg)', border:'1px solid var(--blue-lt)' }}>PRN</span>
                  </div>
                  {med.notes && (
                    <div style={{ marginTop:9, padding:'8px 11px', background:'var(--blue-bg)', borderRadius:8, border:'1px solid var(--blue-lt)' }}>
                      <div style={{ fontSize:'.5rem', fontWeight:300, color:'var(--ink-3)', lineHeight:1.6 }}>
                        <strong style={{ fontWeight:500, color:'var(--ink-2)' }}>{t('medications.whenToUse','When to use')}: </strong>{med.notes}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Filter tabs */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:8, flexWrap:'wrap', marginBottom:14 }}>
        <div style={{ display:'flex', gap:4, flexWrap:'wrap' }}>
          {[
            { k:'all',       label:`${t('home.viewAll','All')} (${counts.total})` },
            { k:'active',    label:`${t('medications.active','Active')} (${counts.active})`,       hide: counts.active === 0 },
            { k:'as-needed', label:`PRN (${counts.asNeeded})`,        hide: counts.asNeeded === 0 },
            { k:'completed', label:`${t('medications.completed','Completed')} (${counts.completed})`, hide: counts.completed === 0 },
          ].filter(tab => !tab.hide).map(tab => (
            <div key={tab.k} onClick={() => setFilter(tab.k)} style={{ height:28, padding:'0 12px', borderRadius:20, cursor:'pointer', userSelect:'none', fontSize:'.52rem', fontWeight: filter === tab.k ? 600 : 400, color: filter === tab.k ? '#fff' : 'var(--ink-2)', background: filter === tab.k ? 'var(--rose)' : 'var(--cream-2)', border:`1px solid ${filter === tab.k ? 'transparent' : 'var(--line2)'}`, transition:'all .15s', display:'inline-flex', alignItems:'center', justifyContent:'center', lineHeight:1 }}>{tab.label}</div>
          ))}
        </div>
        <button type="button" onClick={() => showModal('medication')} style={{ height:32, padding:'0 14px', borderRadius:9, background:'var(--rose)', color:'#fff', border:'none', fontSize:'.58rem', fontWeight:500, cursor:'pointer', display:'flex', alignItems:'center', gap:6, boxShadow:'0 2px 10px rgba(155,58,86,.28)', flexShrink:0 }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
          {t('medications.add','Add Medication')}
        </button>
      </div>

      {/* List */}
      {visible.length === 0 ? (
        <div className="card" style={{ textAlign:'center', padding:'28px 20px' }}>
          <div style={{ fontSize:'1.8rem', marginBottom:8 }}>💊</div>
          <div style={{ fontSize:'.64rem', fontWeight:500, color:'var(--ink)', marginBottom:4 }}>
            {t('medications.noMedications','No medications')}
          </div>
          {filter !== 'completed' && <button type="button" onClick={() => showModal('medication')} className="pv-empty-btn" style={{ marginTop:12 }}>{t('medications.add','Add Medication')}</button>}
        </div>
      ) : (
        <div>
          <div className="sh"><div className="sh-title">{sectionTitle}</div></div>
          <div style={{ display:'flex', flexDirection:'column', gap:0, borderRadius:14, overflow:'hidden', boxShadow:'var(--shadow-card)' }}>
            {visible.map((med, i) => {
              const cfg    = MED_TYPE_CFG[med.type] || MED_TYPE_CFG['Other'];
              const isOpen = expanded === med.id;
              const isDone = med.status === 'completed' || med.status === 'COMPLETED';
              const isPRN  = med.frequency === 'As needed';
              return (
                <div key={med.id} style={{ borderBottom: i < visible.length - 1 ? '1px solid var(--line2)' : 'none', borderLeft:`3px solid ${isDone ? 'var(--line)' : cfg.color}`, background: isDone ? 'var(--cream-2)' : 'var(--white)', opacity: isDone ? .8 : 1, animation:`fadeUp .25s ease ${i * .04}s both` }}>
                  <div style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 16px', cursor:'pointer', userSelect:'none' }} onClick={() => setExpanded(isOpen ? null : med.id)}>
                    <div style={{ width:34, height:34, borderRadius:9, background: isDone ? 'var(--cream-2)' : cfg.bg, border:`1px solid ${isDone ? 'var(--line2)' : cfg.border}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1rem', flexShrink:0 }}>{cfg.icon}</div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:7, flexWrap:'wrap', marginBottom:2 }}>
                        <span style={{ fontSize:'.67rem', fontWeight:600, color: isDone ? 'var(--ink-3)' : 'var(--ink)' }}>{med.name}</span>
                        <span style={{ fontSize:'.44rem', fontWeight:500, color: isDone ? 'var(--ink-3)' : cfg.color, background: isDone ? 'transparent' : cfg.bg, border:`1px solid ${isDone ? 'transparent' : cfg.border}`, borderRadius:20, padding:'1px 6px' }}>{med.type}</span>
                      </div>
                      <div style={{ fontSize:'.52rem', fontWeight:300, color:'var(--ink-3)' }}>{med.dosage} · {med.frequency}</div>
                    </div>
                    <span style={{ fontSize:'.44rem', fontWeight:600, padding:'3px 9px', borderRadius:20, flexShrink:0, color: isDone ? 'var(--ink-3)' : isPRN ? 'var(--blue)' : cfg.color, background: isDone ? 'var(--cream-2)' : isPRN ? 'var(--blue-bg)' : cfg.bg, border:`1px solid ${isDone ? 'var(--line2)' : isPRN ? 'var(--blue-lt)' : cfg.border}` }}>{isDone ? t('medications.completed','Completed') : isPRN ? 'PRN' : t('medications.active','Active')}</span>
                    {!isDone && (
                      <button type="button" onClick={e => { e.stopPropagation(); handleDone(med); }} style={{ height:24, padding:'0 9px', borderRadius:7, flexShrink:0, background:'var(--green-bg)', border:'1px solid var(--green-lt)', color:'var(--green)', fontSize:'.44rem', fontWeight:500, cursor:'pointer' }}>{t('medications.markComplete','✓ Done')}</button>
                    )}
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--ink-3)" strokeWidth="2.2" style={{ flexShrink:0, transform: isOpen ? 'rotate(180deg)' : 'none', transition:'transform .2s' }}><path d="M6 9l6 6 6-6"/></svg>
                  </div>
                  {isOpen && (
                    <div style={{ borderTop:'1px solid var(--line2)', background:'var(--cream-2)', padding:'12px 16px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                      {[
                        { lbl: t('medications.dosage','Dosage'), val: med.dosage },
                        { lbl: t('medications.frequency','Frequency'), val: med.frequency },
                        { lbl: t('medications.startDate','Started'), val: fmtDate(med.startDate) },
                        { lbl: t('medications.prescribedBy','Prescribed by'), val: med.doctor || '—' },
                        { lbl: t('records.documentType','Status'), val: isDone ? t('medications.completed','Completed') : isPRN ? t('medications.frequency','As Needed') : t('medications.active','Active') },
                        { lbl: t('records.byType','Type'), val: med.type },
                      ].map((d, j) => (
                        <div key={j} style={{ background:'var(--white)', borderRadius:8, padding:'8px 11px', border:'1px solid var(--line2)' }}>
                          <div style={{ fontSize:'.41rem', fontWeight:600, letterSpacing:'.13em', textTransform:'uppercase', color:'var(--ink-3)', marginBottom:3 }}>{d.lbl}</div>
                          <div style={{ fontSize:'.6rem', fontWeight:500, color:'var(--ink)' }}>{d.val}</div>
                        </div>
                      ))}
                      {med.notes && (
                        <div style={{ gridColumn:'span 2', background:'var(--white)', borderRadius:8, padding:'9px 12px', border:'1px solid var(--line2)' }}>
                          <div style={{ fontSize:'.41rem', fontWeight:600, letterSpacing:'.13em', textTransform:'uppercase', color:'var(--ink-3)', marginBottom:4 }}>Instructions</div>
                          <div style={{ fontSize:'.56rem', fontWeight:300, color:'var(--ink-2)', lineHeight:1.65 }}>{med.notes}</div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Safety footer */}
      <div className="card" style={{ marginTop:16, padding:'13px 18px', background:'linear-gradient(135deg,rgba(185,40,20,.04),rgba(253,250,248,.9))' }}>
        <div style={{ display:'flex', alignItems:'flex-start', gap:12 }}>
          <div style={{ width:32, height:32, borderRadius:9, background:'var(--red-bg)', border:'1px solid rgba(185,40,20,.18)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="1.8" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          </div>
          <div>
            <div style={{ fontSize:'.6rem', fontWeight:600, color:'var(--red)', marginBottom:3 }}>Medication safety</div>
            <div style={{ fontSize:'.5rem', fontWeight:300, color:'var(--ink-3)', lineHeight:1.7 }}>
              Always complete antibiotic courses fully even if symptoms improve. Never give adult medications to children. If you notice unusual reactions — rash, breathing difficulty or swelling — contact your paediatrician immediately or call 112.
            </div>
          </div>
        </div>
      </div>

      {/* Confirm complete modal */}
      <Modal open={!!confirmDone} onClose={() => setConfirmDone(null)} maxWidth={360}>
        <div className="pv-mhdr" style={{ textAlign:'center', borderBottom:'none', padding:'28px 28px 8px' }}>
          <XBtn onClick={() => setConfirmDone(null)}/>
          <div style={{ width:48, height:48, borderRadius:14, background: MED_TYPE_CFG[confirmDone?.type]?.bg || 'var(--rose-pale)', border:`1px solid ${MED_TYPE_CFG[confirmDone?.type]?.border || 'var(--rose-lt)'}`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 12px' }}>
            {MED_TYPE_CFG[confirmDone?.type]?.icon || '💊'}
          </div>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.05rem', color:'var(--ink)', marginBottom:6 }}>{t('medications.markComplete','Mark as completed?')}</div>
          <div style={{ fontSize:'.55rem', fontWeight:300, color:'var(--ink-3)', lineHeight:1.7 }}>
            <strong style={{ color:'var(--ink)', fontWeight:500 }}>{confirmDone?.name}</strong> will be moved to your completed medications history.
          </div>
        </div>
        <div className="pv-mfoot" style={{ borderTop:'none', background:'transparent', padding:'12px 28px 24px', gap:10, justifyContent:'center' }}>
          <button type="button" className="fb fb-g" style={{ flex:1, maxWidth:150 }} onClick={() => setConfirmDone(null)}>{t('common.cancel','Not yet')}</button>
          <button type="button" className="fb fb-p" style={{ flex:1, maxWidth:150 }} onClick={confirmComplete}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
            {t('medications.markComplete','Mark done')}
          </button>
        </div>
      </Modal>
    </div>
  );
}
