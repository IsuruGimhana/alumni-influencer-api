import { useContext } from "react";
import { DashboardContext } from "../context/DashboardContext";

export const useDashboard = () => useContext(DashboardContext);