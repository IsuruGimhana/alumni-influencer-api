import { useState, useEffect } from "react";
import { sanitizePayload } from "../../../utils/sanitizePayload";

export default function ExperienceForm({ initialData, onSubmit, loading, error }) {
  const [form, setForm] = useState({
    jobTitle: "",
    company: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        jobTitle: initialData.jobTitle || "",
        company: initialData.company || "",
        startDate: initialData.startDate || "",
        endDate: initialData.endDate || "",
        description: initialData.description || "",
      });
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      jobTitle: form.jobTitle,
      company: form.company,
      startDate: form.startDate,
      endDate: form.endDate,
      description: form.description,
    };

    onSubmit(sanitizePayload(payload));
  };

  const labelClass =
    "block text-sm text-gray-500 mb-1 font-medium";

  const inputClass =
    "w-full border border-gray-400 rounded-md p-2 text-sm focus:border-blue-700 focus:ring-1 focus:ring-blue-700 outline-none transition-all";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">

      {/* Job Title */}
      <div>
        <label className={labelClass}>Job Title</label>
        <input
          value={form.jobTitle}
          onChange={(e) =>
            setForm({ ...form, jobTitle: e.target.value })
          }
          className={inputClass}
          placeholder="Software Engineer"
        />
      </div>

      {/* Company */}
      <div>
        <label className={labelClass}>Company</label>
        <input
          value={form.company}
          onChange={(e) =>
            setForm({ ...form, company: e.target.value })
          }
          className={inputClass}
          placeholder="Google"
        />
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Start Date</label>
          <input
            type="date"
            value={form.startDate}
            onChange={(e) =>
              setForm({ ...form, startDate: e.target.value })
            }
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>End Date</label>
          <input
            type="date"
            value={form.endDate}
            onChange={(e) =>
              setForm({ ...form, endDate: e.target.value })
            }
            className={inputClass}
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className={labelClass}>Description</label>
        <textarea
          rows={4}
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
          className={inputClass}
          placeholder="Describe your role..."
        />
      </div>

      {/* ERROR (same as ProfileForm) */}
      {error?.length > 0 && (
        <div className="text-sm text-red-600 bg-red-50 p-2 rounded-lg">
          {error.map((e, i) => (
            <p key={i}>{e.msg}</p>
          ))}
        </div>
      )}

      {/* BUTTON (same style as ProfileForm) */}
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