import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import EmptyState from '../ui/EmptyState';
import Modal from '../ui/Modal';
import XBtn from '../ui/XBtn';

const RECORD_TYPE_CFG = {
  'LAB_REPORT':       { icon:'🧪', color:'var(--blue)',     bg:'rgba(52,120,176,.08)',  border:'rgba(52,120,176,.2)',  label:'Lab Report' },
  'PRESCRIPTION':     { icon:'💊', color:'var(--rose)',     bg:'rgba(196,122,146,.08)', border:'rgba(196,122,146,.2)', label:'Prescription' },
  'VACCINATION_CARD': { icon:'💉', color:'var(--rose-mid)', bg:'rgba(155,58,86,.08)',   border:'rgba(155,58,86,.2)',   label:'Vaccination Card' },
  'SCAN':             { icon:'🩻', color:'var(--ink-2)',    bg:'rgba(80,80,80,.08)',    border:'rgba(80,80,80,.2)',    label:'Scan / X-ray' },
  'GROWTH_CHART':     { icon:'📈', color:'var(--green)',    bg:'rgba(42,158,98,.08)',   border:'rgba(42,158,98,.2)',   label:'Growth Chart' },
  'OTHER':            { icon:'📄', color:'var(--amber)',    bg:'rgba(186,112,24,.08)',  border:'rgba(186,112,24,.2)',  label:'Document' },
};

const IPFS_GATEWAY = 'https://gateway.pinata.cloud/ipfs';
const POLYGONSCAN  = 'https://amoy.polygonscan.com';

function getLabelFromType(type) {
  return RECORD_TYPE_CFG[type]?.label || type || 'Document';
}

function IPFSBadge({ hash }) {
  if (!hash) return null;
  return (
    <a href={`${IPFS_GATEWAY}/${hash}`} target="_blank" rel="noopener noreferrer"
      onClick={e => e.stopPropagation()}
      style={{ display:'inline-flex', alignItems:'center', gap:4, fontSize:'.42rem', fontWeight:500,
        color:'#7B3FE4', background:'rgba(124,63,228,.08)', border:'1px solid rgba(124,63,228,.2)',
        borderRadius:20, padding:'2px 7px', textDecoration:'none' }}>
      🌐 IPFS
    </a>
  );
}

function BlockchainBadge({ txHash }) {
  if (!txHash) return null;
  const short = txHash.slice(0, 6) + '...' + txHash.slice(-4);
  return (
    <a href={`${POLYGONSCAN}/tx/${txHash}`} target="_blank" rel="noopener noreferrer"
      onClick={e => e.stopPropagation()}
      style={{ display:'inline-flex', alignItems:'center', gap:4, fontSize:'.42rem', fontWeight:500,
        color:'#7B3FE4', background:'rgba(124,63,228,.08)', border:'1px solid rgba(124,63,228,.2)',
        borderRadius:20, padding:'2px 7px', textDecoration:'none' }}>
      ⛓ {short}
    </a>
  );
}

