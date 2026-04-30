import axios from "axios";

const arAppApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_AR_API_KEY}`,
  },
});

export default arAppApi;