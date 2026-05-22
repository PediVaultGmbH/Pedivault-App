import { useState, useRef, useEffect } from 'react';
import Brand from '../ui/Brand';
import { Eye } from '../ui/Logo';
import { pwdStrength } from '../../../utils/passwordStrength';
import { register } from '../../../api/auth.api';

const COUNTRIES = [
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
  {flag:'🇬🇧',code:'+44',name:'UK'},
  {flag:'🇨🇭',code:'+41',name:'Switzerland'},
  {flag:'🇳🇴',code:'+47',name:'Norway'},
  {flag:'🇷🇸',code:'+381',name:'Serbia'},
  {flag:'🇦🇱',code:'+355',name:'Albania'},
  {flag:'🇧🇦',code:'+387',name:'Bosnia'},
  {flag:'🇲🇰',code:'+389',name:'North Macedonia'},
  {flag:'🇲🇪',code:'+382',name:'Montenegro'},
  {flag:'🇺🇦',code:'+380',name:'Ukraine'},
  {flag:'🇧🇾',code:'+375',name:'Belarus'},
  {flag:'🇷🇺',code:'+7',name:'Russia'},
  {flag:'🇦🇪',code:'+971',name:'UAE'},
  {flag:'🇸🇦',code:'+966',name:'Saudi Arabia'},
  {flag:'🇶🇦',code:'+974',name:'Qatar'},
  {flag:'🇧🇭',code:'+973',name:'Bahrain'},
  {flag:'🇰🇼',code:'+965',name:'Kuwait'},
  {flag:'🇴🇲',code:'+968',name:'Oman'},
  {flag:'🇯🇴',code:'+962',name:'Jordan'},
  {flag:'🇱🇧',code:'+961',name:'Lebanon'},
  {flag:'🇮🇱',code:'+972',name:'Israel'},
  {flag:'🇮🇶',code:'+964',name:'Iraq'},
  {flag:'🇮🇷',code:'+98',name:'Iran'},
  {flag:'🇸🇾',code:'+963',name:'Syria'},
  {flag:'🇾🇪',code:'+967',name:'Yemen'},
  {flag:'🇹🇷',code:'+90',name:'Turkey'},
  {flag:'🇲🇦',code:'+212',name:'Morocco'},
  {flag:'🇩🇿',code:'+213',name:'Algeria'},
  {flag:'🇹🇳',code:'+216',name:'Tunisia'},
  {flag:'🇱🇾',code:'+218',name:'Libya'},
  {flag:'🇪🇬',code:'+20',name:'Egypt'},
  {flag:'🇳🇬',code:'+234',name:'Nigeria'},
  {flag:'🇬🇭',code:'+233',name:'Ghana'},
  {flag:'🇰🇪',code:'+254',name:'Kenya'},
  {flag:'🇹🇿',code:'+255',name:'Tanzania'},
  {flag:'🇪🇹',code:'+251',name:'Ethiopia'},
  {flag:'🇸🇩',code:'+249',name:'Sudan'},
  {flag:'🇿🇦',code:'+27',name:'South Africa'},
  {flag:'🇵🇰',code:'+92',name:'Pakistan'},
  {flag:'🇮🇳',code:'+91',name:'India'},
  {flag:'🇧🇩',code:'+880',name:'Bangladesh'},
  {flag:'🇱🇰',code:'+94',name:'Sri Lanka'},
  {flag:'🇳🇵',code:'+977',name:'Nepal'},
  {flag:'🇨🇳',code:'+86',name:'China'},
  {flag:'🇯🇵',code:'+81',name:'Japan'},
  {flag:'🇰🇷',code:'+82',name:'South Korea'},
  {flag:'🇲🇾',code:'+60',name:'Malaysia'},
  {flag:'🇸🇬',code:'+65',name:'Singapore'},
  {flag:'🇮🇩',code:'+62',name:'Indonesia'},
  {flag:'🇵🇭',code:'+63',name:'Philippines'},
  {flag:'🇹🇭',code:'+66',name:'Thailand'},
  {flag:'🇻🇳',code:'+84',name:'Vietnam'},
  {flag:'🇺🇿',code:'+998',name:'Uzbekistan'},
  {flag:'🇰🇿',code:'+7',name:'Kazakhstan'},
  {flag:'🇦🇿',code:'+994',name:'Azerbaijan'},
  {flag:'🇦🇲',code:'+374',name:'Armenia'},
  {flag:'🇬🇪',code:'+995',name:'Georgia'},
  {flag:'🇺🇸',code:'+1',name:'USA'},
  {flag:'🇨🇦',code:'+1',name:'Canada'},
  {flag:'🇲🇽',code:'+52',name:'Mexico'},
  {flag:'🇧🇷',code:'+55',name:'Brazil'},
  {flag:'🇦🇷',code:'+54',name:'Argentina'},
  {flag:'🇨🇴',code:'+57',name:'Colombia'},
  {flag:'🇦🇺',code:'+61',name:'Australia'},
  {flag:'🇳🇿',code:'+64',name:'New Zealand'},
];

