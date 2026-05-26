import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import Brand from '../ui/Brand';
import { Eye } from '../ui/Logo';
import { resetPassword } from '../../../api/auth.api';

export function ResetPassword({ goTo, token }) {
  const { t } = useTranslation();
  const [pwd, setPwd]       = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow]     = useState(false);
  const [show2, setShow2]   = useState(false);
  const [err, setErr]       = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone]     = useState(false);

  const handleReset = async () => {
    if (!pwd || !confirm) { setErr('Please fill in all fields.'); return; }
    if (pwd.length < 8) { setErr('Password must be at least 8 characters.'); return; }
    if (pwd !== confirm) { setErr('Passwords do not match.'); return; }
    setErr(''); setLoading(true);
    try {
      await resetPassword({ token, newPassword: pwd });
      setDone(true);
      setTimeout(() => goTo('signin'), 2500);
    } catch (err) {
      setErr(err.message || t('auth.resetFailed','Reset failed. The link may have expired.'));
    } finally {
      setLoading(false);
    }
  };

  if (done) return (
    <div className="pv-si" style={{textAlign:'center'}}>
      <div style={{width:64,height:64,borderRadius:20,background:'var(--green-bg)',border:'1px solid var(--green-lt)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px',animation:'pvSuccessPop .4s ease both'}}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.2" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
      </div>
      <div className="pv-h">{t('auth.passwordReset','Password reset!')}</div>
      <div className="pv-s">{t('auth.signingYouIn','Signing you in…')}</div>
    </div>
  );

  return (
    <div className="pv-si">
      <Brand/>
      <div className="pv-h-calm">{t('auth.setNewPassword','Set new password')}</div>
      <div className="pv-s">{t('auth.setNewPasswordSub','Choose a strong password for your account')}</div>
      {err && <div className="pv-err">{err}</div>}
      <div className="pv-f">
        <label className="pv-lbl">{t('auth.newPassword','New password')}</label>
        <div className="pv-iw">
          <span className="pv-il"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg></span>
          <input className="pv-in il ir" type={show?'text':'password'} value={pwd} onChange={e=>setPwd(e.target.value)} placeholder={t('auth.passwordMin','Min. 8 characters')}/>
          <span className="pv-ir" onClick={()=>setShow(!show)}><Eye open={show}/></span>
        </div>
      </div>
      <div className="pv-f">
        <label className="pv-lbl">{t('auth.confirmPassword','Confirm password')}</label>
        <div className="pv-iw">
          <span className="pv-il"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg></span>
          <input className="pv-in il ir" type={show2?'text':'password'} value={confirm} onChange={e=>setConfirm(e.target.value)} placeholder={t('auth.confirmPassword','Repeat password')}/>
          <span className="pv-ir" onClick={()=>setShow2(!show2)}><Eye open={show2}/></span>
        </div>
      </div>
      <button type="button" className="pv-btn" disabled={loading} onClick={handleReset}>
        {loading ? <><div className="pv-btn-spin"/>{t('auth.resetting','Resetting…')}</> : <>{t('auth.setPassword','Set new password')} <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></>}
      </button>
      <div className="pv-sw">
        <span className="pv-lk" onClick={()=>goTo('signin')}>{t('auth.backToSignIn','← Back to sign in')}</span>
      </div>
    </div>
  );
}

export default ResetPassword;
