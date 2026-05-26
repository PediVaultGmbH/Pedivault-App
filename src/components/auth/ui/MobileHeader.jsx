import { useTranslation } from 'react-i18next';
import { Logo } from './Logo';

export default function MobileHeader() {
  const { t } = useTranslation();
  return (
    <div className="pv-mob-header">
      {/* Petals clipped to header */}
      <div className="pv-petal p1"><svg width="18" height="22" viewBox="0 0 18 22" fill="none"><ellipse cx="9" cy="11" rx="7" ry="10" fill="rgba(255,180,210,.35)" transform="rotate(-20 9 11)"/></svg></div>
      <div className="pv-petal p3"><svg width="14" height="18" viewBox="0 0 14 18" fill="none"><ellipse cx="7" cy="9" rx="5" ry="8" fill="rgba(255,160,200,.3)" transform="rotate(15 7 9)"/></svg></div>
      <div className="pv-petal p5"><svg width="20" height="24" viewBox="0 0 20 24" fill="none"><ellipse cx="10" cy="12" rx="8" ry="11" fill="rgba(255,200,220,.28)" transform="rotate(-10 10 12)"/></svg></div>
      <div className="pv-petal p7"><svg width="16" height="20" viewBox="0 0 16 20" fill="none"><ellipse cx="8" cy="10" rx="6" ry="9" fill="rgba(255,170,205,.32)" transform="rotate(25 8 10)"/></svg></div>

      <div className="pv-mob-brand">
        <div className="pv-mob-logo-box"><Logo /></div>
        <div>
          <div className="pv-mob-brand-name">Pedi<em>Vault</em></div>
          <div className="pv-mob-brand-sub">{t('common.tagline','Child Health Records')}</div>
        </div>
      </div>
      <div className="pv-mob-tagline">
        Your child&#39;s health,<br /><em>beautifully safe</em>
      </div>
      <div className="pv-mob-chips">
        <span><span className="pv-mob-chip-dot" />STIKO 2026</span>
        <span><span className="pv-mob-chip-dot" />GDPR</span>
        <span><span className="pv-mob-chip-dot" />AES-256</span>
      </div>
    </div>
  );
}
