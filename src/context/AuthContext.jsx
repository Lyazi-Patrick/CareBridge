/* eslint-disable react-refresh/only-export-components -- standard
   context+hook colocation pattern; useAuth is a hook, not a component. */
import { createContext, useContext, useEffect, useState } from "react";
import * as authService from "../services/authService.js";
import { getToken } from "../services/apiClient.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(() => !!getToken());

  useEffect(() => {
    if (!getToken()) return;
    authService
      .fetchCurrentUser()
      .then(setUser)
      .catch(() => authService.logout())
      .finally(() => setLoading(false));
  }, []);

  async function login(credentials) {
    const loggedInUser = await authService.login(credentials);
    setUser(loggedInUser);
    return loggedInUser;
  }

  async function register(form) {
    const newUser = await authService.register(form);
    setUser(newUser);
    return newUser;
  }

  function logout() {
    authService.logout();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
