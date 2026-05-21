export default function LeftPanel({ screen }) {
  const features = [
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,220,235,.9)" strokeWidth="1.7" strokeLinecap="round">
          <path d="M18 2l4 4-1 1-4-4z"/><path d="M14.5 5.5l4 4"/>
          <path d="M12 8l-8 8 1 3 3 1 8-8"/>
        </svg>
      ),
      title: 'STIKO 2026 Vaccine Schedule',
      sub: '16+ vaccines auto-generated from your child\'s birth date, with smart reminders',
      color: 'rgba(255,180,210,.25)',
    },
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,220,235,.9)" strokeWidth="1.7" strokeLinecap="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
        </svg>
      ),
      title: 'WHO Growth Percentile Charts',
      sub: 'Weight, height & head circumference plotted against international reference bands',
      color: 'rgba(180,255,210,.15)',
    },
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,220,235,.9)" strokeWidth="1.7" strokeLinecap="round">
          <rect x="3" y="4" width="18" height="18" rx="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      ),
      title: 'U1–U14 Check-up Timeline',
      sub: 'All 14 statutory German paediatric check-ups tracked automatically by age',
      color: 'rgba(180,210,255,.15)',
    },
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,220,235,.9)" strokeWidth="1.7" strokeLinecap="round">
          <path d="M12 2a8 8 0 018 8c0 6-8 12-8 12S4 16 4 10a8 8 0 018-8z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      ),
      title: 'Multilingual AI Health Assistant',
      sub: 'Explains German medical terms and Impfpass entries in English, Turkish & more',
      color: 'rgba(255,210,180,.15)',
    },
  ];

  const headlines = {
    signin:  { eyebrow: "GOOD TO SEE YOU", h: <>Your family’s health story <em>continues</em> here</>, s: "Every vaccine, check-up and milestone — waiting exactly where you left it." },
    create:  { eyebrow: "WELCOME TO PEDIVAULT", h: <>Germany’s most trusted <em>child health</em> vault</>, s: "Track vaccines, growth, check-ups and records — all in one beautifully encrypted place." },
    forgot:  { eyebrow: "NO STRESS", h: <>It happens to <em>everyone</em></>, s: "Forgot your password? We’ll have you back in your vault in under 60 seconds." },
    otp:     { eyebrow: "ALMOST THERE ✦", h: <>One step away from your <em>vault</em></>, s: "Your account is being secured with two-factor verification. Nearly done!" },
  };
  const { eyebrow, h, s } = headlines[screen] || headlines.signin;

  return (
    <div className="pv-float-panel pv-float-left">
      {/* Eyebrow */}
      <div className="pfp-eyebrow">{eyebrow}</div>

      {/* Headline */}
      <div className="pfp-h">{h}</div>
      <div className="pfp-s">{s}</div>

      <div className="pfp-divider" />

      {/* Feature list */}
      <div className="pfp-features">
        {features.map((f, i) => (
          <div key={i} className="pfp-feat-row">
            <div className="pfp-feat-ico" style={{ background: f.color }}>
              {f.icon}
            </div>
            <div className="pfp-feat-text">
              <div className="pfp-feat-title">{f.title}</div>
              <div className="pfp-feat-sub">{f.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="pfp-stats">
        <div className="pfp-stat">
          <div className="pfp-stat-v">12.4K<span>+</span></div>
          <div className="pfp-stat-l">Families</div>
        </div>
        <div className="pfp-stat-sep" />
        <div className="pfp-stat">
          <div className="pfp-stat-v">98<span>%</span></div>
          <div className="pfp-stat-l">Satisfaction</div>
        </div>
        <div className="pfp-stat-sep" />
        <div className="pfp-stat">
          <div className="pfp-stat-v">500<span>+</span></div>
          <div className="pfp-stat-l">Doctors</div>
        </div>
      </div>
    </div>
  );
}
