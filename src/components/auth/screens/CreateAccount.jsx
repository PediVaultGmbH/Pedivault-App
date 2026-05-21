import { useState } from 'react';
import Brand from '../ui/Brand';
import { Eye } from '../ui/Logo';
import { pwdStrength } from '../../../utils/passwordStrength';
import { register } from '../../../api/auth.api';

export function CreateAccount({ goTo }) {
  const [f, setF]         = useState({ fname:'', lname:'', email:'', phone:'', pwd:'', country:'+49' });
  const [show, setShow]   = useState(false);
  const [chk, setChk]     = useState(false);
  const [err, setErr]     = useState('');
  const [loading, setLoading] = useState(false);
  const str = pwdStrength(f.pwd);
  const set = k => e => setF(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async () => {
    if (!f.fname || !f.lname || !f.email || !f.phone || !f.pwd) { setErr('Please fill in all fields.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) { setErr('Please enter a valid email address.'); return; }
    if (f.phone.replace(/\s/g,'').length < 6) { setErr('Please enter a valid phone number.'); return; }
    if (f.pwd.length < 8) { setErr('Password must be at least 8 characters.'); return; }
    if (!chk) { setErr('Please agree to the Terms of Service.'); return; }

    setErr(''); setLoading(true);
    try {
      await register({
        firstName:   f.fname,
        lastName:    f.lname,
        email:       f.email,
        phone:       f.phone.replace(/\s/g, ''),
        countryCode: f.country,
        password:    f.pwd,
      });
      // Pass phone + countryCode to OTP screen so it knows where to verify
      goTo('otp', f.fname, { phone: f.phone.replace(/\s/g, ''), countryCode: f.country });
    } catch (err) {
      setErr(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onKey = e => { if (e.key === 'Enter') handleSubmit(); };

  return (
    <div className="pv-si">
      <Brand/>
      <div className="pv-h-calm">Create your account</div>
      <div className="pv-s">Start managing your child's health in minutes</div>
      {err && <div className="pv-err">{err}</div>}
      <div className="pv-r2">
        <div className="pv-f"><label className="pv-lbl">First name</label><input className="pv-in" type="text" placeholder="Lena" value={f.fname} onChange={set('fname')}/></div>
        <div className="pv-f"><label className="pv-lbl">Last name</label><input className="pv-in" type="text" placeholder="Müller" value={f.lname} onChange={set('lname')}/></div>
      </div>
      <div className="pv-f">
        <label className="pv-lbl">Email address</label>
        <input className="pv-in" type="email" autoComplete="email" placeholder="you@example.com" value={f.email} onChange={set('email')} onKeyDown={onKey}/>
      </div>
      <div className="pv-f">
        <label className="pv-lbl">Mobile number</label>
        <div className="pv-phrow">
          <div style={{position:'relative',flexShrink:0}}>
            <select
              value={f.country}
              onChange={e => setF(p => ({ ...p, country: e.target.value }))}
              style={{height:44,width:96,border:'1.5px solid var(--auth-line)',borderRadius:11,padding:'0 8px 0 10px',fontFamily:"'DM Sans',sans-serif",fontSize:'.65rem',color:'var(--ink)',background:'rgba(255,255,255,.8)',outline:'none',cursor:'pointer',appearance:'none',WebkitAppearance:'none',paddingRight:22}}
            >
              {[
                {flag:'🇩🇪',code:'+49',name:'Germany'},
                {flag:'🇦🇹',code:'+43',name:'Austria'},
                {flag:'🇧🇪',code:'+32',name:'Belgium'},
                {flag:'🇧🇬',code:'+359',name:'Bulgaria'},
                {flag:'🇭🇷',code:'+385',name:'Croatia'},
                {flag:'🇨🇾',code:'+357',name:'Cyprus'},
                {flag:'🇨🇿',code:'+420',name:'Czechia'},
                {flag:'🇩🇰',code:'+45',name:'Denmark'},
                {flag:'🇪🇪',code:'+372',name:'Estonia'},
                {flag:'🇫🇮',code:'+358',name:'Finland'},
                {flag:'🇫🇷',code:'+33',name:'France'},
                {flag:'🇬🇷',code:'+30',name:'Greece'},
                {flag:'🇭🇺',code:'+36',name:'Hungary'},
                {flag:'🇮🇪',code:'+353',name:'Ireland'},
                {flag:'🇮🇹',code:'+39',name:'Italy'},
                {flag:'🇱🇻',code:'+371',name:'Latvia'},
                {flag:'🇱🇹',code:'+370',name:'Lithuania'},
                {flag:'🇱🇺',code:'+352',name:'Luxembourg'},
                {flag:'🇲🇹',code:'+356',name:'Malta'},
                {flag:'🇳🇱',code:'+31',name:'Netherlands'},
                {flag:'🇵🇱',code:'+48',name:'Poland'},
                {flag:'🇵🇹',code:'+351',name:'Portugal'},
                {flag:'🇷🇴',code:'+40',name:'Romania'},
                {flag:'🇸🇰',code:'+421',name:'Slovakia'},
                {flag:'🇸🇮',code:'+386',name:'Slovenia'},
                {flag:'🇪🇸',code:'+34',name:'Spain'},
                {flag:'🇸🇪',code:'+46',name:'Sweden'},
              ].map(c => (
                <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
              ))}
            </select>
            <svg style={{position:'absolute',right:7,top:'50%',transform:'translateY(-50%)',pointerEvents:'none'}} width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--ink-3)" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
          <input className="pv-in" style={{flex:1}} type="tel" placeholder="151 0000 0000" value={f.phone} onChange={set('phone')} onKeyDown={onKey}/>
        </div>
      </div>
      <div className="pv-f">
        <label className="pv-lbl">Password</label>
        <div className="pv-iw">
          <input className="pv-in ir" type={show ? 'text' : 'password'} placeholder="Min. 8 characters" autoComplete="new-password" value={f.pwd} onChange={set('pwd')} onKeyDown={onKey}/>
          <span className="pv-ir" onClick={() => setShow(!show)}><Eye open={show}/></span>
        </div>
        {f.pwd && str && (
          <div className="pv-str">
            <div className="pv-str-bars">
              {[0,1,2,3].map(i => (
                <div key={i} className="pv-str-seg" style={{background: i < str.score ? str.color : 'var(--auth-line)'}}/>
              ))}
            </div>
            <div className="pv-str-meta">
              <span className="pv-str-label" style={{color:str.color}}>{str.label}</span>
              <span className="pv-str-hint">{str.hint}</span>
            </div>
          </div>
        )}
      </div>
      <div className="pv-tr">
        <div className={`pv-ck${chk ? ' on' : ''}`} onClick={() => setChk(!chk)}>
          {chk && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>}
        </div>
        <div className="pv-tt">I agree to the <span className="pv-lk">Terms of Service</span> and <span className="pv-lk">Privacy Policy</span>. PediVault encrypts all health data per GDPR (EU) 2016/679.</div>
      </div>
      <button type="button" className="pv-btn" disabled={loading} onClick={handleSubmit}>
        {loading
          ? <><div className="pv-btn-spin"/>Sending code…</>
          : <>Send OTP & Continue <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></>
        }
      </button>
      <div className="pv-sw">Already have an account? <span className="pv-lk" onClick={() => goTo('signin')}>← Sign in</span></div>
    </div>
  );
}

export default CreateAccount;
