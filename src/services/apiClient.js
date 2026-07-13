const TOKEN_KEY = "carebridge_token";
const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}
export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

/**
 * request() — the single place every API call goes through. Proxied via
 * Vite's dev server config (see vite.config.js) so we can just call
 * fetch("/api/...") with no base URL / CORS setup needed in dev.
 */
async function request(path, { method = "GET", body, auth = true } = {}) {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (auth && token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_BASE}/api${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    // No JSON body (e.g. 204) — fine.
  }

  if (!response.ok) {
    const message = data?.error || `Request failed with status ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return data;
}

export const api = {
  get: (path, opts = {}) => request(path, opts),
  post: (path, body, opts = {}) => request(path, { method: "POST", body, ...opts }),
};
