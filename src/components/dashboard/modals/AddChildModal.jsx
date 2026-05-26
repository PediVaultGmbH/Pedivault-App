import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from '../ui/Modal';
import ModalSuccess from '../ui/ModalSuccess';
import { useFormValidation } from '../../../hooks/useFormValidation';
import { useLoading } from '../../../hooks/useLoading';
import XBtn from '../ui/XBtn';
import FieldErr from '../ui/FieldErr';
import { createChild } from '../../../api/children.api';

export function AddChildModal({open, onClose, onSuccess, onChildAdded}) {
  const { t } = useTranslation();
  const empty = {name:'', dob:'', gender:'girl', bloodGroup:'', notes:'', color:'#C47A92'};
  const [f, setF]     = useState(empty);
  const [done, setDone] = useState(false);
  const {errors, validate, clearError} = useFormValidation({
    name: {required:true, message:'Please enter the child\'s name'},
    dob:  {required:true, message:'Please enter date of birth'},
  });
  const {loading, run} = useLoading(1100);
  const set = k => e => { setF(p => ({...p, [k]: e.target.value})); clearError(k); };

  const submit = () => {
    if (!validate(f)) return;
    run(async () => {
      try {
        const genderMap = { girl: 'FEMALE', boy: 'MALE', other: 'OTHER' };
        const res = await createChild({
          name:        f.name,
          dateOfBirth: f.dob,
          gender:      genderMap[f.gender] || 'OTHER',
          bloodType:   f.bloodGroup || null,
          color:       f.color,
          allergies:   [],
        });
        const saved = res.data || {};
        setDone(true);
        setTimeout(() => {
          onSuccess(`${f.name} ${t('modals.addedToVault','has been added to your vault ✓')}`);
          if (onChildAdded) onChildAdded({ ...f, id: saved.id, name: f.name });
          onClose();
          setDone(false);
          setF(empty);
        }, 1400);
      } catch (err) {
        onSuccess(err.message || 'Failed to add child');
      }
    });
  };

  const handleClose = () => { if (!loading) { onClose(); setTimeout(() => { setDone(false); setF(empty); }, 300); }};

  if (done) return (
    <Modal open={open} onClose={handleClose}>
      <ModalSuccess color="var(--rose)"
        icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--rose)" strokeWidth="1.8" strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>}
        title={`${f.name} ${t('modals.addChild_success_title','is in your vault!')}`}
        sub={`${t('modals.addChild_success_sub',"health profile has been created.\nYou can now log vaccines, track growth and book visits.")}`}
      />
    </Modal>
  );

  return (
    <Modal open={open} onClose={handleClose}>
      <div className="pv-mhdr">
        
        <div className="pv-mhdr-eyebrow">{t('modals.addChild_eyebrow','Family')}</div>
        <div className="pv-mhdr-title">{t('modals.addChild_title','Add a child')}</div>
        <div className="pv-mhdr-sub">{t('modals.addChild_sub','Create a health profile for your child')}</div>
        <XBtn onClick={handleClose}/>
      </div>
      <div className="pv-mbody">
        <div className="fr">
          <div className="fg">
            <label className="fl">{t('modals.fullName','Full name')}</label>
            <input className={`fi${errors.name?' err':''}`} placeholder="e.g. Emma Müller" value={f.name} onChange={set('name')}/>
            <FieldErr msg={errors.name}/>
          </div>
          <div className="fg">
            <label className="fl">{t('modals.dateOfBirth','Date of birth')}</label>
            <input className={`fi${errors.dob?' err':''}`} type="date" value={f.dob} onChange={set('dob')}/>
            <FieldErr msg={errors.dob}/>
          </div>
        </div>
        <div className="fr">
          <div className="fg">
            <label className="fl">{t('modals.gender','Gender')}</label>
            <select className="fi" style={{cursor:'pointer'}} value={f.gender} onChange={set('gender')}>
              <option value="girl">{t('modals.girl','Girl')}</option>
              <option value="boy">{t('modals.boy','Boy')}</option>
              <option value="other">{t('modals.otherGender','Other / Prefer not to say')}</option>
            </select>
          </div>
          <div className="fg">
            <label className="fl">{t('modals.bloodGroup','Blood group')} <span>({t('modals.optional','optional')})</span></label>
            <select className="fi" style={{cursor:'pointer'}} value={f.bloodGroup} onChange={set('bloodGroup')}>
              <option value="">Select…</option>
              {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(bg => <option key={bg}>{bg}</option>)}
            </select>
          </div>
        </div>
        <div className="fg">
          <label className="fl">{t('modals.notes','Notes')} <span>({t('modals.optional','optional')})</span></label>
          <textarea className="ft" placeholder="Any allergies, conditions or important notes…" value={f.notes} onChange={set('notes')}/>
        </div>
        <div className="fg">
          <label className="fl">{t('modals.profileColour','Profile colour')}</label>
          <div style={{display:'flex', gap:8, flexWrap:'wrap', alignItems:'center'}}>
            {['#C47A92','#3478B0','#2A9E62','#BA7018','#7B52B0','#B82810'].map(c => (
              <div key={c} onClick={() => setF(p => ({...p, color:c}))}
                style={{
                  width:26, height:26, borderRadius:'50%', background:c, cursor:'pointer',
                  border:`3px solid ${f.color===c ? c : 'transparent'}`,
                  outline:`2px solid ${f.color===c ? c : 'transparent'}`, outlineOffset:2,
                  transition:'all .15s', transform:f.color===c ? 'scale(1.15)' : 'scale(1)',
                }}/>
            ))}
          </div>
        </div>
      </div>
      <div className="pv-mfoot">
        <button type="button" className="fb fb-g" onClick={handleClose} disabled={loading}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          {t('modals.cancel','Cancel')}
        </button>
        <button type="button" className={`fb fb-p${loading?' fb-loading':''}`} onClick={submit}>
          {loading
            ? <><div className="pv-spinner"/>&nbsp;{t('modals.adding','Adding…')}</>
            : <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>{t('modals.addChild','Add Child')}</>
          }
        </button>
      </div>
    </Modal>
  );
}

export default AddChildModal;
