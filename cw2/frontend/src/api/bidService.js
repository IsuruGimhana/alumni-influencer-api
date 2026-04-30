import api from "./axios";

export const placeBid = (data) => api.post("/bids", data);

export const getMyBid = () => api.get("/bids/me");