import { useState } from 'react';

const MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS=['Su','Mo','Tu','We','Th','Fr','Sa'];

export function CalendarPicker({value,onChange}) {
  const now = new Date();
  const [yr,setYr] = useState(now.getFullYear());
  const [mo,setMo] = useState(now.getMonth());
  const firstDay = new Date(yr,mo,1).getDay();
  const daysInMonth = new Date(yr,mo+1,0).getDate();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;

  const nav = d=>{
    let nm=mo+d, ny=yr;
    if(nm<0){nm=11;ny--;}if(nm>11){nm=0;ny++;}
    setMo(nm);setYr(ny);
  };

  return (
    <div style={{border:'1.5px solid rgba(155,58,86,.14)',borderRadius:11,overflow:'hidden',background:'var(--white)'}}>
      <div className="pv-cal-nav">
        <button className="pv-cal-nav-btn" onClick={()=>nav(-1)} aria-label="Previous month" type="button"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--ink-2)" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg></button>
        <span className="pv-cal-month">{MONTHS[mo]} {yr}</span>
        <button className="pv-cal-nav-btn" onClick={()=>nav(1)} aria-label="Next month" type="button"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--ink-2)" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg></button>
      </div>
      <div className="pv-cal-grid">
        {DAYS.map(d=><div key={d} className="pv-cal-dname">{d}</div>)}
        {Array(firstDay).fill(0).map((_,i)=><div key={`e${i}`} className="pv-cal-day empty"/>)}
        {Array(daysInMonth).fill(0).map((_,i)=>{
          const d = i+1;
          const ds = `${yr}-${String(mo+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
          const isToday = ds===todayStr;
          const isSel = value===ds;
          return <div key={d} className={`pv-cal-day${isToday?' today':''}${isSel?' sel':''}`} onClick={()=>onChange(ds)}>{d}</div>;
        })}
      </div>
    </div>
  );
}

export default CalendarPicker;
