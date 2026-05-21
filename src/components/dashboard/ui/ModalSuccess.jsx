export function ModalSuccess({color='var(--green)', icon, title, sub}) {
  return (
    <div className="pv-modal-success">
      {/* Decorative dots */}
      {[[12,18,'var(--rose-lt)',.6],[88,14,'var(--green-lt)',.5],[8,72,'var(--blue-lt)',.4],[90,75,'var(--amber-lt)',.5]].map(([x,y,c,o],i)=>(
        <div key={i} style={{position:'absolute',left:`${x}%`,top:`${y}%`,width:8,height:8,borderRadius:'50%',background:c,opacity:o,animation:`fadeUp .4s ${i*.08}s ease both`,pointerEvents:'none'}}/>
      ))}
      <div className="pv-modal-success-icon" style={{background:`linear-gradient(135deg,${color}22,${color}10)`,border:`2px solid ${color}30`,color}}>
        {icon}
      </div>
      <div className="pv-modal-success-title">{title}</div>
      <div className="pv-modal-success-sub">{sub}</div>
      <div style={{width:40,height:3,borderRadius:4,background:`linear-gradient(90deg,${color},${color}40)`,marginTop:4,animation:'fadeUp .4s .3s ease both'}}/>
    </div>
  );
}

export default ModalSuccess;
