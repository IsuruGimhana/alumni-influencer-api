import { useContext } from "react";
import { ApiKeyContext } from "../context/ApiKeyContext";

export const useApiKey = () => useContext(ApiKeyContext);