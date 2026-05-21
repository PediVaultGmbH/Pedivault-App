export const SvgDefs = () => (
  <svg width="0" height="0" style={{position:'absolute',overflow:'hidden',pointerEvents:'none'}}>
    <defs>
      <radialGradient id="pvPetal" cx="35%" cy="20%" r="72%">
        <stop offset="0%"   stopColor="rgba(255,255,255,1)"/>
        <stop offset="50%"  stopColor="rgba(255,220,235,0.95)"/>
        <stop offset="100%" stopColor="rgba(248,190,215,0.85)"/>
      </radialGradient>
      <radialGradient id="pvCenter" cx="38%" cy="32%" r="65%">
        <stop offset="0%"   stopColor="rgba(255,255,255,0.98)"/>
        <stop offset="100%" stopColor="rgba(255,210,228,0.9)"/>
      </radialGradient>
    </defs>
  </svg>
);

export const Bg = () => (
  <>
    <div className="pv-lines"/>
    <div className="pv-dots"/>
    <div className="pv-glow gl1"/><div className="pv-glow gl2"/><div className="pv-glow gl3"/>
    <div className="pv-ring rg1"/><div className="pv-ring rg2"/><div className="pv-ring rg3"/>

    {/* Branches — lighter strokes for dark bg */}
    {[
      {cls:'br-tr',vb:'0 0 320 320',stroke:'rgba(255,200,220,.5)',sw:2,paths:["M280 12 C230 52,180 75,160 128 C140 178,156 216,122 256"],dots:[[228,34],[186,84],[145,136]]},
      {cls:'br-bl',vb:'0 0 260 260',stroke:'rgba(255,190,215,.45)',sw:1.8,paths:["M22 242 C58 204,92 178,118 144 C142 112,136 82,164 54"],dots:[[120,142],[156,100]]},
      {cls:'br-tl',vb:'0 0 190 190',stroke:'rgba(255,190,215,.35)',sw:1.5,paths:["M170 14 C140 44,116 68,100 104"],dots:[[126,60]]},
    ].map(({cls,vb,stroke,sw,paths,dots},bi)=>(
      <svg key={bi} className={`pv-branch ${cls}`} viewBox={vb} fill="none">
        {paths.map((d,pi)=><path key={pi} d={d} stroke={stroke} strokeWidth={sw} strokeLinecap="round"/>)}
        {dots.map(([x,y],di)=>(
          <g key={di} transform={`translate(${x},${y})`}>
            {[0,72,144,216,288].map((r,j)=><ellipse key={j} cx="0" cy="-5" rx="3" ry="4.4" fill="rgba(255,210,228,.7)" opacity={j%2===0?.85:.75} transform={`rotate(${r})`}/>)}
            <circle cx="0" cy="0" r="2.4" fill="rgba(255,240,248,.6)" stroke="rgba(255,190,215,.5)" strokeWidth="0.5"/>
          </g>
        ))}
      </svg>
    ))}

    {/* Petals — bright white-pink on dark */}
    {[
      {w:20,c1:'#fff',c2:'#FFB8D4'},{w:14,c1:'#fff',c2:'#FFCCE0'},
      {w:22,c1:'rgba(255,255,255,.9)',c2:'#FF9EBE'},{w:16,c1:'#fff',c2:'#FFD0E8'},
      {w:18,c1:'rgba(255,255,255,.85)',c2:'#FFA8CC'},{w:13,c1:'#fff',c2:'#FFBCD8'},
      {w:19,c1:'rgba(255,255,255,.9)',c2:'#FFB0CC'},{w:15,c1:'#fff',c2:'#FFD8EC'},
      {w:17,c1:'rgba(255,255,255,.85)',c2:'#FF9EC0'},{w:12,c1:'#fff',c2:'#FFBAD4'},
    ].map(({w,c1,c2},i)=>(
      <svg key={i} className={`pv-petal p${i+1}`} width={w} height={Math.round(w*.72)} viewBox={`0 0 ${w} ${Math.round(w*.72)}`}>
        <defs><radialGradient id={`pg${i}`} cx="40%" cy="30%" r="70%"><stop offset="0%" stopColor={c1} stopOpacity=".9"/><stop offset="100%" stopColor={c2} stopOpacity=".85"/></radialGradient></defs>
        <ellipse cx={w/2} cy={Math.round(w*.72)/2} rx={w/2-.5} ry={Math.round(w*.72)/2-.5} fill={`url(#pg${i})`}/>
      </svg>
    ))}
  </>
);
