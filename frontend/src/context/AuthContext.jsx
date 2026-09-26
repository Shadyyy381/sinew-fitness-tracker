import { createContext, useContext, useEffect, useState } from "react";
import api from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("sinew_token");
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get("/auth/me")
      .then((res) => setUser(res.data.user))
      .catch(() => localStorage.removeItem("sinew_token"))
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    const res = await api.post("/auth/login", { email, password });
    localStorage.setItem("sinew_token", res.data.token);
    setUser(res.data.user);
  }

  async function signup(name, email, password) {
    const res = await api.post("/auth/signup", { name, email, password });
    localStorage.setItem("sinew_token", res.data.token);
    setUser(res.data.user);
  }

  function logout() {
    localStorage.removeItem("sinew_token");
    setUser(null);
  }

  function updateUser(patch) {
    setUser((prev) => ({ ...prev, ...patch }));
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
