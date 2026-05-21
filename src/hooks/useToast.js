import { useState, useCallback } from 'react';

export function useToast() {
  const [toasts,setToasts] = useState([]);
  const show = useCallback(msg=>{
    const id=Date.now();
    setToasts(t=>[...t,{id,msg,visible:false}]);
    setTimeout(()=>setToasts(t=>t.map(x=>x.id===id?{...x,visible:true}:x)),20);
    setTimeout(()=>setToasts(t=>t.map(x=>x.id===id?{...x,visible:false}:x)),2700);
    setTimeout(()=>setToasts(t=>t.filter(x=>x.id!==id)),3000);
  },[]);
  const dismiss = useCallback(id=>{
    setToasts(t=>t.map(x=>x.id===id?{...x,visible:false}:x));
    setTimeout(()=>setToasts(t=>t.filter(x=>x.id!==id)),300);
  },[]);
  return {toasts,show,dismiss};
}
