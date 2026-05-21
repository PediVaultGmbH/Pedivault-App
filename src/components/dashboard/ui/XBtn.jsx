export const XBtn = ({onClick}) => (
  <button className="pv-mclose" onClick={onClick} aria-label="Close" type="button" style={{background:'none',border:'none',cursor:'pointer',padding:0}}>
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--ink-3)" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
  </button>
);

export default XBtn;
