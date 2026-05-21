export function SkeletonHome() {
  const Bone = ({w='100%',h=12,r=6,mb=0}) => (
    <div className="pv-skeleton" style={{width:w,height:h,borderRadius:r,marginBottom:mb}}/>
  );
  return (
    <div className="pv-page">
      {/* Stat strip */}
      <div className="pv-skel-strip">
        {[0,1,2,3].map(i=>(
          <div key={i} className="pv-skel-card">
            <Bone w="50%" h={9} mb={10}/>
            <Bone w="65%" h={28} r={4} mb={10}/>
            <Bone w="80%" h={18} r={20}/>
          </div>
        ))}
      </div>
      {/* Two col */}
      <div className="two-col">
        {[0,1].map(i=>(
          <div key={i} className="pv-skel-card" style={{minHeight:180}}>
            <div className="pv-skel-row"><Bone w={36} h={36} r={9}/><div style={{flex:1}}><Bone w="60%" h={9} mb={6}/><Bone w="80%" h={12}/></div></div>
            <div style={{marginTop:14}}><Bone h={4} mb={12} r={2}/></div>
            <Bone h={9} mb={8}/><Bone h={9} w="80%"/>
          </div>
        ))}
      </div>
      {/* Three col */}
      <Bone w="35%" h={14} r={4} mb={12}/>
      <div className="three-col">
        {[0,1,2].map(i=>(
          <div key={i} className="pv-skel-card" style={{minHeight:110}}>
            <Bone w="100%" h={2} r={0} mb={12}/>
            <div className="pv-skel-row"><Bone w={26} h={26} r={7}/><Bone w={50} h={16} r={20}/></div>
            <Bone w="70%" h={11} mb={6}/><Bone w="90%" h={9} mb={10}/><Bone w="50%" h={9}/>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SkeletonHome;
