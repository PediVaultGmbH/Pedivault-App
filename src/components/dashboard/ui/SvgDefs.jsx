// Global SVG gradient/filter defs — rendered once in root
export const SvgDefs = () => (
  <svg width="0" height="0" style={{position:'absolute',overflow:'hidden',pointerEvents:'none'}}>
    <defs>
      <radialGradient id="dvP" cx="35%" cy="20%" r="72%"><stop offset="0%" stopColor="#D4688A"/><stop offset="50%" stopColor="#C47A92"/><stop offset="100%" stopColor="#9B3A56"/></radialGradient>
      <radialGradient id="dvC" cx="38%" cy="32%" r="65%"><stop offset="0%" stopColor="#E8C4CF"/><stop offset="100%" stopColor="#C47A92"/></radialGradient>
    </defs>
  </svg>
);

export default SvgDefs;
