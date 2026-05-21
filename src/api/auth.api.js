/**
 * src/api/auth.api.js
 * ─────────────────────────────────────────────────────────────────────────────
 * All authentication endpoints.
 * Wire these up by replacing the mock logic in auth screens.
 */
import api, { setToken, setRefreshToken, removeToken, removeRefreshToken, getRefreshToken } from './client';

/** Sign in → saves tokens, returns user object */
export const signIn = async ({ email, password }) => {
  const data = await api.post('/auth/signin', { email, password });
  setToken(data.token);
  setRefreshToken(data.refreshToken);
  return data.user;
};

/** Register a new account → returns { userId } */
export const register = ({ firstName, lastName, email, phone, password, countryCode }) =>
  api.post('/auth/register', { firstName, lastName, email, phone, password, countryCode });

/** Send OTP to phone */
export const sendOTP = ({ phone }) =>
  api.post('/auth/otp/send', { phone });

/** Verify OTP → saves tokens, returns user object */
export const verifyOTP = async ({ phone, code }) => {
  const data = await api.post('/auth/otp/verify', { phone, code });
  setToken(data.token);
  setRefreshToken(data.refreshToken);
  return data.user;
};

/** Resend OTP */
export const resendOTP = ({ phone }) =>
  api.post('/auth/otp/resend', { phone });

/** Send password-reset link to email */
export const forgotPassword = ({ email }) =>
  api.post('/auth/forgot-password', { email });

/** Reset password with token from email link */
export const resetPassword = ({ token, newPassword }) =>
  api.post('/auth/reset-password', { token, newPassword });

/** Sign out — clears local tokens and invalidates server session */
export const signOut = async () => {
  try {
    await api.post('/auth/signout', { refreshToken: getRefreshToken() });
  } finally {
    removeToken();
    removeRefreshToken();
  }
};

/** Get current authenticated user */
export const getMe = () =>
  api.get('/auth/me');
