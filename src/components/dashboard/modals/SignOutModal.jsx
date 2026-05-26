import { useTranslation } from 'react-i18next';
import Modal from '../ui/Modal';
import XBtn from '../ui/XBtn';

export function SignOutModal({open, onClose, onConfirm, userName='Lena'}) {
  const { t } = useTranslation();
  return (
    <Modal open={open} onClose={onClose} maxWidth={360}>
      <div className="pv-mhdr" style={{borderBottom:'none',textAlign:'center',padding:'36px 28px 0'}}>
        <XBtn onClick={onClose}/>
        <div style={{width:60,height:60,borderRadius:18,background:'var(--rose-pale)',border:'1px solid var(--rose-lt)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px'}}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--rose)" strokeWidth="1.6" strokeLinecap="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
        </div>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:'1.25rem',fontWeight:400,color:'var(--ink)',marginBottom:8}}>{t('auth.signOutTitle','Sign out of PediVault?')}</div>
        <div style={{fontSize:'.57rem',fontWeight:300,color:'var(--ink-3)',lineHeight:1.75,marginBottom:6}}>
          {t('auth.signOutSub',"All your child's health records are safely encrypted and will be waiting when you come back.")}<br/>
          <span style={{fontWeight:500,color:'var(--ink)'}}>{t('auth.seeYouSoon','See you soon')}, {userName} 🌸</span>
        </div>
      </div>
      <div className="pv-mfoot" style={{justifyContent:'center',gap:12,padding:'20px 28px 24px',borderTop:'none',background:'transparent'}}>
        <button type="button" className="fb fb-g" style={{flex:1,maxWidth:160}} onClick={onClose}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          {t('auth.staySignedIn','Stay signed in')}
        </button>
        <button type="button" className="fb fb-d" style={{flex:1,maxWidth:160}} onClick={onConfirm}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          {t('auth.signOut','Sign out')}
        </button>
      </div>
    </Modal>
  );
}

export default SignOutModal;
