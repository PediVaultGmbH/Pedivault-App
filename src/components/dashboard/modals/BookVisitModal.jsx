import { useState } from 'react';
import Modal from '../ui/Modal';
import ModalSuccess from '../ui/ModalSuccess';
import CalendarPicker from '../ui/CalendarPicker';
import TimePicker from '../ui/TimePicker';
import { useFormValidation } from '../../../hooks/useFormValidation';
import { useLoading } from '../../../hooks/useLoading';
import XBtn from '../ui/XBtn';
import FieldErr from '../ui/FieldErr';

export function BookVisitModal({open,onClose,onSuccess}) {
  const [f,setF] = useState({type:'Vaccination',doctor:'',date:'',time:'',notes:''});
  const [done, setDone] = useState(false);
  const {errors,validate,clearError} = useFormValidation({
    doctor:{required:true,message:'Please enter doctor or clinic name'},
    date:{required:true,message:'Please select a date'},
    time:{required:true,message:'Please select a time slot'},
  });
  const {loading,run} = useLoading(1200);
  const set = k=>e=>{ setF(p=>({...p,[k]:e.target.value})); clearError(k); };

  const submit = () => {
    if (!validate(f)) return;
    run(async () => {
      const entry = {type:f.type, doctor:f.doctor, date:f.date, time:f.time, notes:f.notes};
      await onSuccess(entry);
      setDone(true);
      setTimeout(() => {
        onClose(); setDone(false); setF({type:'Vaccination',doctor:'',date:'',time:'',notes:''});
      }, 1400);
    });
  };

  const handleClose = () => { if(!loading){ onClose(); setTimeout(()=>{setDone(false); setF({type:'Vaccination',doctor:'',date:'',time:'',notes:''});},300); }};

  if (done) return (
    <Modal open={open} onClose={handleClose} maxWidth={520}>
      <ModalSuccess color="var(--blue)"
        icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="M9 14l2 2 4-4"/></svg>}
        title="Appointment booked!"
        sub={`Your visit has been scheduled for ${f.date ? new Date(f.date).toLocaleDateString('en-DE',{day:'numeric',month:'long',year:'numeric'}) : '—'} at ${f.time}.\nYou'll receive a reminder before your appointment.`}
      />
    </Modal>
  );

  return (
    <Modal open={open} onClose={handleClose} maxWidth={520}>
      <div className="pv-mhdr">
        <div className="pv-mhdr-accent" style={{background:'linear-gradient(90deg,var(--blue),rgba(52,120,176,.5))'}}/>
        <div className="pv-mhdr-eyebrow">Schedule</div>
        <div className="pv-mhdr-title">Book a Visit</div>
        <div className="pv-mhdr-sub">Schedule an appointment with your paediatrician</div>
        <XBtn onClick={handleClose}/>
      </div>
      <div className="pv-mbody">
        <div className="fr">
          <div className="fg"><label className="fl">Visit type</label>
            <select className="fi" style={{cursor:'pointer'}} value={f.type} onChange={set('type')}>
              <option>Vaccination</option><option>General Check-up</option><option>U-Untersuchung</option>
              <option>Sick Visit</option><option>Growth Check</option><option>Other</option>
            </select>
          </div>
          <div className="fg">
            <label className="fl">Doctor / Clinic</label>
            <input className={`fi${errors.doctor?' err':''}`} placeholder="Dr. Priya Mehta · Fortis" value={f.doctor} onChange={set('doctor')}/>
            <FieldErr msg={errors.doctor}/>
          </div>
        </div>
        <div className="fg">
          <label className="fl">Select date {errors.date&&<span style={{color:'#B82810',textTransform:'none',letterSpacing:0}}>— {errors.date}</span>}</label>
          <div className={errors.date?'err-wrap':''} style={{borderRadius:11,outline:errors.date?'2px solid rgba(185,40,20,.25)':'none'}}>
            <CalendarPicker value={f.date} onChange={d=>{setF(p=>({...p,date:d}));clearError('date');}}/>
          </div>
        </div>
        <div className="fg" style={{marginTop:10}}>
          <label className="fl">Select time {errors.time&&<span style={{color:'#B82810',textTransform:'none',letterSpacing:0}}>— {errors.time}</span>}</label>
          <div style={{borderRadius:11,outline:errors.time?'2px solid rgba(185,40,20,.25)':'none'}}>
            <TimePicker value={f.time} onChange={t=>{setF(p=>({...p,time:t}));clearError('time');}}/>
          </div>
        </div>
        <div className="fg" style={{marginTop:10}}><label className="fl">Notes <span>(optional)</span></label><textarea className="ft" placeholder="e.g. MMR Dose 1 due, bring vaccination booklet" value={f.notes} onChange={set('notes')}/></div>
      </div>
      <div className="pv-mfoot">
        <button type="button" className="fb fb-g" onClick={handleClose} disabled={loading}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          Cancel
        </button>
        <button type="button" className={`fb fb-p${loading?' fb-loading':''}`} onClick={submit}>
          {loading ? <><div className="pv-spinner"/>&nbsp;Booking…</> : <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>Book Appointment</>}
        </button>
      </div>
    </Modal>
  );
}

export default BookVisitModal;
