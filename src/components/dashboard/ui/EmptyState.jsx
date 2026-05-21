export function EmptyState({icon, title, sub, btnLabel, onBtn, color='var(--rose)'}) {
  return (
    <div className="pv-empty">
      <div className="pv-empty-ico" style={{background:`${color}15`,border:`1px solid ${color}30`}}>
        {icon}
      </div>
      <div className="pv-empty-title">{title}</div>
      <div className="pv-empty-sub">{sub}</div>
      {btnLabel && <button type="button" className="pv-empty-btn" style={{background:color}} onClick={onBtn}>{btnLabel}</button>}
    </div>
  );
}

export default EmptyState;
