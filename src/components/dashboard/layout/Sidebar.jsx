import { useState } from 'react';
import { NAV } from '../../../data/navConfig';
import FlowerLogo from '../ui/FlowerLogo';
import { a11yClick } from '../../../utils/a11y';
import { useTranslation } from 'react-i18next';

export function Sidebar({active,onNav,onSignOut,open,extraChildren=[],apiChildren=[],userName='Lena'}) {
  const childCount = apiChildren.length + extraChildren.length;
  const [ripple, setRipple] = useState(null);
  const { t, i18n } = useTranslation();
  const handleNav = (id) => {
    setRipple(id);
    setTimeout(() => setRipple(null), 500);
    onNav(id);
  };
  return (
    <aside className={`pv-sidebar${open?' open':''}`}>
      <div className="pv-sb-logo">
        <div className="pv-logo-row">
          <div className="pv-logo-box"><FlowerLogo size={22}/></div>
          <div><div className="pv-logo-mark">Pedi<em>Vault</em></div><div className="pv-logo-sub">Child Health Records</div></div>
        </div>
      </div>
      {NAV.map(g=>(
        <div key={`${g.sec}-${i18n.language}`}>
          <div className="pv-nav-sec">{t(`nav.sec_${g.sec.toLowerCase()}`, g.sec)}</div>
          {g.items.map(item=>(
            <div key={item.id}
              className={`pv-nav-item${active===item.id?' active':''}${ripple===item.id?' ripple':''}`}
              {...a11yClick(()=>handleNav(item.id))}
              aria-current={active===item.id?'page':undefined}
              aria-label={item.lbl}>
              <div className="pv-nav-ico">{item.icon}</div>
              <span className="pv-nav-lbl">{t(`nav.${item.id.replace('-','_')}`, item.lbl)}</span>
              {item.badge&&<span className="pv-nav-badge">{item.badge}</span>}
            </div>
          ))}
        </div>
      ))}
      <div className="pv-sb-foot">
        <div
          onClick={()=>onNav('account')}
          role="button"
          tabIndex={0}
          onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();onNav('account');}}}
          style={{
            display:'flex',alignItems:'center',gap:9,
            cursor:'pointer',borderRadius:10,
            padding:'6px 8px',margin:'-6px -8px',
            transition:'background .15s',
            background:active==='account'?'var(--rose-pale)':'transparent',
          }}
          onMouseEnter={e=>e.currentTarget.style.background='var(--rose-pale)'}
          onMouseLeave={e=>e.currentTarget.style.background=active==='account'?'var(--rose-pale)':'transparent'}
        >
          <div className="pv-user-av" style={{
            boxShadow:active==='account'?'0 0 0 2px var(--rose)':'none',
            transition:'box-shadow .2s',flexShrink:0,
          }}>{userName[0]}</div>
          <div style={{flex:1,minWidth:0}}>
            <div className="pv-user-name">{userName}</div>
            <div className="pv-user-role">{t('common.parent','Parent')} · {childCount} {t('common.child','child')}{childCount!==1?t('common.childrenSuffix','ren'):''}</div>
          </div>
          <button
            type="button"
            className="pv-so-btn"
            aria-label="Sign out"
            title="Sign out"
            style={{background:'none',border:'none',cursor:'pointer',padding:0,flexShrink:0}}
            onClick={e=>{e.stopPropagation();onSignOut();}}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--ink-3)" strokeWidth="2" strokeLinecap="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
