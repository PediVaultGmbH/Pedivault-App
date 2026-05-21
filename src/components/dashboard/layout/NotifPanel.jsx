import { useState } from 'react';
import { NOTIFS } from '../../../data/notifs';
import { a11yClick } from '../../../utils/a11y';

export function NotifPanel({open,onClose}) {
  const [read,setRead] = useState(new Set());
  const markOne = i => setRead(s=>new Set([...s,i]));
  const markAll = () => { setRead(new Set(NOTIFS.map((_,i)=>i))); onClose(); };
  const unreadCount = NOTIFS.length - read.size;
  return (
    <div className={`pv-panel${open?' open':''}`}>
      <div className="pv-notif-hdr">
        <div style={{display:'flex',alignItems:'center',gap:7}}>
          <span style={{fontSize:'.68rem',fontWeight:600,color:'var(--ink)'}}>Notifications</span>
          {unreadCount>0 && (
            <span style={{minWidth:18,height:18,padding:'0 5px',borderRadius:20,background:'var(--rose)',fontSize:'.42rem',fontWeight:600,color:'#fff',display:'inline-flex',alignItems:'center',justifyContent:'center'}}>
              {unreadCount}
            </span>
          )}
        </div>
        <button type="button" onClick={markAll} style={{fontSize:'.48rem',color:'var(--rose)',cursor:'pointer',fontWeight:500,background:'none',border:'none',padding:0}}>
          Mark all read
        </button>
      </div>
      {NOTIFS.map((n,i)=>{
        const isRead = read.has(i);
        return (
          <div key={i} className="pv-notif-row"
            style={{
              animationDelay:`${i*.05}s`,
              background: isRead ? 'transparent' : n.urgent ? 'rgba(185,40,20,.025)' : 'rgba(155,58,86,.018)',
              opacity: isRead ? .65 : 1,
              transition:'opacity .2s,background .2s',
            }}
            {...a11yClick(()=>markOne(i))}
            aria-label={`Notification: ${n.title||n.text||'item'}`}
          >
            {/* Unread dot */}
            {!isRead && (
              <div style={{width:6,height:6,borderRadius:'50%',background:n.urgent?'var(--red)':'var(--rose)',flexShrink:0,marginTop:6,marginRight:2}}/>
            )}
            {isRead && <div style={{width:6,flexShrink:0}}/>}
            <div className="pv-notif-ico" style={{background:n.bg,border:`1px solid ${n.border}`}}>
              <span style={{fontSize:'.95rem'}}>{n.ico}</span>
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:'.62rem',fontWeight:isRead?400:500,color:n.urgent&&!isRead?'var(--red)':'var(--ink)',marginBottom:2}}>{n.title}</div>
              <div style={{fontSize:'.5rem',fontWeight:300,color:'var(--ink-3)',lineHeight:1.5}}>{n.sub}</div>
            </div>
            <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:4,flexShrink:0,marginLeft:8}}>
              <span style={{fontSize:'.43rem',color:'var(--ink-3)'}}>{n.time}</span>
              {!isRead && (
                <span style={{fontSize:'.4rem',color:'var(--rose)',cursor:'pointer',fontWeight:500}}
                  onClick={e=>{e.stopPropagation();markOne(i);}}>
                  Mark read
                </span>
              )}
            </div>
          </div>
        );
      })}
      {unreadCount===0 && (
        <div style={{padding:'18px 16px',textAlign:'center',fontSize:'.56rem',color:'var(--ink-3)'}}>
          ✓ All caught up!
        </div>
      )}
    </div>
  );
}

export default NotifPanel;
