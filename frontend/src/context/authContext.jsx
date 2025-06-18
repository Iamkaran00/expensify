import React, { createContext, useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getMeAPI,
  loginUser,
  logoutUser,
  registerUser,
} from "../service/operations/authAPI";
export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const login = (formData) => {
    try {
      setUser(formData);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };
  
  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    }
  };
  useEffect(() => {}, [user]);
  return (
    <AuthContext.Provider value={{ user, login, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
export const userData = () => useContext(AuthContext);
