export const FlowerLogo = ({size=24}) => (
  <svg width={size} height={size} viewBox="0 0 44 44" fill="none">
    <g transform="translate(22,22)">
      {[0,72,144,216,288].map((r,i)=><ellipse key={i} cx="0" cy="-11" rx="6.5" ry="9.2" fill="url(#dvP)" transform={`rotate(${r})`}/>)}
      <circle cx="0" cy="0" r="3.8" fill="url(#dvC)"/>
    </g>
  </svg>
);

export default FlowerLogo;
