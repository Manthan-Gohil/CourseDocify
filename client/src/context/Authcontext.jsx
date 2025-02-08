// context/AuthContext.js
import { createContext, useContext, useState } from "react";
import toast from "react-hot-toast";
import { loginUser, registerUser, logoutUser } from "../services/authServices";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const data = await loginUser(email, password);
      if (data.success) {
        setIsAuthenticated(true);
        return { success: true, message: data.message };
      }
    } catch (error) {
      setIsAuthenticated(false);
      throw new Error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const data = await registerUser(userData);
      if (data.success) {
        setIsAuthenticated(true);
        return { success: true, message: data.message };
      }
    } catch (error) {
      throw new Error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      const data = await logoutUser();
      if (data.success) {
        setIsAuthenticated(false);
        toast.success(data.message);
      }
    } catch (error) {
      toast.error("Logout failed");
    } finally {
      setLoading(false);
    }
  };

  const value = {
    isAuthenticated,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
