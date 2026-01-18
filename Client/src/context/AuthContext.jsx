import { createContext, useContext, useEffect, useState } from "react";
import apiClient from "../lib/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        
        if (!token) {
          setIsLoading(false);
          return;
        }

        const { data } = await apiClient.get("/auth/me");
        setUser(data);
      } catch (error) {
        localStorage.removeItem("accessToken");
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    const { data } = await apiClient.post("/auth/login", credentials);
    localStorage.setItem("accessToken", data.accessToken);
    setUser(data);
  };

  const logout = async () => {
    localStorage.removeItem("accessToken");
    setUser(null);
  };

  const updateUser = (userData) => {
    setUser((prev) => ({ ...prev, ...userData }));
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};