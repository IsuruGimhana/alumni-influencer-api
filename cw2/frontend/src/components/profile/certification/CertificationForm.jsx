import { useState, useEffect } from "react";
import { sanitizePayload } from "../../../utils/sanitizePayload";

export default function CertificationForm({
  initialData,
  onSubmit,
  loading,
  error,
}) {
  const [form, setForm] = useState({
    title: "",
    issuer: "",
    completionDate: "",
    certificationUrl: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || "",
        issuer: initialData.issuer || "",
        completionDate: initialData.completionDate || "",
        certificationUrl: initialData.certificationUrl || "",
      });
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      title: form.title,
      issuer: form.issuer,
      completionDate: form.completionDate,
      certificationUrl: form.certificationUrl,
    };

    onSubmit(sanitizePayload(payload));
  };

  const labelClass =
    "block text-sm text-gray-500 mb-1 font-medium";

  const inputClass =
    "w-full border border-gray-400 rounded-md p-2 text-sm focus:border-blue-700 focus:ring-1 focus:ring-blue-700 outline-none transition-all";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">

      {/* Title */}
      <div>
        <label className={labelClass}>Certification Title</label>
        <input
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
          className={inputClass}
          placeholder="AWS Certified Solutions Architect"
        />
      </div>

      {/* Issuer */}
      <div>
        <label className={labelClass}>Issuer</label>
        <input
          value={form.issuer}
          onChange={(e) =>
            setForm({ ...form, issuer: e.target.value })
          }
          className={inputClass}
          placeholder="Amazon Web Services"
        />
      </div>

      {/* Completion Date */}
      <div>
        <label className={labelClass}>Completion Date</label>
        <input
          type="date"
          value={form.completionDate}
          onChange={(e) =>
            setForm({ ...form, completionDate: e.target.value })
          }
          className={inputClass}
        />
      </div>

      {/* Certification URL */}
      <div>
        <label className={labelClass}>Certification URL</label>
        <input
          value={form.certificationUrl}
          onChange={(e) =>
            setForm({ ...form, certificationUrl: e.target.value })
          }
          className={inputClass}
          placeholder="https://aws.amazon.com/certification"
        />
      </div>

      {/* ERROR */}
      {error?.length > 0 && (
        <div className="text-sm text-red-600 bg-red-50 p-2 rounded-lg">
          {error.map((e, i) => (
            <p key={i}>{e.msg}</p>
          ))}
        </div>
      )}

      {/* BUTTON */}
      <div className="flex justify-end pt-4 border-t border-gray-200">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-1.5 rounded-full font-semibold transition shadow-sm disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>

    </form>
  );
}