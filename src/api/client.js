/**
 * src/api/client.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Central HTTP client for all PediVault API calls.
 * - Attaches JWT from localStorage on every request
 * - Auto-refreshes token on 401 (plug in your refresh endpoint)
 * - Normalises error shape so every caller gets { message, status, data }
 */

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// ─── Token helpers ────────────────────────────────────────────────────────────
export const getToken    = ()  => localStorage.getItem('pv_token');
export const setToken    = (t) => localStorage.setItem('pv_token', t);
export const removeToken = ()  => localStorage.removeItem('pv_token');

export const getRefreshToken    = ()  => localStorage.getItem('pv_refresh');
export const setRefreshToken    = (t) => localStorage.setItem('pv_refresh', t);
export const removeRefreshToken = ()  => localStorage.removeItem('pv_refresh');

// ─── Token refresh ────────────────────────────────────────────────────────────
let refreshPromise = null;

async function tryRefresh() {
  const rt = getRefreshToken();
  if (!rt) return false;
  try {
    const res  = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: rt }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    if (data.token) {
      setToken(data.token);
      if (data.refreshToken) setRefreshToken(data.refreshToken);
      return true;
    }
    return false;
  } catch { return false; }
}

// ─── Core request ─────────────────────────────────────────────────────────────
async function request(path, { method = 'GET', body, headers = {}, signal, _retry = false } = {}) {
  const token = getToken();


  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    signal,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  let data;
  const ct = res.headers.get('Content-Type') || '';
  data = ct.includes('application/json') ? await res.json() : await res.text();

  // Auto-refresh on 401
  if (res.status === 401 && !_retry) {
    if (!refreshPromise) refreshPromise = tryRefresh();
    const refreshed = await refreshPromise;
    refreshPromise = null;
    if (refreshed) return request(path, { method, body, headers, signal, _retry: true });
    removeToken();
    removeRefreshToken();
    window.dispatchEvent(new Event('pv:unauthorised'));
    throw new ApiError('Session expired. Please sign in again.', 401, data);
  }

  if (!res.ok) {
    const message =
      (typeof data === 'object' && (data?.error || data?.message)) ||
      (typeof data === 'string' && data) ||
      'Something went wrong. Please try again.';
    throw new ApiError(message, res.status, data);
  }

  return data;
}

// ─── Error class ──────────────────────────────────────────────────────────────
export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name   = 'ApiError';
    this.status = status;
    this.data   = data;
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────
export const api = {
  get:    (path, opts)       => request(path, { method: 'GET',    ...opts }),
  post:   (path, body, opts) => request(path, { method: 'POST',   body, ...opts }),
  put:    (path, body, opts) => request(path, { method: 'PUT',    body, ...opts }),
  patch:  (path, body, opts) => request(path, { method: 'PATCH',  body, ...opts }),
  delete: (path, opts)       => request(path, { method: 'DELETE', ...opts }),
};

export default api;
