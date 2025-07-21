import { createContext, useContext, useState } from "react";

const API = "https://fsa-jwt-practice.herokuapp.com";
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState();
  const [location, setLocation] = useState("GATE");

  async function signup(username) {
    try {
      const res = await fetch(`${API}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });
      const data = await res.json();
      if (data.token) {
        setToken(data.token);
        setLocation("TABLET");
      } else {
        throw new Error("Signup failed");
      }
    } catch (err) {
      console.error("Signup error:", err);
    }
  }

  async function authenticate() {
    if (!token) throw new Error("No token found");
    try {
      const res = await fetch(`${API}/authenticate`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Authentication failed");
      setLocation("TUNNEL");
    } catch (err) {
      console.error("Auth error:", err);
    }
  }

  // ✅ Include both functions in context
  const value = { location, signup, authenticate };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw Error("useAuth must be used within an AuthProvider");
  return context;
}
