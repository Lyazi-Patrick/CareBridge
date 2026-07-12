import { api, setToken } from "./apiClient.js";

export async function register({ email, password, name, role }) {
  const data = await api.post("/auth/register", { email, password, name, role }, { auth: false });
  setToken(data.token);
  return data.user;
}

export async function login({ email, password }) {
  const data = await api.post("/auth/login", { email, password }, { auth: false });
  setToken(data.token);
  return data.user;
}

export async function fetchCurrentUser() {
  const data = await api.get("/auth/me");
  return data.user;
}

export function logout() {
  setToken(null);
}
