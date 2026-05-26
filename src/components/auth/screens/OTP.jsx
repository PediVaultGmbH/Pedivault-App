import { useTranslation } from 'react-i18next';
import { useState, useRef, useEffect } from 'react';
import Brand from '../ui/Brand';
import { useTimer } from '../../../hooks/useTimer';
import { verifyOTP, resendOTP } from '../../../api/auth.api';

export function OTP({ goTo, phone, countryCode }) {
  const { t } = useTranslation();
  const [otp, setOtp]         = useState(['','','','']);
  const [hasErr, setHasErr]   = useState(false);
  const [errMsg, setErrMsg]   = useState('Incorrect code — please try again');
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified]   = useState(false);
  const [resending, setResending] = useState(false);
  const { secs, done, reset } = useTimer(true);
  const refs = useRef([]);

  // Auto-focus first box on mount
  useEffect(() => { refs.current[0]?.focus(); }, []);

  const handleChange = (i, val) => {
    const v = val.replace(/\D/g,'').slice(-1);
    const next = [...otp]; next[i] = v; setOtp(next);
    setHasErr(false);
    if (v && i < 3) refs.current[i+1]?.focus();
  };

  const handleKey = (i, e) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) {
      const next = [...otp]; next[i-1] = ''; setOtp(next);
      refs.current[i-1]?.focus();
    }
    if (e.key === 'Enter') handleVerify();
  };

  const handlePaste = e => {
    e.preventDefault();
    const p = e.clipboardData.getData('text').replace(/\D/g,'').slice(0,4);
    const next = [...otp];
    [...p].forEach((ch, j) => { if (j < 4) next[j] = ch; });
    setOtp(next);
    refs.current[Math.min(p.length, 3)]?.focus();
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length < 4) { setHasErr(true); setErrMsg('Please enter the 4-digit code'); return; }

    setHasErr(false); setVerifying(true);
    try {
      const user = await verifyOTP({ phone, code });
      setVerified(true);
      // Navigate after success animation
      setTimeout(() => goTo('dashboard', user?.firstName), 1400);
    } catch (err) {
      setHasErr(true);
      setErrMsg(err.message || 'Incorrect code — please try again');
      setOtp(['','','','']);
      refs.current[0]?.focus();
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    if (resending) return;
    setResending(true);
    setOtp(['','','','']);
    setHasErr(false);
    try {
      await resendOTP({ phone });
      reset();
      refs.current[0]?.focus();
    } catch (err) {
      setHasErr(true);
      setErrMsg(err.message || 'Failed to resend code. Please try again.');
    } finally {
      setResending(false);
    }
  };

  const displayPhone = `${countryCode || '+49'} ${phone || ''}`;

  return (
    <div className="pv-si" style={{position:'relative'}}>

      {/* Verified overlay */}
      {verified && (
        <div style={{
          position:'absolute',inset:0,zIndex:10,
          background:'rgba(255,255,255,.97)',backdropFilter:'blur(4px)',
          borderRadius:'inherit',
          display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',
          gap:14,textAlign:'center',
          animation:'pvFadeIn .3s ease both',
        }}>
          <div style={{
            width:72,height:72,borderRadius:22,
            background:'linear-gradient(135deg,rgba(42,158,98,.18),rgba(42,158,98,.08))',
            border:'2px solid rgba(42,158,98,.35)',
            display:'flex',alignItems:'center',justifyContent:'center',
            animation:'pvSuccessPop .4s cubic-bezier(.22,1,.36,1) both',
            boxShadow:'0 8px 28px rgba(42,158,98,.2)',
          }}>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.4" strokeLinecap="round">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
          </div>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:'1.2rem',fontWeight:400,color:'var(--ink)'}}>{t('auth.verified','Verified!')}</div>
          <div style={{fontSize:'.56rem',fontWeight:300,color:'var(--ink-3)',lineHeight:1.7}}>{t('auth.takingToVault','Taking you to your vault…')}</div>
          <div style={{width:48,height:3,borderRadius:4,background:'linear-gradient(90deg,var(--green),rgba(42,158,98,.3))',animation:'pvBarGrow .9s ease both'}}/>
        </div>
      )}

      <Brand/>

      <div className="pv-steps">
        <div className="pv-step d"/><div className="pv-step d"/><div className="pv-step a"/>
        <div className="pv-slbl">{t('auth.stepOf','Step 3 of 3')}</div>
      </div>

      <div className="pv-otp-head">
        <div className="pv-h-calm" style={{marginBottom:5}}>{t('auth.verifyNumber','Verify your number')}</div>
        <div className="pv-os">{t('auth.otpSentTo','We sent a 4-digit code to')}</div>
        <div className="pv-on">{displayPhone}</div>
      </div>

      <div className="pv-on2">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--rose-mid)" strokeWidth="2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        {t('auth.otpNote','Expires in 5 minutes · PediVault will never ask for this code')}
      </div>

      <div className="pv-obs" onPaste={handlePaste}>
        {[0,1,2,3].map(i => (
          <input key={i} ref={el => refs.current[i] = el}
            className={`pv-ob${otp[i] ? ' fi' : ''}${hasErr ? ' er' : ''}`}
            maxLength={1} type="text" inputMode="numeric" pattern="[0-9]"
            autoComplete="one-time-code"
            value={otp[i]}
            onChange={e => handleChange(i, e.target.value)}
            onKeyDown={e => handleKey(i, e)}
            disabled={verifying || verified}
          />
        ))}
      </div>

      {hasErr && (
        <div className="pv-oe">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          {errMsg}
        </div>
      )}

      <button type="button" className="pv-btn" style={{marginTop:18}} onClick={handleVerify} disabled={verifying || verified}>
        {verifying ? (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" style={{animation:'pvSpin 1s linear infinite'}}>
              <circle cx="12" cy="12" r="10" strokeOpacity=".25"/><path d="M12 2a10 10 0 0110 10"/>
            </svg>
            {t('auth.verifying','Verifying…')}
          </>
        ) : (
          <>{t('auth.verifyAndCont','Verify & Continue')} <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2"><path d="M20 6L9 17l-5-5"/></svg></>
        )}
      </button>

      <div className="pv-ors">
        {!done
          ? <span>{t('auth.resendIn','Resend code in')} <strong style={{color:'var(--rose-mid)',fontWeight:500}}>{secs}s</strong></span>
          : <span className="pv-lk" onClick={handleResend}>
              {resending ? t('auth.resending','Sending…') : t('auth.resendCode','Resend code →')}
            </span>
        }
      </div>
      <div className="pv-sw"><span className="pv-lk" onClick={() => goTo('create')}>{t('auth.backToSignIn','← Back')}</span></div>
    </div>
  );
}

export default OTP;
