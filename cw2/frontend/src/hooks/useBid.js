import { useContext } from "react";
import { BidContext } from "../context/BidContext";

export const useBid = () => useContext(BidContext);