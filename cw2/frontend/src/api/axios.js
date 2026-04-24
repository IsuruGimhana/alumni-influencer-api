import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // Required for cookie-based authentication; it sends the cookie with the request
});

export default api;