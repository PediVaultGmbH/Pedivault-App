import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from '../ui/Modal';
import XBtn from '../ui/XBtn';

export default function HealthSummaryModal({ open, onClose, child, growthData, vaccines, medications }) {
  const { t } = useTranslation();
  const printRef = useRef(null);

  if (!child) return null;

  const calcAge = dob => {
    if (!dob) return '—';
    const d = new Date(dob), now = new Date();
    let years = now.getFullYear() - d.getFullYear();
    let months = now.getMonth() - d.getMonth();
    if (months < 0) { years--; months += 12; }
    if (years === 0 && months === 0) return '< 1 month';
    return years > 0 ? `${years} yr${years !== 1 ? 's' : ''} ${months} mo` : `${months} months`;
  };

  const fmtDate = d => d ? new Date(d).toLocaleDateString('en-DE', { day:'numeric', month:'long', year:'numeric' }) : '—';
  const today = new Date().toLocaleDateString('en-DE', { day:'numeric', month:'long', year:'numeric' });

  const latestGrowth = growthData?.[0] || null;
  const bmi = latestGrowth?.weight && latestGrowth?.height
    ? (latestGrowth.weight / ((latestGrowth.height / 100) ** 2)).toFixed(1)
    : null;

  const handlePrint = () => {
    const content = printRef.current.innerHTML;
    const win = window.open('', '_blank');
    win.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>PediVault — Health Summary — ${child.name}</title>
        <meta charset="utf-8"/>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: 'Georgia', serif; color: #1a1a1a; background: #fff; padding: 40px; font-size: 13px; line-height: 1.6; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 20px; border-bottom: 2px solid #9B3A56; margin-bottom: 24px; }
          .brand { font-size: 22px; font-weight: 700; color: #9B3A56; letter-spacing: -0.5px; }
          .brand span { font-weight: 300; }
          .meta { font-size: 11px; color: #888; text-align: right; }
          .child-hero { background: #fdf8f6; border: 1px solid #f0e0e8; border-radius: 10px; padding: 18px 22px; margin-bottom: 24px; display: flex; gap: 20px; align-items: center; }
          .child-avatar { width: 56px; height: 56px; border-radius: 14px; background: #9B3A56; color: #fff; font-size: 24px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
          .child-name { font-size: 20px; font-weight: 700; color: #1a1a1a; margin-bottom: 4px; }
          .child-sub { font-size: 12px; color: #888; }
          .section { margin-bottom: 24px; }
          .section-title { font-size: 11px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: #9B3A56; border-bottom: 1px solid #f0e0e8; padding-bottom: 6px; margin-bottom: 12px; }
          .grid { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 12px; margin-bottom: 8px; }
          .stat { background: #fafafa; border: 1px solid #eee; border-radius: 8px; padding: 12px; }
          .stat-label { font-size: 10px; color: #999; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 4px; }
          .stat-val { font-size: 18px; font-weight: 700; color: #1a1a1a; }
          .stat-unit { font-size: 12px; font-weight: 400; color: #999; }
          table { width: 100%; border-collapse: collapse; font-size: 12px; }
          th { text-align: left; padding: 8px 10px; background: #fdf8f6; font-size: 10px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: #9B3A56; border-bottom: 1px solid #f0e0e8; }
          td { padding: 8px 10px; border-bottom: 1px solid #f5f5f5; color: #333; }
          tr:last-child td { border-bottom: none; }
          .badge { display: inline-block; padding: 2px 8px; border-radius: 20px; font-size: 10px; font-weight: 600; }
          .badge-green { background: #e8f5e9; color: #2a9e62; }
          .badge-red { background: #fde8e8; color: #b92814; }
          .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #eee; font-size: 10px; color: #bbb; display: flex; justify-content: space-between; }
          .empty { color: #bbb; font-style: italic; font-size: 12px; padding: 8px 0; }
        </style>
      </head>
      <body>${content}</body>
      </html>
    `);
    win.document.close();
    setTimeout(() => { win.print(); win.close(); }, 400);
  };

  const completedVaccines = vaccines.filter(v => v.vaccineName || v.name);
  const activeMeds = medications.filter(m => m.status !== 'COMPLETED' && m.status !== 'DISCONTINUED');

  return (
    <Modal open={open} onClose={onClose} maxWidth={640}>
      <div style={{padding:'28px 28px 24px'}}>
        <XBtn onClick={onClose}/>
        <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:20}}>
          <div style={{width:44,height:44,borderRadius:12,background:'linear-gradient(135deg,var(--rose-pale),var(--rose-lt))',border:'1px solid var(--rose-lt)',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--rose)" strokeWidth="1.8" strokeLinecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M9 13h6M9 17h4"/></svg>
          </div>
          <div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:'1.1rem',color:'var(--ink)'}}>{t('modals.healthSummary_title','Health Summary')}</div>
            <div style={{fontSize:'.52rem',color:'var(--ink-3)'}}>{t('modals.healthSummary_sub','Print or save as PDF to share with your doctor')}</div>
          </div>
        </div>

        {/* Preview */}
        <div style={{border:'1px solid var(--line2)',borderRadius:12,overflow:'auto',maxHeight:420,background:'#fff',padding:'24px'}}>
          <div ref={printRef}>
            <div className="header">
              <div>
                <div className="brand">Pedi<span>Vault</span></div>
                <div style={{fontSize:'11px',color:'#888',marginTop:2}}>Child Health Records</div>
              </div>
              <div className="meta">
                <div>Health Summary Report</div>
                <div>Generated: {today}</div>
              </div>
            </div>

            <div className="child-hero">
              <div className="child-avatar">{child.name?.[0]?.toUpperCase()}</div>
              <div>
                <div className="child-name">{child.name}</div>
                <div className="child-sub">
                  DOB: {fmtDate(child.dateOfBirth)} · Age: {calcAge(child.dateOfBirth)}
                  {child.gender ? ` · ${child.gender}` : ''}
                </div>
              </div>
            </div>

            {latestGrowth && (
              <div className="section">
                <div className="section-title">{t('modals.latestMeasurements','Latest Measurements')} — {fmtDate(latestGrowth.date)}</div>
                <div className="grid">
                  <div className="stat"><div className="stat-label">Weight</div><div className="stat-val">{latestGrowth.weight||'—'}<span className="stat-unit"> kg</span></div></div>
                  <div className="stat"><div className="stat-label">Height</div><div className="stat-val">{latestGrowth.height||'—'}<span className="stat-unit"> cm</span></div></div>
                  <div className="stat"><div className="stat-label">Head Circ.</div><div className="stat-val">{latestGrowth.head||latestGrowth.headCm||'—'}<span className="stat-unit"> cm</span></div></div>
                  <div className="stat"><div className="stat-label">BMI</div><div className="stat-val">{bmi||'—'}</div></div>
                </div>
              </div>
            )}

            <div className="section">
              <div className="section-title">{t('modals.vaccinationHistory','Vaccination History')} ({completedVaccines.length} {t('modals.dosesRecorded','doses recorded')})</div>
              {completedVaccines.length === 0 ? (
                <div className="empty">{t('modals.noVaccines','No vaccines recorded yet.')}</div>
              ) : (
                <table>
                  <thead><tr><th>{t('modals.vaccine_th','Vaccine')}</th><th>{t('modals.dose_th','Dose')}</th><th>{t('modals.date_th','Date')}</th><th>{t('modals.administeredBy_th','Administered by')}</th></tr></thead>
                  <tbody>
                    {completedVaccines.slice(0,20).map((v,i)=>(
                      <tr key={i}>
                        <td>{v.vaccineName||v.name}</td>
                        <td>{v.dose}</td>
                        <td>{fmtDate(v.date)}</td>
                        <td>{v.doctor||t('modals.selfRecorded','Self-recorded')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {activeMeds.length > 0 && (
              <div className="section">
                <div className="section-title">{t('modals.currentMedications','Current Medications')} ({activeMeds.length})</div>
                <table>
                  <thead><tr><th>{t('modals.medication_th','Medication')}</th><th>{t('modals.dosage_th','Dosage')}</th><th>{t('modals.frequency_th','Frequency')}</th><th>{t('modals.prescribedBy_th','Prescribed by')}</th></tr></thead>
                  <tbody>
                    {activeMeds.map((m,i)=>(
                      <tr key={i}>
                        <td>{m.name}</td>
                        <td>{m.dosage}</td>
                        <td>{m.frequency}</td>
                        <td>{m.prescribedBy||'—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="footer">
              <span>PediVault · pedivault.de · GDPR compliant · Encrypted health records</span>
              <span>Generated {today}</span>
            </div>
          </div>
        </div>

        <div style={{display:'flex',gap:10,marginTop:16,justifyContent:'flex-end'}}>
          <button type="button" onClick={onClose} style={{height:38,padding:'0 18px',borderRadius:10,border:'1px solid var(--line2)',background:'var(--cream-2)',color:'var(--ink-2)',fontSize:'.6rem',cursor:'pointer'}}>{t('modals.close','Close')}</button>
          <button type="button" onClick={handlePrint} style={{height:38,padding:'0 22px',borderRadius:10,border:'none',background:'var(--rose)',color:'#fff',fontSize:'.6rem',fontWeight:600,cursor:'pointer',display:'flex',alignItems:'center',gap:8,boxShadow:'0 2px 10px rgba(155,58,86,.28)'}}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
            {t('modals.printPDF','Print / Save as PDF')}
          </button>
        </div>
      </div>
    </Modal>
  );
}
