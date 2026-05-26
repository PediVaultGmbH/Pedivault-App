import { useTranslation } from 'react-i18next';

export default function LeftPanel({ screen }) {
  const { t } = useTranslation();

  const features = [
    { icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,220,235,.9)" strokeWidth="1.7" strokeLinecap="round"><path d="M18 2l4 4-1 1-4-4z"/><path d="M14.5 5.5l4 4"/><path d="M12 8l-8 8 1 3 3 1 8-8"/></svg>, title:t('auth.leftPanel.feat1_title'), sub:t('auth.leftPanel.feat1_sub'), color:'rgba(255,180,210,.25)' },
    { icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,220,235,.9)" strokeWidth="1.7" strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>, title:t('auth.leftPanel.feat2_title'), sub:t('auth.leftPanel.feat2_sub'), color:'rgba(180,255,210,.15)' },
    { icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,220,235,.9)" strokeWidth="1.7" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>, title:t('auth.leftPanel.feat3_title'), sub:t('auth.leftPanel.feat3_sub'), color:'rgba(180,210,255,.15)' },
    { icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,220,235,.9)" strokeWidth="1.7" strokeLinecap="round"><path d="M12 2a8 8 0 018 8c0 6-8 12-8 12S4 16 4 10a8 8 0 018-8z"/><circle cx="12" cy="10" r="3"/></svg>, title:t('auth.leftPanel.feat4_title'), sub:t('auth.leftPanel.feat4_sub'), color:'rgba(255,210,180,.15)' },
  ];

  const headlines = {
    signin:  { eyebrow: t('auth.leftPanel.signin_eyebrow'), h: <>{t('auth.leftPanel.signin_h').split('<em>')[0]}<em>{t('auth.leftPanel.signin_h').split('<em>')[1]?.split('</em>')[0]}</em>{t('auth.leftPanel.signin_h').split('</em>')[1]}</>, s: t('auth.leftPanel.signin_s') },
    create:  { eyebrow: t('auth.leftPanel.create_eyebrow'), h: <>{t('auth.leftPanel.create_h').split('<em>')[0]}<em>{t('auth.leftPanel.create_h').split('<em>')[1]?.split('</em>')[0]}</em>{t('auth.leftPanel.create_h').split('</em>')[1]}</>, s: t('auth.leftPanel.create_s') },
    forgot:  { eyebrow: t('auth.leftPanel.forgot_eyebrow'), h: <>{t('auth.leftPanel.forgot_h').split('<em>')[0]}<em>{t('auth.leftPanel.forgot_h').split('<em>')[1]?.split('</em>')[0]}</em>{t('auth.leftPanel.forgot_h').split('</em>')[1]}</>, s: t('auth.leftPanel.forgot_s') },
    otp:     { eyebrow: t('auth.leftPanel.otp_eyebrow'),    h: <>{t('auth.leftPanel.otp_h').split('<em>')[0]}<em>{t('auth.leftPanel.otp_h').split('<em>')[1]?.split('</em>')[0]}</em>{t('auth.leftPanel.otp_h').split('</em>')[1]}</>, s: t('auth.leftPanel.otp_s') },
  };
  const { eyebrow, h, s } = headlines[screen] || headlines.signin;

  return (
    <div className="pv-float-panel pv-float-left">
      <div className="pfp-eyebrow">{eyebrow}</div>
      <div className="pfp-h">{h}</div>
      <div className="pfp-s">{s}</div>
      <div className="pfp-divider" />
      <div className="pfp-features">
        {features.map((f, i) => (
          <div key={i} className="pfp-feat-row">
            <div className="pfp-feat-ico" style={{ background: f.color }}>{f.icon}</div>
            <div className="pfp-feat-text">
              <div className="pfp-feat-title">{f.title}</div>
              <div className="pfp-feat-sub">{f.sub}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="pfp-stats">
        <div className="pfp-stat"><div className="pfp-stat-v">12.4K<span>+</span></div><div className="pfp-stat-l">{t('auth.leftPanel.families','Families')}</div></div>
        <div className="pfp-stat-sep" />
        <div className="pfp-stat"><div className="pfp-stat-v">98<span>%</span></div><div className="pfp-stat-l">{t('auth.leftPanel.satisfaction','Satisfaction')}</div></div>
        <div className="pfp-stat-sep" />
        <div className="pfp-stat"><div className="pfp-stat-v">500<span>+</span></div><div className="pfp-stat-l">{t('auth.leftPanel.doctors','Doctors')}</div></div>
      </div>
    </div>
  );
}
