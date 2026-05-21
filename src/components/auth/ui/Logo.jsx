export const Logo = () => (
  <svg width="34" height="34" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(22,22)">
      {[0,72,144,216,288].map((r,i) => (
        <ellipse key={i}
          cx="0" cy="-11"
          rx="6.5" ry="9.2"
          fill="url(#pvPetal)"
          transform={`rotate(${r})`}
        />
      ))}
      <circle cx="0" cy="0" r="3.8" fill="url(#pvCenter)"/>
    </g>
  </svg>
);

export const Eye = ({open}) => open
  ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
  : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
