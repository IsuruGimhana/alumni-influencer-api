import { useState } from "react";
import { sanitizePayload } from "../../utils/sanitizePayload";

export default function ProfileForm({ profile, onSubmit, loading, error }) {
  const [form, setForm] = useState({
    fullName: profile?.fullName || "",
    city: profile?.city || "",
    country: profile?.country || "",
    // bio: profile?.bio || "",
    linkedInUrl: profile?.linkedInUrl || "",
    attendedEvent: profile?.attendedEvent || false,
    sponsorshipBalance: profile?.sponsorshipBalance || 0,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // onSubmit(form);
    onSubmit(sanitizePayload(form));
  };

  const labelClass = "block text-sm text-gray-500 mb-1 font-medium";
  const inputClass = "w-full border border-gray-400 rounded-md p-2 text-sm focus:border-blue-700 focus:ring-1 focus:ring-blue-700 outline-none transition-all";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      {/* Name Section */}
      <div>
        <label className={labelClass}>Full name</label>
        <input
          value={form.fullName}
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          className={inputClass}
          placeholder="John Doe"
        />
      </div>

      {/* Bio / Headline */}
      {/* <div>
        <label className={labelClass}>Bio / Headline</label>
        <textarea
          rows="3"
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
          className={inputClass}
        />
      </div> */}

      {/* Location Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>City</label>
          <input
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            className={inputClass}
            placeholder="London"
          />
        </div>
        <div>
          <label className={labelClass}>Country</label>
          <input
            value={form.country}
            onChange={(e) => setForm({ ...form, country: e.target.value })}
            className={inputClass}
            placeholder="England"
          />
        </div>
      </div>

      {/* LinkedIn URL */}
      <div>
        <label className={labelClass}>LinkedIn URL</label>
        <input
          type="url"
          value={form.linkedInUrl}
          onChange={(e) => setForm({ ...form, linkedInUrl: e.target.value })}
          className={inputClass}
          placeholder="https://www.linkedin.com/in/username"
        />
      </div>

      {/* Platform Status Section (Special Fields) */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Platform Metrics</h3>
        
        <div className="flex items-center justify-between">
          <label className="text-sm text-gray-700 font-medium">Attended Latest University Alumni Event</label>
          <input 
            type="checkbox" 
            checked={form.attendedEvent}
            onChange={(e) => setForm({ ...form, attendedEvent: e.target.checked })}
            className="w-5 h-5 accent-blue-700 cursor-pointer"
          />
        </div>

        <div>
          <label className={labelClass}>Sponsorship Balance ($)</label>
          <input
            type="number"
            step="0.01"
            value={form.sponsorshipBalance}
            // onChange={(e) => setForm({ ...form, sponsorshipBalance: e.target.value })}
            onChange={(e) => {
              const value = e.target.value;
              setForm({
                ...form,
                sponsorshipBalance:
                  value === "" ? "" : parseFloat(value),
              });
            }}
            className={inputClass}
          />
        </div>
      </div>
      {error?.length > 0 && (
        <div className="text-sm text-red-600 bg-red-50 p-2 rounded-lg">
          {error.map((e, i) => (
            <p key={i}>{e.msg}</p>
          ))}
        </div>
      )}

      <div className="flex justify-end pt-4 border-t border-gray-200">
        {/* <button
          type="submit"
          className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-1.5 rounded-full font-semibold transition shadow-sm"
        >
          Save
        </button> */}
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