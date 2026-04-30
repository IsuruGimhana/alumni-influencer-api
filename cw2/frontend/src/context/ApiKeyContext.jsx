import { createContext, useState, useEffect } from "react";
import * as apiKeyService from "../api/apiKeyService";

export const ApiKeyContext = createContext();

export const ApiKeyProvider = ({ children }) => {
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(true);

  // stores per-key usage stats (used in analytics/dashboard UI)
  const [keyStats, setKeyStats] = useState({});

  /**
   * Load all API keys for the logged-in user
   * Used on initial render and after create/revoke actions
   */
  const fetchKeys = async () => {
    try {
      setLoading(true);

      const res = await apiKeyService.getMyKeys();
      setKeys(res?.data?.apiKeys || []);

    } catch (err) {
      console.error("Failed to fetch keys", err);
      setKeys([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKeys();
  }, []);

  /**
   * Create a new API key and refresh list
   * Returns raw key only once (for user to copy)
   */
  const createKey = async (data) => {
    const res = await apiKeyService.createApiKey(data);
    await fetchKeys();
    return res?.data?.apiKey;
  };

  /**
   * Revoke (deactivate) an API key and refresh list
   * Note: keys are not deleted from DB, just marked inactive
   */
  const revokeKey = async (id) => {
    await apiKeyService.revokeKey(id);

    setKeys((prev) =>
      prev.map((k) =>
        k.id === id
          ? { ...k, isActive: false }
          : k
      )
    );
  };

  /**
   * Fetch usage stats for a specific API key
   * Cached per-key for dashboard performance
   */
  const fetchKeyStats = async (id) => {
    try {
      const res = await apiKeyService.getKeyStats(id);

      setKeyStats((prev) => ({
        ...prev,
        [id]: res?.data?.stats || null,
      }));

      return res?.data?.stats;

    } catch (err) {
      console.error("Failed to fetch key stats", err);
      return null;
    }
  };

  return (
    <ApiKeyContext.Provider
      value={{
        keys,
        loading,
        keyStats,
        fetchKeys,
        createKey,
        revokeKey,
        fetchKeyStats,
      }}
    >
      {children}
    </ApiKeyContext.Provider>
  );
};