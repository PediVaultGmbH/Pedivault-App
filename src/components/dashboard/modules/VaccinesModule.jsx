import { useState, useEffect } from 'react';
import EmptyState from '../ui/EmptyState';
import { STIKO } from '../../../data/stiko';
import { getVaccStatus, findVaccId } from '../../../utils/vaccineUtils';

const STATUS_CFG = {
  done:      { label:'Done',     color:'var(--green)', bg:'var(--green-bg)', border:'var(--green-lt)',     icon:'✓' },
  overdue:   { label:'Overdue',  color:'var(--red)',   bg:'var(--red-bg)',   border:'rgba(185,40,20,.18)', icon:'!' },
  'due-soon':{ label:'Due Soon', color:'var(--amber)', bg:'var(--amber-bg)', border:'var(--amber-lt)',     icon:'~' },
  upcoming:  { label:'Upcoming', color:'var(--blue)',  bg:'var(--blue-bg)',  border:'var(--blue-lt)',      icon:'○' },
};

const POLYGONSCAN = 'https://amoy.polygonscan.com';

function BlockchainBadge({ txHash }) {
  if (!txHash) return null;
  const short = txHash.slice(0, 8) + '...' + txHash.slice(-6);
  return (
    <a href={`${POLYGONSCAN}/tx/${txHash}`} target="_blank" rel="noopener noreferrer"
      onClick={e => e.stopPropagation()}
      style={{ display:'inline-flex', alignItems:'center', gap:4, fontSize:'.42rem', fontWeight:500,
        color:'#7B3FE4', background:'rgba(124,63,228,.08)', border:'1px solid rgba(124,63,228,.2)',
        borderRadius:20, padding:'2px 7px', textDecoration:'none', transition:'all .15s' }}>
      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
        <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
        <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
      </svg>
      ⛓ {short}
    </a>
  );
}

