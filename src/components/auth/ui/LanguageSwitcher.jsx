import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher({ compact = false }) {
  const { i18n } = useTranslation();
  const current = i18n.language?.startsWith('de') ? 'de' : 'en';

  const toggle = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('pv_lang_v3', lang);
  };

  if (compact) {
    return (
      <div style={{ display:'flex', gap:4 }}>
        {['en','de'].map(lang => (
          <button key={lang} type="button" onClick={() => toggle(lang)} style={{
            height:26, padding:'0 10px', borderRadius:20, border:'1px solid var(--line2)',
            background: current === lang ? 'var(--rose)' : 'var(--cream-2)',
            color: current === lang ? '#fff' : 'var(--ink-2)',
            fontSize:'.5rem', fontWeight: current === lang ? 600 : 400,
            cursor:'pointer', transition:'all .15s',
            display:'flex', alignItems:'center', gap:5,
          }}>
            <span style={{fontSize:'.75rem'}}>{lang === 'en' ? '🇬🇧' : '🇩🇪'}</span>
            {lang === 'en' ? 'EN' : 'DE'}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
      {[
        { code:'en', label:'English', flag:'🇬🇧' },
        { code:'de', label:'Deutsch', flag:'🇩🇪' },
      ].map(l => (
        <button key={l.code} type="button" onClick={() => toggle(l.code)} style={{
          display:'flex', alignItems:'center', gap:12, padding:'11px 14px',
          borderRadius:10, border: current === l.code ? '1.5px solid var(--rose)' : '1px solid var(--line2)',
          background: current === l.code ? 'rgba(155,58,86,.05)' : 'var(--cream-2)',
          cursor:'pointer', transition:'all .15s', textAlign:'left',
        }}>
          <span style={{fontSize:'1.2rem'}}>{l.flag}</span>
          <div style={{flex:1}}>
            <div style={{fontSize:'.6rem', fontWeight:600, color: current === l.code ? 'var(--rose)' : 'var(--ink)'}}>{l.label}</div>
            <div style={{fontSize:'.48rem', color:'var(--ink-3)'}}>{l.code === 'en' ? 'English (UK)' : 'Deutsch (DE)'}</div>
          </div>
          {current === l.code && (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--rose)" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
          )}
        </button>
      ))}
    </div>
  );
}
