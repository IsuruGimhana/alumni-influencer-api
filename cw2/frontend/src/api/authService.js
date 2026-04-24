import api from "./axios";

export const register = (data) => api.post("/auth/register", data);

export const login = (data) => api.post("/auth/login", data);

export const logout = () => api.post("/auth/logout");

export const getMe = () => api.get("/auth/me");

export const verifyEmail = (token) =>
  api.get(`/auth/verify/${token}`);

export const forgotPassword = (email) =>
  api.post("/auth/password/forgot/", { email });

export const resetPassword = (token, password) =>
  api.post(`/auth/password/reset/${token}`, { password });