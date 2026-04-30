import axios from "axios";

const dashboardApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_DASHBOARD_API_KEY}`,
  },
});

export default dashboardApi;