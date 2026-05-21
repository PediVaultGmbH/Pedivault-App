// Makes any div/span keyboard-accessible (Enter/Space triggers onClick)
export const a11yClick = (handler) => ({
  onClick: handler,
  onKeyDown: (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handler(e); }
  },
  role: 'button',
  tabIndex: 0,
});
