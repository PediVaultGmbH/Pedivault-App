import { useState } from 'react';
import Modal from '../ui/Modal';
import XBtn from '../ui/XBtn';

function ToggleSwitch({on, onChange, label, sub, color='var(--rose)'}) {
  return (
    <div onClick={onChange} style={{display:'flex',alignItems:'center',gap:14,padding:'12px 0',borderBottom:'1px solid var(--line2)',cursor:'pointer',userSelect:'none'}}>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:'.64rem',fontWeight:500,color:'var(--ink)',marginBottom:2}}>{label}</div>
        {sub && <div style={{fontSize:'.5rem',fontWeight:300,color:'var(--ink-3)'}}>{sub}</div>}
      </div>
      <div style={{
        width:38,height:22,borderRadius:11,flexShrink:0,
        background:on?color:'var(--cream-2)',
        border:on?'none':'1px solid var(--line2)',
        position:'relative',transition:'background .2s,border .2s',
      }}>
        <div style={{
          position:'absolute',top:on?3:2,left:on?17:2,
          width:16,height:16,borderRadius:'50%',
          background:on?'#fff':'var(--ink-3)',
          transition:'left .2s,top .2s',
          boxShadow:'0 1px 4px rgba(0,0,0,.2)',
        }}/>
      </div>
    </div>
  );
}

