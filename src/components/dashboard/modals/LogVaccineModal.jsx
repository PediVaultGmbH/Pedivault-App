import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from '../ui/Modal';
import ModalSuccess from '../ui/ModalSuccess';
import { useFormValidation } from '../../../hooks/useFormValidation';
import { useLoading } from '../../../hooks/useLoading';
import XBtn from '../ui/XBtn';
import FieldErr from '../ui/FieldErr';
import CalendarPicker from '../ui/CalendarPicker';

const VACCINE_OPTIONS = [
  { id:'mmr',      label:'MMR (Measles, Mumps, Rubella)' },
  { id:'varicella',label:'Varicella (Chickenpox)' },
  { id:'dtpa',     label:'DTaP-IPV-Hib-HepB (6-in-1)' },
  { id:'hepb',     label:'Hepatitis B' },
  { id:'pcv',      label:'Pneumococcal (PCV13)' },
  { id:'rota',     label:'Rotavirus' },
  { id:'menb',     label:'Meningococcal B' },
  { id:'influenza',label:'Influenza' },
];

export function LogVaccineModal({open,onClose,onSuccess}) {
  const { t } = useTranslation();
  const [f,setF] = useState({name:'',dose:'Dose 1',date:'',doctor:'',lot:'',site:'Left thigh'});
  const [done,setDone] = useState(false);
  const {errors,validate,clearError} = useFormValidation({
    name:{required:true,message:t('modals.errSelectVaccine','Please select a vaccine')},
    date:{required:true,message:t('modals.errSelectDateGiven','Please select the date given')},
  });
  const {loading,run} = useLoading(1000);
  const set = k=>e=>{ setF(p=>({...p,[k]:e.target.value})); clearError(k); };

  const displayName = VACCINE_OPTIONS.find(v => v.id === f.name)?.label || f.name;

  const submit = ()=>{
    if(!validate(f))return;
    run(async ()=>{
      const entry = {
        name:        f.name,        // STIKO ID e.g. 'mmr'
        displayName: displayName,   // human label e.g. 'MMR (Measles, Mumps, Rubella)'
        dose:        f.dose,
        date:        f.date,
        by:          f.doctor || 'Self-recorded',
        site:        f.site,
        lot:         f.lot,
      };
      await onSuccess(entry);
      setDone(true);
      setTimeout(()=>{
        onClose(); setDone(false); setF({name:'',dose:'Dose 1',date:'',doctor:'',lot:'',site:'Left thigh'});
      },1400);
    });
  };

  const handleClose = ()=>{ if(!loading){ onClose(); setTimeout(()=>setDone(false),300); }};

  if(done) return (
    <Modal open={open} onClose={handleClose} maxWidth={500}>
      <ModalSuccess color="var(--rose)"
        icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--rose)" strokeWidth="1.8" strokeLinecap="round"><path d="M18 2l4 4-1 1-4-4z"/><path d="M14.5 5.5l4 4"/><path d="M12 8l-8 8 1 3 3 1 8-8"/></svg>}
        title={t('modals.vaccine_success','Vaccine logged!')}
        sub={`${displayName} ${f.dose} ${t('modals.vaccine_success_sub','recorded on')} ${f.date?new Date(f.date).toLocaleDateString('en-DE',{day:'numeric',month:'long',year:'numeric'}):'—'}.\n${t('modals.vaccine_success_sub','Immunisation schedule updated.')}`}/>
    </Modal>
  );

  return (
    <Modal open={open} onClose={handleClose} maxWidth={500}>
      <div className="pv-mhdr">
        
        <div className="pv-mhdr-eyebrow">{t('modals.vaccine_eyebrow','Immunisation')}</div>
        <div className="pv-mhdr-title">{t('modals.vaccine_title','Log Vaccine')}</div>
        <div className="pv-mhdr-sub">{t('modals.vaccine_sub','Record a vaccine that was administered')}</div>
        <XBtn onClick={handleClose}/>
      </div>
      <div className="pv-mbody">
        <div className="fg">
          <label className="fl">{t('modals.vaccineName','Vaccine name')}</label>
          <select id="vacc-select" className={`fi${errors.name?' err':''}`} style={{cursor:'pointer'}} value={f.name} onChange={set('name')}>
            <option value="">{t('modals.selectVaccine','Select vaccine…')}</option>
            {VACCINE_OPTIONS.map(v => (
              <option key={v.id} value={v.id}>{v.label}</option>
            ))}
          </select>
          <FieldErr msg={errors.name}/>
        </div>
        <div className="fr">
          <div className="fg"><label className="fl">{t('modals.dose','Dose')}</label>
            <select className="fi" style={{cursor:'pointer'}} value={f.dose} onChange={set('dose')}>
              <option>{t('modals.dose1','Dose 1')}</option><option>{t('modals.dose2','Dose 2')}</option><option>{t('modals.dose3','Dose 3')}</option><option>{t('modals.dose4','Dose 4')}</option><option>{t('modals.booster','Booster')}</option><option>{t('modals.annual','Annual')}</option>
            </select>
          </div>
          <div className="fg"><label className="fl">{t('modals.injectionSite','Injection site')}</label>
            <select className="fi" style={{cursor:'pointer'}} value={f.site} onChange={set('site')}>
              <option>{t('modals.leftThigh','Left thigh')}</option><option>{t('modals.rightThigh','Right thigh')}</option><option>{t('modals.leftArm','Left arm')}</option><option>{t('modals.rightArm','Right arm')}</option><option>{t('modals.oral','Oral')}</option>
            </select>
          </div>
        </div>
        <div className="fg">
          <label className="fl">{t('modals.dateGiven','Date given')} {errors.date&&<span style={{color:'#B82810',textTransform:'none',letterSpacing:0}}>— {errors.date}</span>}</label>
          <div style={{borderRadius:11,outline:errors.date?'2px solid rgba(185,40,20,.25)':'none'}}>
            <CalendarPicker value={f.date} onChange={d=>{setF(p=>({...p,date:d}));clearError('date');}}/>
          </div>
        </div>
        <div className="fr" style={{marginTop:10}}>
          <div className="fg"><label className="fl">{t('modals.administeredBy','Administered by')}</label><input className="fi" placeholder="Dr. Priya Mehta" value={f.doctor} onChange={set('doctor')}/></div>
          <div className="fg"><label className="fl">{t('modals.lotNumber','Lot number')} <span>({t('modals.optional','optional')})</span></label><input className="fi" placeholder="AB1234" value={f.lot} onChange={set('lot')}/></div>
        </div>
      </div>
      <div className="pv-mfoot">
        <button type="button" className="fb fb-g" onClick={handleClose} disabled={loading}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>{t('modals.cancel','Cancel')}</button>
        <button type="button" className={`fb fb-p${loading?' fb-loading':''}`} onClick={submit}>
          {loading?<><div className="pv-spinner"/>&nbsp;{t('modals.logging','Logging…')}</>:<><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>{t('modals.logVaccine','Log Vaccine')}</>}
        </button>
      </div>
    </Modal>
  );
}

export default LogVaccineModal;
