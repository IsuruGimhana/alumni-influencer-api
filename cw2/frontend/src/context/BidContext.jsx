import { createContext, useEffect, useState } from "react";
import * as bidService from "../api/bidService";
import { useAuth } from "../hooks/useAuth";

export const BidContext = createContext();

export const BidProvider = ({ children }) => {
  const { user } = useAuth();

  const [myBid, setMyBid] = useState(null);
  const [loadingBid, setLoadingBid] = useState(true);


  /**
   * Loads today's bid for the logged-in user
   * Only runs when a user is authenticated
   */
  const fetchMyBid = async () => {
    if (!user) return;

    try {
      setLoadingBid(true);
      const res = await bidService.getMyBid();
      setMyBid(res.data);
    } catch {
      setMyBid(null);
    } finally {
      setLoadingBid(false);
    }
  };

  useEffect(() => {
    fetchMyBid();
  }, [user]);

  /**
   * Places a new bid for the current day
   * Returns backend response for UI feedback
   */
  const placeBid = async (amount) => {
    const res = await bidService.placeBid({ amount });

    return res.data;
  };

  return (
    <BidContext.Provider
      value={{
        myBid,
        setMyBid,
        loadingBid,
        fetchMyBid,
        placeBid,
      }}
    >
      {children}
    </BidContext.Provider>
  );
};