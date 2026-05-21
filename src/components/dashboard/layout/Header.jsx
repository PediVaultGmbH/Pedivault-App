import { a11yClick } from '../../../utils/a11y';

export function Header({
  active, activeChild, onChildSelect, extraChildren=[],
  apiChildren=[],
  onSearch, onNotif, onBook, onAddChild, showToast, onBurger,
  onSignOut,
}) {
  const isHome = active === 'home';
  const titles = {
    growth:'Growth Tracker', vaccines:'Vaccines', records:'Health Records',
    appointments:'Appointments', medications:'Medications', profile:'Child Profile',
    'ai-assist':'AI Assistant', support:'Support', account:'My Account',
  };
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const GENDER_COLOR = { FEMALE: '#C47A92', MALE: '#3478B0', OTHER: '#7B52B0' };

  const allChildren = [
    ...apiChildren.map(c => ({
      id:    c.id,
      name:  c.name,
      color: c.color || GENDER_COLOR[c.gender] || '#C47A92',
      lbl:   c.name[0],
    })),
    ...extraChildren.map(c => ({
      id:    c.id,
      name:  c.name,
      color: c.color || '#C47A92',
      lbl:   c.name[0],
    })),
  ];

  return (
    <header className="pv-header">

      {/* Burger — mobile only */}
      <button className="pv-mob-burger" onClick={onBurger} aria-label="Open menu" type="button"
        style={{background:'none',border:'none',cursor:'pointer',padding:0,flexShrink:0}}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--ink-2)" strokeWidth="2" strokeLinecap="round">
          <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>

      {/* Desktop: greeting or page title */}
      {isHome
        ? <div className="pv-hdr-greeting">
            <div className="pv-hdr-hi">{greeting}</div>
            <div className="pv-hdr-name">Hello, <em>there</em> 👋</div>
          </div>
        : <div className="pv-hdr-title">{titles[active] || active}</div>
      }

      {/* Desktop child tabs */}
      <div className="pv-ctabs" role="tablist" aria-label="Children">
        {allChildren.map(c => (
          <div key={c.id}
            className={`pv-ctab${activeChild === c.id ? ' sel' : ''}`}
            {...a11yClick(() => onChildSelect(c.id))}
            role="tab" aria-selected={activeChild === c.id} aria-label={c.name}>
            <div className="pv-ctab-av" style={{background: c.color + '22', color: c.color}}>{c.lbl}</div>
            <span className="pv-ctab-name">{c.name}</span>
            <div className="pv-ctab-dot" style={{background: c.color}}/>
          </div>
        ))}
        <button className="pv-add-child" title="Add child" onClick={onAddChild} aria-label="Add child" type="button">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--rose-mid)" strokeWidth="2.2" strokeLinecap="round">
            <path d="M12 5v14M5 12h14"/>
          </svg>
        </button>
      </div>

      {/* Mobile: child pills */}
      <div className="pv-mob-child-sw" style={{display:'none',alignItems:'center',gap:5,flex:1,minWidth:0,overflowX:'auto'}}>
        {allChildren.map(c => (
          <button key={c.id} type="button" onClick={() => onChildSelect(c.id)} aria-label={c.name}
            style={{
              height:28, padding:'0 10px', borderRadius:20, flexShrink:0,
              border:`1.5px solid ${activeChild === c.id ? c.color : 'var(--line2)'}`,
              background: activeChild === c.id ? c.color + '18' : 'var(--cream-2)',
              color: activeChild === c.id ? c.color : 'var(--ink-3)',
              fontFamily:"'DM Sans',sans-serif", fontSize:'.62rem', fontWeight:600,
              cursor:'pointer', transition:'all .15s',
              display:'inline-flex', alignItems:'center', justifyContent:'center', gap:5,
            }}>
            <div style={{width:14,height:14,borderRadius:'50%',background:activeChild===c.id?c.color:'var(--line2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'.5rem',color:'#fff',fontWeight:700,flexShrink:0}}>{c.lbl}</div>
            {c.name}
          </button>
        ))}
        <button type="button" onClick={onAddChild} aria-label="Add child"
          style={{width:28,height:28,borderRadius:'50%',flexShrink:0,border:'1.5px dashed var(--rose-lt)',background:'transparent',display:'inline-flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--rose-mid)" strokeWidth="2.4" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
        </button>
      </div>

      {/* Action buttons */}
      <div className="pv-hdr-acts" style={{flexShrink:0}}>
        <button className="pv-hbtn" onClick={onSearch} aria-label="Search" type="button">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--ink-3)" strokeWidth="1.8" strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
        </button>
        <button className="pv-hbtn" onClick={onNotif} aria-label="Notifications" type="button" style={{position:'relative'}}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--ink-3)" strokeWidth="1.8" strokeLinecap="round">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
          </svg>
          <div className="pv-dot"/>
        </button>
        <button type="button" className="pv-hbtn-primary" onClick={onBook}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          <span>Book Visit</span>
        </button>
      </div>
    </header>
  );
}

export default Header;
