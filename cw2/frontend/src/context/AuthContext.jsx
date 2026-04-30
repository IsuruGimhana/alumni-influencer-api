import { createContext, useEffect, useState } from "react";
import * as authService from "../api/authService";
import * as profileService from "../api/profileService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // authenticated user state
  const [authLoading, setAuthLoading] = useState(true);

  /**
   * Fetch logged-in user on app load/refresh
   * Keeps session persistent using cookie-based JWT
   */
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

  /**
   * Handles login flow:
   * - authenticate user
   * - fetch user profile
   * - return combined auth + profile data
   */
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

  /**
   * Logout user and clear auth state
   */
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