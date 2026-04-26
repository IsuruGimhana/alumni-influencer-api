import { createContext, useEffect, useState } from "react";
import * as authService from "../api/authService";
import * as profileService from "../api/profileService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // ONLY auth user
  const [authLoading, setAuthLoading] = useState(true);

  // Load logged-in user on app start / refresh
  const fetchUser = async () => {
    try {
      const res = await authService.getMe();
      setUser(res?.data);
    } catch {
      setUser(null);
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Login
  const loginUser = async (form) => {
    const loginRes = await authService.login(form);

    const userRes = await authService.getMe();
    const profileRes = await profileService.getMyProfile().catch(() => null);
    console.log("profile:", profileRes);

    const user = userRes.data;
    const profile = profileRes?.data?.profile || null;

    setUser(user);

    return {
      user,
      profile,
      msg: loginRes.data.msg,
    };
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
        authLoading,
        loginUser,
        logoutUser,
        fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};