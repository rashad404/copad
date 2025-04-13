import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    const checkAuth = () => setIsAuthenticated(!!localStorage.getItem("token"));
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}
