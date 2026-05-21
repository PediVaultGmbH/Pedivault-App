import { Logo } from './Logo';

export default function MobileHeader() {
  return (
    <div className="pv-mob-header">
      <div className="pv-mob-brand">
        <div className="pv-mob-logo-box"><Logo /></div>
        <div>
          <div className="pv-mob-brand-name">Pedi<em>Vault</em></div>
          <div className="pv-mob-brand-sub">Child Health Records</div>
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
