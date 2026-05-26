import { useTranslation } from 'react-i18next';

export default function RightPanel({ screen }) {
  const { t } = useTranslation();

  const secItems = [
    { icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,220,235,.9)" strokeWidth="1.7" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>, title:t('auth.rightPanel.sec1_title'), sub:t('auth.rightPanel.sec1_sub') },
    { icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,220,235,.9)" strokeWidth="1.7" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h4M18 12h4M12 2v4M12 18v4"/></svg>, title:t('auth.rightPanel.sec2_title'), sub:t('auth.rightPanel.sec2_sub') },
    { icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,220,235,.9)" strokeWidth="1.7" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>, title:t('auth.rightPanel.sec3_title'), sub:t('auth.rightPanel.sec3_sub') },
    { icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,220,235,.9)" strokeWidth="1.7" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>, title:t('auth.rightPanel.sec4_title'), sub:t('auth.rightPanel.sec4_sub') },
  ];

  const headlines = {
    signin:  { eyebrow:t('auth.rightPanel.signin_eyebrow'), h:<>{t('auth.rightPanel.signin_h').split('<em>')[0]}<em>{t('auth.rightPanel.signin_h').split('<em>')[1]?.split('</em>')[0]}</em>{t('auth.rightPanel.signin_h').split('</em>')[1]}</>, s:t('auth.rightPanel.signin_s') },
    create:  { eyebrow:t('auth.rightPanel.create_eyebrow'), h:<>{t('auth.rightPanel.create_h').split('<em>')[0]}<em>{t('auth.rightPanel.create_h').split('<em>')[1]?.split('</em>')[0]}</em>{t('auth.rightPanel.create_h').split('</em>')[1]}</>, s:t('auth.rightPanel.create_s') },
    forgot:  { eyebrow:t('auth.rightPanel.forgot_eyebrow'), h:<>{t('auth.rightPanel.forgot_h').split('<em>')[0]}<em>{t('auth.rightPanel.forgot_h').split('<em>')[1]?.split('</em>')[0]}</em>{t('auth.rightPanel.forgot_h').split('</em>')[1]}</>, s:t('auth.rightPanel.forgot_s') },
    otp:     { eyebrow:t('auth.rightPanel.otp_eyebrow'),    h:<>{t('auth.rightPanel.otp_h').split('<em>')[0]}<em>{t('auth.rightPanel.otp_h').split('<em>')[1]?.split('</em>')[0]}</em>{t('auth.rightPanel.otp_h').split('</em>')[1]}</>, s:t('auth.rightPanel.otp_s') },
  };
  const { eyebrow, h, s } = headlines[screen] || headlines.signin;

  return (
    <div className="pv-float-panel pv-float-right">
      <div className="pfp-eyebrow">{eyebrow}</div>
      <div className="pfp-h">{h}</div>
      <div className="pfp-s">{s}</div>
      <div className="pfp-divider" />
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
      <div className="pfp-quote">
        <div className="pfp-quote-text">"{t('auth.rightPanel.quote')}"</div>
        <div className="pfp-quote-author">
          <div className="pfp-quote-av">LM</div>
          <div>
            <div className="pfp-quote-name">Lena Müller</div>
            <div className="pfp-quote-role">{t('auth.rightPanel.quoteRole')}</div>
          </div>
          <div className="pfp-stars">★★★★★</div>
        </div>
      </div>
      <div className="pfp-badge">
        <div className="pfp-badge-dot" />
        <span>{t('auth.rightPanel.badge')}</span>
      </div>
    </div>
  );
}
