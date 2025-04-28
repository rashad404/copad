import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { getApiUrl } from "../config/domains";

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      
      const response = await axios.get(`${getApiUrl()}/user/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
      // If the request fails (e.g., token is invalid), clear the token
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserData();
    } else {
      setUser(null);
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const checkAuth = () => {
      const hasToken = !!localStorage.getItem("token");
      setIsAuthenticated(hasToken);
    };
    
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      // Call the server-side logout endpoint
      await logout();
      // Clear the token from localStorage
      localStorage.removeItem("token");
      // Update auth state
      setIsAuthenticated(false);
      // Redirect to login page or home
      navigate('/login');
    } catch (error) {
      console.error("Logout failed:", error);
      // Still remove token and update state even if server logout fails
      localStorage.removeItem("token");
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticated, 
        setIsAuthenticated, 
        user, 
        loading,
        login,
        logout,
        refreshUser: fetchUserData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}