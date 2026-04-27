// // context/ApiKeyContext.jsx
// import { createContext, useState, useEffect } from "react";
// import * as apiKeyService from "../api/apiKeyService";

// export const ApiKeyContext = createContext();

// export const ApiKeyProvider = ({ children }) => {
//   const [keys, setKeys] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchKeys = async () => {
//     try {
//       setLoading(true);
//       const res = await apiKeyService.getMyKeys();
//       setKeys(res.data.apiKeys || res.data);
//     } catch (err) {
//       console.error("Failed to fetch keys", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchKeys();
//   }, []);

//   const createKey = async (data) => {
//     const res = await apiKeyService.createApiKey(data);
//     await fetchKeys(); // refresh list
//     return res.data;   // contains raw key
//   };

//   const revokeKey = async (id) => {
//     await apiKeyService.revokeKey(id);

//     setKeys((prev) => prev.filter((k) => k.id !== id));
//   };

//   return (
//     <ApiKeyContext.Provider
//       value={{ keys, loading, fetchKeys, createKey, revokeKey }}
//     >
//       {children}
//     </ApiKeyContext.Provider>
//   );
// };

import { createContext, useState, useEffect } from "react";
import * as apiKeyService from "../api/apiKeyService";

export const ApiKeyContext = createContext();

export const ApiKeyProvider = ({ children }) => {
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(true);

  // per-key stats cache (important for UI)
  const [keyStats, setKeyStats] = useState({});

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

  // CREATE KEY
  const createKey = async (data) => {
    const res = await apiKeyService.createApiKey(data);
    await fetchKeys();
    return res?.data?.apiKey;
  };

  // REVOKE KEY
  // const revokeKey = async (id) => {
  //   await apiKeyService.revokeKey(id);
  //   setKeys((prev) => prev.filter((k) => k.id !== id));
  // };
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

  // GET KEY STATS
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