import { useState, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import EmptyState from '../ui/EmptyState';
import { WHO } from '../../../data/growthData';
import Modal from '../ui/Modal';
import XBtn from '../ui/XBtn';


function GrowthChart({ history, field, color, bandKey }) {
  const W = 560, H = 200, PAD = { t:18, r:20, b:32, l:40 };
  const cw = W - PAD.l - PAD.r, ch = H - PAD.t - PAD.b;

  const pts = [...history]
    .filter(d => d[field] != null)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  if (pts.length === 0) return (
    <div style={{ height:200, display:'flex', alignItems:'center', justifyContent:'center' }}>
      <span style={{ fontSize:'.56rem', color:'var(--ink-3)' }}>No data yet — add a measurement to see your chart</span>
    </div>
  );

  const band = bandKey ? WHO[bandKey] : null;
  const vals = pts.map(p => p[field]);
  const allVals = band ? [...vals, ...band.p3, ...band.p97] : vals;
  const minV = Math.floor(Math.min(...allVals) * 0.96);
  const maxV = Math.ceil(Math.max(...allVals) * 1.04);
  const xScale = i => PAD.l + (pts.length > 1 ? (i / (pts.length - 1)) * cw : cw / 2);
  const yScale = v => PAD.t + ch - ((v - minV) / (maxV - minV || 1)) * ch;

  let bandPath = '', medPath = '';
  if (band && pts.length > 1) {
    const totalMs = new Date(pts[pts.length - 1].date) - new Date(pts[0].date);
    const toMo = d => Math.round((new Date(d.date) - new Date(pts[0].date)) / totalMs * Math.min(36, pts.length * 6));
    const moArr = pts.map(toMo);
    const clamp = (arr, mo) => arr[Math.min(mo, arr.length - 1)];
    const p3pts  = moArr.map((mo, i) => [xScale(i), yScale(clamp(band.p3, mo))]);
    const p97pts = moArr.map((mo, i) => [xScale(i), yScale(clamp(band.p97, mo))]);
    const p50pts = moArr.map((mo, i) => [xScale(i), yScale(clamp(band.p50, mo))]);
    bandPath = `M${p97pts.map(p => p.join(',')).join('L')}L${[...p3pts].reverse().map(p => p.join(',')).join('L')}Z`;
    medPath  = `M${p50pts.map(p => p.join(',')).join('L')}`;
  }

  const linePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${xScale(i).toFixed(1)},${yScale(p[field]).toFixed(1)}`).join('');
  const fillPath = pts.length > 1 ? `${linePath}L${xScale(pts.length - 1)},${PAD.t + ch}L${xScale(0)},${PAD.t + ch}Z` : '';
  const yTicks = 4;
  const tickVals = Array.from({ length: yTicks + 1 }, (_, i) => minV + (maxV - minV) * i / yTicks);

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" style={{ display:'block', maxHeight:220 }}>
      <defs>
        <linearGradient id={`cg-${field}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.16"/>
          <stop offset="100%" stopColor={color} stopOpacity="0.01"/>
        </linearGradient>
        <clipPath id={`clip-${field}`}><rect x={PAD.l} y={PAD.t} width={cw} height={ch}/></clipPath>
      </defs>
      {tickVals.map((v, i) => (
        <g key={i}>
          <line x1={PAD.l} y1={yScale(v)} x2={PAD.l + cw} y2={yScale(v)} stroke="var(--line2)" strokeWidth="1"/>
          <text x={PAD.l - 6} y={yScale(v) + 4} fontSize="9" fill="var(--ink-3)" textAnchor="end">{v.toFixed(1)}</text>
        </g>
      ))}
      {bandPath && <path d={bandPath} fill="rgba(52,120,176,.06)" stroke="none" clipPath={`url(#clip-${field})`}/>}
      {medPath  && <path d={medPath}  fill="none" stroke="rgba(52,120,176,.28)" strokeWidth="1.2" strokeDasharray="5,4" clipPath={`url(#clip-${field})`}/>}
      {fillPath && <path d={fillPath} fill={`url(#cg-${field})`} clipPath={`url(#clip-${field})`}/>}
      {pts.length > 1 && <path d={linePath} fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" clipPath={`url(#clip-${field})`}/>}
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={xScale(i)} cy={yScale(p[field])} r="6" fill="white" stroke={color} strokeWidth="2.2"/>
          <circle cx={xScale(i)} cy={yScale(p[field])} r="2.5" fill={color}/>
          {i === pts.length - 1 && (
            <text x={xScale(i)} y={yScale(p[field]) - 10} fontSize="9.5" fill={color} textAnchor="middle" fontWeight="600">{p[field]}</text>
          )}
        </g>
      ))}
      {pts.map((p, i) => {
        const skip = pts.length > 5 && i % Math.ceil(pts.length / 5) !== 0 && i !== pts.length - 1;
        if (skip && i !== 0) return null;
        return (
          <text key={i} x={xScale(i)} y={H - 6} fontSize="9" fill="var(--ink-3)" textAnchor="middle">
            {new Date(p.date).toLocaleDateString('en-DE', { month:'short', year:'2-digit' })}
          </text>
        );
      })}
      <rect x={PAD.l} y={PAD.t} width={cw} height={ch} fill="none" stroke="var(--line2)" strokeWidth="1" rx="2"/>
    </svg>
  );
}

