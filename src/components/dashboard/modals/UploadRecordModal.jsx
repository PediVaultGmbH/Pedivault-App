import { useState } from 'react';
import Modal from '../ui/Modal';
import ModalSuccess from '../ui/ModalSuccess';
import XBtn from '../ui/XBtn';
import FieldErr from '../ui/FieldErr';
import { useFormValidation } from '../../../hooks/useFormValidation';
import { useLoading } from '../../../hooks/useLoading';

export function UploadRecordModal({open,onClose,onSuccess}) {
  const [f,setF] = useState({name:'',type:'Lab Report',source:'',date:''});
  const [file,setFile] = useState(null);
  const [drag,setDrag] = useState(false);
  const [done,setDone] = useState(false);
  const {errors,validate,clearError} = useFormValidation({
    name:{required:true,message:'Please enter a document name'},
  });
  const {loading,run} = useLoading(1200);
  const set = k=>e=>{ setF(p=>({...p,[k]:e.target.value})); clearError(k); };
  const pickFile = e=>{ const fl=e.target.files[0]; if(fl){ setFile(fl); setF(p=>({...p,name:p.name||fl.name})); clearError('name'); }};

  const submit = ()=>{
    if(!validate(f))return;
    run(async ()=>{
      const entry = {name:f.name, type:f.type, date:f.date, source:f.source};
      await onSuccess(entry);
      setDone(true);
      setTimeout(()=>{
        onClose(); setDone(false); setF({name:'',type:'Lab Report',source:'',date:''}); setFile(null);
      }, 1400);
    });
  };

  const handleClose = ()=>{ if(!loading){ onClose(); setTimeout(()=>setDone(false),300); }};

  if(done) return (
    <Modal open={open} onClose={handleClose} maxWidth={500}>
      <ModalSuccess color="var(--green)"
        icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="1.8" strokeLinecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M9 13l2 2 4-4"/></svg>}
        title="Record uploaded!" sub={`${f.name} has been securely stored.\nEncrypted and accessible from your records.`}/>
    </Modal>
  );

  return (
    <Modal open={open} onClose={handleClose} maxWidth={500}>
      <div className="pv-mhdr">
        <div className="pv-mhdr-accent" style={{background:'linear-gradient(90deg,var(--green),rgba(42,158,98,.4))'}}/>
        <div className="pv-mhdr-eyebrow">Health Records</div>
        <div className="pv-mhdr-title">Upload Document</div>
        <div className="pv-mhdr-sub">Add a health document, report or certificate</div>
        <XBtn onClick={handleClose}/>
      </div>
      <div className="pv-mbody">
        <div className={`pv-dzone${drag?' drag':''}`}
          role="button"
          tabIndex={0}
          aria-label="Upload file — click or drag and drop"
          onDragOver={e=>{e.preventDefault();setDrag(true);}} onDragLeave={()=>setDrag(false)}
          onDrop={e=>{e.preventDefault();setDrag(false);const fl=e.dataTransfer.files[0];if(fl){setFile(fl);setF(p=>({...p,name:p.name||fl.name}));clearError('name');}}}
          onClick={()=>document.getElementById('pv-fup').click()}
          onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();document.getElementById('pv-fup').click();}}}>
          <label htmlFor="pv-fup" style={{display:'none'}}>Upload health document</label>
          <input id="pv-fup" type="file" style={{display:'none'}} accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" onChange={pickFile}/>
          {file
            ? <div><div style={{fontSize:'1.5rem',marginBottom:4}}>📄</div><div style={{fontSize:'.65rem',fontWeight:500,color:'var(--ink)'}}>{file.name}</div><div style={{fontSize:'.5rem',color:'var(--ink-3)',marginTop:2}}>{(file.size/1024/1024).toFixed(1)} MB</div></div>
            : <div><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--rose-mid)" strokeWidth="1.5" strokeLinecap="round" style={{margin:'0 auto 7px',display:'block'}}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              <div style={{fontSize:'.59rem',color:'var(--ink-2)'}}>Drop file here or <span style={{color:'var(--rose)'}}>browse</span></div>
              <div style={{fontSize:'.48rem',color:'var(--ink-3)',marginTop:3}}>PDF, JPG, PNG, DOC · Max 10 MB</div></div>
          }
        </div>
        <div className="fg">
          <label className="fl">Document name</label>
          <input className={`fi${errors.name?' err':''}`} placeholder="e.g. Blood Test Report Apr 2025" value={f.name} onChange={set('name')}/>
          <FieldErr msg={errors.name}/>
        </div>
        <div className="fr">
          <div className="fg"><label className="fl">Document type</label>
            <select className="fi" style={{cursor:'pointer'}} value={f.type} onChange={set('type')}>
              <option>Lab Report</option><option>Prescription</option><option>Vaccination Certificate</option><option>Scan / X-ray</option><option>Discharge Summary</option><option>Other</option>
            </select>
          </div>
          <div className="fg"><label className="fl">Date of document</label><input className="fi" type="date" value={f.date} onChange={set('date')}/></div>
        </div>
        <div className="fg"><label className="fl">Source / Hospital</label><input className="fi" placeholder="Apollo Diagnostics" value={f.source} onChange={set('source')}/></div>
      </div>
      <div className="pv-mfoot">
        <button type="button" className="fb fb-g" onClick={handleClose} disabled={loading}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>Cancel</button>
        <button type="button" className={`fb fb-p${loading?' fb-loading':''}`} onClick={submit}>
          {loading?<><div className="pv-spinner"/>&nbsp;Uploading…</>:<><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>Upload Record</>}
        </button>
      </div>
    </Modal>
  );
}

export default UploadRecordModal;
