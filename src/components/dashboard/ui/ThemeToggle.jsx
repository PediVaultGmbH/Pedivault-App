import { useTheme } from '../../../hooks/useTheme';

export default function ThemeToggle({ compact = false }) {
  const { toggleTheme, isDark } = useTheme();

  if (compact) {
    return (
      <button type="button" onClick={toggleTheme} style={{
        width:32, height:32, borderRadius:9,
        background: isDark ? 'rgba(212,104,138,0.15)' : 'var(--cream-2)',
        border: `1px solid ${isDark ? 'var(--rose-lt)' : 'var(--line2)'}`,
        display:'flex', alignItems:'center', justifyContent:'center',
        cursor:'pointer', transition:'all .2s', flexShrink:0,
      }}>
        {isDark
          ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--rose)" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
          : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--ink-2)" strokeWidth="1.8" strokeLinecap="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
        }
      </button>
    );
  }

  return (
    <button type="button" onClick={toggleTheme} style={{
      display:'flex', alignItems:'center', gap:8,
      height:36, padding:'0 14px', borderRadius:10,
      background: isDark ? 'rgba(212,104,138,0.12)' : 'var(--cream-2)',
      border: `1px solid ${isDark ? 'var(--rose-lt)' : 'var(--line2)'}`,
      cursor:'pointer', transition:'all .2s', width:'100%',
    }}>
      {isDark
        ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--rose)" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
        : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--ink-2)" strokeWidth="1.8" strokeLinecap="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
      }
      <span style={{fontSize:'.6rem', fontWeight:400, color: isDark ? 'var(--rose)' : 'var(--ink-2)'}}>
        {isDark ? 'Light mode' : 'Dark mode'}
      </span>
      <div style={{
        marginLeft:'auto', width:28, height:16, borderRadius:8,
        background: isDark ? 'var(--rose)' : 'var(--line2)',
        position:'relative', transition:'background .2s',
      }}>
        <div style={{
          position:'absolute', top:2,
          left: isDark ? 14 : 2,
          width:12, height:12, borderRadius:'50%',
          background:'#fff', transition:'left .2s',
          boxShadow:'0 1px 3px rgba(0,0,0,.2)',
        }}/>
      </div>
    </button>
  );
}
