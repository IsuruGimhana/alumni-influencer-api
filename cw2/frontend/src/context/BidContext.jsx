import { createContext, useEffect, useState } from "react";
import * as bidService from "../api/bidService";
import { useAuth } from "../hooks/useAuth";

export const BidContext = createContext();

export const BidProvider = ({ children }) => {
  const { user } = useAuth();

  const [myBid, setMyBid] = useState(null);
  const [loadingBid, setLoadingBid] = useState(true);

  // -----------------------------
  // FETCH MY BID
  // -----------------------------
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

  // -----------------------------
  // PLACE BID
  // -----------------------------
  const placeBid = async (amount) => {
    const res = await bidService.placeBid({ amount });

    // update UI immediately
    // setMyBid(res.data);

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