import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import Brand from '../ui/Brand';
import { Eye } from '../ui/Logo';
import { signIn, login2FA } from '../../../api/auth.api';

export function SignIn({ goTo }) {
  const { t } = useTranslation();
  const [email, setEmail]           = useState('');
  const [pwd, setPwd]               = useState('');
  const [show, setShow]             = useState(false);
  const [err, setErr]               = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading]       = useState(false);
  const [requires2FA, setRequires2FA] = useState(false);
  const [twoFAUserId, setTwoFAUserId] = useState('');
  const [twoFACode, setTwoFACode]   = useState('');
  const [twoFALoading, setTwoFALoading] = useState(false);

  const handleSignIn = async () => {
    if (!email || !pwd) { setErr('Please fill in all fields.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setErr('Please enter a valid email address.'); return; }
    if (pwd.length < 6) { setErr('Password must be at least 6 characters.'); return; }

    setErr(''); setLoading(true);
    try {
      const res = await signIn({ email, password: pwd, rememberMe });
      if (res?.requires2FA) {
        setRequires2FA(true);
        setTwoFAUserId(res.userId);
        setLoading(false);
        return;
      }
      goTo('dashboard', res.firstName);
    } catch (err) {
      setErr(err.message || t('auth.signInFailed','Sign in failed. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = e => { if (e.key === 'Enter') handleSignIn(); };
if (requires2FA) {
    return (
      <div className="pv-si">
        <div style={{textAlign:'center',marginBottom:28}}>
          <div style={{width:68,height:68,borderRadius:20,background:'linear-gradient(135deg,var(--rose-pale),var(--rose-lt))',border:'1.5px solid var(--rose-lt)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px',boxShadow:'0 8px 24px rgba(155,58,86,.18)'}}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--rose)" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
          </div>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:'1.35rem',fontWeight:400,color:'var(--ink)',marginBottom:6,letterSpacing:'-.02em'}}>{t('auth.twoStepVerification','Two-step verification')}</div>
          <div style={{fontSize:'.58rem',fontWeight:300,color:'var(--ink-3)',lineHeight:1.7}}>{t('auth.twoStepSub','Enter the 6-digit code from your Google Authenticator or Authy app')}</div>
        </div>
        {err && <div className="pv-err" style={{marginBottom:14}}>{err}</div>}
        <div className="pv-f">
          <label className="pv-lbl">{t('auth.authCode','Authentication code')}</label>
          <input
            className="pv-in"
            value={twoFACode}
            onChange={e=>setTwoFACode(e.target.value.replace(/\D/g,'').slice(0,6))}
            placeholder="000 000"
            maxLength={6}
            style={{textAlign:'center',letterSpacing:'.4em',fontFamily:'monospace',fontSize:'1.4rem',height:58,borderRadius:14}}
            autoFocus
          />
        </div>
        <button type="button" className="pv-btn" disabled={twoFACode.length!==6||twoFALoading}
          style={{opacity:twoFACode.length!==6?.5:1}}
          onClick={async()=>{
            setTwoFALoading(true); setErr('');
            try {
              const user = await login2FA({ userId: twoFAUserId, token: twoFACode, rememberMe });
              goTo('dashboard', user.firstName);
            } catch(e){ setErr(e.message||'Invalid code. Please try again.'); }
            finally { setTwoFALoading(false); }
          }}>
          {twoFALoading?<><div className="pv-btn-spin"/>{t('auth.verifying','Verifying…')}</>:<>{t('auth.verifyAndContinue','Verify & continue')} <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></>}
        </button>
        <div className="pv-sw">
          <span className="pv-lk" onClick={()=>{setRequires2FA(false);setTwoFACode('');setErr('');}}>{t('auth.backToSignIn','← Back to sign in')}</span>
        </div>
        <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:6,marginTop:22,paddingTop:16,borderTop:'1px solid var(--line2)'}}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--rose-mid)" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
          <span style={{fontSize:'.48rem',fontWeight:300,color:'var(--ink-3)',letterSpacing:'.04em'}}>{t('auth.securityNote','Secured with AES-256 encryption · GDPR compliant')}</span>
        </div>
      </div>
    );
  }
  return (
    <div className="pv-si">
      <Brand/>
      <div className="pv-h-calm">{t('auth.welcomeBack','Welcome back')}</div>
      <div className="pv-s">{t('auth.signInSub',"Sign in to your child's health records")}</div>
      {err && <div className="pv-err">{err}</div>}
      <div className="pv-f">
        <label className="pv-lbl">{t('auth.emailAddress','Email address')}</label>
        <div className="pv-iw">
          <span className="pv-il"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></span>
          <input className="pv-in il" type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={handleKeyDown} placeholder="you@example.de"/>
        </div>
      </div>
      <div className="pv-f">
        <label className="pv-lbl">{t('auth.password','Password')}</label>
        <div className="pv-iw">
          <span className="pv-il"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg></span>
          <input className="pv-in il ir" type={show ? 'text' : 'password'} autoComplete="current-password" value={pwd} onChange={e => setPwd(e.target.value)} onKeyDown={handleKeyDown} placeholder="Your password"/>
          <span className="pv-ir" onClick={() => setShow(!show)}><Eye open={show}/></span>
        </div>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:8}}>
          <label style={{display:'flex',alignItems:'center',gap:7,cursor:'pointer',userSelect:'none'}}>
            <div
              className={`pv-ck${rememberMe ? ' on' : ''}`}
              style={{width:16,height:16,borderRadius:4,flexShrink:0}}
              onClick={() => setRememberMe(!rememberMe)}
            >
              {rememberMe && <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.2"><path d="M20 6L9 17l-5-5"/></svg>}
            </div>
            <span style={{fontSize:'.53rem',fontWeight:300,color:'var(--ink-3)'}}>
              Remember me {rememberMe ? '(30 days)' : '(1 day)'}
            </span>
          </label>
          <span className="pv-lk" style={{fontSize:'.52rem',fontWeight:400}} onClick={() => goTo('forgot')}>{t('auth.forgotPassword','Forgot password?')}</span>
        </div>
      </div>
      <button type="button" className="pv-btn" disabled={loading} onClick={handleSignIn}>
        {loading
          ? <><div className="pv-btn-spin"/>{t('auth.signingIn','Signing in…')}</>
          : <>{t('auth.signIn','Sign In')} <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></>
        }
      </button>
      <div className="pv-div"><span>{t('auth.orContinueWith','or continue with')}</span></div>
      <div className="pv-sg">
        <button type="button" className="pv-sb" onClick={()=>setErr('Google sign-in coming soon')}>
  <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
  Google
</button>
<button type="button" className="pv-sb" onClick={()=>setErr('Apple sign-in coming soon')}>
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.42c1.4.07 2.38.77 3.2.8 1.22-.24 2.39-.96 3.7-.84 1.57.13 2.75.75 3.52 1.9-3.22 1.93-2.56 6.17.58 7.34-.65 1.69-1.52 3.38-3 4.66zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
  Apple
</button>
      </div>
      <div className="pv-sw">{t('auth.noAccount',"Don't have an account?")} <span className="pv-lk" onClick={() => goTo('create')}>{t('auth.createAccount','Create account →')}</span></div>

      <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:6,marginTop:22,paddingTop:16,borderTop:'1px solid var(--line2)'}}>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--rose-mid)" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
        <span style={{fontSize:'.48rem',fontWeight:300,color:'var(--ink-3)',letterSpacing:'.04em'}}>{t('auth.securityNote','Secured with AES-256 encryption · GDPR compliant')}</span>
      </div>
    </div>
  );
}

export default SignIn;
