import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from '../ui/Modal';
import ModalSuccess from '../ui/ModalSuccess';
import FieldErr from '../ui/FieldErr';
import { useFormValidation } from '../../../hooks/useFormValidation';
import { useLoading } from '../../../hooks/useLoading';
import XBtn from '../ui/XBtn';

export function AddMedicationModal({open,onClose,onSuccess}) {
  const { t } = useTranslation();
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
        title={t('modals.addMed_success','Medication added!')}
        sub={`${f.name} ${f.dosage} has been added.\nReminder schedule is now active.`}/>
    </Modal>
  );

  return (
    <Modal open={open} onClose={handleClose} maxWidth={480}>
      <div className="pv-mhdr">
        
        <div className="pv-mhdr-eyebrow">{t('modals.addMed_eyebrow','Medications')}</div>
        <div className="pv-mhdr-title">{t('modals.addMed_title','Add Medication')}</div>
        <div className="pv-mhdr-sub">{t('modals.addMed_sub','Log a prescribed or ongoing medication')}</div>
        <XBtn onClick={handleClose}/>
      </div>
      <div className="pv-mbody">
        <div className="fr">
          <div className="fg">
            <label className="fl">{t('modals.medName','Medication name')}</label>
            <input className={`fi${errors.name?' err':''}`} placeholder="e.g. Amoxicillin" value={f.name} onChange={set('name')}/>
            <FieldErr msg={errors.name}/>
          </div>
          <div className="fg">
            <label className="fl">{t('modals.type','Type')}</label>
            <select className="fi" style={{cursor:'pointer'}} value={f.type} onChange={set('type')}>
              <option>{t('modals.antibiotic','Antibiotic')}</option><option>{t('modals.painkiller','Painkiller')}</option><option>{t('modals.vitamin','Vitamin')}</option>
              <option>{t('modals.antihistamine','Antihistamine')}</option><option>{t('modals.probiotic','Probiotic')}</option><option>{t('modals.antiviral','Antiviral')}</option>
              <option>{t('modals.steroid','Steroid')}</option><option>{t('modals.other','Other')}</option>
            </select>
          </div>
        </div>
        <div className="fr">
          <div className="fg">
            <label className="fl">{t('modals.dosage','Dosage')}</label>
            <input className={`fi${errors.dosage?' err':''}`} placeholder="e.g. 5ml or 400IU" value={f.dosage} onChange={set('dosage')}/>
            <FieldErr msg={errors.dosage}/>
          </div>
          <div className="fg">
            <label className="fl">{t('modals.frequency','Frequency')}</label>
            <select className="fi" style={{cursor:'pointer'}} value={f.frequency} onChange={set('frequency')}>
              <option>{t('modals.onceDaily','Once daily')}</option><option>{t('modals.twiceDaily','Twice daily')}</option><option>{t('modals.thriceDaily','Three times daily')}</option>
              <option>{t('modals.fourDaily','Four times daily')}</option><option>{t('modals.asNeeded','As needed')}</option><option>{t('modals.weekly','Weekly')}</option><option>{t('modals.other','Other')}</option>
            </select>
          </div>
        </div>
        <div className="fr">
          <div className="fg">
            <label className="fl">{t('modals.duration','Duration')}</label>
            <select className="fi" style={{cursor:'pointer'}} value={f.duration} onChange={set('duration')}>
              <option>3 days</option><option>5 days</option><option>7 days</option><option>10 days</option>
              <option>14 days</option><option>1 month</option><option>3 months</option>
              <option>Ongoing</option><option>{t('modals.asNeeded','As needed')}</option>
            </select>
          </div>
          <div className="fg">
            <label className="fl">{t('modals.startDate','Start date')} <span>({t('modals.optional','optional')})</span></label>
            <input className="fi" type="date" value={f.startDate} onChange={set('startDate')}/>
          </div>
        </div>
        <div className="fg">
          <label className="fl">{t('modals.prescribedBy','Prescribed by')} <span>({t('modals.optional','optional')})</span></label>
          <input className="fi" placeholder="Dr. Kavita Singh" value={f.doctor} onChange={set('doctor')}/>
        </div>
        <div className="fg">
          <label className="fl">{t('modals.instructions','Instructions')} <span>({t('modals.optional','optional')})</span></label>
          <textarea className="ft" placeholder="e.g. Take with food. Avoid dairy 1 hour before/after." value={f.notes} onChange={set('notes')}/>
        </div>
      </div>
      <div className="pv-mfoot">
        <button type="button" className="fb fb-g" onClick={handleClose} disabled={loading}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          {t('modals.cancel','Cancel')}
        </button>
        <button type="button" className={`fb fb-p${loading?' fb-loading':''}`} onClick={submit}>
          {loading
            ? <><div className="pv-spinner"/>&nbsp;{t('modals.adding_med','Adding…')}</>
            : <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round"><path d="M10.5 20.5L3.5 13.5a5 5 0 017.07-7.07l7 7a5 5 0 01-7.07 7.07z"/><line x1="14" y1="7" x2="7" y2="14"/></svg>{t('modals.addMedBtn','Add Medication')}</>
          }
        </button>
      </div>
    </Modal>
  );
}

export default AddMedicationModal;
