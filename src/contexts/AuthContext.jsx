/**
 * src/contexts/AuthContext.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Global authentication state.
 * Wrap your app root with <AuthProvider> then use the useAuth() hook anywhere.
 *
 * Usage:
 *   const { user, token, signIn, signOut, loading } = useAuth();
 */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getToken, setToken, removeToken } from '../api/client';
import { getMe, signIn as apiSignIn, signOut as apiSignOut } from '../api/auth.api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true); // true until initial session check done

  // ── Restore session on app load ─────────────────────────────────────────
  useEffect(() => {
    const token = getToken();
    if (!token) { setLoading(false); return; }

    getMe()
      .then(me   => setUser(me))
      .catch(()  => removeToken())
      .finally(() => setLoading(false));
  }, []);

  // ── Listen for 401 events from the API client ────────────────────────────
  useEffect(() => {
    const handle = () => { setUser(null); removeToken(); };
    window.addEventListener('pv:unauthorised', handle);
    return () => window.removeEventListener('pv:unauthorised', handle);
  }, []);

  // ── Actions ──────────────────────────────────────────────────────────────
  const signIn = useCallback(async (email, password) => {
    const { token, user: me } = await apiSignIn({ email, password });
    setToken(token);
    setUser(me);
    return me;
  }, []);

  const signOut = useCallback(async () => {
    try { await apiSignOut(); } catch (_) { /* ignore */ }
    removeToken();
    setUser(null);
  }, []);

  const updateUser = useCallback((patch) => {
    setUser(prev => ({ ...prev, ...patch }));
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

/** Hook — throws if used outside <AuthProvider> */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}

export default AuthContext;
