import { useState, useCallback, useEffect } from 'react';
import PediVaultAuth from './components/auth/PediVaultAuth';
import PediVaultDashboard from './components/dashboard/PediVaultDashboard';
import { getToken, removeToken, removeRefreshToken } from './api/client';
import { getMe } from './api/auth.api';
import { getChildren } from './api/children.api';

export default function App() {
  const [authed, setAuthed]           = useState(false);
  const [activeChild, setActiveChild] = useState('');
  const [userName, setUserName]       = useState('');
  const [checking, setChecking]       = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) { setChecking(false); return; }

    getMe()
      .then(res => {
        const user = res.data || res;
        if (user?.firstName) setUserName(user.firstName);
        return getChildren();
      })
      .then(res => {
        const list = res?.data || [];
        if (list.length > 0) setActiveChild(list[0].id);
        else setActiveChild('');
        setAuthed(true);
      })
      .catch(() => {
        removeToken();
        removeRefreshToken();
      })
      .finally(() => setChecking(false));
  }, []);

  const handleLogin = useCallback(async (name) => {
    if (name) setUserName(name);

    try {
      const res = await getChildren();
      const list = res?.data || [];
      if (list.length > 0) setActiveChild(list[0].id);
      else setActiveChild('');
    } catch {
      setActiveChild('');
    }

    setAuthed(true);
  }, []);

  const handleSignOut = useCallback(() => {
    removeToken();
    removeRefreshToken();
    setAuthed(false);
    setActiveChild('');
    setUserName('');
  }, []);

  if (checking) return null;

  return authed ? (
    <PediVaultDashboard
      onSignOut={handleSignOut}
      activeChild={activeChild}
      onChildSelect={setActiveChild}
      userName={userName}
    />
  ) : (
    <PediVaultAuth onLogin={handleLogin} />
  );
}
