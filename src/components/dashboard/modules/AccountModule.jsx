import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from '../ui/Modal';
import XBtn from '../ui/XBtn';
import { updateMe, changePassword, getSessions, revokeAllSessions, deleteAccount, getNotifications, updateNotifications, setup2FA, verify2FA, disable2FA } from '../../../api/auth.api';
import LanguageSwitcher from '../ui/LanguageSwitcher';
import { createSubscription, getSubscription, cancelSubscription } from '../../../api/payments.api';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const CARD_STYLE = {
  style: {
    base: { fontSize:'13px', color:'var(--ink)', fontFamily:"'DM Sans', sans-serif", '::placeholder':{ color:'var(--ink-3)' } },
    invalid: { color:'var(--red)' },
  },
};

function StripePaymentForm({ plan, onSuccess }) {
  const stripe   = useStripe();
  const elements = useElements();
  const [paying, setPaying] = useState(false);
  const [error, setError]   = useState('');

  const handlePay = async () => {
    if (!stripe || !elements) return;
    setPaying(true); setError('');
    try {
      const cardElement = elements.getElement(CardElement);
      const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({ type:'card', card:cardElement });
      if (pmError) { setError(pmError.message); setPaying(false); return; }
      await createSubscription({ plan, paymentMethodId: paymentMethod.id });
      onSuccess();
    } catch (err) { setError(err.message || 'Payment failed. Please try again.'); }
    finally { setPaying(false); }
  };

  return (
    <div>
      <div style={{marginBottom:16}}>
        <div style={{fontSize:'.5rem',fontWeight:600,letterSpacing:'.12em',textTransform:'uppercase',color:'var(--ink-3)',marginBottom:8}}>Card details</div>
        <div style={{padding:'12px 14px',border:'1px solid var(--line2)',borderRadius:10,background:'var(--cream-2)'}}>
          <CardElement options={CARD_STYLE}/>
        </div>
      </div>
      {error && <div style={{fontSize:'.52rem',color:'var(--red)',marginBottom:10}}>{error}</div>}
      <div style={{marginTop:14,padding:'10px 12px',background:'var(--green-bg)',border:'1px solid var(--green-lt)',borderRadius:10,display:'flex',alignItems:'center',gap:8}}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
        <span style={{fontSize:'.5rem',color:'var(--green)',fontWeight:500}}>Encrypted payment · Stripe · PCI DSS compliant</span>
      </div>
      <div style={{marginTop:10,fontSize:'.46rem',color:'var(--ink-3)'}}>Test card: 4242 4242 4242 4242 · Any future date · Any CVV · Any ZIP</div>
      <button type="button" onClick={handlePay} disabled={paying||!stripe}
        style={{width:'100%',height:44,marginTop:14,borderRadius:12,border:'none',background:'var(--rose)',color:'#fff',fontSize:'.66rem',fontWeight:600,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:8,boxShadow:'0 4px 16px rgba(155,58,86,.28)',opacity:paying?.7:1}}>
        {paying?<><div style={{width:14,height:14,borderRadius:'50%',border:'2px solid rgba(255,255,255,.3)',borderTopColor:'#fff',animation:'pvSpin .7s linear infinite'}}/> Processing…</>:<>Subscribe {plan==='monthly'?'€4.99/mo':'€44.99/yr'} →</>}
      </button>
    </div>
  );
}

function ToggleSwitch({on, onChange, label, sub, color='var(--rose)'}) {
  return (
    <div onClick={onChange} style={{display:'flex',alignItems:'center',gap:14,padding:'12px 0',borderBottom:'1px solid var(--line2)',cursor:'pointer',userSelect:'none'}}>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:'.64rem',fontWeight:500,color:'var(--ink)',marginBottom:2}}>{label}</div>
        {sub && <div style={{fontSize:'.5rem',fontWeight:300,color:'var(--ink-3)'}}>{sub}</div>}
      </div>
      <div style={{width:38,height:22,borderRadius:11,flexShrink:0,background:on?color:'var(--cream-2)',border:on?'none':'1px solid var(--line2)',position:'relative',transition:'background .2s,border .2s'}}>
        <div style={{position:'absolute',top:on?3:2,left:on?17:2,width:16,height:16,borderRadius:'50%',background:on?'#fff':'var(--ink-3)',transition:'left .2s,top .2s',boxShadow:'0 1px 4px rgba(0,0,0,.2)'}}/>
      </div>
    </div>
  );
}

