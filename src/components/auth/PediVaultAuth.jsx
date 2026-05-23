import { useState, useCallback, useRef, useEffect } from 'react';
import '../../styles/auth.css';

import { SvgDefs, Bg } from './ui/Background';
import LeftPanel    from './panels/LeftPanel';
import RightPanel   from './panels/RightPanel';
import MobileHeader from './ui/MobileHeader';
import SignIn        from './screens/SignIn';
import CreateAccount from './screens/CreateAccount';
import Forgot        from './screens/Forgot';
import OTP           from './screens/OTP';
import ResetPassword from './screens/ResetPassword';

export default function PediVaultAuth({ onLogin }) {
  const [screen, setScreen] = useState('signin');
  const [resetToken, setResetToken] = useState('');
  const [fading, setFading] = useState(false);
  const pendingNameRef      = useRef('');
  const pendingPhoneRef     = useRef({ phone: '', countryCode: '+49' });

  useEffect(() => {
    // Check for reset token in URL
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      setResetToken(token);
      setScreen('reset');
      window.history.replaceState({}, '', window.location.pathname);
    }

    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      document.documentElement.style.height = 'auto';
      document.documentElement.style.overflow = 'auto';
      document.body.style.height = 'auto';
      document.body.style.overflow = 'auto';
      document.body.style.webkitOverflowScrolling = 'touch';
    }
    return () => {
      document.documentElement.style.height = '';
      document.documentElement.style.overflow = '';
      document.body.style.height = '';
      document.body.style.overflow = '';
      document.body.style.webkitOverflowScrolling = '';
    };
  }, []);

  const goTo = useCallback((s, name, phoneData) => {
    if (name)      pendingNameRef.current  = name;
    if (phoneData) pendingPhoneRef.current = phoneData;
    if (s === 'dashboard' && onLogin) {
      setFading(true);
      setTimeout(() => { onLogin(pendingNameRef.current || 'Lena'); }, 320);
      return;
    }
    setScreen(s);
  }, [onLogin]);

  const sharedProps = { goTo };
  const otpProps    = { ...sharedProps, phone: pendingPhoneRef.current.phone, countryCode: pendingPhoneRef.current.countryCode };

  const isMobile = window.innerWidth <= 768;

  return (
    <div className="pv-root" style={{
      opacity: fading ? 0 : 1,
      transition: 'opacity .3s ease',
      pointerEvents: fading ? 'none' : 'auto',
      position: isMobile ? 'relative' : 'fixed',
      overflow: isMobile ? 'visible' : 'hidden',
      height: isMobile ? 'auto' : '100%',
    }}>
      <SvgDefs />
      <Bg />
      <div className="pv-layout pv-layout-desktop">
        <LeftPanel  screen={screen} />
        <RightPanel screen={screen} />
        <div className="pv-wrap">
          <div className="pv-card">
            {screen === 'signin'  && <SignIn        {...sharedProps} />}
            {screen === 'create'  && <CreateAccount {...sharedProps} />}
            {screen === 'forgot'  && <Forgot        {...sharedProps} />}
            {screen === 'otp'     && <OTP           {...otpProps}    />}
            {screen === 'reset'   && <ResetPassword {...sharedProps} token={resetToken} />}
          </div>
        </div>
      </div>
      <div className="pv-mob-layout">
        <MobileHeader />
        <div className="pv-mob-sheet">
          <div className="pv-mob-sheet-handle" />
          {screen === 'signin'  && <SignIn        {...sharedProps} />}
          {screen === 'create'  && <CreateAccount {...sharedProps} />}
          {screen === 'forgot'  && <Forgot        {...sharedProps} />}
          {screen === 'otp'     && <OTP           {...otpProps}    />}
          {screen === 'reset'   && <ResetPassword {...sharedProps} token={resetToken} />}
        </div>
      </div>
    </div>
  );
}
