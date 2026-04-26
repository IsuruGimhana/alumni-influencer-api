import api from "./axios";

export const createApiKey = (data) => api.post("/api-keys", data);
export const getMyKeys = () => api.get("/api-keys/me");
export const revokeKey = (id) => api.delete(`/api-keys/${id}`);
export const getKeyStats = (id) => api.get(`/api-keys/${id}/stats`);