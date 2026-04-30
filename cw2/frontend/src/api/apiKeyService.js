import api from "./axios";

// DEVELOPER (JWT AUTH)

// Create API Key
export const createApiKey = (data) => api.post("/keys", data);

// Get all my keys
export const getMyKeys = () => api.get("/keys/me");

// Revoke key
export const revokeKey = (id) => api.delete(`/keys/${id}`);

// Get usage stats
export const getKeyStats = (id) => api.get(`/keys/${id}/stats`);
