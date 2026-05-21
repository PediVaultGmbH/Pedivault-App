export const PanIco = ({d,d2,circle,rect,poly,line,path2}) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,220,232,.8)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {d&&<path d={d}/>}{d2&&<path d={d2}/>}{circle&&<circle {...circle}/>}
    {rect&&<rect {...rect}/>}{poly&&<polyline points={poly}/>}
    {line&&line.map((l,i)=><line key={i} {...l}/>)}{path2&&<path d={path2}/>}
  </svg>
);

export const SecItem = ({icon,title,sub}) => (
  <div className="pan-sec-item">
    <div className="pan-sec-ico">{icon}</div>
    <div style={{flex:1,minWidth:0}}>
      <div className="pan-sec-title">{title}</div>
      <div className="pan-sec-sub">{sub}</div>
    </div>
    <div className="pan-check"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(100,220,140,.85)" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg></div>
  </div>
);

export const FeatItem = ({icon,title,sub}) => (
  <div className="pan-item">
    <div className="pan-ico">{icon}</div>
    <div><div className="pan-item-title">{title}</div><div className="pan-item-sub">{sub}</div></div>
  </div>
);


export const StepItem = ({n,title,sub,done}) => (
  <div style={{display:'flex',alignItems:'flex-start',gap:12}}>
    <div style={{width:24,height:24,borderRadius:'50%',background:done?'rgba(100,220,140,.15)':'rgba(255,255,255,.08)',border:`1px solid ${done?'rgba(100,220,140,.3)':'rgba(255,255,255,.12)'}`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,marginTop:1}}>
      {done
        ? <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(100,220,140,.9)" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
        : <span style={{fontSize:'.44rem',fontWeight:600,color:'rgba(255,240,248,.6)'}}>{n}</span>}
    </div>
    <div><div className="pan-item-title">{title}</div><div className="pan-item-sub">{sub}</div></div>
  </div>
);
