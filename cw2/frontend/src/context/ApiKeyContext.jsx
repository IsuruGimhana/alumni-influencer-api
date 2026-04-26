import { createContext, useState, useEffect } from "react";
import * as apiKeyService from "../api/apiKeyService";

export const ApiKeyContext = createContext();

export const ApiKeyProvider = ({ children }) => {
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchKeys = async () => {
    try {
      setLoading(true);
      const res = await apiKeyService.getMyKeys();
      setKeys(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKeys();
  }, []);

  const createKey = async (data) => {
    const res = await apiKeyService.createApiKey(data);
    setKeys((prev) => [...prev, res.data]);
    return res.data;
  };

  const revokeKey = async (id) => {
    await apiKeyService.revokeKey(id);
    setKeys((prev) => prev.filter((k) => k.id !== id));
  };

  return (
    <ApiKeyContext.Provider
      value={{ keys, loading, fetchKeys, createKey, revokeKey }}
    >
      {children}
    </ApiKeyContext.Provider>
  );
};