function calcTrend(history, field) {
  const sorted = [...history].sort((a, b) => new Date(b.date) - new Date(a.date));
  if (sorted.length < 2) return null;
  const latest = sorted[0][field];
  const prev   = sorted[1][field];
  if (!latest || !prev) return null;
  const diff   = (latest - prev).toFixed(1);
  const ms     = new Date(sorted[0].date) - new Date(sorted[1].date);
  const months = Math.round(ms / (1000 * 60 * 60 * 24 * 30.44));
  const dir    = diff > 0 ? '↑' : diff < 0 ? '↓' : '→';
  const col    = diff > 0 ? 'var(--green)' : diff < 0 ? 'var(--red)' : 'var(--ink-3)';
  return { dir, diff: Math.abs(diff), months, col };
}

export function GrowthModule({ activeChild, showModal, extraEntries = [] }) {
  const [tab, setTab]           = useState('weight');
  const [showAll, setShowAll]   = useState(false);
  const [showBmiInfo, setShowBmiInfo] = useState(false);
  const chartRef = useRef(null);
  const { t: tr } = useTranslation();
  const switchTab = useCallback(t => {
    setTab(t);
    setTimeout(() => {
      if (chartRef.current && window.innerWidth < 768) {
        chartRef.current.scrollIntoView({ behavior:'smooth', block:'nearest' });
      }
    }, 50);
  }, []);

  const allHistory = [...extraEntries]
    .map(e => ({
      date:   e.date,
      weight: e.weight || e.weightKg,
      height: e.height || e.heightCm,
      head:   e.head   || e.headCm,
      by:     e.by     || e.measuredBy || 'Self-recorded',
    }))
    .filter(e => e.date)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  if (allHistory.length === 0) return (
    <div className="pv-page" style={{ animation:'fadeUp .3s ease both' }}>
      <div className="mb">
        <EmptyState color="var(--green)"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="1.5" strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>}
          title={tr('growth.noData','No growth data yet')}
          sub="Start tracking growth by adding the first measurements. WHO percentile charts will populate automatically."
          btnLabel={tr('growth.addEntry','Add First Measurement')}
          onBtn={() => showModal('growth')}/>
      </div>
    </div>
  );

  const curr = allHistory[0];
  const displayHistory = showAll ? allHistory : allHistory.slice(0, 6);

  const CHARTS = {
    weight: { label: tr('growth.weight','Weight'),     unit:'kg', color:'var(--rose)',  bandKey:'weight' },
    height: { label: tr('growth.height','Height'),     unit:'cm', color:'var(--green)', bandKey:'height' },
   head:   { label: tr('growth.headCirc','Head circ.'), unit:'cm', color:'var(--blue)',  bandKey:'head'   },
  };
  const cd = CHARTS[tab];
  const wTrend = calcTrend(allHistory, 'weight');
  const hTrend = calcTrend(allHistory, 'height');

  const bmi = curr.weight && curr.height
    ? (curr.weight / ((curr.height / 100) ** 2)).toFixed(1)
    : '—';

  const bmiStatus = bmi === '—' ? '—'
    : bmi < 13 ? 'Underweight'
    : bmi < 17 ? 'Healthy'
    : bmi < 19 ? 'Overweight'
    : 'Obese';

  return (
    <div className="pv-page" style={{ animation:'fadeUp .3s ease both' }}>

      {/* Stat strip */}
      <div className="stat-strip" style={{ marginBottom:20 }}>
        {[
          { cls:'sc-healthy', lbl: tr('growth.weight','Weight'),     val:curr.weight, unit:'kg', sub: tr('growth.current','Current'), subC:'var(--green)',    t:'weight', trend:wTrend },
          { cls:'sc-info',    lbl: tr('growth.height','Height'),     val:curr.height, unit:'cm', sub: tr('growth.current','Current'), subC:'var(--blue)',     t:'height', trend:hTrend },
          { cls:'sc-normal',  lbl: tr('growth.headCirc','Head Circ.'), val:curr.head, unit:'cm', sub: tr('growth.current','Current'), subC:'var(--rose-mid)', t:'head', trend:null },
          { cls:'sc-warning', lbl: tr('growth.bmi','BMI'),             val:bmi,       unit:'',   sub:bmiStatus, subC:'var(--amber)',    t:null,   trend:null },
        ].map((s, i) => (
          <div key={i} className={`stat-card ${s.cls}`}
            style={{ cursor: s.t || i === 3 ? 'pointer' : 'default' }}
            onClick={() => { if (s.t) switchTab(s.t); if (i === 3) setShowBmiInfo(true); }}>
            <div className="stat-label">{s.lbl}</div>
            <div className="stat-val">{s.val}<span className="stat-unit">{s.unit && ` ${s.unit}`}</span></div>
            <div className="stat-meta">
              <span style={{ fontSize:'.46rem', color:s.subC }}>{s.sub}</span>
              {s.trend && <span style={{ fontSize:'.44rem', fontWeight:500, color:s.trend.col, marginLeft:6 }}>{s.trend.dir}{s.trend.diff}{s.unit} / {s.trend.months}mo</span>}
            </div>
            <div className="stat-card-cta">{i === 3 ? tr('growth.whatIsBmi','What is BMI?') + ' →' : tr('growth.viewChart','View chart') + ' →'}</div>
          </div>
        ))}
      </div>

      {/* Chart card */}
      <div className="card mb" style={{ padding:0, overflow:'hidden' }} ref={chartRef}>
        <div style={{ display:'flex', alignItems:'center', borderBottom:'1px solid var(--line2)', padding:'0 20px', gap:2 }}>
          {Object.entries(CHARTS).map(([key, v]) => (
            <div key={key} onClick={() => switchTab(key)} style={{
              padding:'12px 14px 10px', fontSize:'.58rem',
              fontWeight: tab === key ? 600 : 400,
              color: tab === key ? 'var(--rose)' : 'var(--ink-3)',
              cursor:'pointer', userSelect:'none',
              borderBottom:`2px solid ${tab === key ? 'var(--rose)' : 'transparent'}`,
              transition:'all .15s',
            }}>{v.label}</div>
          ))}
          <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:8, paddingRight:4 }}>
            <div style={{ display:'flex', alignItems:'center', gap:5, fontSize:'.43rem', color:'var(--ink-3)' }}>
              <svg width="18" height="6"><line x1="0" y1="3" x2="18" y2="3" stroke="rgba(52,120,176,.35)" strokeWidth="1.5" strokeDasharray="4,3"/></svg>WHO median
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:5, fontSize:'.43rem', color:'var(--ink-3)' }}>
              <div style={{ width:16, height:8, background:'rgba(52,120,176,.07)', border:'1px solid rgba(52,120,176,.14)', borderRadius:2 }}/>3rd–97th %ile
            </div>
            <button type="button" onClick={() => showModal('growth')} style={{
              height:27, padding:'0 11px', borderRadius:8,
              background:'var(--rose)', color:'#fff', border:'none',
              fontSize:'.51rem', fontWeight:500, cursor:'pointer',
              display:'flex', alignItems:'center', gap:5,
            }}>
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
              {tr('growth.addEntry','Add Entry')}
            </button>
          </div>
        </div>

        <div style={{ padding:'14px 20px 6px', display:'flex', alignItems:'baseline', gap:8 }}>
          <div className="eyebrow" style={{ marginBottom:0 }}>{cd.label} over time</div>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'1rem', color:'var(--ink)' }}>
            {curr[tab]} <span style={{ fontSize:'.7rem', color:'var(--ink-3)', fontFamily:"'DM Sans',sans-serif" }}>{cd.unit}</span>
          </div>
          {calcTrend(allHistory, tab) && (() => {
            const t = calcTrend(allHistory, tab);
            return <span style={{ fontSize:'.52rem', fontWeight:500, color:t.col, marginLeft:4 }}>{t.dir} {t.diff}{cd.unit} / {t.months}mo</span>;
          })()}
        </div>

        <div style={{ padding:'4px 20px 14px' }}>
          <GrowthChart history={allHistory} field={tab} color={cd.color} bandKey={cd.bandKey}/>
        </div>
      </div>

      {/* History table */}
      <div>
        <div className="sh">
         <div className="sh-title">{tr('growth.history','Measurement History')} <span style={{ fontSize:'.5rem', color:'var(--ink-3)', fontWeight:300, marginLeft:4 }}>({allHistory.length} entries)</span></div>
          <button type="button" className="sh-link" onClick={() => showModal('growth')}>+ Add →</button>
        </div>
        <div className="card" style={{ padding:0, overflow:'hidden' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1.2fr .7fr .7fr .6fr .8fr', gap:0, padding:'9px 17px', borderBottom:'1px solid var(--line2)', background:'var(--cream-2)' }}>
            {[tr('appointments.date','Date'), tr('growth.weight','Weight'), tr('growth.height','Height'), tr('growth.headCirc','Head'), tr('growth.trend','Trend')].map(h => (
              <div key={h} style={{ fontSize:'.41rem', fontWeight:600, letterSpacing:'.14em', textTransform:'uppercase', color:'var(--ink-3)' }}>{h}</div>
            ))}
          </div>
          {displayHistory.map((h, i) => {
            const wt  = i < allHistory.length - 1 ? +(h.weight - allHistory[i + 1]?.weight).toFixed(1) : null;
            const tCol = wt === null ? 'var(--ink-3)' : wt > 0 ? 'var(--green)' : wt < 0 ? 'var(--red)' : 'var(--ink-3)';
            return (
              <div key={i} style={{
                display:'grid', gridTemplateColumns:'1.2fr .7fr .7fr .6fr .8fr',
                padding:'10px 17px', borderBottom: i < displayHistory.length - 1 ? '1px solid var(--line2)' : 'none',
                background: i === 0 ? 'rgba(155,58,86,.024)' : 'transparent',
              }}>
                <div>
                  <div style={{ fontSize:'.61rem', fontWeight: i === 0 ? 600 : 400, color: i === 0 ? 'var(--rose)' : 'var(--ink)' }}>
                    {new Date(h.date).toLocaleDateString('en-DE', { day:'numeric', month:'short', year:'numeric' })}
                  </div>
                  {i === 0 && <div style={{ fontSize:'.42rem', color:'var(--rose)' }}>{tr('common.latest','Latest')}</div>}
                </div>
                <div style={{ fontSize:'.61rem', color:'var(--ink-2)' }}>{h.weight} <span style={{ fontSize:'.46rem', color:'var(--ink-3)' }}>kg</span></div>
                <div style={{ fontSize:'.61rem', color:'var(--ink-2)' }}>{h.height} <span style={{ fontSize:'.46rem', color:'var(--ink-3)' }}>cm</span></div>
                <div style={{ fontSize:'.61rem', color:'var(--ink-2)' }}>{h.head} <span style={{ fontSize:'.46rem', color:'var(--ink-3)' }}>cm</span></div>
                <div style={{ fontSize:'.56rem', fontWeight:500, color:tCol }}>
                  {wt === null ? '—' : wt > 0 ? `↑${wt}` : wt < 0 ? `↓${Math.abs(wt)}` : '→'}
                </div>
              </div>
            );
          })}
          {allHistory.length > 6 && (
            <div onClick={() => setShowAll(s => !s)} style={{ padding:'10px 17px', textAlign:'center', fontSize:'.54rem', fontWeight:500, color:'var(--rose)', cursor:'pointer', borderTop:'1px solid var(--line2)', background:'var(--rose-ghost)', transition:'background .15s' }}>
              {showAll ? `↑ ${tr('growth.showLess','Show less')}` : `↓ ${tr('growth.viewAll','View all')} ${allHistory.length} entries`}
            </div>
          )}
        </div>
      </div>

      {/* BMI modal */}
      <Modal open={showBmiInfo} onClose={() => setShowBmiInfo(false)} maxWidth={400}>
        <div className="pv-mhdr">

          <div className="pv-mhdr-eyebrow">Growth</div>
          <div className="pv-mhdr-title">Body Mass Index (BMI)</div>
          <div className="pv-mhdr-sub">Understanding your child's BMI reading</div>
          <XBtn onClick={() => setShowBmiInfo(false)}/>
        </div>
        <div className="pv-mbody">
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {[
              { range:'Below 13', label:'Underweight',    color:'var(--blue)',  desc:'May need nutritional support. Talk to your paediatrician.' },
              { range:'13 – 17',  label:'Healthy weight', color:'var(--green)', desc:'This is the ideal range for most children aged 1–5 years.' },
              { range:'17 – 19',  label:'Overweight',     color:'var(--amber)', desc:'Monitor diet and activity. No cause for alarm at this stage.' },
              { range:'Above 19', label:'Obese',          color:'var(--red)',   desc:'Consult your paediatrician for a personalised health plan.' },
            ].map((b, i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 13px', background:'var(--cream-2)', borderRadius:10, border:'1px solid var(--line2)' }}>
                <div style={{ width:4, height:36, borderRadius:2, background:b.color, flexShrink:0 }}/>
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:2 }}>
                    <span style={{ fontSize:'.62rem', fontWeight:600, color:b.color }}>{b.label}</span>
                    <span style={{ fontSize:'.48rem', color:'var(--ink-3)' }}>BMI {b.range}</span>
                  </div>
                  <div style={{ fontSize:'.52rem', fontWeight:300, color:'var(--ink-3)', lineHeight:1.5 }}>{b.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="pv-mfoot">
          <button type="button" className="fb fb-p" style={{ flex:1 }} onClick={() => setShowBmiInfo(false)}>Got it</button>
        </div>
      </Modal>
    </div>
  );
}
