export function ComingSoon({module}) {
  const labels={vaccines:'Vaccines',records:'Health Records',appointments:'Appointments',medications:'Medications',profile:'Child Profile','ai-assist':'AI Assistant',support:'Support',account:'My Account'};
  return (
    <div className="pv-page" style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'60vh'}}>
      <div style={{textAlign:'center'}}>
        <div style={{width:60,height:60,borderRadius:16,background:'var(--rose-pale)',border:'1px solid var(--rose-lt)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 18px'}}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--rose)" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M9 9h6M9 13h4"/></svg>
        </div>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:'1.35rem',fontWeight:400,color:'var(--ink)',marginBottom:7}}>{labels[module]||module}</div>
        <div style={{fontSize:'.58rem',fontWeight:300,color:'var(--ink-3)',maxWidth:280,lineHeight:1.75,margin:'0 auto'}}>This module is being built and will be ready in the next session.</div>
      </div>
    </div>
  );
}

export default ComingSoon;
