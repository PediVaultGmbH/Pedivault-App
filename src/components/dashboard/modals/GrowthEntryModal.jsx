import { useState } from 'react';
import Modal from '../ui/Modal';
import ModalSuccess from '../ui/ModalSuccess';
import { useFormValidation } from '../../../hooks/useFormValidation';
import { useLoading } from '../../../hooks/useLoading';
import XBtn from '../ui/XBtn';
import CalendarPicker from '../ui/CalendarPicker';
import FieldErr from '../ui/FieldErr';

export function GrowthEntryModal({open,onClose,onSuccess}) {
  const [f,setF] = useState({date:'',weight:'',height:'',head:'',doctor:''});
  const [done,setDone] = useState(false);
  const {errors,validate,clearError} = useFormValidation({
    date:{required:true,message:'Please select the date'},
    weight:{required:true,message:'Weight is required'},
  });
  const {loading,run} = useLoading(1000);
  const set = k=>e=>{ setF(p=>({...p,[k]:e.target.value})); clearError(k); };

  const submit = () => {
    if(!validate(f)) return;
    run(async ()=>{
      const entry = {
        date: f.date,
        weight: f.weight ? parseFloat(f.weight) : null,
        height: f.height ? parseFloat(f.height) : null,
        head:   f.head   ? parseFloat(f.head)   : null,
        by: f.doctor || 'Self-recorded',
      };
      await onSuccess(entry);
      setDone(true);
      setTimeout(()=>{
        onClose(); setDone(false); setF({date:'',weight:'',height:'',head:'',doctor:''});
      }, 1400);
    });
  };

  const handleClose = ()=>{ if(!loading){ onClose(); setTimeout(()=>setDone(false),300); }};

  if(done) return (
    <Modal open={open} onClose={handleClose} maxWidth={500}>
      <ModalSuccess color="var(--green)"
        icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="1.8" strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>}
        title="Measurement saved!"
        sub={`${f.weight} kg recorded on ${f.date ? new Date(f.date).toLocaleDateString('en-DE',{day:'numeric',month:'long',year:'numeric'}) : '—'}.\nGrowth chart has been updated.`}/>
    </Modal>
  );

  return (
    <Modal open={open} onClose={handleClose} maxWidth={500}>
      <div className="pv-mhdr">
        
        <div className="pv-mhdr-eyebrow">Growth Tracking</div>
        <div className="pv-mhdr-title">Add Measurement</div>
        <div className="pv-mhdr-sub">Record your child's latest growth measurements</div>
        <XBtn onClick={handleClose}/>
      </div>
      <div className="pv-mbody">
        <div className="fg">
          <label className="fl">Date measured {errors.date&&<span style={{color:'#B82810',textTransform:'none',letterSpacing:0}}>— {errors.date}</span>}</label>
          <div style={{borderRadius:11,outline:errors.date?'2px solid rgba(185,40,20,.25)':'none'}}>
            <CalendarPicker value={f.date} onChange={d=>{setF(p=>({...p,date:d}));clearError('date');}}/>
          </div>
        </div>
        <div className="fr" style={{marginTop:10}}>
          <div className="fg">
            <label className="fl">Weight (kg)</label>
            <input className={`fi${errors.weight?' err':''}`} type="number" step="0.1" placeholder="12.4" value={f.weight} onChange={set('weight')}/>
            <FieldErr msg={errors.weight}/>
          </div>
          <div className="fg"><label className="fl">Height (cm)</label><input className="fi" type="number" step="0.1" placeholder="89" value={f.height} onChange={set('height')}/></div>
        </div>
        <div className="fr">
          <div className="fg"><label className="fl">Head circ. (cm) <span>(opt.)</span></label><input className="fi" type="number" step="0.1" placeholder="47" value={f.head} onChange={set('head')}/></div>
          <div className="fg"><label className="fl">Recorded by</label><input className="fi" placeholder="Dr. Kavita Singh" value={f.doctor} onChange={set('doctor')}/></div>
        </div>
      </div>
      <div className="pv-mfoot">
        <button type="button" className="fb fb-g" onClick={handleClose} disabled={loading}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>Cancel</button>
        <button type="button" className={`fb fb-p${loading?' fb-loading':''}`} onClick={submit}>
          {loading?<><div className="pv-spinner"/>&nbsp;Saving…</>:<><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>Save Measurement</>}
        </button>
      </div>
    </Modal>
  );
}

export default GrowthEntryModal;