function RecordDetailModal({ open, onClose, record }) {
  const { t } = useTranslation();
  if (!record) return null;
  const cfg     = RECORD_TYPE_CFG[record.type] || RECORD_TYPE_CFG['OTHER'];
  const fmtDate = d => d ? new Date(d).toLocaleDateString('en-DE', { day:'numeric', month:'long', year:'numeric' }) : '—';
  const fileExt = record.name?.match(/\.(pdf|jpg|jpeg|png|doc|docx)$/i)?.[1]?.toUpperCase() || 'DOC';

  const handleDownload = e => {
    e?.stopPropagation?.();
    if (!record.fileUrl) return;
    if (record.fileUrl.startsWith('data:')) {
      const a = document.createElement('a');
      a.href = record.fileUrl;
      a.download = record.name || 'document';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      window.open(record.fileUrl, '_blank');
    }
  };

  return (
    <Modal open={open} onClose={onClose} maxWidth={480}>
      <div className="pv-mhdr">

        <div className="pv-mhdr-eyebrow">Health Record</div>
        <div className="pv-mhdr-title" style={{ paddingRight:32 }}>{record.name}</div>
        <div className="pv-mhdr-sub">{record.source || '—'} · {fmtDate(record.date || record.createdAt)}</div>
        <XBtn onClick={onClose}/>
      </div>
      <div className="pv-mbody">
        <div style={{ background:`linear-gradient(135deg,${cfg.bg},var(--cream-2))`, border:`1.5px solid ${cfg.border}`, borderRadius:12, padding:'28px 20px', textAlign:'center', marginBottom:16 }}>
          <div style={{ fontSize:'2.8rem', marginBottom:8 }}>{cfg.icon}</div>
          <div style={{ fontSize:'.64rem', fontWeight:500, color:cfg.color, marginBottom:3 }}>{cfg.label}</div>
          <div style={{ fontSize:'.52rem', color:'var(--ink-3)' }}>{fileExt}</div>
          {record.fileUrl && (
            <>
              {record.fileUrl.startsWith('data:image') && (
                <img src={record.fileUrl} alt={record.name}
                  style={{maxWidth:'100%',maxHeight:200,borderRadius:8,marginTop:12,objectFit:'contain',border:'1px solid var(--line2)'}}/>
              )}
              {record.fileUrl.startsWith('data:application/pdf') && (
                <div style={{marginTop:12}}>
                  <iframe src={record.fileUrl} title={record.name}
                    style={{width:'100%',height:280,borderRadius:8,border:'1px solid var(--line2)'}}/>
                </div>
              )}
              <div onClick={handleDownload} style={{marginTop:14,display:'inline-flex',alignItems:'center',gap:6,height:30,padding:'0 16px',borderRadius:9,background:cfg.color,color:'#fff',fontSize:'.54rem',fontWeight:500,cursor:'pointer'}}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                {t('common.download','Open / Download')} {fileExt}
              </div>
            </>
          )}
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:12 }}>
          {[
            { lbl: t('records.documentType','Document type'), val: cfg.label },
            { lbl: t('appointments.date','Date'), val: fmtDate(record.date || record.createdAt) },
            { lbl: t('records.source','Source'), val: record.source || '—' },
            { lbl: t('records.file','File'), val: record.fileUrl ? fileExt : t('records.noFile','No file') },
          ].map(d => (
            <div key={d.lbl} style={{ background:'var(--cream-2)', borderRadius:9, padding:'9px 12px', border:'1px solid var(--line2)' }}>
              <div style={{ fontSize:'.42rem', fontWeight:600, letterSpacing:'.14em', textTransform:'uppercase', color:'var(--ink-3)', marginBottom:3 }}>{d.lbl}</div>
              <div style={{ fontSize:'.6rem', fontWeight:500, color:'var(--ink)' }}>{d.val}</div>
            </div>
          ))}
        </div>

        {/* IPFS + Blockchain verification */}
        {(record.ipfsHash || record.blockchainTx) && (
          <div style={{ background:'rgba(124,63,228,.06)', border:'1px solid rgba(124,63,228,.18)', borderRadius:10, padding:'12px 14px', marginBottom:12 }}>
            <div style={{ fontSize:'.5rem', fontWeight:600, color:'#7B3FE4', marginBottom:8, display:'flex', alignItems:'center', gap:6 }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#7B3FE4" strokeWidth="2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              Blockchain Verified
            </div>
            {record.ipfsHash && (
              <div style={{ marginBottom:6 }}>
                <div style={{ fontSize:'.42rem', color:'var(--ink-3)', marginBottom:3 }}>IPFS Hash</div>
                <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                  <code style={{ fontSize:'.46rem', color:'#7B3FE4', wordBreak:'break-all' }}>{record.ipfsHash}</code>
                  <a href={`${IPFS_GATEWAY}/${record.ipfsHash}`} target="_blank" rel="noopener noreferrer"
                    style={{ fontSize:'.46rem', color:'#7B3FE4', textDecoration:'none', flexShrink:0 }}>↗</a>
                </div>
              </div>
            )}
            {record.blockchainTx && (
              <div>
                <div style={{ fontSize:'.42rem', color:'var(--ink-3)', marginBottom:3 }}>Blockchain TX</div>
                <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                  <code style={{ fontSize:'.46rem', color:'#7B3FE4', wordBreak:'break-all' }}>{record.blockchainTx}</code>
                  <a href={`${POLYGONSCAN}/tx/${record.blockchainTx}`} target="_blank" rel="noopener noreferrer"
                    style={{ fontSize:'.46rem', color:'#7B3FE4', textDecoration:'none', flexShrink:0 }}>↗</a>
                </div>
              </div>
            )}
          </div>
        )}

        {record.notes && (
          <div style={{ background:'var(--cream-2)', borderRadius:9, padding:'10px 13px', border:'1px solid var(--line2)' }}>
            <div style={{ fontSize:'.42rem', fontWeight:600, letterSpacing:'.14em', textTransform:'uppercase', color:'var(--ink-3)', marginBottom:4 }}>Notes</div>
            <div style={{ fontSize:'.57rem', fontWeight:300, color:'var(--ink-2)', lineHeight:1.65 }}>{record.notes}</div>
          </div>
        )}
      </div>
      <div className="pv-mfoot">
        <button type="button" className="fb fb-g" onClick={onClose}>{t('common.close','Close')}</button>
        {record.fileUrl && (
          <button type="button" className="fb fb-p" onClick={handleDownload}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            {t('common.download','Download')} {fileExt}
          </button>
        )}
      </div>
    </Modal>
  );
}

