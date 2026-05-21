import { useState, useCallback, useRef } from 'react';
import '../../styles/auth.css';

import { SvgDefs, Bg } from './ui/Background';
import LeftPanel    from './panels/LeftPanel';
import RightPanel   from './panels/RightPanel';
import MobileHeader from './ui/MobileHeader';
import SignIn        from './screens/SignIn';
import CreateAccount from './screens/CreateAccount';
import Forgot        from './screens/Forgot';
import OTP           from './screens/OTP';

export default function PediVaultAuth({ onLogin }) {
  const [screen, setScreen] = useState('signin');
  const [fading, setFading] = useState(false);
  const pendingNameRef      = useRef('');
  const pendingPhoneRef     = useRef({ phone: '', countryCode: '+49' });

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

  return (
    <div className="pv-root" style={{ opacity: fading ? 0 : 1, transition: 'opacity .3s ease', pointerEvents: fading ? 'none' : 'auto' }}>
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
        </div>
      </div>
    </div>
  );
}
