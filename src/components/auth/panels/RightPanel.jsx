export default function RightPanel({ screen }) {
  const secItems = [
    {
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,220,235,.9)" strokeWidth="1.7" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>,
      title: 'AES-256 Encrypted',
      sub: 'Every health record encrypted before it leaves your device',
    },
    {
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,220,235,.9)" strokeWidth="1.7" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h4M18 12h4M12 2v4M12 18v4"/></svg>,
      title: 'EU-Only Servers',
      sub: 'Frankfurt, Germany · ISO 27001 certified · DSGVO compliant',
    },
    {
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,220,235,.9)" strokeWidth="1.7" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>,
      title: 'GDPR Article 9 Compliant',
      sub: 'Full EU health data protection — the highest standard available',
    },
    {
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,220,235,.9)" strokeWidth="1.7" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>,
      title: 'Real-time Sync',
      sub: 'Access your child\'s records instantly from any device, anywhere',
    },
  ];

  const headlines = {
    signin:  { eyebrow: 'YOUR ACCOUNT', h: <>Safe &amp; always <em>in sync</em></>, s: 'Your child\'s health data is protected by the same standards used in medical institutions across Germany.' },
    create:  { eyebrow: 'TRUSTED BY PARENTS', h: <>Families <em>love</em> PediVault</>, s: 'Join over 12,400 families who trust PediVault to keep their most important records safe.' },
    forgot:  { eyebrow: 'SECURE RESET', h: <>Your reset link is <em>protected</em></>, s: 'Password resets follow medical-grade security standards. Your link expires in 15 minutes.' },
    otp:     { eyebrow: 'WHY VERIFY?', h: <>Keeping your account <em>secure</em></>, s: 'Two-factor verification means only you — with your phone — can ever access your child\'s health records.' },
  };
  const { eyebrow, h, s } = headlines[screen] || headlines.signin;

  return (
    <div className="pv-float-panel pv-float-right">
      {/* Eyebrow */}
      <div className="pfp-eyebrow">{eyebrow}</div>

      {/* Headline */}
      <div className="pfp-h">{h}</div>
      <div className="pfp-s">{s}</div>

      <div className="pfp-divider" />

      {/* Security items */}
      <div className="pfp-sec-list">
        {secItems.map((item, i) => (
          <div key={i} className="pfp-sec-row">
            <div className="pfp-sec-ico">{item.icon}</div>
            <div className="pfp-sec-text">
              <div className="pfp-sec-title">{item.title}</div>
              <div className="pfp-sec-sub">{item.sub}</div>
            </div>
            <div className="pfp-sec-check">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(80,220,130,.9)" strokeWidth="3" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
            </div>
          </div>
        ))}
      </div>

      {/* Quote */}
      <div className="pfp-quote">
        <div className="pfp-quote-text">
          "PediVault made navigating the Impfpass effortless — in our language, with reminders before every appointment."
        </div>
        <div className="pfp-quote-author">
          <div className="pfp-quote-av">LM</div>
          <div>
            <div className="pfp-quote-name">Lena Müller</div>
            <div className="pfp-quote-role">Mother of 2 · Berlin</div>
          </div>
          <div className="pfp-stars">★★★★★</div>
        </div>
      </div>

      {/* Badge */}
      <div className="pfp-badge">
        <div className="pfp-badge-dot" />
        <span>Data stored on EU servers · Frankfurt</span>
      </div>
    </div>
  );
}
