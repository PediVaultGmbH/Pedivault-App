import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import Brand from '../ui/Brand';
import { forgotPassword } from '../../../api/auth.api';

export function Forgot({ goTo }) {
  const { t } = useTranslation();
  const [email, setEmail]   = useState('');
  const [sent, setSent]     = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr]       = useState('');

  const handleSend = async () => {
    if (!email) { setErr('Please enter your email address.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setErr('Please enter a valid email address.'); return; }

    setErr(''); setLoading(true);
    try {
      await forgotPassword({ email });
      setSent(true);
    } catch (err) {
      setErr(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onKey = e => { if (e.key === 'Enter') handleSend(); };

  return (
    <div className="pv-si">
      <Brand/>
      {!sent ? (
        <>
          <div className="pv-h-calm">{t('auth.forgotTitle','Forgot your password?')}</div>
          <div className="pv-s">{t('auth.forgotSub',"Enter your email and we'll send a reset link right away.")}</div>
          {err && <div className="pv-err">{err}</div>}
          <div className="pv-f">
            <label className="pv-lbl">{t('auth.emailAddress','Email address')}</label>
            <input
              className="pv-in" type="email" placeholder="you@example.com"
              value={email} onChange={e => { setEmail(e.target.value); setErr(''); }}
              onKeyDown={onKey} autoComplete="email"
            />
          </div>
          <button type="button" className="pv-btn" disabled={loading} onClick={handleSend}>
            {loading
              ? <><div className="pv-btn-spin"/>{t('auth.sending','Sending…')}</>
              : <>{t('auth.sendResetLink','Send Reset Link')} <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2"><path d="M22 2L11 13"/><path d="M22 2L15 22l-4-9-9-4 20-7z"/></svg></>
            }
          </button>
          <div className="pv-sw"><span className="pv-lk" onClick={() => goTo('signin')}>{t('auth.backToSignIn','← Back to Sign In')}</span></div>
        </>
      ) : (
        <div style={{textAlign:'center'}}>
          <div className="pv-sico">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#2A9E62" strokeWidth="1.8" strokeLinecap="round"><path d="M22 2L11 13"/><path d="M22 2L15 22l-4-9-9-4 20-7z"/></svg>
          </div>
          <div className="pv-h-calm" style={{marginBottom:8}}>{t('auth.checkInbox','Check your inbox')}</div>
          <div className="pv-s" style={{marginBottom:5}}>{t('auth.resetSentTo',"We've sent a reset link to")}</div>
          <div style={{fontSize:'.67rem',fontWeight:500,color:'var(--ink)',marginBottom:18}}>{email}</div>
          <div className="pv-fn">
            {t('auth.linkExpires','Link expires in')} <strong style={{fontWeight:500,color:'var(--ink)'}}>15 {t('auth.minutes','minutes')}</strong>. {t('auth.checkSpam',"Check your spam folder if you don't see it.")}
          </div>
          <button type="button" className="pv-btn" style={{marginBottom:12}} onClick={() => goTo('signin')}>
            Back to Sign In <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
          <div style={{fontSize:'.53rem',color:'var(--ink-3)'}}>
            {t('auth.didntReceive',"Didn't receive it?")}{' '}
            <span className="pv-lk" onClick={() => { setSent(false); setErr(''); }}>{t('auth.resendEmail','Resend email')}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default Forgot;
