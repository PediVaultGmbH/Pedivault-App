import { useEffect, useRef } from 'react';

export function Modal({open,onClose,maxWidth=480,children}) {
  const modalRef       = useRef(null);
  const onCloseRef     = useRef(onClose);
  const initializedRef = useRef(false);
  const cleanupRef     = useRef(null);

  onCloseRef.current = onClose;

  useEffect(()=>{
    if(!open){
      if(cleanupRef.current){ cleanupRef.current(); cleanupRef.current=null; }
      initializedRef.current = false;
      return;
    }

    if(initializedRef.current) return;
    initializedRef.current = true;

    const page = document.querySelector('.pv-page');
    const prevOverflow = page ? page.style.overflowY : '';
    if(page) page.style.overflowY = 'hidden';

    const blockScroll = e => {
      if(!modalRef.current?.contains(e.target)) e.preventDefault();
    };
    document.addEventListener('wheel',     blockScroll, {passive:false});
    document.addEventListener('touchmove', blockScroll, {passive:false});

    const prevFocus = document.activeElement;
    const t = setTimeout(()=>{
      const els = modalRef.current?.querySelectorAll(
        'button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])'
      );
      els?.[0]?.focus();
    }, 60);

    const onKey = e => {
      if(e.key==='Escape'){ onCloseRef.current(); return; }
      if(e.key==='Tab' && modalRef.current){
        const els=[...modalRef.current.querySelectorAll(
          'button:not([disabled]),[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex="0"]'
        )];
        if(!els.length) return;
        const first=els[0], last=els[els.length-1];
        if(e.shiftKey  && document.activeElement===first){ e.preventDefault(); last.focus(); }
        if(!e.shiftKey && document.activeElement===last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', onKey);

    cleanupRef.current = ()=>{
      clearTimeout(t);
      document.removeEventListener('keydown',   onKey);
      document.removeEventListener('wheel',     blockScroll);
      document.removeEventListener('touchmove', blockScroll);
      if(page) page.style.overflowY = prevOverflow;
      if(prevFocus?.focus) prevFocus.focus();
    };
  });

  return (
    <div className={`pv-overlay${open?' open':''}`}
      onClick={e=>{ if(e.target===e.currentTarget) onCloseRef.current(); }}
      role="dialog" aria-modal="true">
      <div className="pv-modal" style={{maxWidth, borderRadius:20, overflow:'hidden'}} ref={modalRef}>{children}</div>
    </div>
  );
}

export default Modal;