export function VaccinesModule({ activeChild, showModal, extraVaccines = [], childDob }) {
  const [filter, setFilter]       = useState('all');
  const [expanded, setExpanded]   = useState(null);
  const [expandAll, setExpandAll] = useState(false);
  const [showBlockchain, setShowBlockchain] = useState(false);
  const [polBalance, setPolBalance] = useState(null);
  const [polWarning, setPolWarning] = useState(false);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000/api'}/blockchain/status`,
      { headers: { Authorization: `Bearer ${localStorage.getItem('pv_token')}` } })
      .then(r => r.json())
      .then(d => {
        const bal = parseFloat(d?.data?.balance || '0');
        setPolBalance(bal);
        if (d?.data?.enabled && bal < 0.01) setPolWarning(true);
      }).catch(() => {});
  }, []);

  const childAgeMo = (() => {
    if (!childDob) return 43;
    const d = new Date(childDob), now = new Date();
    return (now.getFullYear() - d.getFullYear()) * 12 + now.getMonth() - d.getMonth();
  })();

  const records = {};
  extraVaccines.forEach(ev => {
    const id = ev.vaccineId || findVaccId(ev.vaccineName) || findVaccId(ev.name);
    if (id) {
      records[id] = [...(records[id] || []), {
        dose:    ev.dose,
        date:    ev.date,
        by:      ev.doctor || ev.by || 'Self-recorded',
        txHash:  ev.blockchainTx || null,
        rawId:   ev.id,
        name:    ev.vaccineName || ev.name,
      }];
    }
  });

  const allDoses = STIKO.flatMap(vacc => vacc.doses.map(dose => ({
    vacc, dose, ...getVaccStatus(vacc.id, dose, records, childAgeMo),
  })));

  const counts = {
    done:      allDoses.filter(d => d.status === 'done').length,
    overdue:   allDoses.filter(d => d.status === 'overdue').length,
    'due-soon':allDoses.filter(d => d.status === 'due-soon').length,
    upcoming:  allDoses.filter(d => d.status === 'upcoming').length,
    total:     allDoses.length,
  };
  const pct = counts.total > 0 ? Math.round((counts.done / counts.total) * 100) : 0;
  const onChainCount = extraVaccines.filter(v => v.blockchainTx).length;

  const filteredVacc = STIKO.filter(vacc =>
    filter === 'all' || vacc.doses.some(dose => getVaccStatus(vacc.id, dose, records, childAgeMo).status === filter)
  );

  const fmtDate = d => d ? new Date(d).toLocaleDateString('en-DE', { day:'numeric', month:'short', year:'numeric' }) : '—';
  const isOpen = id => expandAll || expanded === id;
  const toggleExpand = id => {
    if (expandAll) { setExpandAll(false); setExpanded(id); }
    else setExpanded(v => v === id ? null : id);
  };

  if (extraVaccines.length === 0) return (
    <div className="pv-page" style={{ animation:'fadeUp .3s ease both' }}>
      <div className="mb">
        <EmptyState color="var(--rose)"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--rose)" strokeWidth="1.5" strokeLinecap="round"><path d="M18 2l4 4-1 1-4-4z"/><path d="M14.5 5.5l4 4"/><path d="M12 8l-8 8 1 3 3 1 8-8"/></svg>}
          title="No vaccine records yet"
          sub="Add vaccination history to track the STIKO 2026 schedule. Due dates are calculated automatically."
          btnLabel="Log First Vaccine"
          onBtn={() => showModal('vaccine')}/>
      </div>
    </div>
  );

  return (
    <div className="pv-page" style={{ animation:'fadeUp .3s ease both' }}>

      {polWarning && (
        <div style={{display:'flex',alignItems:'center',gap:12,padding:'12px 16px',background:'var(--amber-bg)',border:'1px solid var(--amber-lt)',borderRadius:12,marginBottom:18}}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--amber)" strokeWidth="2" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          <div style={{flex:1}}>
            <div style={{fontSize:'.6rem',fontWeight:600,color:'var(--amber)',marginBottom:2}}>Low blockchain wallet balance</div>
            <div style={{fontSize:'.52rem',fontWeight:300,color:'var(--amber)'}}>POL balance is {polBalance?.toFixed(4) || '0'} — vaccine certificates may not be recorded on-chain. Top up the wallet to restore blockchain features.</div>
          </div>
          <div onClick={()=>setPolWarning(false)} style={{cursor:'pointer',color:'var(--amber)',fontSize:'1rem',lineHeight:1,flexShrink:0}}>×</div>
        </div>
      )}

      {/* Blockchain banner */}
      {counts.done > 0 && (
        <div style={{ marginBottom:14, padding:'10px 16px', background:'linear-gradient(135deg,rgba(124,63,228,.08),rgba(124,63,228,.04))', border:'1px solid rgba(124,63,228,.2)', borderRadius:12, display:'flex', alignItems:'center', gap:10, cursor:'pointer' }}
          onClick={() => setShowBlockchain(v => !v)}>
          <div style={{ width:28, height:28, borderRadius:8, background:'rgba(124,63,228,.12)', border:'1px solid rgba(124,63,228,.2)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#7B3FE4" strokeWidth="2" strokeLinecap="round">
              <rect x="2" y="7" width="6" height="10" rx="1"/><rect x="9" y="4" width="6" height="16" rx="1"/><rect x="16" y="7" width="6" height="10" rx="1"/>
              <path d="M8 12h1M15 12h1"/>
            </svg>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:'.58rem', fontWeight:600, color:'#7B3FE4', marginBottom:1 }}>
              Polygon Blockchain — {counts.done} certificate{counts.done > 1 ? 's' : ''} issued
            </div>
            <div style={{ fontSize:'.48rem', color:'rgba(124,63,228,.7)' }}>
              Vaccine records are tamper-proof and verifiable on Polygon Amoy · Click to {showBlockchain ? 'hide' : 'view'} certificates
            </div>
          </div>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#7B3FE4" strokeWidth="2.2"
            style={{ flexShrink:0, transform:showBlockchain ? 'rotate(180deg)' : 'none', transition:'transform .2s' }}>
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </div>
      )}

      {/* Blockchain certificates panel */}
      {showBlockchain && (
        <div className="card" style={{ marginBottom:14, padding:0, overflow:'hidden', border:'1px solid rgba(124,63,228,.2)' }}>
          <div style={{ padding:'12px 16px', background:'rgba(124,63,228,.06)', borderBottom:'1px solid rgba(124,63,228,.12)', display:'flex', alignItems:'center', gap:8 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#7B3FE4" strokeWidth="2" strokeLinecap="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <span style={{ fontSize:'.58rem', fontWeight:600, color:'#7B3FE4' }}>On-Chain Vaccine Certificates</span>
            <a href={`${POLYGONSCAN}/address/${process.env.REACT_APP_VACCINE_CONTRACT || '0xB9A1FceE143AbeFF003787bd5A68139CA5df6c5E'}`}
              target="_blank" rel="noopener noreferrer"
              style={{ marginLeft:'auto', fontSize:'.46rem', color:'#7B3FE4', textDecoration:'none', display:'flex', alignItems:'center', gap:4 }}
              onClick={e => e.stopPropagation()}>
              View contract ↗
            </a>
          </div>
          {extraVaccines.map((ev, i) => (
            <div key={ev.id || i} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 16px', borderBottom:i < extraVaccines.length-1 ? '1px solid var(--line2)' : 'none' }}>
              <div style={{ width:28, height:28, borderRadius:8, background:'rgba(42,158,98,.1)', border:'1px solid var(--green-lt)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:'.58rem', fontWeight:500, color:'var(--ink)', marginBottom:2 }}>
                  {ev.vaccineName || ev.name} — {ev.dose}
                </div>
                <div style={{ fontSize:'.46rem', color:'var(--ink-3)' }}>
                  {fmtDate(ev.date)} · {ev.doctor || 'Self-recorded'}
                </div>
              </div>
              <div style={{ flexShrink:0 }}>
                {ev.blockchainTx ? (
                  <BlockchainBadge txHash={ev.blockchainTx}/>
                ) : (
                  <span style={{ fontSize:'.42rem', color:'var(--ink-3)', background:'var(--cream-2)', border:'1px solid var(--line2)', borderRadius:20, padding:'2px 7px' }}>
                    Pending chain
                  </span>
                )}
              </div>
            </div>
          ))}
          <div style={{ padding:'10px 16px', background:'rgba(124,63,228,.04)', display:'flex', alignItems:'center', gap:6 }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#7B3FE4" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <span style={{ fontSize:'.46rem', color:'rgba(124,63,228,.7)' }}>
              Certificates are permanently recorded on Polygon Amoy and cannot be altered or deleted.
            </span>
          </div>
        </div>
      )}

      {/* Stat strip */}
      <div className="stat-strip" style={{ marginBottom:20 }}>
        <div className="stat-card sc-urgent" style={{ cursor:'pointer' }} onClick={() => setFilter('overdue')}>
          {counts.overdue > 0 && <div className="sc-urgent-flag"><div className="sc-urgent-dot"/>Urgent</div>}
          <div className="stat-label">Overdue</div>
          <div className="stat-val">{counts.overdue}</div>
          <div className="stat-meta"><span className="pill red">{counts.overdue > 0 ? 'Action needed' : 'All clear'}</span></div>
          <div className="stat-card-cta">View overdue →</div>
        </div>
        <div className="stat-card sc-warning" style={{ cursor:'pointer' }} onClick={() => setFilter('due-soon')}>
          <div className="stat-label">Due Soon</div>
          <div className="stat-val">{counts['due-soon']}</div>
          <div className="stat-meta"><span className="pill amber">Schedule now</span></div>
          <div className="stat-card-cta">View schedule →</div>
        </div>
        <div className="stat-card sc-healthy" style={{ cursor:'pointer' }} onClick={() => setFilter('done')}>
          <div className="stat-label">Completed</div>
          <div className="stat-val">{counts.done}<span className="stat-unit"> /{counts.total}</span></div>
          <div className="stat-meta"><span className="pill green">{pct}% done</span></div>
          <div className="stat-card-cta">View completed →</div>
        </div>
        <div className="stat-card sc-info" style={{ cursor:'pointer' }} onClick={() => setFilter('upcoming')}>
          <div className="stat-label">Upcoming</div>
          <div className="stat-val">{counts.upcoming}</div>
          <div className="stat-meta"><span className="pill blue">Not yet due</span></div>
          <div className="stat-card-cta">View upcoming →</div>
        </div>
      </div>

      {/* Progress banner */}
      <div className="card mb" style={{ padding:'16px 20px' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
          <div>
            <div className="eyebrow">STIKO 2026 Immunisation Schedule</div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'.95rem', color:'var(--ink)' }}>
              {counts.done} of {counts.total} doses completed
            </div>
          </div>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.85rem', color:'var(--rose)', lineHeight:1 }}>
              {pct}<span style={{ fontSize:'.9rem', fontFamily:"'DM Sans',sans-serif", color:'var(--ink-3)' }}>%</span>
            </div>
            <div style={{ fontSize:'.44rem', color:'var(--ink-3)' }}>immunised</div>
          </div>
        </div>
        <div style={{ display:'flex', gap:2, height:8, borderRadius:4, overflow:'hidden', marginBottom:10 }}>
          {allDoses.map((d, i) => (
            <div key={i} style={{ flex:1, background:STATUS_CFG[d.status].color, opacity:d.status === 'upcoming' ? .22 : 1 }}/>
          ))}
        </div>
        <div style={{ display:'flex', gap:14, flexWrap:'wrap' }}>
          {Object.entries(STATUS_CFG).map(([k, v]) => (
            <div key={k} style={{ display:'flex', alignItems:'center', gap:5, fontSize:'.46rem', color:'var(--ink-3)', cursor:'pointer' }}
              onClick={() => setFilter(k)}>
              <div style={{ width:8, height:8, borderRadius:'50%', background:v.color }}/>
              {v.label}: <strong style={{ color:'var(--ink)', marginLeft:2 }}>{k === 'due-soon' ? counts['due-soon'] : counts[k]}</strong>
            </div>
          ))}
        </div>
      </div>

      {/* Filter + Log button */}
      <div style={{ display:'flex', flexDirection:'column', gap:9, marginBottom:14 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:8, flexWrap:'wrap' }}>
          <div style={{ display:'flex', gap:4, flexWrap:'wrap' }}>
            {[
              { k:'all',      label:`All (${counts.total})` },
              { k:'overdue',  label:`Overdue (${counts.overdue})`,   alert:counts.overdue > 0 },
              { k:'due-soon', label:`Due Soon (${counts['due-soon']})` },
              { k:'done',     label:`Done (${counts.done})` },
              { k:'upcoming', label:`Upcoming (${counts.upcoming})` },
            ].map(tab => (
              <div key={tab.k} onClick={() => setFilter(tab.k)} style={{
                height:28, padding:'0 12px', borderRadius:20, cursor:'pointer', userSelect:'none',
                fontSize:'.52rem', fontWeight:filter === tab.k ? 600 : 400,
                color:filter === tab.k ? '#fff' : tab.alert ? 'var(--red)' : 'var(--ink-2)',
                background:filter === tab.k ? (tab.alert ? 'var(--red)' : 'var(--rose)') : tab.alert ? 'var(--red-bg)' : 'var(--cream-2)',
                border:`1px solid ${filter === tab.k ? 'transparent' : tab.alert ? 'rgba(185,40,20,.2)' : 'var(--line2)'}`,
                transition:'all .15s', display:'inline-flex', alignItems:'center', justifyContent:'center', lineHeight:1,
              }}>{tab.label}</div>
            ))}
          </div>
          <div style={{ display:'flex', gap:6, alignItems:'center', flexShrink:0 }}>
            <div onClick={() => { setExpandAll(v => !v); setExpanded(null); }} style={{
              height:28, padding:'0 11px', borderRadius:20, cursor:'pointer', userSelect:'none',
              fontSize:'.51rem', color:'var(--ink-2)', background:'var(--cream-2)',
              border:'1px solid var(--line2)', display:'flex', alignItems:'center', gap:5, transition:'all .15s',
            }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"
                style={{ transform:expandAll ? 'rotate(180deg)' : 'none', transition:'transform .2s' }}>
                <path d="M6 9l6 6 6-6"/>
              </svg>
              {expandAll ? 'Collapse all' : 'Expand all'}
            </div>
            <button type="button" onClick={() => showModal('vaccine')} style={{
              height:32, padding:'0 14px', borderRadius:9, background:'var(--rose)', color:'#fff', border:'none',
              fontSize:'.58rem', fontWeight:500, cursor:'pointer', display:'flex', alignItems:'center', gap:6,
              boxShadow:'0 2px 10px rgba(155,58,86,.28)',
            }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
              Log Vaccine
            </button>
          </div>
        </div>
      </div>

      {filteredVacc.length === 0 && (
        <div className="card" style={{ textAlign:'center', padding:'32px', color:'var(--ink-3)', fontSize:'.6rem' }}>
          No vaccines in this category
        </div>
      )}

      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {filteredVacc.map((vacc, vi) => {
          const doseStatuses = vacc.doses.map(dose => ({ dose, ...getVaccStatus(vacc.id, dose, records, childAgeMo) }));
          const open = isOpen(vacc.id);
          const worstStatus = doseStatuses.find(d => d.status === 'overdue')?.status
            || doseStatuses.find(d => d.status === 'due-soon')?.status
            || doseStatuses.find(d => d.status === 'upcoming')?.status || 'done';
          const cfg = STATUS_CFG[worstStatus];
          const doneCnt = doseStatuses.filter(d => d.status === 'done').length;
          const nextPending = doseStatuses.find(d => d.status === 'overdue') || doseStatuses.find(d => d.status === 'due-soon') || doseStatuses.find(d => d.status === 'upcoming');

          return (
            <div key={vacc.id} style={{ animation:`fadeUp .3s ease ${vi * .04}s both` }}>
              <div className="card" style={{
                padding:0, overflow:'hidden',
                border:`1px solid ${worstStatus === 'overdue' ? 'rgba(185,40,20,.22)' : worstStatus === 'due-soon' ? 'rgba(186,112,24,.2)' : 'var(--line2)'}`,
                background:worstStatus === 'overdue' ? 'rgba(185,40,20,.015)' : 'var(--white)',
                transition:'border-color .15s,box-shadow .15s',
              }}>
                <div style={{ display:'flex', alignItems:'center', gap:12, padding:'13px 17px', cursor:'pointer', userSelect:'none' }}
                  onClick={() => toggleExpand(vacc.id)}>
                  <div style={{ width:10, height:10, borderRadius:'50%', background:vacc.color, flexShrink:0,
                    boxShadow:worstStatus === 'overdue' ? `0 0 0 3px ${vacc.color}28` : worstStatus === 'due-soon' ? `0 0 0 3px ${vacc.color}20` : 'none' }}/>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:7, flexWrap:'wrap', marginBottom:2 }}>
                      <span style={{ fontSize:'.7rem', fontWeight:600, color:'var(--ink)' }}>{vacc.name}</span>
                      <span style={{ fontSize:'.43rem', color:'var(--ink-3)', background:'var(--cream-2)', border:'1px solid var(--line2)', borderRadius:20, padding:'1px 6px' }}>{vacc.short}</span>
                      {doneCnt > 0 && (
                        <span style={{ fontSize:'.42rem', color:'#7B3FE4', background:'rgba(124,63,228,.08)', border:'1px solid rgba(124,63,228,.2)', borderRadius:20, padding:'1px 6px', display:'flex', alignItems:'center', gap:3 }}>
                          ⛓ On-chain
                        </span>
                      )}
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:9, flexWrap:'wrap' }}>
                      <span style={{ fontSize:'.49rem', fontWeight:300, color:'var(--ink-3)' }}>{vacc.protects}</span>
                      {nextPending && worstStatus !== 'done' && (
                        <span style={{ fontSize:'.46rem', fontWeight:500, color:cfg.color }}>
                          · {worstStatus === 'overdue'
                              ? `${nextPending.dose.dose} overdue`
                              : worstStatus === 'due-soon'
                              ? `${nextPending.dose.dose} due ~${nextPending.dose.ageMinMo}mo`
                              : `${nextPending.dose.dose} at ${nextPending.dose.ageMinMo}mo`}
                        </span>
                      )}
                    </div>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:4, flexShrink:0 }}>
                    <div style={{ display:'flex', gap:3 }}>
                      {doseStatuses.map((ds, i) => (
                        <div key={i} style={{ width:8, height:8, borderRadius:'50%', background:STATUS_CFG[ds.status].color, opacity:ds.status === 'upcoming' ? .28 : 1 }}/>
                      ))}
                    </div>
                    <span style={{ fontSize:'.47rem', color:'var(--ink-3)' }}>{doneCnt}/{vacc.doses.length}</span>
                  </div>
                  <span style={{ fontSize:'.44rem', fontWeight:600, padding:'3px 9px', borderRadius:20, flexShrink:0,
                    color:cfg.color, background:cfg.bg, border:`1px solid ${cfg.border}` }}>{cfg.label}</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--ink-3)" strokeWidth="2.2"
                    style={{ flexShrink:0, transform:open ? 'rotate(180deg)' : 'none', transition:'transform .2s' }}>
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </div>

                {open && (
                  <div style={{ borderTop:'1px solid var(--line2)', background:'var(--cream-2)' }}>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1.1fr 1.3fr auto', padding:'8px 17px', borderBottom:'1px solid var(--line2)' }}>
                      {['Dose','Status','Date / Due',''].map(h => (
                        <div key={h} style={{ fontSize:'.4rem', fontWeight:600, letterSpacing:'.14em', textTransform:'uppercase', color:'var(--ink-3)' }}>{h}</div>
                      ))}
                    </div>
                    {doseStatuses.map((ds, i) => {
                      const sc = STATUS_CFG[ds.status];
                      const dueText = ds.status === 'overdue'
                        ? `Was due at ${ds.dose.ageMaxMo === 999 ? '6' : ds.dose.ageMaxMo} months`
                        : ds.status === 'due-soon'
                        ? `Due ~${ds.dose.ageMinMo} months`
                        : ds.status === 'upcoming'
                        ? ds.dose.ageMaxMo === 999 ? 'Annually from 6 months' : `Due at ${ds.dose.ageMinMo} months`
                        : '';
                      return (
                        <div key={i} style={{
                          display:'grid', gridTemplateColumns:'1fr 1.1fr 1.3fr auto',
                          alignItems:'center', padding:'11px 17px',
                          borderBottom:i < doseStatuses.length - 1 ? '1px solid var(--line2)' : 'none',
                          background:ds.status === 'overdue' ? 'rgba(185,40,20,.028)' : ds.status === 'done' ? 'rgba(42,158,98,.014)' : 'transparent',
                        }}>
                          <div>
                            <div style={{ fontSize:'.62rem', fontWeight:500, color:'var(--ink)' }}>{ds.dose.dose}</div>
                            <div style={{ fontSize:'.46rem', color:'var(--ink-3)', marginTop:1 }}>{ds.dose.timing}</div>
                          </div>
                          <div>
                            <span style={{ fontSize:'.44rem', fontWeight:600, color:sc.color, background:sc.bg,
                              border:`1px solid ${sc.border}`, borderRadius:20, padding:'2px 8px' }}>
                              {sc.icon} {sc.label}
                            </span>
                          </div>
                          <div style={{ fontSize:'.55rem' }}>
                            {ds.status === 'done' ? (
                              <div>
                                <div style={{ fontWeight:500, color:'var(--ink)' }}>{fmtDate(ds.date)}</div>
                                <div style={{ fontSize:'.44rem', color:'var(--ink-3)', marginTop:1 }}>{ds.by}</div>
                                {ds.txHash && <div style={{ marginTop:4 }}><BlockchainBadge txHash={ds.txHash}/></div>}
                              </div>
                            ) : (
                              <span style={{ color:sc.color, fontWeight:ds.status === 'overdue' ? 500 : 400 }}>{dueText}</span>
                            )}
                          </div>
                          <div>
                            {ds.status !== 'done' ? (
                              <button type="button" onClick={e => { e.stopPropagation(); showModal('vaccine'); }} style={{
                                height:26, padding:'0 10px', borderRadius:7,
                                background:ds.status === 'overdue' ? 'var(--red)' : 'var(--rose)',
                                color:'#fff', border:'none', fontSize:'.48rem', fontWeight:500, cursor:'pointer', whiteSpace:'nowrap',
                              }}>Log {ds.dose.dose}</button>
                            ) : (
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
                            )}
                          </div>
                        </div>
                      );
                    })}
                    <div style={{ padding:'9px 17px', borderTop:'1px solid var(--line2)', display:'flex', alignItems:'center', gap:6 }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--ink-3)" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                      <span style={{ fontSize:'.48rem', color:'var(--ink-3)' }}>{vacc.note}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* STIKO info footer */}
      <div className="card" style={{ marginTop:16, padding:'14px 18px', background:'linear-gradient(135deg,var(--rose-pale),rgba(253,250,248,.8))' }}>
        <div style={{ display:'flex', alignItems:'flex-start', gap:12 }}>
          <div style={{ width:32, height:32, borderRadius:9, background:'var(--rose-pale)', border:'1px solid var(--rose-lt)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--rose)" strokeWidth="1.8" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <div>
            <div style={{ fontSize:'.62rem', fontWeight:600, color:'var(--rose)', marginBottom:3 }}>About STIKO 2026</div>
            <div style={{ fontSize:'.52rem', fontWeight:300, color:'var(--ink-3)', lineHeight:1.7 }}>
              The Standing Committee on Vaccination (STIKO) at the Robert Koch Institute publishes the official German immunisation schedule annually. These recommendations are for healthy children — your paediatrician may adjust timing based on your child's individual health.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
