import { a11yClick } from '../../../utils/a11y';

export function MobileNav({active,onNav,onSignOut}) {
  const items=[
    {id:'home',lbl:'Home',icon:<svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>},
    {id:'vaccines',lbl:'Vaccines',icon:<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M18 2l4 4-1 1-4-4z"/><path d="M14.5 5.5l4 4"/><path d="M12 8l-8 8 1 3 3 1 8-8"/></svg>},
    {id:'appointments',lbl:'Visits',icon:<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>},
    {id:'account',lbl:'Account',icon:<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="8" r="4"/><path d="M6 20v-2a6 6 0 0112 0v2"/></svg>},
  ];
  return (
    <nav className="pv-mob-nav" aria-label="Main navigation">
      {items.map(item=>(
        <div key={item.id} className={`pv-mob-ni${active===item.id?' active':''}`} {...a11yClick(()=>onNav(item.id))} aria-current={active===item.id?'page':undefined} aria-label={item.lbl}>
          <div style={{color:active===item.id?'var(--rose)':'var(--ink-3)'}}>{item.icon}</div>
          <span className="pv-mob-lbl">{item.lbl}</span>
        </div>
      ))}
      {/* Sign-out — always visible, far right of nav */}
      <div className="pv-mob-ni" {...a11yClick(onSignOut)} aria-label="Sign out" style={{opacity:.8}}>
        <div style={{color:'var(--ink-3)'}}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </div>
        <span className="pv-mob-lbl">Sign out</span>
      </div>
    </nav>
  );
}

export default MobileNav;