export function AccountModule({userName='Lena', userProfile=null, onSignOut}) {
  const [tab, setTab] = useState('profile');

  /* ── Profile state ── */
  const [profile, setProfile] = useState({
    firstName: userProfile?.firstName || userName || 'Lena',
    lastName:  userProfile?.lastName  || '',
    email:     userProfile?.email     || '',
    phone:     userProfile?.phone     || '',
    language:  'English',
    timezone:  'Europe/Berlin (CET)',
  });
  const [profileSaved, setProfileSaved] = useState(false);

  /* ── Security state ── */
  const [pwd, setPwd] = useState({current:'', next:'', confirm:''});
  const [show2FA, setShow2FA] = useState(false);
  const [twoFA, setTwoFA]   = useState(false);

  /* ── Notifications state ── */
  const [notifs, setNotifs] = useState({
    vaccineReminder: true,
    apptReminder:    true,
    medReminder:     true,
    growthAlert:     false,
    weeklySummary:   true,
    appUpdates:      false,
    emailDelivery:   true,
    pushDelivery:    true,
  });
  const toggleNotif = k => setNotifs(n => ({...n,[k]:!n[k]}));

  /* ── Delete account modal ── */
  const [deleteStep, setDeleteStep] = useState(0); // 0=closed 1=warning 2=confirm 3=deleting
  const [deleteInput, setDeleteInput] = useState('');

  /* ── Upgrade modal ── */
  const [upgradeStep, setUpgradeStep] = useState(0); // 0=closed 1=plan 2=payment 3=success
  const [plan, setPlan] = useState('monthly');
  const [card, setCard] = useState({number:'', name:'', expiry:'', cvv:''});
  const [paying, setPaying] = useState(false);

  const tabs = [
    {k:'profile',      icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="8" r="4"/><path d="M6 20v-1a6 6 0 0112 0v1"/></svg>,       label:'Profile'},
    {k:'security',     icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>, label:'Security'},
    {k:'notifications',icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>, label:'Notifications'},
    {k:'plan',         icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>, label:'Plan'},
  ];

  return (
    <div className="pv-page" style={{animation:'fadeUp .3s ease both'}}>

      {/* ════ DELETE ACCOUNT MODAL ════ */}
      <Modal open={deleteStep>0} onClose={()=>{setDeleteStep(0);setDeleteInput('');}} maxWidth={400}>
        {deleteStep===1 && (
          <div style={{padding:'32px 28px 24px'}}>
            <XBtn onClick={()=>{setDeleteStep(0);setDeleteInput('');}}/>
            <div style={{width:60,height:60,borderRadius:18,background:'var(--red-bg)',border:'1.5px solid rgba(185,40,20,.2)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px'}}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="1.8" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
            </div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:'1.15rem',textAlign:'center',color:'var(--ink)',marginBottom:6}}>Delete your account?</div>
            <div style={{fontSize:'.54rem',fontWeight:300,color:'var(--ink-3)',textAlign:'center',lineHeight:1.75,marginBottom:20}}>
              This will permanently and irreversibly remove:<br/>
            </div>
            {["All children's health records",'Vaccine history and certificates','Uploaded documents and scans','Appointments, medications & growth data','Your account and login credentials'].map((item,i)=>(
              <div key={i} style={{display:'flex',alignItems:'center',gap:10,padding:'7px 0',borderBottom:i<4?'1px solid var(--line2)':'none'}}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                <span style={{fontSize:'.58rem',color:'var(--ink-2)'}}>{item}</span>
              </div>
            ))}
            <div style={{marginTop:20,display:'flex',gap:10}}>
              <button type="button" className="fb fb-g" style={{flex:1}} onClick={()=>setDeleteStep(0)}>Cancel</button>
              <button type="button" onClick={()=>setDeleteStep(2)} style={{flex:1,height:40,borderRadius:10,background:'var(--red)',color:'#fff',border:'none',fontSize:'.6rem',fontWeight:500,cursor:'pointer',transition:'opacity .15s'}}>
                I understand, continue
              </button>
            </div>
          </div>
        )}
        {deleteStep===2 && (
          <div style={{padding:'32px 28px 24px'}}>
            <XBtn onClick={()=>{setDeleteStep(0);setDeleteInput('');}}/>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:'1.05rem',color:'var(--ink)',marginBottom:6,textAlign:'center'}}>Final confirmation</div>
            <div style={{fontSize:'.54rem',fontWeight:300,color:'var(--ink-3)',textAlign:'center',lineHeight:1.75,marginBottom:20}}>
              Type <strong style={{color:'var(--red)',fontFamily:'monospace',letterSpacing:'.1em'}}>DELETE</strong> to permanently delete your account and all data.
            </div>
            <input
              value={deleteInput}
              onChange={e=>setDeleteInput(e.target.value.toUpperCase())}
              className="fi"
              placeholder="Type DELETE here"
              style={{
                width:'100%',boxSizing:'border-box',
                textAlign:'center',letterSpacing:'.15em',fontFamily:'monospace',fontSize:'.85rem',
                borderColor:deleteInput==='DELETE'?'var(--red)':'var(--line2)',
                background:deleteInput==='DELETE'?'rgba(185,40,20,.05)':'var(--cream-2)',
                transition:'all .2s',
              }}
            />
            <div style={{marginTop:16,display:'flex',gap:10}}>
              <button type="button" className="fb fb-g" style={{flex:1}} onClick={()=>{setDeleteStep(1);setDeleteInput('');}}>← Back</button>
              <button type="button"
                disabled={deleteInput!=='DELETE'}
                onClick={()=>{setDeleteStep(3);setTimeout(onSignOut,2200);}}
                style={{flex:1,height:40,borderRadius:10,border:'none',fontSize:'.6rem',fontWeight:500,cursor:deleteInput==='DELETE'?'pointer':'default',transition:'all .2s',
                  background:deleteInput==='DELETE'?'var(--red)':'var(--cream-2)',
                  color:deleteInput==='DELETE'?'#fff':'var(--ink-3)',
                }}>
                Delete my account
              </button>
            </div>
          </div>
        )}
        {deleteStep===3 && (
          <div style={{padding:'48px 28px',textAlign:'center',display:'flex',flexDirection:'column',alignItems:'center',gap:14}}>
            <div style={{width:64,height:64,borderRadius:20,background:'var(--red-bg)',border:'1.5px solid rgba(185,40,20,.2)',display:'flex',alignItems:'center',justifyContent:'center',animation:'pvSuccessPop .4s ease both'}}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg>
            </div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:'1.1rem',color:'var(--ink)'}}>Account deleted</div>
            <div style={{fontSize:'.54rem',fontWeight:300,color:'var(--ink-3)',lineHeight:1.7}}>All your data has been permanently removed. Signing you out…</div>
            <div style={{width:48,height:3,borderRadius:3,background:'linear-gradient(90deg,var(--red),rgba(185,40,20,.3))',animation:'pvBarGrow 2s ease both'}}/>
          </div>
        )}
      </Modal>

      {/* ════ UPGRADE MODAL ════ */}
      <Modal open={upgradeStep>0} onClose={()=>{if(upgradeStep!==3)setUpgradeStep(0);}} maxWidth={440}>
        {upgradeStep===1 && (
          <div style={{padding:'28px 28px 24px'}}>
            <XBtn onClick={()=>setUpgradeStep(0)}/>
            <div style={{textAlign:'center',marginBottom:20}}>
              <div style={{display:'inline-flex',alignItems:'center',justifyContent:'center',width:56,height:56,borderRadius:16,background:'linear-gradient(135deg,var(--rose-pale),var(--rose-lt))',marginBottom:12}}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--rose)" strokeWidth="1.8" strokeLinecap="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
              </div>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:'1.25rem',color:'var(--ink)',marginBottom:4}}>Upgrade to Premium</div>
              <div style={{fontSize:'.54rem',fontWeight:300,color:'var(--ink-3)'}}>Everything your growing family needs</div>
            </div>
            {/* Plan toggle */}
            <div style={{display:'flex',background:'var(--cream-2)',borderRadius:12,padding:4,marginBottom:20,gap:4}}>
              {[{k:'monthly',label:'Monthly',price:'€4.99/mo'},{k:'annual',label:'Annual',price:'€44.99/yr',save:'Save 25%'}].map(p=>(
                <div key={p.k} onClick={()=>setPlan(p.k)} style={{
                  flex:1,padding:'10px',borderRadius:9,textAlign:'center',cursor:'pointer',
                  background:plan===p.k?'var(--white)':'transparent',
                  boxShadow:plan===p.k?'0 2px 8px rgba(0,0,0,.1)':'none',
                  transition:'all .2s',
                }}>
                  <div style={{fontSize:'.54rem',fontWeight:600,color:'var(--ink)',marginBottom:2}}>{p.label}</div>
                  <div style={{fontSize:'.7rem',fontWeight:700,color:'var(--rose)'}}>{p.price}</div>
                  {p.save && <div style={{fontSize:'.43rem',color:'var(--green)',fontWeight:600,marginTop:2}}>{p.save}</div>}
                </div>
              ))}
            </div>
            {/* Features */}
            {[
              {svg:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--rose)" strokeWidth="1.8" strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>,   bg:'var(--rose-pale)',   border:'var(--rose-lt)',   text:'Up to 5 children (vs 2)'},
              {svg:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="1.8" strokeLinecap="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>,      bg:'var(--blue-bg)',     border:'var(--blue-lt)',   text:'50 GB storage (vs 500 MB)'},
              {svg:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--purple)" strokeWidth="1.8" strokeLinecap="round"><path d="M12 2a4 4 0 014 4c0 1.5-.8 2.8-2 3.5V11h-4V9.5A4 4 0 0112 2z"/><rect x="8" y="11" width="8" height="5" rx="1"/><path d="M10 16v3M14 16v3M7 19h10"/></svg>,  bg:'rgba(124,58,237,.08)',border:'rgba(124,58,237,.2)', text:'Unlimited AI Assistant messages'},
              {svg:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="1.8" strokeLinecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M9 13h6M9 17h4"/></svg>,               bg:'var(--green-bg)',    border:'var(--green-lt)',  text:'Vaccination certificate PDF export'},
              {svg:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--amber)" strokeWidth="1.8" strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>, bg:'var(--amber-bg)',    border:'var(--amber-lt)', text:'Family sharing with partner'},
              {svg:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--rose)" strokeWidth="1.8" strokeLinecap="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>,                                                                                                                                                     bg:'var(--rose-pale)',   border:'var(--rose-lt)',   text:'Priority support (same-day)'},
            ].map((f,i)=>(
              <div key={i} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 0',borderBottom:i<5?'1px solid var(--line2)':'none'}}>
                <div style={{width:28,height:28,borderRadius:8,background:f.bg,border:`1px solid ${f.border}`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                  {f.svg}
                </div>
                <span style={{fontSize:'.58rem',color:'var(--ink-2)'}}>{f.text}</span>
                <svg style={{marginLeft:'auto',flexShrink:0}} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
              </div>
            ))}
            <button type="button" onClick={()=>setUpgradeStep(2)} style={{
              width:'100%',height:44,marginTop:20,borderRadius:12,border:'none',
              background:'var(--rose)',color:'#fff',fontSize:'.66rem',fontWeight:600,
              cursor:'pointer',boxShadow:'0 4px 16px rgba(155,58,86,.32)',transition:'opacity .15s',
              display:'flex',alignItems:'center',justifyContent:'center',gap:8,
            }}>
              Continue to payment →
            </button>
            <div style={{fontSize:'.46rem',color:'var(--ink-3)',textAlign:'center',marginTop:10}}>Cancel anytime · No commitment · GDPR compliant</div>
          </div>
        )}
        {upgradeStep===2 && (
          <div style={{padding:'28px 28px 24px'}}>
            <XBtn onClick={()=>setUpgradeStep(0)}/>
            <button type="button" onClick={()=>setUpgradeStep(1)} style={{display:'flex',alignItems:'center',gap:5,background:'none',border:'none',cursor:'pointer',color:'var(--ink-3)',fontSize:'.52rem',marginBottom:16,padding:0}}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
              Back to plans
            </button>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:'1.1rem',color:'var(--ink)',marginBottom:4}}>Payment details</div>
            <div style={{fontSize:'.52rem',color:'var(--ink-3)',marginBottom:18}}>
              {plan==='monthly'?'€4.99/month · cancel anytime':'€44.99/year · 25% saving vs monthly'}
            </div>
            {/* Card number */}
            <div style={{marginBottom:12}}>
              <div style={{fontSize:'.5rem',fontWeight:600,letterSpacing:'.12em',textTransform:'uppercase',color:'var(--ink-3)',marginBottom:5}}>Card number</div>
              <input className="fi" value={card.number} onChange={e=>setCard(c=>({...c,number:e.target.value.replace(/\D/g,'').slice(0,16).replace(/(.{4})/g,'$1 ').trim()}))}
                placeholder="1234 5678 9012 3456" style={{width:'100%',boxSizing:'border-box',fontFamily:'monospace',letterSpacing:'.08em'}}/>
            </div>
            <div style={{marginBottom:12}}>
              <div style={{fontSize:'.5rem',fontWeight:600,letterSpacing:'.12em',textTransform:'uppercase',color:'var(--ink-3)',marginBottom:5}}>Cardholder name</div>
              <input className="fi" value={card.name} onChange={e=>setCard(c=>({...c,name:e.target.value}))} placeholder="Lena Müller" style={{width:'100%',boxSizing:'border-box'}}/>
            </div>
            <div className="two-col">
              <div>
                <div style={{fontSize:'.5rem',fontWeight:600,letterSpacing:'.12em',textTransform:'uppercase',color:'var(--ink-3)',marginBottom:5}}>Expiry date</div>
                <input className="fi" value={card.expiry} onChange={e=>{let v=e.target.value.replace(/\D/g,'').slice(0,4);if(v.length>2)v=v.slice(0,2)+'/'+v.slice(2);setCard(c=>({...c,expiry:v}));}} placeholder="MM/YY" style={{width:'100%',boxSizing:'border-box'}}/>
              </div>
              <div>
                <div style={{fontSize:'.5rem',fontWeight:600,letterSpacing:'.12em',textTransform:'uppercase',color:'var(--ink-3)',marginBottom:5}}>CVV</div>
                <input className="fi" value={card.cvv} onChange={e=>setCard(c=>({...c,cvv:e.target.value.replace(/\D/g,'').slice(0,4)}))} placeholder="123" style={{width:'100%',boxSizing:'border-box'}}/>
              </div>
            </div>
            <div style={{marginTop:14,padding:'10px 12px',background:'var(--green-bg)',border:'1px solid var(--green-lt)',borderRadius:10,display:'flex',alignItems:'center',gap:8}}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
              <span style={{fontSize:'.5rem',color:'var(--green)',fontWeight:500}}>Encrypted payment · Stripe · PCI DSS compliant</span>
            </div>
            <button type="button"
              disabled={!card.number||!card.name||!card.expiry||!card.cvv||paying}
              onClick={()=>{
                if(!card.number||!card.name||!card.expiry||!card.cvv) return;
                setPaying(true);
                setTimeout(()=>{setPaying(false);setUpgradeStep(3);},1800);
              }}
              style={{
                width:'100%',height:44,marginTop:16,borderRadius:12,border:'none',
                background:card.number&&card.name&&card.expiry&&card.cvv?'var(--rose)':'var(--cream-2)',
                color:card.number&&card.name&&card.expiry&&card.cvv?'#fff':'var(--ink-3)',
                fontSize:'.66rem',fontWeight:600,cursor:'pointer',transition:'all .2s',
                display:'flex',alignItems:'center',justifyContent:'center',gap:8,
                boxShadow:card.number&&card.name&&card.expiry&&card.cvv?'0 4px 16px rgba(155,58,86,.28)':'none',
              }}>
              {paying
                ? <><div style={{width:14,height:14,borderRadius:'50%',border:'2px solid rgba(255,255,255,.3)',borderTopColor:'#fff',animation:'pvSpin .7s linear infinite'}}/> Processing…</>
                : <>Subscribe {plan==='monthly'?'€4.99/mo':'€44.99/yr'} →</>
              }
            </button>
          </div>
        )}
        {upgradeStep===3 && (
          <div style={{padding:'48px 28px',textAlign:'center',display:'flex',flexDirection:'column',alignItems:'center',gap:14,background:'linear-gradient(180deg,var(--rose-pale),var(--white))'}}>
            {[[12,18,'var(--rose-lt)',.6],[88,14,'var(--green-lt)',.5],[8,72,'var(--blue-lt)',.4],[90,75,'var(--amber-lt)',.5]].map(([x,y,c,o],i)=>(
              <div key={i} style={{position:'absolute',left:`${x}%`,top:`${y}%`,width:8,height:8,borderRadius:'50%',background:c,opacity:o,pointerEvents:'none'}}/>
            ))}
            <div style={{width:72,height:72,borderRadius:22,background:'linear-gradient(135deg,var(--rose-pale),var(--rose-lt))',border:'2px solid var(--rose-lt)',display:'flex',alignItems:'center',justifyContent:'center',animation:'pvSuccessPop .5s ease both',boxShadow:'0 8px 28px rgba(155,58,86,.2)',position:'relative'}}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--rose)" strokeWidth="2.2" strokeLinecap="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
            </div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:'1.3rem',color:'var(--ink)'}}>Welcome to Premium!</div>
            <div style={{fontSize:'.56rem',fontWeight:300,color:'var(--ink-3)',lineHeight:1.8,maxWidth:280}}>
              Your account has been upgraded. All Premium features are now active. Thank you for supporting PediVault! 🌸
            </div>
            <div style={{display:'flex',gap:8,flexWrap:'wrap',justifyContent:'center'}}>
              {['5 children','50 GB storage','Unlimited AI','Certificates','Priority support'].map(f=>(
                <span key={f} style={{fontSize:'.46rem',fontWeight:500,color:'var(--rose)',background:'var(--rose-pale)',border:'1px solid var(--rose-lt)',borderRadius:20,padding:'3px 10px'}}>{f}</span>
              ))}
            </div>
            <button type="button" onClick={()=>{setUpgradeStep(0);setCard({number:'',name:'',expiry:'',cvv:''});}} style={{
              height:40,padding:'0 28px',borderRadius:12,border:'none',
              background:'var(--rose)',color:'#fff',fontSize:'.62rem',fontWeight:600,
              cursor:'pointer',boxShadow:'0 4px 16px rgba(155,58,86,.28)',marginTop:4,
            }}>Start exploring Premium →</button>
          </div>
        )}
      </Modal>

      {/* ── HERO ── */}
      <div style={{
        background:'linear-gradient(135deg,var(--rose-pale),rgba(255,255,255,.8))',
        border:'1.5px solid var(--rose-lt)',borderRadius:20,
        padding:'24px',marginBottom:22,
        display:'flex',alignItems:'center',gap:18,position:'relative',overflow:'hidden',
      }}>
        {/* Decorative blur circle */}
        <div style={{position:'absolute',right:-30,top:-30,width:120,height:120,borderRadius:'50%',background:'var(--rose-lt)',opacity:.3,pointerEvents:'none'}}/>
        {/* Big avatar */}
        <div style={{
          width:70,height:70,borderRadius:20,flexShrink:0,
          background:'linear-gradient(135deg,var(--rose-pale),var(--rose-lt))',
          border:'2px solid var(--rose-lt)',
          display:'flex',alignItems:'center',justifyContent:'center',
          fontFamily:"'Playfair Display',serif",fontSize:'1.8rem',color:'var(--rose)',
          boxShadow:'0 4px 20px rgba(155,58,86,.2)',
          position:'relative',zIndex:1,
        }}>
          {(profile.firstName||userName||'L')[0]}
        </div>
        <div style={{position:'relative',zIndex:1}}>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:'1.3rem',fontWeight:400,color:'var(--ink)',marginBottom:3}}>
            {profile.firstName} {profile.lastName}
          </div>
          <div style={{fontSize:'.56rem',color:'var(--ink-3)',marginBottom:8}}>{profile.email}</div>
          <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
            <span style={{fontSize:'.46rem',fontWeight:600,color:'var(--rose)',background:'var(--rose-pale)',border:'1px solid var(--rose-lt)',borderRadius:20,padding:'2px 8px'}}>FREE PLAN</span>
            <span style={{fontSize:'.46rem',fontWeight:500,color:'var(--green)',background:'var(--green-bg)',border:'1px solid var(--green-lt)',borderRadius:20,padding:'2px 8px',display:'flex',alignItems:'center',gap:4}}>
              <div style={{width:5,height:5,borderRadius:'50%',background:'var(--green)'}}/>
              Active
            </span>
            <span style={{fontSize:'.46rem',color:'var(--ink-3)',background:'var(--cream-2)',border:'1px solid var(--line2)',borderRadius:20,padding:'2px 8px'}}>
              {profile.language}
            </span>
          </div>
        </div>
      </div>

      {/* ── TABS ── */}
      <div style={{display:'flex',gap:6,marginBottom:18,flexWrap:'wrap'}}>
        {tabs.map(t=>(
          <button key={t.k} type="button" onClick={()=>setTab(t.k)} style={{
            height:32,padding:'0 14px',borderRadius:20,border:'none',cursor:'pointer',
            fontSize:'.56rem',fontWeight:tab===t.k?600:400,
            color:tab===t.k?'#fff':'var(--ink-2)',
            background:tab===t.k?'var(--rose)':'var(--cream-2)',
            display:'inline-flex',alignItems:'center',justifyContent:'center',gap:6,
            transition:'all .15s',lineHeight:1,
            boxShadow:tab===t.k?'0 2px 10px rgba(155,58,86,.28)':'none',
          }}>
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      {/* ══ PROFILE TAB ══ */}
      {tab==='profile' && (
        <div style={{display:'flex',flexDirection:'column',gap:14}}>
          <div className="card">
            <div className="sh" style={{marginBottom:14}}><div className="sh-title">Personal Information</div></div>
            <div className="two-col">
              <div>
                <div style={{fontSize:'.5rem',fontWeight:600,letterSpacing:'.12em',textTransform:'uppercase',color:'var(--ink-3)',marginBottom:5}}>First name</div>
                <input className="fi" value={profile.firstName} onChange={e=>setProfile(p=>({...p,firstName:e.target.value}))} style={{width:'100%',boxSizing:'border-box'}} placeholder="First name"/>
              </div>
              <div>
                <div style={{fontSize:'.5rem',fontWeight:600,letterSpacing:'.12em',textTransform:'uppercase',color:'var(--ink-3)',marginBottom:5}}>Last name</div>
                <input className="fi" value={profile.lastName} onChange={e=>setProfile(p=>({...p,lastName:e.target.value}))} style={{width:'100%',boxSizing:'border-box'}} placeholder="Last name"/>
              </div>
            </div>
            <div style={{marginTop:12}}>
              <div style={{fontSize:'.5rem',fontWeight:600,letterSpacing:'.12em',textTransform:'uppercase',color:'var(--ink-3)',marginBottom:5}}>Email address</div>
              <input className="fi" type="email" value={profile.email} onChange={e=>setProfile(p=>({...p,email:e.target.value}))} style={{width:'100%',boxSizing:'border-box'}} placeholder="your@email.de"/>
            </div>
            <div style={{marginTop:12}}>
              <div style={{fontSize:'.5rem',fontWeight:600,letterSpacing:'.12em',textTransform:'uppercase',color:'var(--ink-3)',marginBottom:5}}>Phone number</div>
              <input className="fi" type="tel" value={profile.phone} onChange={e=>setProfile(p=>({...p,phone:e.target.value}))} style={{width:'100%',boxSizing:'border-box'}} placeholder="+49 151 0000 0000"/>
            </div>
            <div className="two-col" style={{marginTop:12}}>
              <div>
                <div style={{fontSize:'.5rem',fontWeight:600,letterSpacing:'.12em',textTransform:'uppercase',color:'var(--ink-3)',marginBottom:5}}>Language</div>
                <select className="fi" value={profile.language} onChange={e=>setProfile(p=>({...p,language:e.target.value}))} style={{width:'100%',boxSizing:'border-box',cursor:'pointer'}}>
                  <option>English</option>
                  <option>Deutsch</option>
                </select>
              </div>
              <div>
                <div style={{fontSize:'.5rem',fontWeight:600,letterSpacing:'.12em',textTransform:'uppercase',color:'var(--ink-3)',marginBottom:5}}>Timezone</div>
                <select className="fi" value={profile.timezone} onChange={e=>setProfile(p=>({...p,timezone:e.target.value}))} style={{width:'100%',boxSizing:'border-box',cursor:'pointer'}}>
                  <option>Europe/Berlin (CET)</option>
                  <option>Europe/Vienna (CET)</option>
                  <option>Europe/Zurich (CET)</option>
                  <option>Europe/London (GMT)</option>
                  <option>America/New_York (EST)</option>
                </select>
              </div>
            </div>
            <div style={{marginTop:16,display:'flex',gap:10,justifyContent:'flex-end'}}>
              {profileSaved && (
                <div style={{display:'flex',alignItems:'center',gap:6,fontSize:'.54rem',color:'var(--green)'}}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
                  Changes saved
                </div>
              )}
              <button type="button" onClick={()=>{setProfileSaved(true);setTimeout(()=>setProfileSaved(false),2500);}} style={{
                height:36,padding:'0 20px',borderRadius:10,border:'none',
                background:'var(--rose)',color:'#fff',
                fontSize:'.6rem',fontWeight:500,cursor:'pointer',
                boxShadow:'0 2px 10px rgba(155,58,86,.28)',transition:'opacity .15s',
              }}>Save changes</button>
            </div>
          </div>

          {/* Danger zone */}
          <div className="card" style={{borderColor:'rgba(185,40,20,.15)'}}>
            <div className="sh" style={{marginBottom:12}}><div className="sh-title" style={{color:'var(--red)'}}>Danger Zone</div></div>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:14}}>
              <div>
                <div style={{fontSize:'.64rem',fontWeight:500,color:'var(--ink)',marginBottom:3}}>Delete account</div>
                <div style={{fontSize:'.5rem',fontWeight:300,color:'var(--ink-3)'}}>Permanently removes your account and all children's health records. This cannot be undone.</div>
              </div>
              <button type="button" style={{
                height:34,padding:'0 14px',borderRadius:9,flexShrink:0,
                background:'var(--red-bg)',border:'1px solid rgba(185,40,20,.25)',
                color:'var(--red)',fontSize:'.56rem',fontWeight:500,cursor:'pointer',
                transition:'all .15s',whiteSpace:'nowrap',
              }} onClick={()=>setDeleteStep(1)}>Delete account</button>
            </div>
          </div>
        </div>
      )}

      {/* ══ SECURITY TAB ══ */}
      {tab==='security' && (
        <div style={{display:'flex',flexDirection:'column',gap:14}}>
          {/* Change password */}
          <div className="card">
            <div className="sh" style={{marginBottom:14}}><div className="sh-title">Change Password</div></div>
            {[
              {label:'Current password', k:'current', ac:'current-password'},
              {label:'New password',     k:'next',    ac:'new-password'},
              {label:'Confirm new password', k:'confirm', ac:'new-password'},
            ].map(f=>(
              <div key={f.k} style={{marginBottom:12}}>
                <div style={{fontSize:'.5rem',fontWeight:600,letterSpacing:'.12em',textTransform:'uppercase',color:'var(--ink-3)',marginBottom:5}}>{f.label}</div>
                <input className="fi" type="password" autoComplete={f.ac} value={pwd[f.k]} onChange={e=>setPwd(p=>({...p,[f.k]:e.target.value}))} style={{width:'100%',boxSizing:'border-box'}} placeholder="••••••••"/>
              </div>
            ))}
            {pwd.next && pwd.confirm && pwd.next!==pwd.confirm && (
              <div style={{fontSize:'.52rem',color:'var(--red)',marginBottom:10}}>Passwords do not match.</div>
            )}
            <div style={{display:'flex',justifyContent:'flex-end',marginTop:4}}>
              <button type="button" onClick={()=>setPwd({current:'',next:'',confirm:''})} style={{
                height:36,padding:'0 20px',borderRadius:10,border:'none',
                background:pwd.current&&pwd.next&&pwd.next===pwd.confirm?'var(--rose)':'var(--cream-2)',
                color:pwd.current&&pwd.next&&pwd.next===pwd.confirm?'#fff':'var(--ink-3)',
                fontSize:'.6rem',fontWeight:500,cursor:'pointer',transition:'all .2s',
              }}>Update password</button>
            </div>
          </div>

          {/* 2FA */}
          <div className="card">
            <div className="sh" style={{marginBottom:14}}><div className="sh-title">Two-Factor Authentication</div></div>
            <ToggleSwitch on={twoFA} onChange={()=>{setTwoFA(v=>!v);setShow2FA(v=>!v);}} label="Enable 2FA" sub="Secure your account with an authenticator app (TOTP)"/>
            {show2FA && twoFA && (
              <div style={{marginTop:14,padding:'14px',background:'var(--cream-2)',borderRadius:12,border:'1px solid var(--line2)'}}>
                <div style={{fontSize:'.6rem',fontWeight:500,color:'var(--ink)',marginBottom:6}}>Scan with your authenticator app</div>
                {/* Mock QR placeholder */}
                <div style={{width:100,height:100,background:'var(--white)',borderRadius:10,border:'1px solid var(--line2)',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:10}}>
                  <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                    {/* Simple QR pattern */}
                    {[0,1,2,3,4,5,6].map(r=>[0,1,2,3,4,5,6].map(c=>(
                      Math.random()>.4?<rect key={r*10+c} x={c*8} y={r*8} width={7} height={7} rx={1} fill="var(--ink)" opacity={.85}/>:null
                    )))}
                  </svg>
                </div>
                <div style={{fontSize:'.5rem',color:'var(--ink-3)'}}>Or enter this code manually: <strong style={{color:'var(--ink)',letterSpacing:'.1em'}}>PVLT-X2KR-9QMW</strong></div>
              </div>
            )}
          </div>

          {/* Active sessions */}
          <div className="card">
            <div className="sh" style={{marginBottom:12}}><div className="sh-title">Active Sessions</div></div>
            {[
              {device:'Chrome on MacBook Pro',  loc:'Berlin, Germany',   time:'Active now',   current:true,  icon:'💻'},
              {device:'Safari on iPhone 15',    loc:'Berlin, Germany',   time:'2 hours ago',  current:false, icon:'📱'},
              {device:'PediVault App (Android)',loc:'Frankfurt, Germany', time:'3 days ago',   current:false, icon:'📱'},
            ].map((s,i)=>(
              <div key={i} style={{display:'flex',alignItems:'center',gap:12,padding:'11px 0',borderBottom:i<2?'1px solid var(--line2)':'none'}}>
                <div style={{width:36,height:36,borderRadius:10,background:'var(--cream-2)',border:'1px solid var(--line2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1rem',flexShrink:0}}>{s.icon}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:'.62rem',fontWeight:500,color:'var(--ink)',marginBottom:2}}>{s.device}</div>
                  <div style={{fontSize:'.48rem',color:'var(--ink-3)'}}>{s.loc} · {s.time}</div>
                </div>
                {s.current
                  ? <span style={{fontSize:'.44rem',fontWeight:600,color:'var(--green)',background:'var(--green-bg)',border:'1px solid var(--green-lt)',borderRadius:20,padding:'2px 8px'}}>This device</span>
                  : <button type="button" style={{height:26,padding:'0 10px',borderRadius:8,background:'var(--red-bg)',border:'1px solid rgba(185,40,20,.2)',color:'var(--red)',fontSize:'.48rem',cursor:'pointer'}}>Revoke</button>
                }
              </div>
            ))}
            <button type="button" style={{marginTop:12,height:32,width:'100%',borderRadius:9,background:'var(--cream-2)',border:'1px solid var(--line2)',fontSize:'.56rem',color:'var(--ink-2)',cursor:'pointer',transition:'all .15s'}}>
              Sign out all other devices
            </button>
          </div>
        </div>
      )}

      {/* ══ NOTIFICATIONS TAB ══ */}
      {tab==='notifications' && (
        <div style={{display:'flex',flexDirection:'column',gap:14}}>
          {/* Delivery channels */}
          <div className="card">
            <div className="sh" style={{marginBottom:2}}><div className="sh-title">Delivery Channels</div></div>
            <ToggleSwitch on={notifs.pushDelivery}  onChange={()=>toggleNotif('pushDelivery')}  label="Push notifications" sub="In-app and browser notifications"/>
            <ToggleSwitch on={notifs.emailDelivery} onChange={()=>toggleNotif('emailDelivery')} label="Email notifications" sub={profile.email}/>
          </div>

          {/* Health reminders */}
          <div className="card">
            <div className="sh" style={{marginBottom:2}}><div className="sh-title">Health Reminders</div></div>
            <ToggleSwitch on={notifs.vaccineReminder} onChange={()=>toggleNotif('vaccineReminder')} label="Vaccine reminders"     sub="Alerts when doses are due or overdue"/>
            <ToggleSwitch on={notifs.apptReminder}    onChange={()=>toggleNotif('apptReminder')}    label="Appointment reminders" sub="24 hours and 1 hour before each visit"/>
            <ToggleSwitch on={notifs.medReminder}     onChange={()=>toggleNotif('medReminder')}     label="Medication reminders"  sub="Daily reminders for active medications"/>
            <ToggleSwitch on={notifs.growthAlert}     onChange={()=>toggleNotif('growthAlert')}     label="Growth milestone alerts" sub="When your child reaches a new milestone"/>
          </div>

          {/* Reports */}
          <div className="card">
            <div className="sh" style={{marginBottom:2}}><div className="sh-title">Reports & Updates</div></div>
            <ToggleSwitch on={notifs.weeklySummary} onChange={()=>toggleNotif('weeklySummary')} label="Weekly health summary"  sub="Every Sunday — overview of the past week"/>
            <ToggleSwitch on={notifs.appUpdates}    onChange={()=>toggleNotif('appUpdates')}    label="App updates & tips"     sub="New features and paediatric health tips"/>
          </div>
        </div>
      )}

      {/* ══ PLAN TAB ══ */}
      {tab==='plan' && (
        <div style={{display:'flex',flexDirection:'column',gap:14}}>
          {/* Current plan */}
          <div className="card" style={{background:'linear-gradient(135deg,var(--rose-pale),rgba(255,255,255,.9))',border:'1.5px solid var(--rose-lt)'}}>
            <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:12,marginBottom:16}}>
              <div>
                <div style={{fontSize:'.48rem',fontWeight:600,letterSpacing:'.2em',textTransform:'uppercase',color:'var(--ink-3)',marginBottom:4}}>Current plan</div>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:'1.5rem',color:'var(--ink)',lineHeight:1,marginBottom:6}}>Free</div>
                <div style={{fontSize:'.54rem',color:'var(--ink-3)'}}>Up to 2 children · 500 MB storage · Basic features</div>
              </div>
              <span style={{fontSize:'.46rem',fontWeight:700,color:'var(--rose)',background:'var(--rose-pale)',border:'1.5px solid var(--rose-lt)',borderRadius:20,padding:'3px 10px',flexShrink:0}}>FREE</span>
            </div>
            {/* Storage bar */}
            <div style={{marginBottom:16}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:5}}>
                <span style={{fontSize:'.5rem',color:'var(--ink-3)'}}>Storage used</span>
                <span style={{fontSize:'.5rem',fontWeight:500,color:'var(--ink)'}}>12.4 MB of 500 MB</span>
              </div>
              <div style={{height:6,borderRadius:3,background:'var(--line2)',overflow:'hidden'}}>
                <div style={{height:'100%',width:'2.5%',borderRadius:3,background:'linear-gradient(90deg,var(--rose),var(--rose-mid))',transition:'width .6s ease'}}/>
              </div>
              <div style={{fontSize:'.46rem',color:'var(--ink-3)',marginTop:4}}>487.6 MB remaining</div>
            </div>
            <button type="button" onClick={()=>setUpgradeStep(1)} style={{
              width:'100%',height:42,borderRadius:12,border:'none',
              background:'var(--rose)',color:'#fff',
              fontFamily:"'DM Sans',sans-serif",fontSize:'.66rem',fontWeight:600,
              cursor:'pointer',transition:'opacity .15s',
              boxShadow:'0 4px 16px rgba(155,58,86,.32)',
              display:'flex',alignItems:'center',justifyContent:'center',gap:8,
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
              Upgrade to Premium — €4.99/mo
            </button>
          </div>

          {/* Feature comparison */}
          <div className="card">
            <div className="sh" style={{marginBottom:14}}><div className="sh-title">Free vs Premium</div></div>
            {[
              {feature:'Children profiles',     free:'Up to 2',   premium:'Unlimited'},
              {feature:'Storage',               free:'500 MB',    premium:'10 GB'},
              {feature:'AI Assistant',          free:'Basic',     premium:'Full context, history'},
              {feature:'Record export',         free:'PDF only',  premium:'PDF, CSV, HL7 FHIR'},
              {feature:'Doctor sharing',        free:'Manual PDF',premium:'Direct secure link'},
              {feature:'Vaccine reminders',     free:'Email',     premium:'Email + SMS + Push'},
              {feature:'Priority support',      free:false,       premium:true},
              {feature:'Family plan sharing',   free:false,       premium:true},
            ].map((r,i)=>(
              <div key={i} style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8,padding:'9px 0',borderBottom:i<7?'1px solid var(--line2)':'none',alignItems:'center'}}>
                <div style={{fontSize:'.58rem',color:'var(--ink)',fontWeight:400}}>{r.feature}</div>
                <div style={{fontSize:'.54rem',color:'var(--ink-3)',textAlign:'center'}}>
                  {r.free===false
                    ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--ink-3)" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    : r.free}
                </div>
                <div style={{fontSize:'.54rem',color:'var(--rose)',textAlign:'center',fontWeight:500}}>
                  {r.premium===true
                    ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--rose)" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
                    : r.premium}
                </div>
              </div>
            ))}
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8,marginTop:6,paddingTop:6}}>
              <div/>
              <div style={{fontSize:'.5rem',fontWeight:600,color:'var(--ink-3)',textAlign:'center',letterSpacing:'.08em'}}>FREE</div>
              <div style={{fontSize:'.5rem',fontWeight:600,color:'var(--rose)',textAlign:'center',letterSpacing:'.08em'}}>PREMIUM</div>
            </div>
          </div>

          {/* Billing info */}
          <div className="card">
            <div className="sh" style={{marginBottom:12}}><div className="sh-title">Billing Information</div></div>
            <div style={{padding:'14px',background:'var(--cream-2)',borderRadius:12,border:'1px solid var(--line2)',textAlign:'center'}}>
              <div style={{fontSize:'.56rem',color:'var(--ink-3)',lineHeight:1.7}}>
                You are on the free plan.<br/>
                No billing information on file.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sign out */}
      <div style={{marginTop:8,paddingTop:16,borderTop:'1px solid var(--line2)'}}>
        <button type="button" onClick={onSignOut} style={{
          width:'100%',height:38,borderRadius:10,
          background:'var(--cream-2)',border:'1px solid var(--line2)',
          color:'var(--ink-2)',fontSize:'.6rem',fontWeight:500,cursor:'pointer',
          display:'flex',alignItems:'center',justifyContent:'center',gap:8,
          transition:'all .15s',
        }}
        onMouseEnter={e=>{e.currentTarget.style.background='var(--red-bg)';e.currentTarget.style.borderColor='rgba(185,40,20,.2)';e.currentTarget.style.color='var(--red)';}}
        onMouseLeave={e=>{e.currentTarget.style.background='var(--cream-2)';e.currentTarget.style.borderColor='var(--line2)';e.currentTarget.style.color='var(--ink-2)';}}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Sign out of PediVault
        </button>
      </div>

    </div>
  );
}