export function AccountModule({userName='Lena', userProfile=null, onSignOut}) {
  const { t } = useTranslation();
  const [tab, setTab] = useState('profile');
  const [userPlan, setUserPlan] = useState(userProfile?.plan || 'FREE');

  const [profile, setProfile] = useState({
    firstName: userProfile?.firstName || userName || 'Lena',
    lastName:  userProfile?.lastName  || '',
    email:     userProfile?.email     || '',
    phone:     userProfile?.phone     || '',
    language:  'English',
    timezone:  'Europe/Berlin (CET)',
  });
  const [profileSaved, setProfileSaved]   = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError]   = useState('');

  const [pwd, setPwd]             = useState({current:'', next:'', confirm:''});
  const [pwdSaving, setPwdSaving] = useState(false);
  const [pwdMsg, setPwdMsg]       = useState('');
  const [pwdError, setPwdError]   = useState('');
  const [show2FA, setShow2FA]     = useState(false);
  const [twoFA, setTwoFA]         = useState(userProfile?.twoFactorEnabled || false);
  const [qrCode, setQrCode]       = useState('');
  const [tfaCode, setTfaCode]     = useState('');
  const [tfaError, setTfaError]   = useState('');
  const [tfaLoading, setTfaLoading] = useState(false);
  const [sessions, setSessions]   = useState([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [revokingAll, setRevokingAll] = useState(false);

  const [notifs, setNotifs] = useState({
    vaccineReminder:true, apptReminder:true, medReminder:true,
    growthAlert:false, weeklySummary:true, appUpdates:false,
    emailDelivery:true, pushDelivery:true,
  });
  const toggleNotif = async (k) => {
  const updated = {...notifs, [k]: !notifs[k]};
  setNotifs(updated);
  try { await updateNotifications(updated); } catch(_) {}
};

  const [deleteStep, setDeleteStep]   = useState(0);
  const [deleteInput, setDeleteInput] = useState('');
  const [upgradeStep, setUpgradeStep] = useState(0);
  const [plan, setPlan]               = useState('monthly');
  const [billing, setBilling]         = useState(null);
  const [cancelling, setCancelling]   = useState(false);

  useEffect(() => {
  if (tab !== 'security') return;
  setSessionsLoading(true);
  getSessions().then(res => setSessions(res?.data || [])).catch(() => setSessions([])).finally(() => setSessionsLoading(false));
}, [tab]);

useEffect(() => {
  getNotifications().then(res => {
    if (res?.data && Object.keys(res.data).length > 0) setNotifs(n => ({...n, ...res.data}));
  }).catch(() => {});
}, []);

useEffect(() => {
  if (tab !== 'plan') return;
  getSubscription().then(res => setBilling(res?.data || null)).catch(() => {});
}, [tab]);

  const handleSaveProfile = async () => {
    setProfileSaving(true); setProfileError('');
    try {
      await updateMe({ firstName: profile.firstName, lastName: profile.lastName, phone: profile.phone });
      setProfileSaved(true); setTimeout(() => setProfileSaved(false), 2500);
    } catch (err) { setProfileError(err.message || 'Failed to save changes'); }
    finally { setProfileSaving(false); }
  };

  const handleChangePassword = async () => {
    if (!pwd.current || !pwd.next || pwd.next !== pwd.confirm) return;
    if (pwd.next.length < 8) { setPwdError('Password must be at least 8 characters'); return; }
    setPwdSaving(true); setPwdError(''); setPwdMsg('');
    try {
      await changePassword({ currentPassword: pwd.current, newPassword: pwd.next });
      setPwdMsg('Password changed! Signing you out…');
      setPwd({current:'', next:'', confirm:''});
      setTimeout(onSignOut, 2000);
    } catch (err) { setPwdError(err.message || 'Failed to change password'); }
    finally { setPwdSaving(false); }
  };

  const handleRevokeAll = async () => {
    setRevokingAll(true);
    try { await revokeAllSessions(); const res = await getSessions(); setSessions(res?.data || []); } catch (_) {}
    finally { setRevokingAll(false); }
  };

  const handleUpgradeSuccess = () => {
    setUserPlan('PREMIUM');
    setUpgradeStep(3);
  };

  const isPremium = userPlan === 'PREMIUM';

  const tabs = [
    {k:'profile',      icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="8" r="4"/><path d="M6 20v-1a6 6 0 0112 0v1"/></svg>, label:t('account.profile','Profile')},
    {k:'security',     icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>, label:t('account.security','Security')},
    {k:'notifications',icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>, label:t('account.notifications','Notifications')},
    {k:'plan',         icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>, label:t('account.plan','Plan')},
  ];

  const fmtDate = d => d ? new Date(d).toLocaleDateString('en-DE', {day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'}) : '—';

  return (
    <div className="pv-page" style={{animation:'fadeUp .3s ease both'}}>

      {/* DELETE MODAL */}
      <Modal open={deleteStep>0} onClose={()=>{setDeleteStep(0);setDeleteInput('');}} maxWidth={400}>
        {deleteStep===1 && (
          <div style={{padding:'32px 28px 24px'}}>
            <XBtn onClick={()=>{setDeleteStep(0);setDeleteInput('');}}/>
            <div style={{width:60,height:60,borderRadius:18,background:'var(--red-bg)',border:'1.5px solid rgba(185,40,20,.2)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px'}}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="1.8" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
            </div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:'1.15rem',textAlign:'center',color:'var(--ink)',marginBottom:6}}>{t('account.deleteModal1','Delete your account?')}</div>
            <div style={{fontSize:'.54rem',fontWeight:300,color:'var(--ink-3)',textAlign:'center',lineHeight:1.75,marginBottom:20}}>{t('account.deleteModal1Sub','This will permanently and irreversibly remove:')}</div>
            {["All children's health records",'Vaccine history and certificates','Uploaded documents and scans','Appointments, medications & growth data','Your account and login credentials'].map((item,i)=>(
              <div key={i} style={{display:'flex',alignItems:'center',gap:10,padding:'7px 0',borderBottom:i<4?'1px solid var(--line2)':'none'}}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                <span style={{fontSize:'.58rem',color:'var(--ink-2)'}}>{item}</span>
              </div>
            ))}
            <div style={{marginTop:20,display:'flex',gap:10}}>
              <button type="button" className="fb fb-g" style={{flex:1}} onClick={()=>setDeleteStep(0)}>{t('account.deleteCancel','Cancel')}</button>
              <button type="button" onClick={()=>setDeleteStep(2)} style={{flex:1,height:40,borderRadius:10,background:'var(--red)',color:'#fff',border:'none',fontSize:'.6rem',fontWeight:500,cursor:'pointer'}}>{t('account.deleteContinue','I understand, continue')}</button>
            </div>
          </div>
        )}
        {deleteStep===2 && (
          <div style={{padding:'32px 28px 24px'}}>
            <XBtn onClick={()=>{setDeleteStep(0);setDeleteInput('');}}/>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:'1.05rem',color:'var(--ink)',marginBottom:6,textAlign:'center'}}>{t('account.deleteConfirm','Final confirmation')}</div>
            <div style={{fontSize:'.54rem',fontWeight:300,color:'var(--ink-3)',textAlign:'center',lineHeight:1.75,marginBottom:20}}>
              Type <strong style={{color:'var(--red)',fontFamily:'monospace',letterSpacing:'.1em'}}>DELETE</strong> to permanently delete your account.
            </div>
            <input value={deleteInput} onChange={e=>setDeleteInput(e.target.value.toUpperCase())} className="fi" placeholder="Type DELETE here"
              style={{width:'100%',boxSizing:'border-box',textAlign:'center',letterSpacing:'.15em',fontFamily:'monospace',fontSize:'.85rem',borderColor:deleteInput==='DELETE'?'var(--red)':'var(--line2)',background:deleteInput==='DELETE'?'rgba(185,40,20,.05)':'var(--cream-2)',transition:'all .2s'}}/>
            <div style={{marginTop:16,display:'flex',gap:10}}>
              <button type="button" className="fb fb-g" style={{flex:1}} onClick={()=>{setDeleteStep(1);setDeleteInput('');}}>← Back</button>
              <button type="button" disabled={deleteInput!=='DELETE'} onClick={async ()=>{
  setDeleteStep(3);
  try { await deleteAccount(); } catch(_) {}
  setTimeout(onSignOut, 2200);
}}
                style={{flex:1,height:40,borderRadius:10,border:'none',fontSize:'.6rem',fontWeight:500,cursor:deleteInput==='DELETE'?'pointer':'default',transition:'all .2s',background:deleteInput==='DELETE'?'var(--red)':'var(--cream-2)',color:deleteInput==='DELETE'?'#fff':'var(--ink-3)'}}>
                Delete my account
              </button>
            </div>
          </div>
        )}
        {deleteStep===3 && (
          <div style={{padding:'48px 28px',textAlign:'center',display:'flex',flexDirection:'column',alignItems:'center',gap:14,borderRadius:22,overflow:'hidden'}}>
            <div style={{width:64,height:64,borderRadius:20,background:'var(--red-bg)',border:'1.5px solid rgba(185,40,20,.2)',display:'flex',alignItems:'center',justifyContent:'center',animation:'pvSuccessPop .4s ease both'}}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg>
            </div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:'1.1rem',color:'var(--ink)'}}>{t('account.accountDeleted','Account deleted')}</div>
            <div style={{fontSize:'.54rem',fontWeight:300,color:'var(--ink-3)',lineHeight:1.7}}>{t('account.accountDeletedSub','All your data has been permanently removed. Signing you out…')}</div>
            <div style={{width:48,height:3,borderRadius:3,background:'linear-gradient(90deg,var(--red),rgba(185,40,20,.3))',animation:'pvBarGrow 2s ease both'}}/>
          </div>
        )}
      </Modal>

      {/* UPGRADE MODAL */}
      <Modal open={upgradeStep>0} onClose={()=>{if(upgradeStep!==3)setUpgradeStep(0);}} maxWidth={440}>
        {upgradeStep===1 && (
          <div style={{padding:'28px 28px 24px'}}>
            <XBtn onClick={()=>setUpgradeStep(0)}/>
            <div style={{textAlign:'center',marginBottom:20}}>
              <div style={{display:'inline-flex',alignItems:'center',justifyContent:'center',width:56,height:56,borderRadius:16,background:'linear-gradient(135deg,var(--rose-pale),var(--rose-lt))',marginBottom:12}}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--rose)" strokeWidth="1.8" strokeLinecap="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
              </div>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:'1.25rem',color:'var(--ink)',marginBottom:4}}>{t('account.upgradeToPremium','Upgrade to Premium')}</div>
              <div style={{fontSize:'.54rem',fontWeight:300,color:'var(--ink-3)'}}>{t('account.upgradeTagline','Everything your growing family needs')}</div>
            </div>
            <div style={{display:'flex',background:'var(--cream-2)',borderRadius:12,padding:4,marginBottom:20,gap:4}}>
              {[{k:'monthly',label:'Monthly',price:'€4.99/mo'},{k:'annual',label:'Annual',price:'€44.99/yr',save:'Save 25%'}].map(p=>(
                <div key={p.k} onClick={()=>setPlan(p.k)} style={{flex:1,padding:'10px',borderRadius:9,textAlign:'center',cursor:'pointer',background:plan===p.k?'var(--white)':'transparent',boxShadow:plan===p.k?'0 2px 8px rgba(0,0,0,.1)':'none',transition:'all .2s'}}>
                  <div style={{fontSize:'.54rem',fontWeight:600,color:'var(--ink)',marginBottom:2}}>{p.label}</div>
                  <div style={{fontSize:'.7rem',fontWeight:700,color:'var(--rose)'}}>{p.price}</div>
                  {p.save && <div style={{fontSize:'.43rem',color:'var(--green)',fontWeight:600,marginTop:2}}>{p.save}</div>}
                </div>
              ))}
            </div>
            {[
              {svg:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--rose)" strokeWidth="1.8" strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>,bg:'var(--rose-pale)',border:'var(--rose-lt)',text:'Up to 5 children (vs 2)'},
              {svg:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="1.8" strokeLinecap="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>,bg:'var(--blue-bg)',border:'var(--blue-lt)',text:'50 GB storage (vs 500 MB)'},
              {svg:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--purple)" strokeWidth="1.8" strokeLinecap="round"><path d="M12 2a4 4 0 014 4c0 1.5-.8 2.8-2 3.5V11h-4V9.5A4 4 0 0112 2z"/><rect x="8" y="11" width="8" height="5" rx="1"/><path d="M10 16v3M14 16v3M7 19h10"/></svg>,bg:'rgba(124,58,237,.08)',border:'rgba(124,58,237,.2)',text:'Unlimited AI Assistant messages'},
              {svg:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="1.8" strokeLinecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M9 13h6M9 17h4"/></svg>,bg:'var(--green-bg)',border:'var(--green-lt)',text:'Vaccination certificate PDF export'},
              {svg:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--rose)" strokeWidth="1.8" strokeLinecap="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>,bg:'var(--rose-pale)',border:'var(--rose-lt)',text:'Priority support (same-day)'},
            ].map((f,i)=>(
              <div key={i} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 0',borderBottom:i<4?'1px solid var(--line2)':'none'}}>
                <div style={{width:28,height:28,borderRadius:8,background:f.bg,border:`1px solid ${f.border}`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>{f.svg}</div>
                <span style={{fontSize:'.58rem',color:'var(--ink-2)'}}>{f.text}</span>
                <svg style={{marginLeft:'auto',flexShrink:0}} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
              </div>
            ))}
            <button type="button" onClick={()=>setUpgradeStep(2)} style={{width:'100%',height:44,marginTop:20,borderRadius:12,border:'none',background:'var(--rose)',color:'#fff',fontSize:'.66rem',fontWeight:600,cursor:'pointer',boxShadow:'0 4px 16px rgba(155,58,86,.32)',display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
              Continue to payment →
            </button>
            <div style={{fontSize:'.46rem',color:'var(--ink-3)',textAlign:'center',marginTop:10}}>{t('account.cancelAnytime','Cancel anytime · No commitment · GDPR compliant')}</div>
          </div>
        )}
        {upgradeStep===2 && (
          <div style={{padding:'28px 28px 24px'}}>
            <XBtn onClick={()=>setUpgradeStep(0)}/>
            <button type="button" onClick={()=>setUpgradeStep(1)} style={{display:'flex',alignItems:'center',gap:5,background:'none',border:'none',cursor:'pointer',color:'var(--ink-3)',fontSize:'.52rem',marginBottom:16,padding:0}}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>Back to plans
            </button>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:'1.1rem',color:'var(--ink)',marginBottom:4}}>{t('account.paymentDetails','Payment details')}</div>
            <div style={{fontSize:'.52rem',color:'var(--ink-3)',marginBottom:18}}>{plan==='monthly'?'€4.99/month · cancel anytime':'€44.99/year · 25% saving vs monthly'}</div>
            <Elements stripe={stripePromise}>
              <StripePaymentForm plan={plan} onSuccess={handleUpgradeSuccess}/>
            </Elements>
          </div>
        )}
        {upgradeStep===3 && (
         <div style={{padding:'48px 28px',textAlign:'center',display:'flex',flexDirection:'column',alignItems:'center',gap:14,background:'linear-gradient(180deg,var(--rose-pale),var(--white))',borderRadius:22,overflow:'hidden'}}>
            <div style={{width:72,height:72,borderRadius:22,background:'linear-gradient(135deg,var(--rose-pale),var(--rose-lt))',border:'2px solid var(--rose-lt)',display:'flex',alignItems:'center',justifyContent:'center',animation:'pvSuccessPop .5s ease both',boxShadow:'0 8px 28px rgba(155,58,86,.2)'}}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--rose)" strokeWidth="2.2" strokeLinecap="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
            </div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:'1.3rem',color:'var(--ink)'}}>{t('account.welcomePremium','Welcome to Premium!')}</div>
            <div style={{fontSize:'.56rem',fontWeight:300,color:'var(--ink-3)',lineHeight:1.8,maxWidth:280}}>Your account has been upgraded. All Premium features are now active. Thank you for supporting PediVault! 🌸</div>
            <div style={{display:'flex',gap:8,flexWrap:'wrap',justifyContent:'center'}}>
              {['5 children','50 GB storage','Unlimited AI','Certificates','Priority support'].map(f=>(
                <span key={f} style={{fontSize:'.46rem',fontWeight:500,color:'var(--rose)',background:'var(--rose-pale)',border:'1px solid var(--rose-lt)',borderRadius:20,padding:'3px 10px'}}>{f}</span>
              ))}
            </div>
            <button type="button" onClick={()=>setUpgradeStep(0)} style={{height:40,padding:'0 28px',borderRadius:12,border:'none',background:'var(--rose)',color:'#fff',fontSize:'.62rem',fontWeight:600,cursor:'pointer',boxShadow:'0 4px 16px rgba(155,58,86,.28)',marginTop:4}}>
              Start exploring Premium →
            </button>
          </div>
        )}
      </Modal>

      {/* HERO */}
      <div style={{background:isPremium?'linear-gradient(135deg,rgba(42,158,98,.08),rgba(255,255,255,.9))':'linear-gradient(135deg,var(--rose-pale),rgba(255,255,255,.8))',border:`1.5px solid ${isPremium?'var(--green-lt)':'var(--rose-lt)'}`,borderRadius:20,padding:'24px',marginBottom:22,display:'flex',alignItems:'center',gap:18,position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',right:-30,top:-30,width:120,height:120,borderRadius:'50%',background:isPremium?'var(--green-lt)':'var(--rose-lt)',opacity:.3,pointerEvents:'none'}}/>
        <div style={{width:70,height:70,borderRadius:20,flexShrink:0,background:isPremium?'linear-gradient(135deg,var(--green-bg),var(--green-lt))':'linear-gradient(135deg,var(--rose-pale),var(--rose-lt))',border:`2px solid ${isPremium?'var(--green-lt)':'var(--rose-lt)'}`,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Playfair Display',serif",fontSize:'1.8rem',color:isPremium?'var(--green)':'var(--rose)',boxShadow:`0 4px 20px ${isPremium?'rgba(42,158,98,.2)':'rgba(155,58,86,.2)'}`,position:'relative',zIndex:1}}>
          {(profile.firstName||userName||'L')[0]}
        </div>
        <div style={{position:'relative',zIndex:1}}>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:'1.3rem',fontWeight:400,color:'var(--ink)',marginBottom:3}}>{profile.firstName} {profile.lastName}</div>
          <div style={{fontSize:'.56rem',color:'var(--ink-3)',marginBottom:8}}>{profile.email}</div>
          <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
            <span style={{fontSize:'.46rem',fontWeight:600,color:isPremium?'var(--green)':'var(--rose)',background:isPremium?'var(--green-bg)':'var(--rose-pale)',border:`1px solid ${isPremium?'var(--green-lt)':'var(--rose-lt)'}`,borderRadius:20,padding:'2px 8px'}}>
              {isPremium?'✨ PREMIUM':'FREE PLAN'}
            </span>
            <span style={{fontSize:'.46rem',fontWeight:500,color:'var(--green)',background:'var(--green-bg)',border:'1px solid var(--green-lt)',borderRadius:20,padding:'2px 8px',display:'flex',alignItems:'center',gap:4}}>
              <div style={{width:5,height:5,borderRadius:'50%',background:'var(--green)'}}/>Active
            </span>
            <span style={{fontSize:'.46rem',color:'var(--ink-3)',background:'var(--cream-2)',border:'1px solid var(--line2)',borderRadius:20,padding:'2px 8px'}}>{profile.language}</span>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div style={{display:'flex',gap:6,marginBottom:18,flexWrap:'wrap'}}>
        {tabs.map(tabItem=>(
          <button key={tabItem.k} type="button" onClick={()=>setTab(tabItem.k)} style={{height:32,padding:'0 14px',borderRadius:20,border:'none',cursor:'pointer',fontSize:'.56rem',fontWeight:tab===tabItem.k?600:400,color:tab===tabItem.k?'#fff':'var(--ink-2)',background:tab===tabItem.k?'var(--rose)':'var(--cream-2)',display:'inline-flex',alignItems:'center',justifyContent:'center',gap:6,transition:'all .15s',lineHeight:1,boxShadow:tab===tabItem.k?'0 2px 10px rgba(155,58,86,.28)':'none'}}>
            {tabItem.icon}{tabItem.label}
          </button>
        ))}
      </div>

      {/* PROFILE TAB */}
      {tab==='profile' && (
        <div style={{display:'flex',flexDirection:'column',gap:14}}>
          <div className="card">
            <div className="sh" style={{marginBottom:14}}><div className="sh-title">{t('account.personalInfo','Personal Information')}</div></div>
            <div className="two-col">
              <div>
                <div style={{fontSize:'.5rem',fontWeight:600,letterSpacing:'.12em',textTransform:'uppercase',color:'var(--ink-3)',marginBottom:5}}>{t('account.firstName','First name')}</div>
                <input className="fi" value={profile.firstName} onChange={e=>setProfile(p=>({...p,firstName:e.target.value}))} style={{width:'100%',boxSizing:'border-box'}} placeholder="First name"/>
              </div>
              <div>
                <div style={{fontSize:'.5rem',fontWeight:600,letterSpacing:'.12em',textTransform:'uppercase',color:'var(--ink-3)',marginBottom:5}}>{t('account.lastName','Last name')}</div>
                <input className="fi" value={profile.lastName} onChange={e=>setProfile(p=>({...p,lastName:e.target.value}))} style={{width:'100%',boxSizing:'border-box'}} placeholder="Last name"/>
              </div>
            </div>
            <div style={{marginTop:12}}>
              <div style={{fontSize:'.5rem',fontWeight:600,letterSpacing:'.12em',textTransform:'uppercase',color:'var(--ink-3)',marginBottom:5}}>{t('account.email','Email address')}</div>
              <input className="fi" type="email" value={profile.email} disabled style={{width:'100%',boxSizing:'border-box',opacity:.6,cursor:'not-allowed'}}/>
              <div style={{fontSize:'.44rem',color:'var(--ink-3)',marginTop:4}}>{t('account.emailNote','Email cannot be changed. Contact support if needed.')}</div>
            </div>
            <div style={{marginTop:12}}>
              <div style={{fontSize:'.5rem',fontWeight:600,letterSpacing:'.12em',textTransform:'uppercase',color:'var(--ink-3)',marginBottom:5}}>{t('account.phone','Phone number')}</div>
              <input className="fi" type="tel" value={profile.phone} onChange={e=>setProfile(p=>({...p,phone:e.target.value}))} style={{width:'100%',boxSizing:'border-box'}} placeholder="+49 151 0000 0000"/>
            </div>
            <div className="two-col" style={{marginTop:12}}>
              <div>
               <div style={{fontSize:'.5rem',fontWeight:600,letterSpacing:'.12em',textTransform:'uppercase',color:'var(--ink-3)',marginBottom:5}}>{t('account.language','Language')}</div>
                <LanguageSwitcher compact={false}/>
              </div>
              <div>
                <div style={{fontSize:'.5rem',fontWeight:600,letterSpacing:'.12em',textTransform:'uppercase',color:'var(--ink-3)',marginBottom:5}}>{t('account.timezone','Timezone')}</div>
                <select className="fi" value={profile.timezone} onChange={e=>setProfile(p=>({...p,timezone:e.target.value}))} style={{width:'100%',boxSizing:'border-box',cursor:'pointer'}}>
                  <option>Europe/Berlin (CET)</option><option>Europe/Vienna (CET)</option>
                  <option>Europe/Zurich (CET)</option><option>Europe/London (GMT)</option>
                  <option>America/New_York (EST)</option>
                </select>
              </div>
            </div>
            <div style={{marginTop:16,display:'flex',gap:10,justifyContent:'flex-end',alignItems:'center'}}>
              {profileError && <div style={{fontSize:'.52rem',color:'var(--red)'}}>{profileError}</div>}
              {profileSaved && <div style={{display:'flex',alignItems:'center',gap:6,fontSize:'.54rem',color:'var(--green)'}}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>{t('account.saved','Changes saved')}</div>}
              <button type="button" onClick={handleSaveProfile} disabled={profileSaving} style={{height:36,padding:'0 20px',borderRadius:10,border:'none',background:'var(--rose)',color:'#fff',fontSize:'.6rem',fontWeight:500,cursor:'pointer',boxShadow:'0 2px 10px rgba(155,58,86,.28)',opacity:profileSaving?.6:1}}>
                {profileSaving?t('account.saving','Saving…'):t('account.saveChanges','Save changes')}
              </button>
            </div>
          </div>
          <div className="card" style={{borderColor:'rgba(185,40,20,.15)'}}>
            <div className="sh" style={{marginBottom:12}}><div className="sh-title" style={{color:'var(--red)'}}>{t('account.dangerZone','Danger Zone')}</div></div>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:14}}>
              <div>
                <div style={{fontSize:'.64rem',fontWeight:500,color:'var(--ink)',marginBottom:3}}>{t('account.deleteAccount','Delete account')}</div>
                <div style={{fontSize:'.5rem',fontWeight:300,color:'var(--ink-3)'}}>{t('account.deleteAccountSub','Permanently removes your account and all health records.')}</div>
              </div>
              <button type="button" style={{height:34,padding:'0 14px',borderRadius:9,flexShrink:0,background:'var(--red-bg)',border:'1px solid rgba(185,40,20,.25)',color:'var(--red)',fontSize:'.56rem',fontWeight:500,cursor:'pointer',transition:'all .15s',whiteSpace:'nowrap'}} onClick={()=>setDeleteStep(1)}>{t('account.deleteAccount','Delete account')}</button>
            </div>
          </div>
        </div>
      )}

      {/* SECURITY TAB */}
      {tab==='security' && (
        <div style={{display:'flex',flexDirection:'column',gap:14}}>
          <div className="card">
            <div className="sh" style={{marginBottom:14}}><div className="sh-title">{t('account.changePassword','Change Password')}</div></div>
            {[{label:t('account.currentPassword','Current password'),k:'current',ac:'current-password'},{label:t('account.newPassword','New password'),k:'next',ac:'new-password'},{label:t('account.confirmPassword','Confirm new password'),k:'confirm',ac:'new-password'}].map(f=>(
              <div key={f.k} style={{marginBottom:12}}>
                <div style={{fontSize:'.5rem',fontWeight:600,letterSpacing:'.12em',textTransform:'uppercase',color:'var(--ink-3)',marginBottom:5}}>{f.label}</div>
                <input className="fi" type="password" autoComplete={f.ac} value={pwd[f.k]} onChange={e=>setPwd(p=>({...p,[f.k]:e.target.value}))} style={{width:'100%',boxSizing:'border-box'}} placeholder="••••••••"/>
              </div>
            ))}
            {pwd.next&&pwd.confirm&&pwd.next!==pwd.confirm&&<div style={{fontSize:'.52rem',color:'var(--red)',marginBottom:8}}>{t('account.passwordMismatch','Passwords do not match.')}</div>}
            {pwdError&&<div style={{fontSize:'.52rem',color:'var(--red)',marginBottom:8}}>{pwdError}</div>}
            {pwdMsg&&<div style={{fontSize:'.52rem',color:'var(--green)',marginBottom:8}}>{pwdMsg}</div>}
            <div style={{display:'flex',justifyContent:'flex-end',marginTop:4}}>
              <button type="button" onClick={handleChangePassword} disabled={pwdSaving||!pwd.current||!pwd.next||pwd.next!==pwd.confirm}
                style={{height:36,padding:'0 20px',borderRadius:10,border:'none',fontSize:'.6rem',fontWeight:500,cursor:'pointer',transition:'all .2s',opacity:pwdSaving?.6:1,background:pwd.current&&pwd.next&&pwd.next===pwd.confirm?'var(--rose)':'var(--cream-2)',color:pwd.current&&pwd.next&&pwd.next===pwd.confirm?'#fff':'var(--ink-3)'}}>
                {pwdSaving?t('account.updating','Updating…'):t('account.updatePassword','Update password')}
              </button>
            </div>
          </div>
          <div className="card">
            <div className="sh" style={{marginBottom:14}}><div className="sh-title">{t('account.twoFA','Two-Factor Authentication')}</div></div>
            <ToggleSwitch on={twoFA} onChange={async()=>{
              if(!twoFA){
                setTfaError(''); setTfaCode('');
                setTfaLoading(true);
                try {
                  const res = await setup2FA();
                  setQrCode(res.data.qrCode);
                  setShow2FA(true);
                } catch(e){ setTfaError(e.message||'Failed to set up 2FA'); }
                finally { setTfaLoading(false); }
              } else {
                try { await disable2FA(); setTwoFA(false); setShow2FA(false); setQrCode(''); } catch(e){ setTfaError(e.message||'Failed to disable 2FA'); }
              }
            }} label={t('account.enable2FA','Enable 2FA')} sub={twoFA?t('account.twoFAActive','2FA is active'):t('account.twoFADisabled','Secure your account with TOTP')}/>
            {tfaError&&<div style={{fontSize:'.52rem',color:'var(--red)',marginTop:8}}>{tfaError}</div>}
            {show2FA&&!twoFA&&qrCode&&(
              <div style={{marginTop:14,padding:'14px',background:'var(--cream-2)',borderRadius:12,border:'1px solid var(--line2)'}}>
                <div style={{fontSize:'.6rem',fontWeight:500,color:'var(--ink)',marginBottom:6}}>1. Scan with Google Authenticator or Authy</div>
                <img src={qrCode} alt="2FA QR Code" style={{width:120,height:120,borderRadius:10,marginBottom:10,display:'block'}}/>
                <div style={{fontSize:'.6rem',fontWeight:500,color:'var(--ink)',marginBottom:6}}>2. Enter the 6-digit code to confirm</div>
                <div style={{display:'flex',gap:8}}>
                  <input className="fi" value={tfaCode} onChange={e=>setTfaCode(e.target.value.replace(/\D/g,'').slice(0,6))} placeholder="000000" maxLength={6}
                    style={{flex:1,textAlign:'center',letterSpacing:'.2em',fontFamily:'monospace',fontSize:'.85rem'}}/>
                  <button type="button" onClick={async()=>{
                    setTfaLoading(true); setTfaError('');
                    try {
                      await verify2FA(tfaCode);
                      setTwoFA(true); setShow2FA(false);
                    } catch(e){ setTfaError(e.message||'Invalid code'); }
                    finally { setTfaLoading(false); }
                  }} disabled={tfaCode.length!==6||tfaLoading}
                    style={{height:40,padding:'0 16px',borderRadius:10,border:'none',background:'var(--rose)',color:'#fff',fontSize:'.6rem',fontWeight:500,cursor:'pointer',opacity:tfaCode.length!==6?0.5:1}}>
                    {tfaLoading?'…':'Verify'}
                  </button>
                </div>
              </div>
            )}
            {twoFA&&<div style={{marginTop:10,padding:'10px 12px',background:'var(--green-bg)',border:'1px solid var(--green-lt)',borderRadius:10,display:'flex',alignItems:'center',gap:8}}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
              <span style={{fontSize:'.54rem',color:'var(--green)',fontWeight:500}}>{t('account.twoFAEnabled','2FA is enabled — toggle off to disable')}</span>
            </div>}
          </div>
          <div className="card">
            <div className="sh" style={{marginBottom:12}}><div className="sh-title">{t('account.activeSessions','Active Sessions')}</div></div>
            {sessionsLoading?<div style={{fontSize:'.56rem',color:'var(--ink-3)',padding:'12px 0'}}>{t('account.loadingSessions','Loading sessions…')}</div>
            :sessions.length===0?<div style={{fontSize:'.56rem',color:'var(--ink-3)',padding:'12px 0'}}>{t('account.noSessions','No active sessions found.')}</div>
            :sessions.map((s,i)=>(
              <div key={s.id||i} style={{display:'flex',alignItems:'center',gap:12,padding:'11px 0',borderBottom:i<sessions.length-1?'1px solid var(--line2)':'none'}}>
                <div style={{width:36,height:36,borderRadius:10,background:'var(--cream-2)',border:'1px solid var(--line2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1rem',flexShrink:0}}>
  {(()=>{const ua=(s.userAgent||'').toLowerCase();if(ua.includes('iphone'))return'📱';if(ua.includes('android')&&ua.includes('mobile'))return'📱';if(ua.includes('ipad'))return'📟';if(ua.includes('android'))return'📟';if(ua.includes('mac'))return'🖥️';if(ua.includes('windows'))return'💻';if(ua.includes('linux'))return'🐧';return'💻';})()}
</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:'.62rem',fontWeight:500,color:'var(--ink)',marginBottom:2}}>
  {(()=>{const ua=(s.userAgent||'').toLowerCase();if(ua.includes('iphone'))return'iPhone';if(ua.includes('android')&&ua.includes('mobile'))return'Android Phone';if(ua.includes('ipad'))return'iPad';if(ua.includes('android'))return'Android Tablet';if(ua.includes('mac'))return'Mac';if(ua.includes('windows'))return'Windows PC';if(ua.includes('linux'))return'Linux';return'Unknown Device';})()}
</div>
                  <div style={{fontSize:'.48rem',color:'var(--ink-3)'}}>Created {fmtDate(s.createdAt)} · Expires {fmtDate(s.expiresAt)}</div>
                </div>
                <span style={{fontSize:'.44rem',fontWeight:600,color:'var(--green)',background:'var(--green-bg)',border:'1px solid var(--green-lt)',borderRadius:20,padding:'2px 8px'}}>{t('account.active','Active')}</span>
              </div>
            ))}
            <button type="button" onClick={handleRevokeAll} disabled={revokingAll} style={{marginTop:12,height:32,width:'100%',borderRadius:9,background:'var(--cream-2)',border:'1px solid var(--line2)',fontSize:'.56rem',color:'var(--ink-2)',cursor:'pointer',transition:'all .15s',opacity:revokingAll?.6:1}}>
              {revokingAll?t('account.revoking','Revoking…'):t('account.signOutAll','Sign out all other devices')}
            </button>
          </div>
        </div>
      )}

      {/* NOTIFICATIONS TAB */}
      {tab==='notifications' && (
        <div style={{display:'flex',flexDirection:'column',gap:14}}>
         <div className="card">
            <div className="sh" style={{marginBottom:2}}><div className="sh-title">{t('account.deliveryChannels','Delivery Channels')}</div></div>
            <ToggleSwitch on={notifs.pushDelivery} onChange={()=>toggleNotif('pushDelivery')} label={t('account.pushNotifs','Push notifications')} sub={t('account.pushSub','In-app and browser notifications')}/>
            <ToggleSwitch on={notifs.emailDelivery} onChange={()=>toggleNotif('emailDelivery')} label={t('account.emailNotifs','Email notifications')} sub={profile.email}/>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 0',borderBottom:'1px solid var(--line2)'}}>
              <div>
                <div style={{fontSize:'.64rem',fontWeight:500,color:'var(--ink)',marginBottom:2}}>{t('account.smsNotifs','SMS notifications')}</div>
                <div style={{fontSize:'.5rem',fontWeight:300,color:'var(--ink-3)'}}>{profile.phone||t('account.noPhone','No phone number set')}</div>
              </div>
              <button type="button" onClick={async()=>{
                try {
                  const {default:api} = await import('../../../api/client');
                  await api.post('/notifications/test');
                  alert('✅ Test SMS sent! Check your phone.');
                } catch(e){ alert('Failed: '+e.message); }
              }} style={{height:32,padding:'0 14px',borderRadius:9,background:'var(--green-bg)',border:'1px solid var(--green-lt)',color:'var(--green)',fontSize:'.56rem',fontWeight:500,cursor:'pointer'}}>
                Send test SMS
              </button>
            </div>
          </div>
          <div className="card">
            <div className="sh" style={{marginBottom:2}}><div className="sh-title">{t('account.healthReminders','Health Reminders')}</div></div>
            <ToggleSwitch on={notifs.vaccineReminder} onChange={()=>toggleNotif('vaccineReminder')} label={t('account.vaccineReminder','Vaccine reminders')} sub={t('account.vaccineReminderSub','Alerts when doses are due or overdue')}/>
            <ToggleSwitch on={notifs.apptReminder} onChange={()=>toggleNotif('apptReminder')} label={t('account.apptReminder','Appointment reminders')} sub={t('account.apptReminderSub','24 hours and 1 hour before each visit')}/>
            <ToggleSwitch on={notifs.medReminder} onChange={()=>toggleNotif('medReminder')} label={t('account.medReminder','Medication reminders')} sub={t('account.medReminderSub','Daily reminders for active medications')}/>
            <ToggleSwitch on={notifs.growthAlert} onChange={()=>toggleNotif('growthAlert')} label={t('account.growthAlert','Growth milestone alerts')} sub={t('account.growthAlertSub','When your child reaches a new milestone')}/>
          </div>
          <div className="card">
            <div className="sh" style={{marginBottom:2}}><div className="sh-title">{t('account.reportsUpdates','Reports & Updates')}</div></div>
            <ToggleSwitch on={notifs.weeklySummary} onChange={()=>toggleNotif('weeklySummary')} label={t('account.weeklySummary','Weekly health summary')} sub={t('account.weeklySummarySub','Every Sunday — overview of the past week')}/>
            <ToggleSwitch on={notifs.appUpdates} onChange={()=>toggleNotif('appUpdates')} label={t('account.appUpdates','App updates & tips')} sub={t('account.appUpdatesSub','New features and paediatric health tips')}/>
          </div>
        </div>
      )}

      {/* PLAN TAB */}
      {tab==='plan' && (
        <div style={{display:'flex',flexDirection:'column',gap:14}}>
          <div className="card" style={{background:isPremium?'linear-gradient(135deg,rgba(42,158,98,.06),rgba(255,255,255,.9))':'linear-gradient(135deg,var(--rose-pale),rgba(255,255,255,.9))',border:`1.5px solid ${isPremium?'var(--green-lt)':'var(--rose-lt)'}`}}>
            <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:12,marginBottom:16}}>
              <div>
                <div style={{fontSize:'.48rem',fontWeight:600,letterSpacing:'.2em',textTransform:'uppercase',color:'var(--ink-3)',marginBottom:4}}>{t('account.currentPlan','Current plan')}</div>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:'1.5rem',color:'var(--ink)',lineHeight:1,marginBottom:6}}>{isPremium?t('account.premiumPlan','Premium'):t('account.freePlan','Free')}</div>
                <div style={{fontSize:'.54rem',color:'var(--ink-3)'}}>{isPremium?t('account.premiumPlanSub','Unlimited children · 50 GB storage · All features'):t('account.freePlanSub','Up to 2 children · 500 MB storage · Basic features')}</div>
              </div>
              <span style={{fontSize:'.46rem',fontWeight:700,color:isPremium?'var(--green)':'var(--rose)',background:isPremium?'var(--green-bg)':'var(--rose-pale)',border:`1.5px solid ${isPremium?'var(--green-lt)':'var(--rose-lt)'}`,borderRadius:20,padding:'3px 10px',flexShrink:0}}>{isPremium?'✨ PREMIUM':'FREE'}</span>
            </div>
            {!isPremium && (
              <>
                <div style={{marginBottom:16}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:5}}>
                    <span style={{fontSize:'.5rem',color:'var(--ink-3)'}}>{t('account.storageUsed','Storage used')}</span>
                    <span style={{fontSize:'.5rem',fontWeight:500,color:'var(--ink)'}}>12.4 MB of 500 MB</span>
                  </div>
                  <div style={{height:6,borderRadius:3,background:'var(--line2)',overflow:'hidden'}}>
                    <div style={{height:'100%',width:'2.5%',borderRadius:3,background:'linear-gradient(90deg,var(--rose),var(--rose-mid))',transition:'width .6s ease'}}/>
                  </div>
                  <div style={{fontSize:'.46rem',color:'var(--ink-3)',marginTop:4}}>487.6 MB remaining</div>
                </div>
                <button type="button" onClick={()=>setUpgradeStep(1)} style={{width:'100%',height:42,borderRadius:12,border:'none',background:'var(--rose)',color:'#fff',fontFamily:"'DM Sans',sans-serif",fontSize:'.66rem',fontWeight:600,cursor:'pointer',transition:'opacity .15s',boxShadow:'0 4px 16px rgba(155,58,86,.32)',display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                  Upgrade to Premium — €4.99/mo
                </button>
              </>
            )}
            {isPremium && (
              <div style={{padding:'12px',background:'var(--green-bg)',borderRadius:10,border:'1px solid var(--green-lt)',display:'flex',alignItems:'center',gap:8}}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
                <span style={{fontSize:'.54rem',color:'var(--green)',fontWeight:500}}>{t('account.allPremiumActive','All Premium features are active.')}</span>
              </div>
            )}
          </div>
          {!isPremium && (
            <div className="card">
              <div className="sh" style={{marginBottom:14}}><div className="sh-title">{t('account.freeVsPremium','Free vs Premium')}</div></div>
              {[
                {feature:'Children profiles',free:'Up to 2',premium:'Unlimited'},
                {feature:'Storage',free:'500 MB',premium:'10 GB'},
                {feature:'AI Assistant',free:'Basic',premium:'Full context, history'},
                {feature:'Record export',free:'PDF only',premium:'PDF, CSV, HL7 FHIR'},
                {feature:'Doctor sharing',free:'Manual PDF',premium:'Direct secure link'},
                {feature:'Vaccine reminders',free:'Email',premium:'Email + SMS + Push'},
                {feature:'Priority support',free:false,premium:true},
                {feature:'Family plan sharing',free:false,premium:true},
              ].map((r,i)=>(
                <div key={i} style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8,padding:'9px 0',borderBottom:i<7?'1px solid var(--line2)':'none',alignItems:'center'}}>
                  <div style={{fontSize:'.58rem',color:'var(--ink)',fontWeight:400}}>{r.feature}</div>
                  <div style={{fontSize:'.54rem',color:'var(--ink-3)',textAlign:'center'}}>{r.free===false?<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--ink-3)" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>:r.free}</div>
                  <div style={{fontSize:'.54rem',color:'var(--rose)',textAlign:'center',fontWeight:500}}>{r.premium===true?<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--rose)" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>:r.premium}</div>
                </div>
              ))}
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8,marginTop:6,paddingTop:6}}>
                <div/><div style={{fontSize:'.5rem',fontWeight:600,color:'var(--ink-3)',textAlign:'center',letterSpacing:'.08em'}}>FREE</div>
                <div style={{fontSize:'.5rem',fontWeight:600,color:'var(--rose)',textAlign:'center',letterSpacing:'.08em'}}>PREMIUM</div>
              </div>
            </div>
          )}
          <div className="card">
            <div className="sh" style={{marginBottom:12}}><div className="sh-title">{t('account.billingInfo','Billing Information')}</div></div>
            {billing && billing.status !== 'none' ? (
              <div style={{display:'flex',flexDirection:'column',gap:10}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 0',borderBottom:'1px solid var(--line2)'}}>
                  <span style={{fontSize:'.56rem',color:'var(--ink-3)'}}>Status</span>
                  <span style={{fontSize:'.56rem',fontWeight:600,color:billing.status==='active'?'var(--green)':'var(--amber)',background:billing.status==='active'?'var(--green-bg)':'var(--amber-bg)',border:`1px solid ${billing.status==='active'?'var(--green-lt)':'var(--amber-lt)'}`,borderRadius:20,padding:'2px 10px'}}>
                    {billing.cancelAtPeriodEnd ? '⚠ Cancels at period end' : billing.status === 'active' ? '✓ Active' : billing.status}
                  </span>
                </div>
                {billing.currentPeriodEnd && (
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 0',borderBottom:'1px solid var(--line2)'}}>
                    <span style={{fontSize:'.56rem',color:'var(--ink-3)'}}>
                      {billing.cancelAtPeriodEnd ? 'Access until' : 'Next renewal'}
                    </span>
                    <span style={{fontSize:'.56rem',fontWeight:500,color:'var(--ink)'}}>
                      {new Date(billing.currentPeriodEnd).toLocaleDateString('en-DE',{day:'numeric',month:'long',year:'numeric'})}
                    </span>
                  </div>
                )}
                {!billing.cancelAtPeriodEnd ? (
                  <button type="button" onClick={async()=>{
                    if(!window.confirm('Cancel your Premium subscription? You keep access until the end of the billing period.')) return;
                    setCancelling(true);
                    try {
                      await cancelSubscription();
                      const res = await getSubscription();
                      setBilling(res?.data || null);
                    } catch(e){ alert('Failed to cancel: '+e.message); }
                    finally { setCancelling(false); }
                  }} disabled={cancelling} style={{height:34,padding:'0 16px',borderRadius:9,background:'var(--red-bg)',border:'1px solid rgba(185,40,20,.2)',color:'var(--red)',fontSize:'.56rem',fontWeight:500,cursor:'pointer',alignSelf:'flex-start',opacity:cancelling?.6:1}}>
                    {cancelling?t('account.cancelling','Cancelling…'):t('account.cancelSubscription','Cancel subscription')}
                  </button>
                ) : (
                  <div style={{fontSize:'.52rem',color:'var(--amber)',padding:'8px 12px',background:'var(--amber-bg)',borderRadius:9,border:'1px solid var(--amber-lt)'}}>
                    Your subscription is set to cancel. You'll keep Premium access until the renewal date above.
                  </div>
                )}
              </div>
            ) : (
              <div style={{padding:'14px',background:'var(--cream-2)',borderRadius:12,border:'1px solid var(--line2)',textAlign:'center'}}>
                <div style={{fontSize:'.56rem',color:'var(--ink-3)',lineHeight:1.7}}>
                  {isPremium?'You are on the Premium plan.\nManage your subscription via your payment provider.':'You are on the free plan.\nNo billing information on file.'}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sign out */}
      <div style={{marginTop:8,paddingTop:16,borderTop:'1px solid var(--line2)'}}>
        <button type="button" onClick={onSignOut} style={{width:'100%',height:38,borderRadius:10,background:'var(--cream-2)',border:'1px solid var(--line2)',color:'var(--ink-2)',fontSize:'.6rem',fontWeight:500,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:8,transition:'all .15s'}}
          onMouseEnter={e=>{e.currentTarget.style.background='var(--red-bg)';e.currentTarget.style.borderColor='rgba(185,40,20,.2)';e.currentTarget.style.color='var(--red)';}}
          onMouseLeave={e=>{e.currentTarget.style.background='var(--cream-2)';e.currentTarget.style.borderColor='var(--line2)';e.currentTarget.style.color='var(--ink-2)';}}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Sign out of PediVault
        </button>
      </div>
    </div>
  );
}
