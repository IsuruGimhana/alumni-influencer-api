import api from "./axios";

// Place a bid
export const placeBid = (data) => api.post("/bids", data);

// Get my bid
export const getMyBid = () => api.get("/bids/me");