import Modal from '../ui/Modal';
import XBtn from '../ui/XBtn';

const RECORD_TYPE_CFG = {
  'LAB_REPORT':       { icon: '🧪', color: 'var(--blue)',     bg: 'rgba(52,120,176,.08)',  border: 'rgba(52,120,176,.2)',  label: 'Lab Report' },
  'PRESCRIPTION':     { icon: '💊', color: 'var(--rose)',     bg: 'rgba(196,122,146,.08)', border: 'rgba(196,122,146,.2)', label: 'Prescription' },
  'VACCINATION_CARD': { icon: '💉', color: 'var(--rose-mid)', bg: 'rgba(155,58,86,.08)',   border: 'rgba(155,58,86,.2)',   label: 'Vaccination Card' },
  'SCAN':             { icon: '🩻', color: 'var(--ink-2)',    bg: 'rgba(80,80,80,.08)',    border: 'rgba(80,80,80,.2)',    label: 'Scan / X-ray' },
  'GROWTH_CHART':     { icon: '📈', color: 'var(--green)',    bg: 'rgba(42,158,98,.08)',   border: 'rgba(42,158,98,.2)',   label: 'Growth Chart' },
  'OTHER':            { icon: '📄', color: 'var(--amber)',    bg: 'rgba(186,112,24,.08)',  border: 'rgba(186,112,24,.2)',  label: 'Document' },
  // Legacy string keys for backwards compat
  'Lab Report':          { icon: '🧪', color: 'var(--blue)',     bg: 'rgba(52,120,176,.08)',  border: 'rgba(52,120,176,.2)',  label: 'Lab Report' },
  'Prescription':        { icon: '💊', color: 'var(--rose)',     bg: 'rgba(196,122,146,.08)', border: 'rgba(196,122,146,.2)', label: 'Prescription' },
  'Vaccination Certificate': { icon: '💉', color: 'var(--rose-mid)', bg: 'rgba(155,58,86,.08)', border: 'rgba(155,58,86,.2)', label: 'Vaccination Card' },
  'Scan / X-ray':        { icon: '🩻', color: 'var(--ink-2)',    bg: 'rgba(80,80,80,.08)',    border: 'rgba(80,80,80,.2)',    label: 'Scan / X-ray' },
  'Discharge Summary':   { icon: '📋', color: 'var(--amber)',    bg: 'rgba(186,112,24,.08)',  border: 'rgba(186,112,24,.2)',  label: 'Discharge Summary' },
  'Other':               { icon: '📄', color: 'var(--amber)',    bg: 'rgba(186,112,24,.08)',  border: 'rgba(186,112,24,.2)',  label: 'Document' },
};

export function RecordDetailModal({ open, onClose, record }) {
  if (!record) return null;

  const cfg     = RECORD_TYPE_CFG[record.type] || RECORD_TYPE_CFG['OTHER'];
  const fmtDate = d => d ? new Date(d).toLocaleDateString('en-DE', { day: 'numeric', month: 'long', year: 'numeric' }) : '—';
  const fileExt = record.name?.match(/\.(pdf|jpg|jpeg|png|doc|docx)$/i)?.[1]?.toUpperCase() || 'DOC';

  const handleDownload = e => {
    e?.stopPropagation?.();
    if (record.fileUrl) {
      const a = document.createElement('a');
      a.href     = record.fileUrl;
      a.target   = '_blank';
      a.download = record.name;
      a.click();
    }
  };

  return (
    <Modal open={open} onClose={onClose} maxWidth={480}>
      <div className="pv-mhdr">
        
        <div className="pv-mhdr-eyebrow">Health Record</div>
        <div className="pv-mhdr-title" style={{ paddingRight: 32 }}>{record.name}</div>
        <div className="pv-mhdr-sub">{record.source || '—'} · {fmtDate(record.date || record.createdAt)}</div>
        <XBtn onClick={onClose}/>
      </div>
      <div className="pv-mbody">
        <div style={{
          background: `linear-gradient(135deg,${cfg.bg},var(--cream-2))`,
          border: `1.5px solid ${cfg.border}`,
          borderRadius: 12, padding: '28px 20px',
          textAlign: 'center', marginBottom: 16,
        }}>
          <div style={{ fontSize: '2.8rem', marginBottom: 8 }}>{cfg.icon}</div>
          <div style={{ fontSize: '.64rem', fontWeight: 500, color: cfg.color, marginBottom: 3 }}>{cfg.label}</div>
          <div style={{ fontSize: '.52rem', color: 'var(--ink-3)' }}>{fileExt}</div>
          {record.fileUrl && (
            <div onClick={handleDownload} style={{
              marginTop: 14, display: 'inline-flex', alignItems: 'center', gap: 6,
              height: 30, padding: '0 16px', borderRadius: 9,
              background: cfg.color, color: '#fff',
              fontSize: '.54rem', fontWeight: 500, cursor: 'pointer',
              transition: 'opacity .15s',
            }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Download {fileExt}
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
          {[
            { lbl: 'Document type', val: cfg.label },
            { lbl: 'Date',          val: fmtDate(record.date || record.createdAt) },
            { lbl: 'Source',        val: record.source || '—' },
            { lbl: 'File',          val: record.fileUrl ? fileExt : 'No file' },
          ].map(d => (
            <div key={d.lbl} style={{ background: 'var(--cream-2)', borderRadius: 9, padding: '9px 12px', border: '1px solid var(--line2)' }}>
              <div style={{ fontSize: '.42rem', fontWeight: 600, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 3 }}>{d.lbl}</div>
              <div style={{ fontSize: '.6rem', fontWeight: 500, color: 'var(--ink)' }}>{d.val}</div>
            </div>
          ))}
        </div>

        {record.notes && (
          <div style={{ background: 'var(--cream-2)', borderRadius: 9, padding: '10px 13px', border: '1px solid var(--line2)' }}>
            <div style={{ fontSize: '.42rem', fontWeight: 600, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 4 }}>Notes</div>
            <div style={{ fontSize: '.57rem', fontWeight: 300, color: 'var(--ink-2)', lineHeight: 1.65 }}>{record.notes}</div>
          </div>
        )}
      </div>

      <div className="pv-mfoot">
        <button type="button" className="fb fb-g" onClick={onClose}>Close</button>
        {record.fileUrl && (
          <button type="button" className="fb fb-p" onClick={handleDownload}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Download {fileExt}
          </button>
        )}
      </div>
    </Modal>
  );
}

export default RecordDetailModal;
