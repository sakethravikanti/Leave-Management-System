import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login as loginAPI } from "../api/auth";
import axios from "axios"; 

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [authError, setAuthError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsAuthReady(true);
  }, []);

  const login = async (userEmail, userPassword) => {
    try {
      const response = await loginAPI(userEmail, userPassword);
      const userData = response.data;

      const authenticatedUser = {
        email: userData.email,
        role: userData.role,
        empId: userData.empId,
      };

      setUser(authenticatedUser);
      localStorage.setItem("user", JSON.stringify(authenticatedUser));

      setAuthError(null);

      if (userData.role === "ROLE_ADMIN") navigate("/admindashboard");
      else if (userData.role === "ROLE_MANAGER") navigate("/managerdashboard");
      else if (userData.role === "ROLE_EMPLOYEE") navigate("/employeedashboard");
      else navigate("/");

      return { success: true, message: "Login successful!" };
    } catch (error) {
      console.error("Login error:", error);

      let errorMessage = "Login failed. Please try again.";
      if (error.response && error.response.data) {
        errorMessage = "Invalid email or password. Please try again.";
      } else if (error.request) {
        errorMessage = "Network error. Please check your connection.";
      }

      setAuthError(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await axios.post("/auth/logout", {}, { withCredentials: true });
    } catch (err) {
      console.error("Backend logout failed:", err);
    }

    setUser(null);
    localStorage.removeItem("user");
    setAuthError(null);

    navigate("/");
  };

  const value = {
    user,
    isAuthReady,
    authError,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};