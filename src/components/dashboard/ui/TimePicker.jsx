const TIME_SLOTS = ['08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30','12:00','14:00','14:30','15:00','15:30','16:00','16:30','17:00'];

export function TimePicker({value,onChange}) {
  return (
    <div style={{border:'1.5px solid rgba(155,58,86,.14)',borderRadius:11,overflow:'hidden',background:'var(--white)'}}>
      <div className="pv-time-row">
        <div className="pv-time-label">Time</div>
        <div className="pv-time-slots">
          {TIME_SLOTS.map(t=>(
            <div key={t} className={`pv-time-slot${value===t?' sel':''}`} onClick={()=>onChange(t)}>{t}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TimePicker;
