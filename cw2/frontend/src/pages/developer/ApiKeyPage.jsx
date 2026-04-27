import { useEffect, useState } from "react";
import { useApiKey } from "../../hooks/useApiKey";
import Loader from "../../components/common/Loader";
import ProfileFormModal from "../../components/profile/ProfileFormModal";
import { ChevronDown, Eye, EyeOff } from "lucide-react";

import {
  KeyRound,
  Copy,
  Trash2,
  PlusCircle,
  ShieldCheck,
  Clock,
  Monitor,
  BarChart3,
} from "lucide-react";

export default function ApiKeyPage() {
  const {
    keys = [],
    loading,
    createKey,
    revokeKey,
    keyStats,
    fetchKeyStats,
  } = useApiKey();

  const [openModal, setOpenModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [filter, setFilter] = useState("all");

  const [form, setForm] = useState({
    label: "",
    clientType: "dashboard",
  });

  // Load stats safely
  useEffect(() => {
    if (!keys.length) return;

    keys.forEach((k) => {
      if (!keyStats?.[k.id]) {
        fetchKeyStats(k.id);
      }
    });
  }, [keys]);

  if (loading) return <Loader />;

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.label.trim()) return;

    setCreating(true);

    try {
      await createKey(form);
      setForm({ label: "", clientType: "dashboard" });
      setOpenModal(false);
    } finally {
      setCreating(false);
    }
  };

  const handleCopy = (key) => {
    navigator.clipboard.writeText(key);
    setCopiedId(key);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const maskKey = (key) =>
    key ? `${key.slice(0, 6)}••••••••••••${key.slice(-4)}` : "";

  const filteredKeys = keys.filter((k) => {
    if (filter === "active") return k.isActive;
    if (filter === "revoked") return !k.isActive;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#F3F2EF] pb-12 font-sans">
      <div className="max-w-5xl mx-auto pt-6 px-4 space-y-6">

        {/* HEADER */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <KeyRound size={20} />
              API Keys
            </h1>
            <p className="text-sm text-gray-500">
              Manage developer access & monitor usage
            </p>
          </div>

          <button
            onClick={() => setOpenModal(true)}
            className="flex items-center gap-2 bg-blue-700 text-white px-4 py-2 rounded-full text-sm"
          >
            <PlusCircle size={16} />
            New Key
          </button>
        </div>

        {/* FILTER */}
        <div className="flex gap-2">
          {["all", "active", "revoked"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-full text-sm border ${
                filter === f
                  ? "bg-blue-700 text-white"
                  : "bg-white text-gray-600"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* EMPTY STATE */}
        {filteredKeys.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">
            <ShieldCheck className="mx-auto text-gray-400" size={40} />
            <p className="mt-3 font-medium">No API keys found</p>
          </div>
        )}

        {/* LIST */}
        <div className="space-y-4">
          {filteredKeys.map((key) => {
            const stats = keyStats?.[key.id];

            return (
              <div
                key={key.id}
                className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition group"
              >
                <div className="flex justify-between">

                  {/* LEFT */}
                  <div>
                    <h2 className="font-semibold flex items-center gap-2">
                      <Monitor size={14} />
                      {key.label}
                    </h2>

                    <p className="text-sm text-gray-500 font-mono mt-1">
                      {maskKey(key.key)}
                    </p>

                    {/* META */}
                    <div className="flex justify-center items-center gap-3 text-xs mt-2 text-gray-500">
                      <span>{key.clientType}</span>

                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {new Date(key.createdAt).toLocaleDateString()}
                      </span>

                      <span
                        className={`px-2 py-1 rounded-full ${
                          key.isActive
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        {key.isActive ? "Active" : "Revoked"}
                      </span>
                    </div>

                    {/* STATS */}
                    {stats && (
                      <div className="mt-2 text-xs flex items-center gap-2 text-gray-600">
                        <BarChart3 size={12} />
                        {stats.totalHits} requests
                      </div>
                    )}
                  </div>

                  {/* ACTIONS */}
                  <div className="flex items-center justify-center gap-3">
                    <button 
                    className="cursor-pointer"
                    onClick={() => handleCopy(key.key)}>
                      <Copy size={16} />
                    </button>

                    {/* ONLY SHOW REVOKE IF ACTIVE */}
                    {key.isActive && (
                      <button
                        onClick={() => revokeKey(key.id)}
                        className="text-red-600 cursor-pointer"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>

                {copiedId === key.key && (
                  <p className="text-xs text-green-600 mt-2">
                    Copied to clipboard
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL */}
      <ProfileFormModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        title="Create API Key"
      >
        <form onSubmit={handleCreate}>

          {/* Label */}
          <input
            type="text"
            required
            placeholder="API Key Label (e.g. Mobile App Key)"
            value={form.label}
            className="w-full mb-3 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) =>
              setForm({ ...form, label: e.target.value })
            }
          />

          {/* Client Type */}
          <div className="relative mb-4">
            <select
              required
              className="w-full p-2 border rounded-lg bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
              value={form.clientType}
              onChange={(e) =>
                setForm({ ...form, clientType: e.target.value })
              }
            >
              <option value="dashboard">Dashboard</option>
              <option value="ar_app">AR App</option>
            </select>

            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
              <ChevronDown size={18} />
            </div>
          </div>

          {/* Button */}
          <button
            disabled={creating}
            className="w-full mb-3 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {creating ? "Creating API Key..." : "Generate Key"}
          </button>
        </form>
      </ProfileFormModal>
    </div>
  );
}