export function pwdStrength(v) {
  if (!v) return null;
  let s = 0;
  if (v.length >= 8) s++;
  if (/[A-Z]/.test(v)) s++;
  if (/[0-9]/.test(v)) s++;
  if (/[^A-Za-z0-9]/.test(v)) s++;
  const levels = [
    {label:'Too weak', color:'#B82810', hint:'Add more characters'},
    {label:'Weak',     color:'#B82810', hint:'Add uppercase & numbers'},
    {label:'Fair',     color:'#BA7018', hint:'Add a special character'},
    {label:'Strong',   color:'#2A9E62', hint:'Great password!'},
    {label:'Very strong', color:'#2A9E62', hint:'Excellent!'},
  ];
  const idx = Math.min(s, 4);
  return { score:s, ...levels[idx] };
}