function CountryPicker({ value, onChange }) {
  const [open, setOpen]     = useState(false);
  const [search, setSearch] = useState('');
  const ref                 = useRef(null);
  const searchRef           = useRef(null);
  const selected            = COUNTRIES.find(c => c.code === value) || COUNTRIES[0];
  const filtered            = COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.code.includes(search)
  );

  useEffect(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 50);
    else setSearch('');
  }, [open]);

  return (
    <div ref={ref} style={{ position:'relative', flexShrink:0 }}>
      <button type="button" onClick={() => setOpen(o => !o)}
        style={{ height:44, width:96, border:'1.5px solid var(--auth-line)', borderRadius:11, padding:'0 8px 0 10px', fontFamily:"'DM Sans',sans-serif", fontSize:'.65rem', color:'var(--ink)', background:'rgba(255,255,255,.8)', outline:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'space-between', gap:4 }}>
        <span style={{ fontSize:'1rem' }}>{selected.flag}</span>
        <span style={{ fontSize:'.65rem', fontWeight:500 }}>{selected.code}</span>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--ink-3)" strokeWidth="2.5"
          style={{ transform: open ? 'rotate(180deg)' : 'none', transition:'transform .2s', flexShrink:0 }}>
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      {open && (
        <div style={{ position:'absolute', top:'100%', left:0, zIndex:9999, background:'#fff', border:'1.5px solid var(--auth-line)', borderRadius:12, boxShadow:'0 8px 32px rgba(0,0,0,.15)', width:220, maxHeight:260, display:'flex', flexDirection:'column', overflow:'hidden', marginTop:4 }}>
          <div style={{ padding:'8px 10px', borderBottom:'1px solid var(--auth-line)' }}>
            <input ref={searchRef} value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search country…"
              style={{ width:'100%', border:'1px solid var(--auth-line)', borderRadius:8, padding:'6px 10px', fontSize:'.6rem', fontFamily:"'DM Sans',sans-serif", outline:'none', background:'var(--cream-2)', boxSizing:'border-box' }}/>
          </div>
          <div style={{ overflowY:'auto', flex:1 }}>
            {filtered.length === 0 ? (
              <div style={{ padding:'12px', textAlign:'center', fontSize:'.56rem', color:'var(--ink-3)' }}>No results</div>
            ) : filtered.map(c => (
              <div key={c.code + c.name} onClick={() => { onChange(c.code); setOpen(false); }}
                style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 12px', cursor:'pointer', transition:'background .1s',
                  background: c.code === value && c.name === selected.name ? 'var(--rose-pale)' : 'transparent' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--cream-2)'}
                onMouseLeave={e => e.currentTarget.style.background = c.code === value && c.name === selected.name ? 'var(--rose-pale)' : 'transparent'}>
                <span style={{ fontSize:'1rem' }}>{c.flag}</span>
                <span style={{ fontSize:'.6rem', color:'var(--ink)', flex:1 }}>{c.name}</span>
                <span style={{ fontSize:'.58rem', color:'var(--ink-3)', fontWeight:500 }}>{c.code}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

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
          <CountryPicker value={f.country} onChange={code => setF(p => ({ ...p, country: code }))}/>
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
