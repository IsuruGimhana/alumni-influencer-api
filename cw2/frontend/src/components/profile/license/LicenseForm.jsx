import { useState, useEffect } from "react";
import { sanitizePayload } from "../../../utils/sanitizePayload";

export default function LicenseForm({ initialData, onSubmit, loading, error }) {
  const [form, setForm] = useState({
    title: "",
    awardingBody: "",
    completionDate: "",
    licenseUrl: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || "",
        awardingBody: initialData.awardingBody || "",
        completionDate: initialData.completionDate || "",
        licenseUrl: initialData.licenseUrl || "",
      });
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      title: form.title,
      awardingBody: form.awardingBody,
      completionDate: form.completionDate,
      licenseUrl: form.licenseUrl,
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
        <label className={labelClass}>License Title</label>
        <input
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
          className={inputClass}
          placeholder="Professional Software Engineer License"
        />
      </div>

      {/* Awarding Body */}
      <div>
        <label className={labelClass}>Awarding Body</label>
        <input
          value={form.awardingBody}
          onChange={(e) =>
            setForm({ ...form, awardingBody: e.target.value })
          }
          className={inputClass}
          placeholder="IEEE"
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

      {/* License URL */}
      <div>
        <label className={labelClass}>License URL</label>
        <input
          value={form.licenseUrl}
          onChange={(e) =>
            setForm({ ...form, licenseUrl: e.target.value })
          }
          className={inputClass}
          placeholder="https://ieee.org/license"
        />
      </div>

      {/* ERROR (same as ExperienceForm) */}
      {error?.length > 0 && (
        <div className="text-sm text-red-600 bg-red-50 p-2 rounded-lg">
          {error.map((e, i) => (
            <p key={i}>{e.msg}</p>
          ))}
        </div>
      )}

      {/* BUTTON (same style as ExperienceForm) */}
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