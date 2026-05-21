import { useState } from 'react';
import Modal from '../ui/Modal';
import ModalSuccess from '../ui/ModalSuccess';
import FieldErr from '../ui/FieldErr';
import { useFormValidation } from '../../../hooks/useFormValidation';
import { useLoading } from '../../../hooks/useLoading';
import XBtn from '../ui/XBtn';

export function AddMedicationModal({open,onClose,onSuccess}) {
  const empty = {name:'',type:'Antibiotic',dosage:'',frequency:'Twice daily',duration:'5 days',startDate:'',doctor:'',notes:''};
  const [f,setF] = useState(empty);
  const [done,setDone] = useState(false);
  const {errors,validate,clearError} = useFormValidation({
    name:   {required:true, message:'Please enter the medication name'},
    dosage: {required:true, message:'Please enter the dosage'},
  });
  const {loading,run} = useLoading(1000);
  const set = k=>e=>{ setF(p=>({...p,[k]:e.target.value})); clearError(k); };

  const submit = ()=>{
    if(!validate(f)) return;
    run(async ()=>{
      const entry = {...f, id:`med-${Date.now()}`, status:'active', addedAt:Date.now()};
      await onSuccess(entry);
      setDone(true);
      setTimeout(()=>{
        onClose(); setDone(false); setF(empty);
      },1400);
    });
  };

  const handleClose = ()=>{ if(!loading){ onClose(); setTimeout(()=>{setDone(false);setF(empty);},300); }};

  if(done) return (
    <Modal open={open} onClose={handleClose} maxWidth={480}>
      <ModalSuccess color="var(--green)"
        icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="1.8" strokeLinecap="round"><path d="M10.5 20.5L3.5 13.5a5 5 0 017.07-7.07l7 7a5 5 0 01-7.07 7.07z"/><line x1="14" y1="7" x2="7" y2="14"/></svg>}
        title="Medication added!"
        sub={`${f.name} ${f.dosage} has been added.\nReminder schedule is now active.`}/>
    </Modal>
  );

  return (
    <Modal open={open} onClose={handleClose} maxWidth={480}>
      <div className="pv-mhdr">
        <div className="pv-mhdr-accent" style={{background:'linear-gradient(90deg,var(--green),rgba(42,158,98,.4))'}}/>
        <div className="pv-mhdr-eyebrow">Medications</div>
        <div className="pv-mhdr-title">Add Medication</div>
        <div className="pv-mhdr-sub">Log a prescribed or ongoing medication</div>
        <XBtn onClick={handleClose}/>
      </div>
      <div className="pv-mbody">
        <div className="fr">
          <div className="fg">
            <label className="fl">Medication name</label>
            <input className={`fi${errors.name?' err':''}`} placeholder="e.g. Amoxicillin" value={f.name} onChange={set('name')}/>
            <FieldErr msg={errors.name}/>
          </div>
          <div className="fg">
            <label className="fl">Type</label>
            <select className="fi" style={{cursor:'pointer'}} value={f.type} onChange={set('type')}>
              <option>Antibiotic</option><option>Painkiller</option><option>Vitamin</option>
              <option>Antihistamine</option><option>Probiotic</option><option>Antiviral</option>
              <option>Steroid</option><option>Other</option>
            </select>
          </div>
        </div>
        <div className="fr">
          <div className="fg">
            <label className="fl">Dosage</label>
            <input className={`fi${errors.dosage?' err':''}`} placeholder="e.g. 5ml or 400IU" value={f.dosage} onChange={set('dosage')}/>
            <FieldErr msg={errors.dosage}/>
          </div>
          <div className="fg">
            <label className="fl">Frequency</label>
            <select className="fi" style={{cursor:'pointer'}} value={f.frequency} onChange={set('frequency')}>
              <option>Once daily</option><option>Twice daily</option><option>Three times daily</option>
              <option>Four times daily</option><option>As needed</option><option>Weekly</option><option>Other</option>
            </select>
          </div>
        </div>
        <div className="fr">
          <div className="fg">
            <label className="fl">Duration</label>
            <select className="fi" style={{cursor:'pointer'}} value={f.duration} onChange={set('duration')}>
              <option>3 days</option><option>5 days</option><option>7 days</option><option>10 days</option>
              <option>14 days</option><option>1 month</option><option>3 months</option>
              <option>Ongoing</option><option>As needed</option>
            </select>
          </div>
          <div className="fg">
            <label className="fl">Start date <span>(optional)</span></label>
            <input className="fi" type="date" value={f.startDate} onChange={set('startDate')}/>
          </div>
        </div>
        <div className="fg">
          <label className="fl">Prescribed by <span>(optional)</span></label>
          <input className="fi" placeholder="Dr. Kavita Singh" value={f.doctor} onChange={set('doctor')}/>
        </div>
        <div className="fg">
          <label className="fl">Instructions <span>(optional)</span></label>
          <textarea className="ft" placeholder="e.g. Take with food. Avoid dairy 1 hour before/after." value={f.notes} onChange={set('notes')}/>
        </div>
      </div>
      <div className="pv-mfoot">
        <button type="button" className="fb fb-g" onClick={handleClose} disabled={loading}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          Cancel
        </button>
        <button type="button" className={`fb fb-p${loading?' fb-loading':''}`} onClick={submit}>
          {loading
            ? <><div className="pv-spinner"/>&nbsp;Adding…</>
            : <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round"><path d="M10.5 20.5L3.5 13.5a5 5 0 017.07-7.07l7 7a5 5 0 01-7.07 7.07z"/><line x1="14" y1="7" x2="7" y2="14"/></svg>Add Medication</>
          }
        </button>
      </div>
    </Modal>
  );
}

export default AddMedicationModal;
