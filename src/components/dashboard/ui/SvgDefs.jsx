// Global SVG gradient/filter defs — rendered once in root
export const SvgDefs = () => (
  <svg width="0" height="0" style={{position:'absolute',overflow:'hidden',pointerEvents:'none'}}>
    <defs>
      <radialGradient id="dvP" cx="35%" cy="20%" r="72%"><stop offset="0%" stopColor="rgba(255,255,255,1)"/><stop offset="50%" stopColor="rgba(255,220,235,0.95)"/><stop offset="100%" stopColor="rgba(248,190,215,0.85)"/></radialGradient>
      <radialGradient id="dvC" cx="38%" cy="32%" r="65%"><stop offset="0%" stopColor="rgba(255,255,255,0.95)"/><stop offset="100%" stopColor="rgba(255,210,228,0.9)"/></radialGradient>
    </defs>
  </svg>
);

export default SvgDefs;