export function RecordsModule({ activeChild, showModal, extraRecords = [] }) {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [sort,   setSort]   = useState('newest');
  const [detail, setDetail] = useState(null);
  const searchRef = useRef(null);

  useEffect(() => { const t = setTimeout(() => searchRef.current?.focus(), 100); return () => clearTimeout(t); }, []);

  const fmtDate = d => d ? new Date(d).toLocaleDateString('en-DE', { day:'numeric', month:'short', year:'numeric' }) : '—';

  const allRecords = extraRecords.map((r, i) => ({ ...r, id: r.id || `rec-${i}`, date: r.date || r.createdAt }));

  const counts = {
    total:  allRecords.length,
    lab:    allRecords.filter(r => r.type === 'LAB_REPORT').length,
    rx:     allRecords.filter(r => r.type === 'PRESCRIPTION').length,
    recent: allRecords.filter(r => { const d = new Date(r.date || r.createdAt); return !isNaN(d) && (Date.now() - d.getTime()) < 90 * 86400000; }).length,
    ipfs:   allRecords.filter(r => r.ipfsHash).length,
  };

  const safeDate = d => { const dt = new Date(d); return isNaN(dt) ? new Date(0) : dt; };

  let visible = allRecords
    .filter(r => filter === 'all' || r.type === filter)
    .filter(r => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return r.name?.toLowerCase().includes(q) || r.type?.toLowerCase().includes(q) || (r.source || '').toLowerCase().includes(q);
    });

  visible = [...visible].sort((a, b) => {
    if (sort === 'newest') return safeDate(b.date) - safeDate(a.date);
    if (sort === 'oldest') return safeDate(a.date) - safeDate(b.date);
    if (sort === 'name')   return (a.name || '').localeCompare(b.name || '');
    if (sort === 'type')   return (a.type || '').localeCompare(b.type || '');
    return 0;
  });

  const filterTypes = ['all', 'LAB_REPORT', 'PRESCRIPTION', 'VACCINATION_CARD', 'SCAN', 'OTHER'];

  if (allRecords.length === 0) return (
    <div className="pv-page" style={{ animation:'fadeUp .3s ease both' }}>
      <EmptyState color="var(--green)"
        icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="1.5" strokeLinecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/></svg>}
        title={t('records.noRecords','No health records yet')}
        sub={t('records.noRecordsSub','Upload health documents — lab reports, prescriptions, vaccination certificates and more.')}
        btnLabel={t('records.uploadDocument','Upload First Document')}
        onBtn={() => showModal('record')}/>
    </div>
  );

  return (
    <div className="pv-page" style={{ animation:'fadeUp .3s ease both' }}>

      {/* IPFS banner */}
      {counts.ipfs > 0 && (
        <div style={{ marginBottom:14, padding:'10px 16px', background:'linear-gradient(135deg,rgba(124,63,228,.08),rgba(124,63,228,.04))', border:'1px solid rgba(124,63,228,.2)', borderRadius:12, display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:28, height:28, borderRadius:8, background:'rgba(124,63,228,.12)', border:'1px solid rgba(124,63,228,.2)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:'.9rem' }}>🌐</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:'.58rem', fontWeight:600, color:'#7B3FE4', marginBottom:1 }}>IPFS + Blockchain Secured</div>
            <div style={{ fontSize:'.46rem', color:'rgba(124,63,228,.7)' }}>
              {counts.ipfs} of {counts.total} records stored on IPFS with blockchain verification
            </div>
          </div>
        </div>
      )}

      {/* Stat strip */}
      <div className="stat-strip" style={{ marginBottom:20 }}>
        <div className="stat-card sc-normal" style={{ cursor:'pointer' }} onClick={() => setFilter('all')}>
          <div className="stat-label" style={{ color:'var(--rose-mid)' }}>{t('records.title','Total Records')}</div>
          <div className="stat-val">{counts.total}</div>
          <div className="stat-meta"><span className="pill rose">{t('records.title','All documents')}</span></div>
          <div className="stat-card-cta">{t('home.viewAll','View all')} →</div>
        </div>
        <div className="stat-card sc-info" style={{ cursor:'pointer' }} onClick={() => setFilter('LAB_REPORT')}>
          <div className="stat-label">{t('records.documentType','Lab Reports')}</div>
          <div className="stat-val">{counts.lab}</div>
          <div className="stat-meta"><span className="pill blue">{t('records.documentType','Test results')}</span></div>
          <div className="stat-card-cta">{t('home.viewAll','View')} →</div>
        </div>
        <div className="stat-card sc-healthy" style={{ cursor:'pointer' }} onClick={() => setFilter('PRESCRIPTION')}>
          <div className="stat-label">{t('medications.name','Prescriptions')}</div>
          <div className="stat-val">{counts.rx}</div>
          <div className="stat-meta"><span className="pill green">{t('medications.title','Medications')}</span></div>
          <div className="stat-card-cta">{t('home.viewAll','View')} →</div>
        </div>
        <div className="stat-card sc-warning" style={{ cursor:'pointer' }} onClick={() => showModal('record')}>
          <div className="stat-label">{t('home.recentActivity','Recent')} (90d)</div>
          <div className="stat-val">{counts.recent}</div>
          <div className="stat-meta"><span className="pill amber">+ {t('records.upload','Upload')}</span></div>
          <div className="stat-card-cta">{t('records.uploadDocument','Upload document')} →</div>
        </div>
      </div>

      {/* Search + sort + upload */}
      <div style={{ display:'flex', gap:8, marginBottom:12, alignItems:'center', flexWrap:'wrap' }}>
        <div style={{ flex:1, minWidth:160, display:'flex', alignItems:'center', gap:8, height:36, background:'var(--white)', border:'1.5px solid var(--line2)', borderRadius:9, padding:'0 11px' }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--ink-3)" strokeWidth="1.8" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <input ref={searchRef} value={search} onChange={e => setSearch(e.target.value)} placeholder={t('common.search','Search records, source…')} style={{ flex:1, border:'none', outline:'none', fontSize:'.62rem', color:'var(--ink)', background:'transparent', fontFamily:"'DM Sans',sans-serif" }}/>
          {search && <span style={{ cursor:'pointer', color:'var(--ink-3)', fontSize:'.7rem', lineHeight:1 }} onClick={() => setSearch('')}>✕</span>}
        </div>
        <select value={sort} onChange={e => setSort(e.target.value)} style={{ height:36, padding:'0 11px', borderRadius:9, border:'1.5px solid var(--line2)', background:'var(--white)', color:'var(--ink-2)', fontSize:'.58rem', fontFamily:"'DM Sans',sans-serif", cursor:'pointer', outline:'none', appearance:'none' }}>
          <option value="newest">{t('common.latest','Newest first')}</option>
          <option value="oldest">{t('growth.history','Oldest first')}</option>
          <option value="name">Name A–Z</option>
          <option value="type">{t('records.documentType','By type')}</option>
        </select>
        <button type="button" onClick={() => showModal('record')} style={{ height:36, padding:'0 14px', borderRadius:9, background:'var(--rose)', color:'#fff', border:'none', fontSize:'.58rem', fontWeight:500, cursor:'pointer', display:'flex', alignItems:'center', gap:6, flexShrink:0, boxShadow:'0 2px 10px rgba(155,58,86,.28)' }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
          Upload
        </button>
      </div>

      {/* Filter tabs */}
      <div style={{ display:'flex', gap:4, flexWrap:'wrap', marginBottom:12 }}>
        {filterTypes.map(ftype => {
          const count    = ftype === 'all' ? allRecords.length : allRecords.filter(r => r.type === ftype).length;
          if (ftype !== 'all' && count === 0) return null;
          const cfg      = ftype === 'all' ? null : RECORD_TYPE_CFG[ftype];
          const isActive = filter === ftype;
          return (
            <div key={ftype} onClick={() => setFilter(ftype)} style={{ height:26, padding:'0 11px', borderRadius:20, cursor:'pointer', userSelect:'none', fontSize:'.5rem', fontWeight: isActive ? 600 : 400, color: isActive ? '#fff' : 'var(--ink-2)', background: isActive ? (cfg ? cfg.color : 'var(--rose)') : 'var(--cream-2)', border:`1px solid ${isActive ? 'transparent' : 'var(--line2)'}`, transition:'all .15s', display:'inline-flex', alignItems:'center', justifyContent:'center', gap:4, lineHeight:1 }}>
              {cfg && <span style={{ fontSize:'.65rem' }}>{cfg.icon}</span>}
              {ftype === 'all' ? t('home.viewAll','All') : getLabelFromType(ftype)}
              <span style={{ opacity:.65 }}>({count})</span>
            </div>
          );
        })}
      </div>

      {/* Records list */}
      {visible.length === 0 ? (
        <div className="card" style={{ textAlign:'center', padding:'32px 20px' }}>
          <div style={{ fontSize:'1.8rem', marginBottom:8 }}>🔍</div>
          <div style={{ fontSize:'.64rem', fontWeight:500, color:'var(--ink)', marginBottom:4 }}>{t('records.noRecords','No records found')}</div>
          <div style={{ fontSize:'.54rem', color:'var(--ink-3)' }}>{search ? `No results for "${search}"` : `No ${getLabelFromType(filter)} documents yet`}</div>
          {!search && <button type="button" onClick={() => showModal('record')} className="pv-empty-btn" style={{ marginTop:14 }}>{t('records.uploadDocument','Upload Document')}</button>}
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {visible.map((rec, i) => {
            const cfg = RECORD_TYPE_CFG[rec.type] || RECORD_TYPE_CFG['OTHER'];
            return (
              <div key={rec.id} style={{ animation:`fadeUp .25s ease ${i * .035}s both` }}>
                <div className="card card-hover" style={{ padding:0, overflow:'hidden', cursor:'pointer', borderLeft:`3px solid ${cfg.color}` }} onClick={() => setDetail(rec)}>
                  <div style={{ display:'flex', alignItems:'center', gap:13, padding:'12px 16px' }}>
                    <div style={{ width:38, height:38, borderRadius:10, flexShrink:0, background:cfg.bg, border:`1px solid ${cfg.border}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.2rem' }}>{cfg.icon}</div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:'.66rem', fontWeight:600, color:'var(--ink)', marginBottom:3 }}>{rec.name}</div>
                      <div style={{ display:'flex', alignItems:'center', gap:6, flexWrap:'wrap' }}>
                        <span style={{ fontSize:'.46rem', fontWeight:500, color:cfg.color, background:cfg.bg, border:`1px solid ${cfg.border}`, borderRadius:20, padding:'1px 7px' }}>{cfg.label}</span>
                        {rec.source && <span style={{ fontSize:'.48rem', fontWeight:300, color:'var(--ink-3)' }}>{rec.source}</span>}
                        <span style={{ fontSize:'.46rem', color:'var(--ink-3)' }}>·</span>
                        <span style={{ fontSize:'.48rem', color:'var(--ink-3)' }}>{fmtDate(rec.date || rec.createdAt)}</span>
                        {rec.ipfsHash && <IPFSBadge hash={rec.ipfsHash}/>}
                        {rec.blockchainTx && <BlockchainBadge txHash={rec.blockchainTx}/>}
                      </div>
                      {rec.notes && <div style={{ fontSize:'.48rem', color:'var(--ink-3)', marginTop:4 }}>{rec.notes}</div>}
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:6, flexShrink:0 }}>
                      {rec.fileUrl && (
                        <div style={{ width:28, height:28, borderRadius:8, background:'var(--cream-2)', border:'1px solid var(--line2)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}
                          onClick={e => {
                            e.stopPropagation();
                            if (rec.fileUrl.startsWith('data:')) {
                              const a = document.createElement('a');
                              a.href = rec.fileUrl;
                              a.download = rec.name || 'document';
                              document.body.appendChild(a);
                              a.click();
                              document.body.removeChild(a);
                            } else {
                              window.open(rec.fileUrl, '_blank');
                            }
                          }} title="Download">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--ink-3)" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                        </div>
                      )}
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--ink-3)" strokeWidth="2.2" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer */}
      <div className="card" style={{ marginTop:16, padding:'13px 18px', background:'linear-gradient(135deg,var(--green-bg),rgba(253,250,248,.8))' }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ width:32, height:32, borderRadius:9, background:'var(--green-bg)', border:'1px solid var(--green-lt)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="1.8" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:'.6rem', fontWeight:600, color:'var(--green)', marginBottom:2 }}>End-to-end encrypted + IPFS stored</div>
            <div style={{ fontSize:'.5rem', fontWeight:300, color:'var(--ink-3)', lineHeight:1.6 }}>All documents are encrypted with AES-256, stored on IPFS and verified on Polygon blockchain under DSGVO / GDPR.</div>
          </div>
          <div style={{ textAlign:'right', flexShrink:0 }}>
            <div style={{ fontSize:'.52rem', fontWeight:600, color:'var(--ink)' }}>{allRecords.length} files</div>
            {counts.ipfs > 0 && <div style={{ fontSize:'.44rem', color:'#7B3FE4' }}>{counts.ipfs} on IPFS</div>}
          </div>
        </div>
      </div>

      <RecordDetailModal open={!!detail} onClose={() => setDetail(null)} record={detail}/>
    </div>
  );
}
