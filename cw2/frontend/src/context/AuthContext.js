import { createContext, useEffect, useState } from "react";
import * as authService from "../api/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // ONLY auth user
  const [loading, setLoading] = useState(true);

  // Load logged-in user on app start / refresh
  const fetchUser = async () => {
    try {
      const res = await authService.getMe();
      setUser(res.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Login
  const loginUser = async (form) => {
    const loginRes = await authService.login(form);
    const userRes = await authService.getMe();

    setUser(userRes.data);

    return loginRes.data;
  };

  // Logout
  const logoutUser = async () => {
    await authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginUser,
        logoutUser,
        fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};