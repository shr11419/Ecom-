import { createContext, useState, useContext } from "react"; 

const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const email = localStorage.getItem("currentUserEmail");
    const name = localStorage.getItem("currentUserName");
    return email ? { email, name } : null;
  });

  const [showAuthPrompt, setShowAuthPrompt] = useState(() => {
    return !localStorage.getItem("currentUserEmail");
  });

  function signUp(email, password) {
    const users = JSON.parse(localStorage.getItem('users') || "[]");
    if (users.find((u) => u.email === email)) {
      return { success: false, error: "Email already exists" };
    }
    users.push({ email, password });
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUserEmail", email);
    setUser({ email, name: null });
    return { success: true };
  }

  async function login(email, password) {
    try {
      const res = await fetch("https://dummyjson.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password })
      });
      const data = await res.json();
      if (!data.token) {
        return { success: false, error: "Invalid credentials" };
      }
      localStorage.setItem("token", data.token);
      localStorage.setItem("currentUserEmail", email);
      const name = localStorage.getItem("currentUserName");
      setUser({ email, name });
      setShowAuthPrompt(false);
      return { success: true };
    } catch {
      return { success: false, error: "Server error" };
    }
  }

  function saveName(name) {
    localStorage.setItem("currentUserName", name);
    setUser(prev => ({ ...prev, name }));
    setShowAuthPrompt(false);
  }

  function logout() {
    localStorage.removeItem("currentUserEmail");
    localStorage.removeItem("currentUserName");
    localStorage.removeItem("token");
    setUser(null);
    setShowAuthPrompt(true);
  }

  return (
    <AuthContext.Provider value={{
      signUp, user, logout, login, saveName,
      showAuthPrompt, setShowAuthPrompt
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}